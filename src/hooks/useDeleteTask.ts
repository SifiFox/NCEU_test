import { Modal } from 'antd';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteTaskMutation } from '@/store/api';

export function useDeleteTask() {
  const navigate = useNavigate();
  const [deleteTask, { isLoading }] = useDeleteTaskMutation();

  const confirmDelete = useCallback(
    (taskId: string) => {
      Modal.confirm({
        title: 'Удалить задачу?',
        content: 'Это действие нельзя отменить.',
        okText: 'Удалить',
        okButtonProps: { danger: true },
        cancelText: 'Отмена',
        onOk: async () => {
          await deleteTask(taskId).unwrap();
          navigate('/');
        },
      });
    },
    [deleteTask, navigate],
  );

  return { confirmDelete, isLoading };
}
