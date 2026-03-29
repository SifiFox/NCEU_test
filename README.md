# Task Manager SPA

Одностраничное приложение для управления задачами на современном стеке: React + TypeScript + RTK Query + JSON Server.

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

### Дополнительные команды

```bash
npm run dev:client   # только frontend
npm run dev:server   # только json-server
npm run lint         # eslint
npm run build        # production build
npm run preview      # локальный preview
```

## Архитектура проекта

```text
src/
  components/      # переиспользуемые UI-компоненты
  constants/       # единые константы и словари (DRY)
  hooks/           # кастомные хуки бизнес-логики
  pages/           # роут-страницы
  schemas/         # zod-схемы валидации
  store/
    api/           # RTK Query: baseApi + endpoints
  types/           # доменные типы
  utils/           # утилиты
```

### Поток данных

1. Компоненты страниц вызывают RTK Query hooks.
2. RTK Query обращается к JSON Server через `/api` proxy Vite.
3. После мутаций выполняется кеш-инвалидация (`Task`, `Tag`), список обновляется автоматически.

### Принципы реализации

- DRY: единые константы для статусов/приоритетов/сортировки
- KISS: простая композиция компонентов и локальный state фильтров
- YAGNI: без лишних абстракций и middleware поверх RTK Query
- Оптимизация: `React.memo`, `useMemo`, `useCallback`, lazy loading страницы деталей
