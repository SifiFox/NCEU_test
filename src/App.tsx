import { Layout, Spin } from 'antd';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { TaskListPage } from '@/pages';

const TaskDetailPage = lazy(() =>
  import('@/pages/TaskDetailPage').then((module) => ({
    default: module.TaskDetailPage,
  })),
);

const basePath = import.meta.env.BASE_URL || '/';


function App() {

  return (
    <BrowserRouter basename={basePath}>
      <Layout style={{ minHeight: '100vh', padding: '24px' }}>
        <Layout.Content style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <Suspense fallback={<Spin size="large" />}>
            <Routes>
              <Route path="/" element={<TaskListPage />} />
              <Route path="/tasks/:id" element={<TaskDetailPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout.Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
