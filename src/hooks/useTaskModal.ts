import { useCallback, useState } from 'react';
import type { Task } from '@/types';

export function useTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const openForCreate = useCallback(() => {
    setEditingTask(undefined);
    setIsOpen(true);
  }, []);

  const openForEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingTask(undefined);
  }, []);

  return {
    isOpen,
    editingTask,
    openForCreate,
    openForEdit,
    closeModal,
  };
}
