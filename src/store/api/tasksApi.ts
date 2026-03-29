import { baseApi } from '@/store/api';
import type { Task, TaskStatus } from '@/types';

type PatchTaskStatusPayload = {
  id: string;
  status: TaskStatus;
};

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => '/tasks',
      providesTags: ['Task'],
    }),
    getTaskById: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: ['Task'],
    }),
    createTask: builder.mutation<Task, Task>({
      query: (payload) => ({
        url: '/tasks',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<Task, Task>({
      query: ({ id, ...payload }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: { id, ...payload },
      }),
      invalidatesTags: ['Task'],
    }),
    patchTaskStatus: builder.mutation<Task, PatchTaskStatusPayload>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: { status, updatedAt: new Date().toISOString() },
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  usePatchTaskStatusMutation,
  useDeleteTaskMutation,
} = tasksApi;
