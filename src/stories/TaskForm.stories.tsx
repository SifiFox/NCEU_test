import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskForm } from '@/components';
import { mockTask, mockTags } from './mocks';

const meta: Meta<typeof TaskForm> = {
  title: 'Components/TaskForm',
  component: TaskForm,
  args: {
    open: true,
    title: 'Новая задача',
    onCancel: () => undefined,
    onSubmit: async () => undefined,
    isSubmitting: false,
    submitError: undefined,
  },
  parameters: {
    tagsData: mockTags,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateMode: Story = {};

export const EditMode: Story = {
  args: {
    title: 'Редактирование задачи',
    initialValues: mockTask,
  },
};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};

export const WithError: Story = {
  args: {
    submitError: 'Не удалось сохранить задачу. Попробуйте позже.',
  },
};
