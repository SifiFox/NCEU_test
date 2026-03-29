import { Card, Flex, Select, Space, Tag, Typography } from 'antd';
import { memo, type MouseEvent } from 'react';
import { PRIORITY_LABELS, STATUS_LABELS, STATUS_OPTIONS } from '@/constants';
import { TructatedText } from '@/components/TructatedText';
import type { Task, TaskPriority, TaskStatus } from '@/types';
import { formatDeadline, overdue } from '@/utils';
import cls from '@/components/TaskCard.module.css';

type TaskCardProps = {
  task: Task;
  isStatusUpdating?: boolean;
  onStatusChange: (id: string, status: TaskStatus) => void;
};

const cardClassByStatus: Record<TaskStatus, string> = {
  todo: cls.card,
  inProgress: `${cls.card} ${cls.cardProgress}`,
  done: `${cls.card} ${cls.cardDone}`,
};

const statusLozengeClassByStatus: Record<TaskStatus, string> = {
  todo: cls.statusTodo,
  inProgress: cls.statusInProgress,
  done: cls.statusDone,
};

const priorityLozengeClassByPriority: Record<TaskPriority, string> = {
  low: cls.priorityLow,
  medium: cls.priorityMedium,
  high: cls.priorityHigh,
};

const getCardClassName = (status: TaskStatus) => cardClassByStatus[status];

export const TaskCard = memo(function TaskCard({
  task,
  isStatusUpdating = false,
  onStatusChange,
}: TaskCardProps) {
  const isOverdue = task.status !== 'done' && overdue(task.deadline);

  const stopCardClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  return (
    <Card
      hoverable
      data-task-id={task.id}
      className={`${getCardClassName(task.status)} ${isOverdue ? cls.cardOverdue : ''}`}
    >
      <Flex vertical gap={12} className={cls.content}>
        <Flex vertical gap={8} align="stretch" className={cls.header}>
          <div onClick={stopCardClick} onMouseDown={stopCardClick}>
            <Select
              className={cls.statusSelect}
              size="small"
              options={STATUS_OPTIONS}
              value={task.status}
              loading={isStatusUpdating}
              onClick={stopCardClick}
              onMouseDown={stopCardClick}
              onChange={(value) => onStatusChange(task.id, value)}
            />
          </div>
          <Space size={8} align="start" className={cls.titleWrap}>
            <TructatedText
              text={task.title}
              rows={2}
              strong
              as="paragraph"
              className={cls.titleText}
            />
          </Space>
        </Flex>

        <Typography.Paragraph
          className={cls.description}
          ellipsis={{
            rows: 2,
          }}
        >
          {task.description || 'Без описания'}
        </Typography.Paragraph>

        <Space size={8} wrap className={cls.metaRow}>
          <span className={`${cls.info} ${statusLozengeClassByStatus[task.status]}`}>
            {STATUS_LABELS[task.status]}
          </span>
          <span className={`${cls.info} ${priorityLozengeClassByPriority[task.priority]}`}>
            Приоритет: {PRIORITY_LABELS[task.priority]}
          </span>
          <span
            className={`${cls.info} ${isOverdue ? cls.deadlineOverdue : cls.deadlineDefault}`}
          >
            Дедлайн: {formatDeadline(task.deadline)}
          </span>
        </Space>

        <Flex justify="space-between" align="flex-end" gap={8} className={cls.bottomRow}>
          <Flex vertical gap={6} className={cls.tagsRow}>
            <Space wrap className={cls.tags}>
              {task.tags.map((tag) => (
                <Tag
                  key={`${task.id}-${tag}`}
                  data-task-tag={tag}
                  className={cls.tag}
                >
                  {tag}
                </Tag>
              ))}
            </Space>
          </Flex>
          {isOverdue ? (
            <Tag color="red" className={cls.overdueTag}>
              Просрочено
            </Tag>
          ) : null}
        </Flex>
      </Flex>
    </Card>
  );
});
