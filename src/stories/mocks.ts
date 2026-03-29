import type { Tag, Task } from '@/types';

export const mockTags: Tag[] = [
  { id: 'tag-frontend', name: 'frontend' },
  { id: 'tag-backend', name: 'backend' },
  { id: 'tag-bugfix', name: 'bugfix' },
  { id: 'tag-release', name: 'release' },
];

export const mockTask: Task = {
  id: 'task-1001',
  title: 'Подготовить релиз версии 2.0',
  description: 'Проверить чеклист, обновить changelog и выкатить релиз.',
  status: 'todo',
  priority: 'high',
  deadline: '2026-04-10',
  tags: ['frontend', 'release'],
  createdAt: '2026-03-20T10:00:00.000Z',
  updatedAt: '2026-03-20T10:00:00.000Z',
};
