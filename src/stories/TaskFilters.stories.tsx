import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskFilters } from '@/components';

const commonCallbacks = {
  onSearchChange: () => undefined,
  onStatusChange: () => undefined,
  onPriorityChange: () => undefined,
  onTagChange: () => undefined,
  onSortChange: () => undefined,
  onReset: () => undefined,
};

const meta: Meta<typeof TaskFilters> = {
  title: 'Components/TaskFilters',
  component: TaskFilters,
  args: {
    search: '',
    status: undefined,
    priority: undefined,
    tag: undefined,
    sort: 'createdAtDesc',
    tagOptions: ['frontend', 'backend', 'bugfix'],
    ...commonCallbacks,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActiveFilters: Story = {
  args: {
    search: 'релиз',
    status: 'inProgress',
    priority: 'high',
  },
};

export const WithTagOptions: Story = {
  args: {
    tag: 'frontend',
    tagOptions: ['frontend', 'backend', 'bugfix', 'release'],
  },
};
