import type { Meta, StoryObj } from '@storybook/react-vite';
import { TructatedText } from '@/components';

const longParagraph =
  'Это длинный текст задачи, который нужен для демонстрации режима обрезки. ' +
  'Когда строк становится больше заданного лимита, компонент показывает многоточие и подсказку.';

const meta: Meta<typeof TructatedText> = {
  title: 'Components/TructatedText',
  component: TructatedText,
  args: {
    text: 'Текст задачи',
    rows: 2,
    as: 'paragraph',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ShortText: Story = {
  args: {
    text: 'Короткий текст без обрезки',
    rows: 1,
  },
};

export const LongParagraph: Story = {
  args: {
    text: longParagraph,
    rows: 2,
    as: 'paragraph',
  },
};

export const AsText: Story = {
  args: {
    text: 'Однострочный вариант в Typography.Text',
    as: 'text',
  },
};

export const Danger: Story = {
  args: {
    text: 'Ошибка валидации поля',
    as: 'text',
    type: 'danger',
  },
};

export const Secondary: Story = {
  args: {
    text: 'Вспомогательная информация',
    as: 'text',
    type: 'secondary',
  },
};
