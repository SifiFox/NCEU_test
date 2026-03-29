import { Alert, Button, Col, Empty, Flex, Pagination, Row, Spin, Typography } from 'antd';
import { useMemo } from 'react';
import { PAGE_SIZE } from '@/constants';
import { TaskCard, TaskFilters, TaskForm } from '@/components';
import { useTaskListInteractions, useTaskModal, useTaskFilters } from '@/hooks';
import { useGetTagsQuery, useGetTasksQuery } from '@/store/api';
import cls from '@/pages/TaskListPage.module.css';

export function TaskListPage() {
  const { data: tasks = [], isLoading, isError } = useGetTasksQuery();
  const { data: tags = [] } = useGetTagsQuery();

  const { isOpen, editingTask, openForCreate, closeModal } = useTaskModal();
  const {
    filters,
    paginated,
    total,
    setSearch,
    setStatus,
    setPriority,
    setTag,
    setSort,
    setPage,
    resetFilters,
  } = useTaskFilters(tasks);

  const tagOptions = useMemo(() => tags.map((tag) => tag.name), [tags]);
  const {
    submitError,
    isSubmitting,
    pendingStatusTaskId,
    onTaskListClick,
    onStatusChange,
    handleSubmit,
  } = useTaskListInteractions({
    tags,
    editingTask,
    closeModal,
    setTag,
  });

  return (
    <Flex vertical gap={20} className={cls.page}>
      <Flex justify="space-between" align="center" wrap className={cls.header}>
        <Typography.Title level={2} className={cls.title}>
          Задачник
        </Typography.Title>
        <Button type="primary" onClick={openForCreate}>
          Создать задачу
        </Button>
      </Flex>

      <TaskFilters
        search={filters.search}
        status={filters.status}
        priority={filters.priority}
        tag={filters.tag}
        sort={filters.sort}
        tagOptions={tagOptions}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onTagChange={setTag}
        onSortChange={setSort}
        onReset={resetFilters}
      />

      {isLoading ? (
        <Spin size="large" />
      ) : null}

      {isError ? (
        <Alert
          type="error"
          showIcon
          description="Не удалось загрузить список задач."
        />
      ) : null}

      {!isLoading && !isError && paginated.length === 0 ? (
        <Empty description="Задачи не найдены" />
      ) : null}

      <Row gutter={[16, 16]} onClick={onTaskListClick}>
        {paginated.map((task) => (
          <Col key={task.id} xs={24} md={12} xl={8} className={cls.cardCol}>
            <TaskCard
              task={task}
              isStatusUpdating={pendingStatusTaskId === task.id}
              onStatusChange={onStatusChange}
            />
          </Col>
        ))}
      </Row>

      {total > PAGE_SIZE ? (
        <Flex justify="center">
          <Pagination
            current={filters.page}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={setPage}
          />
        </Flex>
      ) : null}

      <TaskForm
        open={isOpen}
        title={editingTask ? 'Редактировать задачу' : 'Создать задачу'}
        initialValues={editingTask}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </Flex>
  );
}
