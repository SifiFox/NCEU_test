import { Select, Typography } from 'antd';
import { useMemo } from 'react';
import { useGetTagsQuery } from '@/store/api';

type TagSelectorProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
};

export function TagSelector({
  value,
  onChange,
  placeholder = 'Выберите теги',
}: TagSelectorProps) {
  const { data: tags = [], isLoading } = useGetTagsQuery();

  const options = useMemo(
    () => tags.map((tag) => ({ value: tag.name, label: tag.name })),
    [tags],
  );

  function normalizeTags(nextTags: string[]) {
    const normalizedSet = new Set<string>();
    for (const tagName of nextTags) {
      const normalizedTag = tagName.trim();
      if (normalizedTag) {
        normalizedSet.add(normalizedTag);
      }
    }

    return Array.from(normalizedSet);
  }

  return (
    <>
      <Select
        mode="tags"
        allowClear
        showSearch={{
          filterOption: (inputValue, option) =>
            String(option?.label ?? '')
              .toLowerCase()
              .includes(inputValue.toLowerCase()),
        }}
        value={value}
        options={options}
        loading={isLoading}
        placeholder={placeholder}
        tokenSeparators={[',']}
        onChange={(nextTags) => onChange(normalizeTags(nextTags))}
      />
      <Typography.Text type="secondary">
        Введите тег и нажмите Enter, чтобы добавить его в задачу.
      </Typography.Text>
    </>
  );
}
