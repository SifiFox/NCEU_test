import { useCallback, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import type { TaskFormValues } from '@/schemas';
import {
  useCreateTagMutation,
  useCreateTaskMutation,
  usePatchTaskStatusMutation,
  useUpdateTaskMutation,
} from '@/store/api';
import type { Tag, Task, TaskStatus } from '@/types';

type UseTaskListInteractionsParams = {
  tags: Tag[];
  editingTask?: Task;
  closeModal: () => void;
  setTag: (tag?: string) => void;
};

export function useTaskListInteractions({
  tags,
  editingTask,
  closeModal,
  setTag,
}: UseTaskListInteractionsParams) {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  const [pendingStatusTaskId, setPendingStatusTaskId] = useState<string | null>(null);

  const [createTask, { isLoading: isTaskCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isTaskUpdating }] = useUpdateTaskMutation();
  const [createTag] = useCreateTagMutation();
  const [patchTaskStatus] = usePatchTaskStatusMutation();

  const isSubmitting = isTaskCreating || isTaskUpdating;

  const onTaskListClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const tagElement = target.closest<HTMLElement>('[data-task-tag]');

      if (tagElement && event.currentTarget.contains(tagElement)) {
        const tagName = tagElement.dataset.taskTag;
        if (!tagName) {
          return;
        }

        setTag(tagName);
        return;
      }

      const cardElement = target.closest<HTMLElement>('[data-task-id]');

      if (!cardElement || !event.currentTarget.contains(cardElement)) {
        return;
      }

      const taskId = cardElement.dataset.taskId;
      if (!taskId) {
        return;
      }

      navigate(`/tasks/${taskId}`);
    },
    [navigate, setTag],
  );

  const onStatusChange = useCallback(
    async (id: string, status: TaskStatus) => {
      setPendingStatusTaskId(id);

      try {
        await patchTaskStatus({ id, status }).unwrap();
      } finally {
        setPendingStatusTaskId((currentTaskId) =>
          currentTaskId === id ? null : currentTaskId,
        );
      }
    },
    [patchTaskStatus],
  );

  const ensureTagsExist = useCallback(
    async (tagNames: string[]) => {
      const normalizedTags = Array.from(
        new Set(tagNames.map((tagName) => tagName.trim()).filter(Boolean)),
      );
      const existingTagNames = new Set(
        tags.map((tag) => tag.name.trim().toLowerCase()),
      );

      for (const tagName of normalizedTags) {
        const normalizedTagName = tagName.toLowerCase();
        if (existingTagNames.has(normalizedTagName)) {
          continue;
        }

        await createTag({ name: tagName }).unwrap();
        existingTagNames.add(normalizedTagName);
      }

      return normalizedTags;
    },
    [createTag, tags],
  );

  const handleSubmit = useCallback(
    async (values: TaskFormValues) => {
      try {
        setSubmitError('');
        const now = new Date().toISOString();
        const tagsFromForm = await ensureTagsExist(values.tags);

        if (editingTask) {
          await updateTask({
            ...editingTask,
            ...values,
            tags: tagsFromForm,
            updatedAt: now,
          }).unwrap();
        } else {
          await createTask({
            id: uuidv4(),
            ...values,
            tags: tagsFromForm,
            createdAt: now,
            updatedAt: now,
          }).unwrap();
        }

        closeModal();
      } catch {
        setSubmitError('Не удалось сохранить задачу. Попробуйте снова.');
      }
    },
    [closeModal, createTask, editingTask, ensureTagsExist, updateTask],
  );

  return {
    submitError,
    isSubmitting,
    pendingStatusTaskId,
    onTaskListClick,
    onStatusChange,
    handleSubmit,
  };
}
