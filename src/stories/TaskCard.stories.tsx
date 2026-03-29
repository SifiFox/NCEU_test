import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskCard } from '@/components';
import type { TaskStatus } from '@/types';
import { mockTask } from './mocks';

function withStatus(status: TaskStatus) {
  return { ...mockTask, status };
}

const meta: Meta<typeof TaskCard> = {
  title: 'Components/TaskCard',
  component: TaskCard,
  args: {
    task: mockTask,
    isStatusUpdating: false,
    onStatusChange: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Todo: Story = {
  args: {
    task: withStatus('todo'),
  },
};

export const InProgress: Story = {
  args: {
    task: withStatus('inProgress'),
  },
};

export const Done: Story = {
  args: {
    task: withStatus('done'),
  },
};

export const Overdue: Story = {
  args: {
    task: {
      ...withStatus('todo'),
      deadline: '2026-01-01',
    },
  },
};

export const StatusUpdating: Story = {
  args: {
    task: withStatus('inProgress'),
    isStatusUpdating: true,
  },
};

export const NoDescription: Story = {
  args: {
    task: {
      ...withStatus('todo'),
      description: '',
    },
  },
};
