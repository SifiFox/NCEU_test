import type { TaskPriority, TaskStatus } from '@/types';

export type TaskSortKey =
  | 'createdAtDesc'
  | 'createdAtAsc'
  | 'deadlineAsc'
  | 'deadlineDesc';

export const PAGE_SIZE = 8;

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'К выполнению',
  inProgress: 'В работе',
  done: 'Готово',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

export const STATUS_OPTIONS: Array<{ value: TaskStatus; label: string }> = [
  { value: 'todo', label: STATUS_LABELS.todo },
  { value: 'inProgress', label: STATUS_LABELS.inProgress },
  { value: 'done', label: STATUS_LABELS.done },
];

export const PRIORITY_OPTIONS: Array<{ value: TaskPriority; label: string }> = [
  { value: 'low', label: PRIORITY_LABELS.low },
  { value: 'medium', label: PRIORITY_LABELS.medium },
  { value: 'high', label: PRIORITY_LABELS.high },
];

export const SORT_OPTIONS: Array<{ value: TaskSortKey; label: string }> = [
  { value: 'createdAtDesc', label: 'По дате создания (сначала новые)' },
  { value: 'createdAtAsc', label: 'По дате создания (сначала старые)' },
  { value: 'deadlineAsc', label: 'По дедлайну (сначала ранние)' },
  { value: 'deadlineDesc', label: 'По дедлайну (сначала поздние)' },
];
