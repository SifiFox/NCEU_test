import { skipToken } from '@reduxjs/toolkit/query';
import { Alert, Button, Card, Divider, Flex, Space, Spin, Tag, Typography } from 'antd';
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PRIORITY_LABELS, STATUS_LABELS } from '@/constants';
import { TaskForm } from '@/components';
import { useDeleteTask, useTaskModal } from '@/hooks';
import type { TaskFormValues } from '@/schemas';
import type { TaskPriority, TaskStatus } from '@/types';
import {
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useGetTagsQuery,
  useCreateTagMutation,
} from '@/store/api';
import { formatDateTime, formatDeadline, overdue } from '@/utils';
import cls from '@/pages/TaskDetailPage.module.css';

const statusTagColorMap: Record<TaskStatus, string> = {
  todo: 'default',
  inProgress: 'processing',
  done: 'success',
};

const priorityTagColorMap: Record<TaskPriority, string> = {
  low: 'green',
  medium: 'gold',
  high: 'red',
};

export function TaskDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [submitError, setSubmitError] = useState('');

  const { data: task, isLoading, isError } = useGetTaskByIdQuery(id ?? skipToken);
  const { data: tags = [] } = useGetTagsQuery();
  const [createTag] = useCreateTagMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const { confirmDelete, isLoading: isDeleteLoading } = useDeleteTask();
  const { isOpen, openForEdit, closeModal } = useTaskModal();

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

  async function handleSubmit(values: TaskFormValues) {
    if (!task) {
      return;
    }

    try {
      setSubmitError('');
      const tagsFromForm = await ensureTagsExist(values.tags);
      await updateTask({
        ...task,
        ...values,
        tags: tagsFromForm,
        updatedAt: new Date().toISOString(),
      }).unwrap();
      closeModal();
    } catch {
      setSubmitError('Не удалось обновить задачу. Попробуйте снова.');
    }
  }

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (isError || !task) {
    return (
      <Flex vertical gap={8}>
        <Alert type="error" showIcon description="Задача не найдена." />
        <Button onClick={() => navigate('/')}>Вернуться к списку</Button>
      </Flex>
    );
  }

  const isOverdue = task.status !== 'done' && overdue(task.deadline);

  return (
    <Flex vertical gap={16} className={cls.page}>
      <Card className={cls.heroCard}>
        <Flex justify="space-between" align="flex-start" gap={16} wrap>
          <Space vertical size={6} className={cls.titleBlock}>
            <Typography.Text type="secondary">Детали задачи</Typography.Text>
            <Space wrap className={cls.topTags}>
              {task.tags.length > 0 ? (
                task.tags.map((tag) => (
                  <Tag key={`${task.id}-${tag}`} className={cls.tag}>
                    {tag}
                  </Tag>
                ))
              ) : (
                <Typography.Text className={cls.emptyTagsText}>Без тегов</Typography.Text>
              )}
            </Space>
            <Typography.Title level={2} className={cls.title}>
              {task.title}
            </Typography.Title>
          </Space>



          <Space wrap>
            <Button onClick={() => navigate('/')}>Назад</Button>
            <Button type="primary" onClick={() => openForEdit(task)}>
              Редактировать
            </Button>
            <Button
              danger
              loading={isDeleteLoading}
              onClick={() => confirmDelete(task.id)}
            >
              Удалить
            </Button>
          </Space>
        </Flex>

        <Flex wrap gap={12} className={cls.keyInfo}>
          <Tag color={statusTagColorMap[task.status]} className={cls.keyBadge}>
            Статус: {STATUS_LABELS[task.status]}
          </Tag>
          <Tag color={priorityTagColorMap[task.priority]} className={cls.keyBadge}>
            Приоритет: {PRIORITY_LABELS[task.priority]}
          </Tag>
          <Tag color={isOverdue ? 'error' : 'blue'} className={cls.keyBadge}>
            {isOverdue
              ? `Дедлайн просрочен: ${formatDeadline(task.deadline)}`
              : `Дедлайн: ${formatDeadline(task.deadline)}`}
          </Tag>
        </Flex>



        <Divider className={cls.sectionDivider} />

        <Space direction="vertical" size={8} className={cls.section}>
          <Typography.Text type="secondary" className={cls.sectionLabel}>
            Описание
          </Typography.Text>
          <Typography.Paragraph className={cls.description}>
            {task.description || 'Без описания'}
          </Typography.Paragraph>
        </Space>

        <Divider className={cls.sectionDivider} />

        <Flex wrap gap={24} className={cls.metaRow}>
          <div className={cls.metaItem}>
            <Typography.Text type="secondary">Создано</Typography.Text>
            <Typography.Text strong>{formatDateTime(task.createdAt)}</Typography.Text>
          </div>
          <div className={cls.metaItem}>
            <Typography.Text type="secondary">Обновлено</Typography.Text>
            <Typography.Text strong>{formatDateTime(task.updatedAt)}</Typography.Text>
          </div>
        </Flex>
      </Card>

      <TaskForm
        open={isOpen}
        title="Редактировать задачу"
        initialValues={task}
        isSubmitting={isUpdating}
        submitError={submitError}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </Flex>
  );
}
