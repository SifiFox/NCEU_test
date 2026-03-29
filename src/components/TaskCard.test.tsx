import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Task } from '@/types';
import { TaskCard } from '@/components/TaskCard';

vi.mock('antd', async () => {
  const antd = await vi.importActual<typeof import('antd')>('antd');

  return {
    ...antd,
    Select: ({
      options = [],
      value,
      onChange,
      className,
    }: {
      options?: Array<{ value: string; label: string }>;
      value?: string;
      onChange?: (value: string) => void;
      className?: string;
    }) => (
      <select
        data-testid="status-select"
        className={className}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ),
  };
});

const baseTask: Task = {
  id: 'task-1',
  title: 'Подготовить релиз',
  description: 'Проверить все блокеры',
  status: 'todo',
  priority: 'high',
  deadline: '2026-03-20',
  tags: ['frontend', 'release'],
  createdAt: '2026-03-10T12:00:00.000Z',
  updatedAt: '2026-03-10T12:00:00.000Z',
};

describe('TaskCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-21T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders core task data', () => {
    render(<TaskCard task={baseTask} onStatusChange={vi.fn()} />);

    expect(screen.getByText(baseTask.title)).toBeInTheDocument();
    expect(screen.getByText(baseTask.description as string)).toBeInTheDocument();
    expect(screen.getByText('К выполнению', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('Приоритет: Высокий')).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('release')).toBeInTheDocument();
    expect(screen.getByText('Просрочено')).toBeInTheDocument();
  });

  it('does not show overdue badge for done task with past deadline', () => {
    render(
      <TaskCard
        task={{ ...baseTask, status: 'done' }}
        onStatusChange={vi.fn()}
      />,
    );

    expect(screen.queryByText('Просрочено')).not.toBeInTheDocument();
  });

  it('calls onStatusChange when status changes', () => {
    const onStatusChange = vi.fn();

    render(<TaskCard task={baseTask} onStatusChange={onStatusChange} />);

    fireEvent.change(screen.getByTestId('status-select'), {
      target: { value: 'done' },
    });

    expect(onStatusChange).toHaveBeenCalledWith('task-1', 'done');
  });
});
