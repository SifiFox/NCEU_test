import { describe, expect, it } from 'vitest';
import type { Task } from '@/types';
import { filterAndSortTasks } from './task-filters-logic';
import { DEFAULT_TASK_FILTERS } from './task-filters-state';

const tasks: Task[] = [
  {
    id: '1',
    title: 'Подготовить релиз',
    description: '...',
    status: 'todo',
    priority: 'high',
    deadline: '2026-03-20',
    tags: ['frontend', 'release'],
    createdAt: '2026-03-10T10:00:00.000Z',
    updatedAt: '2026-03-10T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Исправить баг логина',
    description: '...',
    status: 'inProgress',
    priority: 'medium',
    deadline: '2026-03-18',
    tags: ['bugfix', 'backend'],
    createdAt: '2026-03-11T10:00:00.000Z',
    updatedAt: '2026-03-11T10:00:00.000Z',
  },
  {
    id: '3',
    title: 'Обновить документацию',
    description: '...',
    status: 'done',
    priority: 'low',
    deadline: '2026-03-25',
    tags: ['docs'],
    createdAt: '2026-03-09T10:00:00.000Z',
    updatedAt: '2026-03-09T10:00:00.000Z',
  },
];

describe('filterAndSortTasks', () => {
  it('filters tasks by case-insensitive title search', () => {
    const result = filterAndSortTasks({
      tasks,
      filters: { ...DEFAULT_TASK_FILTERS, search: 'ЛОГИНА' },
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters tasks by status, priority and tag', () => {
    const result = filterAndSortTasks({
      tasks,
      filters: {
        ...DEFAULT_TASK_FILTERS,
        status: 'todo',
        priority: 'high',
        tag: 'release',
      },
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('sorts by createdAt ascending and descending', () => {
    const asc = filterAndSortTasks({
      tasks,
      filters: { ...DEFAULT_TASK_FILTERS, sort: 'createdAtAsc' },
    }).map((task) => task.id);
    const desc = filterAndSortTasks({
      tasks,
      filters: { ...DEFAULT_TASK_FILTERS, sort: 'createdAtDesc' },
    }).map((task) => task.id);

    expect(asc).toEqual(['3', '1', '2']);
    expect(desc).toEqual(['2', '1', '3']);
  });

  it('sorts by deadline ascending and descending', () => {
    const asc = filterAndSortTasks({
      tasks,
      filters: { ...DEFAULT_TASK_FILTERS, sort: 'deadlineAsc' },
    }).map((task) => task.id);
    const desc = filterAndSortTasks({
      tasks,
      filters: { ...DEFAULT_TASK_FILTERS, sort: 'deadlineDesc' },
    }).map((task) => task.id);

    expect(asc).toEqual(['2', '1', '3']);
    expect(desc).toEqual(['3', '1', '2']);
  });

  it('applies combined filters correctly', () => {
    const result = filterAndSortTasks({
      tasks,
      filters: {
        ...DEFAULT_TASK_FILTERS,
        search: 'исправить',
        status: 'inProgress',
        priority: 'medium',
        tag: 'backend',
      },
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });
});
