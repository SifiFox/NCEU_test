import { baseApi } from '@/store/api';
import type { Tag } from '@/types';

type CreateTagPayload = Pick<Tag, 'name'>;

export const tagsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query<Tag[], void>({
      query: () => '/tags',
      providesTags: ['Tag'],
    }),
    createTag: builder.mutation<Tag, CreateTagPayload>({
      query: (payload) => ({
        url: '/tags',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Tag'],
    }),
  }),
});

export const { useGetTagsQuery, useCreateTagMutation } = tagsApi;
