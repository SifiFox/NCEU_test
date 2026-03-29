import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form, Grid, Input, Modal, Radio, Select } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '@/constants';
import { type TaskFormValues, taskSchema } from '@/schemas';
import { TagSelector } from '@/components';
import type { Task } from '@/types';
import cls from './TaskForm.module.css';

type TaskFormProps = {
  open: boolean;
  title: string;
  initialValues?: Task;
  isSubmitting?: boolean;
  submitError?: string;
  onCancel: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void> | void;
};

function getDefaultValues(initialValues?: Task): TaskFormValues {
  if (!initialValues) {
    return {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      deadline: '',
      tags: [],
    };
  }

  return {
    title: initialValues.title,
    description: initialValues.description ?? '',
    status: initialValues.status,
    priority: initialValues.priority,
    deadline: initialValues.deadline,
    tags: initialValues.tags,
  };
}

export function TaskForm({
  open,
  title,
  initialValues,
  isSubmitting = false,
  submitError,
  onCancel,
  onSubmit,
}: TaskFormProps) {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const formId = 'task-form';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: getDefaultValues(initialValues),
  });

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(initialValues));
    }
  }, [initialValues, open, reset]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      destroyOnHidden
      centered={!isMobile}
      wrapClassName={isMobile ? cls.mobileModalWrap : undefined}
      footer={
        <div className={cls.footerActions}>
          <Button onClick={onCancel}>Отмена</Button>
          <Button
            type="primary"
            htmlType="submit"
            form={formId}
            loading={isSubmitting}
          >
            Сохранить
          </Button>
        </div>
      }
    >
      <Form
        id={formId}
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        className={cls.form}
      >
        <div
          className={`${cls.formScroll} ${isMobile ? cls.mobileFormScroll : ''}`}
        >
          {submitError ? <Alert type="error" message={submitError} showIcon /> : null}

          <Form.Item
            label="Заголовок"
            validateStatus={errors.title ? 'error' : ''}
            help={errors.title?.message}
          >
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Например: Подготовить релиз"
                  maxLength={120}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Описание"
            validateStatus={errors.description ? 'error' : ''}
            help={errors.description?.message}
          >
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  placeholder="Дополнительные детали задачи"
                  rows={4}
                  maxLength={500}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Статус"
            validateStatus={errors.status ? 'error' : ''}
            help={errors.status?.message}
          >
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  {...field}
                  options={STATUS_OPTIONS}
                  onChange={field.onChange}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Приоритет"
            validateStatus={errors.priority ? 'error' : ''}
            help={errors.priority?.message}
          >
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Radio.Group
                  optionType="button"
                  buttonStyle="solid"
                  options={PRIORITY_OPTIONS}
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.value)}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Дедлайн"
            validateStatus={errors.deadline ? 'error' : ''}
            help={errors.deadline?.message}
          >
            <Controller
              control={control}
              name="deadline"
              render={({ field }) => <Input {...field} type="date" />}
            />
          </Form.Item>

          <Form.Item
            label="Теги"
            validateStatus={errors.tags ? 'error' : ''}
            help={errors.tags?.message}
            className={cls.submitItem}
          >
            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <TagSelector value={field.value} onChange={field.onChange} />
              )}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
