import { Button, Flex, Input, Select } from 'antd';
import { memo } from 'react';
import {
  PRIORITY_OPTIONS,
  SORT_OPTIONS,
  STATUS_OPTIONS,
  type TaskSortKey,
} from '@/constants';
import type { TaskPriority, TaskStatus } from '@/types';

type TaskFiltersProps = {
  search: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  tag?: string;
  sort: TaskSortKey;
  tagOptions: string[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value?: TaskStatus) => void;
  onPriorityChange: (value?: TaskPriority) => void;
  onTagChange: (value?: string) => void;
  onSortChange: (value: TaskSortKey) => void;
  onReset: () => void;
};

export const TaskFilters = memo(function TaskFilters({
  search,
  status,
  priority,
  tag,
  sort,
  tagOptions,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onTagChange,
  onSortChange,
  onReset,
}: TaskFiltersProps) {
  return (
    <Flex gap={12} wrap align="center">
      <Input
        value={search}
        placeholder="Поиск по названию"
        onChange={(event) => onSearchChange(event.target.value)}
        style={{ width: 240 }}
        allowClear
      />

      <Select
        allowClear
        value={status}
        placeholder="Статус"
        style={{ width: 170 }}
        options={STATUS_OPTIONS}
        onChange={(value) => onStatusChange(value)}
      />

      <Select
        allowClear
        value={priority}
        placeholder="Приоритет"
        style={{ width: 170 }}
        options={PRIORITY_OPTIONS}
        onChange={(value) => onPriorityChange(value)}
      />

      <Select
        allowClear
        value={tag}
        placeholder="Тег"
        style={{ width: 170 }}
        options={tagOptions.map((tagName) => ({ value: tagName, label: tagName }))}
        onChange={(value) => onTagChange(value)}
      />

      <Select
        value={sort}
        style={{ width: 290 }}
        options={SORT_OPTIONS}
        onChange={onSortChange}
      />

      <Button onClick={onReset}>Сбросить</Button>
    </Flex>
  );
});
