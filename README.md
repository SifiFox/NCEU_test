# Task Manager 

## Технологии

- React 18+ (функциональные компоненты и хуки)
- TypeScript
- Ant Design
- React Router v6
- Redux Toolkit + RTK Query
- react-hook-form + zod
- JSON Server
- Vite

## Возможности

- CRUD для задач
- Отдельный PATCH-запрос для быстрого изменения статуса
- Просмотр задачи на отдельной странице
- Подтверждение удаления задачи через модальное окно
- Фильтрация по статусу, приоритету, тегу
- Поиск по названию задачи
- Сортировка по дате создания и дедлайну
- Пагинация списка задач
- Визуальное выделение просроченных задач
- Выбор тегов с поиском и созданием новых

## Структура проекта

- src/pages — экранные контейнеры (TaskListPage, TaskDetailPage), отвечают за сборку страницы и сценарии пользователя.
- src/components — переиспользуемые UI-компоненты (TaskCard, TaskFilters, TaskForm, TagSelector).
- src/hooks — прикладная логика и композиция поведения (модалки, удаление, фильтрация).
- src/store/api — слой работы с сервером (baseApi, tasksApi, tagsApi) на основе RTK Query.
- src/schemas — валидация форм (zod-схемы).
- src/utils — утилиты форматирования дат и служебные функции.
- src/constants, src/types — константы и доменные типы.

## Запуск проекта

### 1. Установить зависимости

```bash
npm install
```

### 2. Запустить приложение и mock API

```bash
npm run dev
```

Скрипт запускает:
- Vite dev server (frontend)
- JSON Server на `http://localhost:3001`

