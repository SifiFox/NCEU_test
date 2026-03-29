import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagSelector } from '@/components';
import { mockTags } from './mocks';

const meta: Meta<typeof TagSelector> = {
  title: 'Components/TagSelector',
  component: TagSelector,
  args: {
    value: [],
    onChange: () => undefined,
    placeholder: 'Выберите теги',
  },
  parameters: {
    tagsData: mockTags,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithSelectedTags: Story = {
  args: {
    value: ['frontend', 'release'],
  },
};
