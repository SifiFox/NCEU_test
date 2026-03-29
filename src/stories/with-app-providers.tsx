import { configureStore } from '@reduxjs/toolkit';
import type { Decorator } from '@storybook/react-vite';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { baseApi, tagsApi } from '@/store/api';
import type { Tag } from '@/types';
import { mockTags } from './mocks';

function createStoryStore({ tags }: { tags: Tag[] }) {
  const store = configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });

  store.dispatch(tagsApi.util.upsertQueryData('getTags', undefined, tags));

  return store;
}

export const withAppProviders: Decorator = (Story, context) => {
  const tagsData = (context.parameters.tagsData as Tag[] | undefined) ?? mockTags;
  const store = createStoryStore({ tags: tagsData });

  return (
    <Provider store={store}>
      <MemoryRouter>
        <div style={{ padding: 16, maxWidth: 920 }}>
          <Story />
        </div>
      </MemoryRouter>
    </Provider>
  );
};
