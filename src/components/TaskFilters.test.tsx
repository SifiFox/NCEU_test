import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TaskFilters } from '@/components/TaskFilters';

vi.mock('antd', async () => {
  const antd = await vi.importActual<typeof import('antd')>('antd');

  return {
    ...antd,
    Select: ({
      options = [],
      value,
      placeholder,
      onChange,
    }: {
      options?: Array<{ value: string; label: string }>;
      value?: string;
      placeholder?: string;
      onChange?: (value: string | undefined) => void;
    }) => (
      <select
        data-testid={`select-${String(placeholder ?? 'sort')}`}
        value={value ?? ''}
        onChange={(event) => onChange?.(event.target.value || undefined)}
      >
        <option value="">{placeholder ?? 'Выберите'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ),
  };
});

function renderTaskFilters(overrides?: Partial<React.ComponentProps<typeof TaskFilters>>) {
  const handlers = {
    onSearchChange: vi.fn(),
    onStatusChange: vi.fn(),
    onPriorityChange: vi.fn(),
    onTagChange: vi.fn(),
    onSortChange: vi.fn(),
    onReset: vi.fn(),
  };

  render(
    <TaskFilters
      search=""
      status={undefined}
      priority={undefined}
      tag={undefined}
      sort="createdAtDesc"
      tagOptions={['frontend', 'backend']}
      {...handlers}
      {...overrides}
    />,
  );

  return handlers;
}

describe('TaskFilters', () => {
  it('renders search, selects and reset button', () => {
    renderTaskFilters();

    expect(screen.getByPlaceholderText('Поиск по названию')).toBeInTheDocument();
    expect(screen.getByTestId('select-Статус')).toBeInTheDocument();
    expect(screen.getByTestId('select-Приоритет')).toBeInTheDocument();
    expect(screen.getByTestId('select-Тег')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Сбросить' })).toBeInTheDocument();
  });

  it('calls onSearchChange when user types in search', async () => {
    const user = userEvent.setup();
    const { onSearchChange } = renderTaskFilters({ tagOptions: [] });

    await user.type(screen.getByPlaceholderText('Поиск по названию'), 'релиз');

    expect(onSearchChange).toHaveBeenCalled();
  });

  it('calls onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    const { onReset } = renderTaskFilters({
      search: 'релиз',
      status: 'todo',
      priority: 'high',
      tag: 'frontend',
      tagOptions: ['frontend'],
    });

    await user.click(screen.getByRole('button', { name: 'Сбросить' }));

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('calls onStatusChange when status select changes', () => {
    const { onStatusChange } = renderTaskFilters();

    fireEvent.change(screen.getByTestId('select-Статус'), {
      target: { value: 'done' },
    });

    expect(onStatusChange).toHaveBeenCalledWith('done');
  });

  it('calls onPriorityChange when priority select changes', () => {
    const { onPriorityChange } = renderTaskFilters();

    fireEvent.change(screen.getByTestId('select-Приоритет'), {
      target: { value: 'high' },
    });

    expect(onPriorityChange).toHaveBeenCalledWith('high');
  });

  it('calls onTagChange when tag select changes', () => {
    const { onTagChange } = renderTaskFilters();

    fireEvent.change(screen.getByTestId('select-Тег'), {
      target: { value: 'frontend' },
    });

    expect(onTagChange).toHaveBeenCalledWith('frontend');
  });

  it('calls onSortChange when sort select changes', () => {
    const { onSortChange } = renderTaskFilters();

    fireEvent.change(screen.getByTestId('select-sort'), {
      target: { value: 'deadlineAsc' },
    });

    expect(onSortChange).toHaveBeenCalledWith('deadlineAsc');
  });
});
