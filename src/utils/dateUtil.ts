import { parseISO, parse, isValid, format } from 'date-fns';
import { DATE_FORMATS, DateMode } from '../constants/dateFormat';

export const normalizeToDate = (value: any): Date | null => {
  if (!value) return null;

  // 1. Check if it's already a Date object (Safety first)
  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    // 2. Try Full ISO (Datetime: "2026-01-12T15:30:00.000Z")
    // parseISO is very strict; if it doesn't see an ISO pattern, it returns Invalid Date
    let parsed = parseISO(trimmed);
    if (isValid(parsed)) return parsed;

    // 3. Try Date-only (Date: "2026-01-12")
    // We use parse() with a specific template
    parsed = parse(trimmed, 'yyyy-MM-dd', new Date());
    if (isValid(parsed)) return parsed;

    // 4. Try Time-only (Time: "15:30:00")
    parsed = parse(trimmed, 'HH:mm:ss', new Date());
    if (isValid(parsed)) return parsed;
  }

  return null;
};

/**
 * We pass 'mode' here because even if normalizeToDate finds a date,
 * we need to know HOW the user wants to see it (e.g., just the time).
 */
export const formatForDisplay = (value: any, mode: DateMode): string => {
  const date = normalizeToDate(value);
  if (!date) return '';
  return format(date, DATE_FORMATS[mode].display);
};