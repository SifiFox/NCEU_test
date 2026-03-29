import { describe, expect, it } from 'vitest';
import { taskSchema } from '@/schemas/taskSchema';

const validTask = {
  title: 'Подготовить релиз',
  description: 'Проверить чеклист и выкатить изменения',
  status: 'todo' as const,
  priority: 'medium' as const,
  deadline: '2026-03-20',
  tags: ['frontend'],
};

describe('taskSchema', () => {
  it('rejects title shorter than 5 chars', () => {
    const result = taskSchema.safeParse({ ...validTask, title: 'Зада' });

    expect(result.success).toBe(false);
  });

  it('accepts title with 5 or more chars', () => {
    const result = taskSchema.safeParse({ ...validTask, title: 'Задача' });

    expect(result.success).toBe(true);
  });

  it('rejects description longer than 500 chars and accepts empty description', () => {
    const tooLongDescription = 'a'.repeat(501);

    expect(
      taskSchema.safeParse({ ...validTask, description: tooLongDescription }).success,
    ).toBe(false);
    expect(taskSchema.safeParse({ ...validTask, description: '' }).success).toBe(true);
  });

  it('rejects empty tags and accepts non-empty tags', () => {
    expect(taskSchema.safeParse({ ...validTask, tags: [] }).success).toBe(false);
    expect(taskSchema.safeParse({ ...validTask, tags: ['bug'] }).success).toBe(true);
  });

  it('rejects empty deadline', () => {
    const result = taskSchema.safeParse({ ...validTask, deadline: '' });

    expect(result.success).toBe(false);
  });
});
