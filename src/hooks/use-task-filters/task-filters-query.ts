import type { TaskSortKey } from '@/constants';
import type { TaskPriority, TaskStatus } from '@/types';
import { DEFAULT_TASK_FILTERS, type TaskFiltersState } from './task-filters-state';

const TASK_FILTERS_QUERY_KEYS = {
  search: 'search',
  status: 'status',
  priority: 'priority',
  tag: 'tag',
  sort: 'sort',
  page: 'page',
};

const STATUS_BY_QUERY_VALUE: Record<string, TaskStatus> = {
  todo: 'todo',
  inProgress: 'inProgress',
  done: 'done',
};

const PRIORITY_BY_QUERY_VALUE: Record<string, TaskPriority> = {
  low: 'low',
  medium: 'medium',
  high: 'high',
};

const SORT_BY_QUERY_VALUE: Record<string, TaskSortKey> = {
  createdAtDesc: 'createdAtDesc',
  createdAtAsc: 'createdAtAsc',
  deadlineAsc: 'deadlineAsc',
  deadlineDesc: 'deadlineDesc',
};

type FilterQueryConfigEntry<TValue> = {
  queryKey: string;
  fromQuery: (rawValue: string | null) => TValue;
  toQuery: (value: TValue) => string | undefined;
};

type TaskFiltersQueryConfig = {
  search: FilterQueryConfigEntry<TaskFiltersState['search']>;
  status: FilterQueryConfigEntry<TaskFiltersState['status']>;
  priority: FilterQueryConfigEntry<TaskFiltersState['priority']>;
  tag: FilterQueryConfigEntry<TaskFiltersState['tag']>;
  sort: FilterQueryConfigEntry<TaskFiltersState['sort']>;
  page: FilterQueryConfigEntry<TaskFiltersState['page']>;
};

const FILTER_QUERY_CONFIG: TaskFiltersQueryConfig = {
  search: {
    queryKey: TASK_FILTERS_QUERY_KEYS.search,
    fromQuery: (rawValue) => normalizeText(rawValue) ?? '',
    toQuery: (value) => normalizeText(value),
  },
  status: {
    queryKey: TASK_FILTERS_QUERY_KEYS.status,
    fromQuery: (rawValue) => parseStatus(rawValue),
    toQuery: (value) => value,
  },
  priority: {
    queryKey: TASK_FILTERS_QUERY_KEYS.priority,
    fromQuery: (rawValue) => parsePriority(rawValue),
    toQuery: (value) => value,
  },
  tag: {
    queryKey: TASK_FILTERS_QUERY_KEYS.tag,
    fromQuery: (rawValue) => normalizeText(rawValue),
    toQuery: (value) => normalizeText(value),
  },
  sort: {
    queryKey: TASK_FILTERS_QUERY_KEYS.sort,
    fromQuery: (rawValue) => parseSort(rawValue),
    toQuery: (value) => (value === DEFAULT_TASK_FILTERS.sort ? undefined : value),
  },
  page: {
    queryKey: TASK_FILTERS_QUERY_KEYS.page,
    fromQuery: (rawValue) => parsePageValue(rawValue),
    toQuery: (value) => (value > 1 ? String(value) : undefined),
  },
};

export function parseFiltersFromQueryParams({
  searchParams,
}: {
  searchParams: URLSearchParams;
}): TaskFiltersState {
  return {
    search: FILTER_QUERY_CONFIG.search.fromQuery(
      searchParams.get(FILTER_QUERY_CONFIG.search.queryKey),
    ),
    status: FILTER_QUERY_CONFIG.status.fromQuery(
      searchParams.get(FILTER_QUERY_CONFIG.status.queryKey),
    ),
    priority: FILTER_QUERY_CONFIG.priority.fromQuery(
      searchParams.get(FILTER_QUERY_CONFIG.priority.queryKey),
    ),
    tag: FILTER_QUERY_CONFIG.tag.fromQuery(
      searchParams.get(FILTER_QUERY_CONFIG.tag.queryKey),
    ),
    sort: FILTER_QUERY_CONFIG.sort.fromQuery(
      searchParams.get(FILTER_QUERY_CONFIG.sort.queryKey),
    ),
    page: FILTER_QUERY_CONFIG.page.fromQuery(
      searchParams.get(FILTER_QUERY_CONFIG.page.queryKey),
    ),
  };
}

export function toQueryParams({
  filters,
}: {
  filters: TaskFiltersState;
}): URLSearchParams {
  const queryParams = new URLSearchParams();
  const queryEntries: Array<{ queryKey: string; value: string | undefined }> = [
    {
      queryKey: FILTER_QUERY_CONFIG.search.queryKey,
      value: FILTER_QUERY_CONFIG.search.toQuery(filters.search),
    },
    {
      queryKey: FILTER_QUERY_CONFIG.status.queryKey,
      value: FILTER_QUERY_CONFIG.status.toQuery(filters.status),
    },
    {
      queryKey: FILTER_QUERY_CONFIG.priority.queryKey,
      value: FILTER_QUERY_CONFIG.priority.toQuery(filters.priority),
    },
    {
      queryKey: FILTER_QUERY_CONFIG.tag.queryKey,
      value: FILTER_QUERY_CONFIG.tag.toQuery(filters.tag),
    },
    {
      queryKey: FILTER_QUERY_CONFIG.sort.queryKey,
      value: FILTER_QUERY_CONFIG.sort.toQuery(filters.sort),
    },
    {
      queryKey: FILTER_QUERY_CONFIG.page.queryKey,
      value: FILTER_QUERY_CONFIG.page.toQuery(filters.page),
    },
  ];

  for (const { queryKey, value } of queryEntries) {
    if (value !== undefined) {
      queryParams.set(queryKey, value);
    }
  }

  return queryParams;
}

function normalizeText(value: string | null | undefined): string | undefined {
  const normalizedValue = value?.trim();
  if (!normalizedValue) {
    return undefined;
  }

  return normalizedValue;
}

function parseStatus(rawValue: string | null): TaskStatus | undefined {
  if (!rawValue) {
    return undefined;
  }

  return STATUS_BY_QUERY_VALUE[rawValue];
}

function parsePriority(rawValue: string | null): TaskPriority | undefined {
  if (!rawValue) {
    return undefined;
  }

  return PRIORITY_BY_QUERY_VALUE[rawValue];
}

function parseSort(rawValue: string | null): TaskSortKey {
  if (!rawValue) {
    return DEFAULT_TASK_FILTERS.sort;
  }

  return SORT_BY_QUERY_VALUE[rawValue] ?? DEFAULT_TASK_FILTERS.sort;
}

function parsePageValue(rawValue: string | null): number {
  if (!rawValue) {
    return DEFAULT_TASK_FILTERS.page;
  }

  const parsedPage = Number.parseInt(rawValue, 10);
  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    return DEFAULT_TASK_FILTERS.page;
  }

  return parsedPage;
}
