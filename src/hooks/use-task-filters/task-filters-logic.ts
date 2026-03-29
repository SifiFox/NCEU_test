import type { Task } from '@/types';
import type { TaskFiltersState } from './task-filters-state';

const SORT_COMPARATORS = {
  createdAtAsc: (left: Task, right: Task) =>
    new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  createdAtDesc: (left: Task, right: Task) =>
    new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  deadlineAsc: (left: Task, right: Task) =>
    new Date(left.deadline).getTime() - new Date(right.deadline).getTime(),
  deadlineDesc: (left: Task, right: Task) =>
    new Date(right.deadline).getTime() - new Date(left.deadline).getTime(),
};

export function filterAndSortTasks({
  tasks,
  filters,
}: {
  tasks: Task[];
  filters: TaskFiltersState;
}): Task[] {
  const normalizedSearch = filters.search.trim().toLowerCase();
  const prepared: Task[] = [];
  const sortComparator = SORT_COMPARATORS[filters.sort];

  for (const task of tasks) {
    if (
      !matchesTaskFilters({
        task,
        filters,
        normalizedSearch,
      })
    ) {
      continue;
    }

    prepared.push(task);
  }

  prepared.sort(sortComparator);
  return prepared;
}

function matchesTaskFilters({
  task,
  filters,
  normalizedSearch,
}: {
  task: Task;
  filters: TaskFiltersState;
  normalizedSearch: string;
}): boolean {
  if (normalizedSearch && !task.title.toLowerCase().includes(normalizedSearch)) {
    return false;
  }

  if (filters.status && task.status !== filters.status) {
    return false;
  }

  if (filters.priority && task.priority !== filters.priority) {
    return false;
  }

  if (filters.tag && !task.tags.includes(filters.tag)) {
    return false;
  }

  return true;
}
