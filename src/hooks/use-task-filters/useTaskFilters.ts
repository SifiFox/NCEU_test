import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE, type TaskSortKey } from "@/constants";
import type { Task, TaskPriority, TaskStatus } from "@/types";
import { filterAndSortTasks } from "./task-filters-logic";
import {
  parseFiltersFromQueryParams,
  toQueryParams,
} from "./task-filters-query";
import { type TaskFiltersState } from "./task-filters-state";

export { DEFAULT_TASK_FILTERS } from "./task-filters-state";
export type { TaskFiltersState } from "./task-filters-state";

export function useTaskFilters(tasks: Task[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(
    () => parseFiltersFromQueryParams({ searchParams }),
    [searchParams],
  );

  const filtered = useMemo(
    () => filterAndSortTasks({ tasks, filters }),
    [filters, tasks],
  );

  const paginated = useMemo(() => {
    const offset = (filters.page - 1) * PAGE_SIZE;
    return filtered.slice(offset, offset + PAGE_SIZE);
  }, [filtered, filters.page]);

  const updateFilters = useCallback(
    (partialFilters: Partial<TaskFiltersState>) => {
      const nextFilters: TaskFiltersState = {
        ...filters,
        ...partialFilters,
      };
      const nextSearchParams = toQueryParams({ filters: nextFilters });
      setSearchParams(nextSearchParams);
    },
    [filters, setSearchParams],
  );

  const setFilters = useCallback(
    (
      updater:
        | TaskFiltersState
        | ((previousFilters: TaskFiltersState) => TaskFiltersState),
    ) => {
      const nextFilters =
        typeof updater === "function" ? updater(filters) : updater;
      setSearchParams(toQueryParams({ filters: nextFilters }));
    },
    [filters, setSearchParams],
  );

  const setSearch = useCallback(
    (search: string) => {
      updateFilters({ search, page: 1 });
    },
    [updateFilters],
  );

  const setStatus = useCallback(
    (status?: TaskStatus) => {
      updateFilters({ status, page: 1 });
    },
    [updateFilters],
  );

  const setPriority = useCallback(
    (priority?: TaskPriority) => {
      updateFilters({ priority, page: 1 });
    },
    [updateFilters],
  );

  const setTag = useCallback(
    (tag?: string) => {
      updateFilters({ tag, page: 1 });
    },
    [updateFilters],
  );

  const setSort = useCallback(
    (sort: TaskSortKey) => {
      updateFilters({ sort, page: 1 });
    },
    [updateFilters],
  );

  const setPage = useCallback(
    (page: number) => {
      updateFilters({ page: Math.max(1, page) });
    },
    [updateFilters],
  );

  const resetFilters = useCallback(() => {
    setSearchParams();
  }, [setSearchParams]);

  return {
    filters,
    setFilters,
    filtered,
    paginated,
    total: filtered.length,
    setSearch,
    setStatus,
    setPriority,
    setTag,
    setSort,
    setPage,
    resetFilters,
  };
}
