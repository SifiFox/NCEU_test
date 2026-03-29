import type { TaskSortKey } from '@/constants';
import type { TaskPriority, TaskStatus } from '@/types';

export type TaskFiltersState = {
  search: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  tag?: string;
  sort: TaskSortKey;
  page: number;
};

export const DEFAULT_TASK_FILTERS: TaskFiltersState = {
  search: '',
  status: undefined,
  priority: undefined,
  tag: undefined,
  sort: 'createdAtDesc',
  page: 1,
};
