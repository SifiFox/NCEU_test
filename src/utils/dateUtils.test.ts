import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatDateTime, formatDeadline, overdue } from '@/utils/dateUtils';

describe('dateUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-15T10:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true for deadlines in the past', () => {
    expect(overdue('2026-03-14')).toBe(true);
  });

  it('returns false for current or future deadlines', () => {
    expect(overdue('2026-03-15')).toBe(false);
    expect(overdue('2026-03-16')).toBe(false);
  });

  it('formats deadline in ru locale and returns raw value for invalid date', () => {
    const value = '2026-03-10';
    const expected = new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(value));

    expect(formatDeadline(value)).toBe(expected);
    expect(formatDeadline('not-a-date')).toBe('not-a-date');
  });

  it('formats date-time in ru locale and returns fallback for invalid value', () => {
    const value = '2026-03-10T14:35:00.000Z';
    const expected = new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));

    expect(formatDateTime(value)).toBe(expected);
    expect(formatDateTime('invalid-date')).toBe('Не указано');
  });
});
