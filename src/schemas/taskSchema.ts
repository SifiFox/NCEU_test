import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(5, 'Минимум 5 символов'),
  description: z
    .string()
    .max(500, 'Максимум 500 символов')
    .optional()
    .or(z.literal('')),
  status: z.enum(['todo', 'inProgress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  deadline: z.string().min(1, 'Обязательное поле'),
  tags: z.array(z.string()).min(1, 'Выберите минимум 1 тег'),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
