import type { AppConfig } from '../config/schema.js';

function minutesFromTime(value: string): number {
  const [hour = '0', minute = '0'] = value.split(':');
  return Number(hour) * 60 + Number(minute);
}

export function getLocalDateKey(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

export function getLocalMinutes(date: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');
  return hour * 60 + minute;
}

export function isQuietHours(date: Date, config: AppConfig): boolean {
  const now = getLocalMinutes(date, config.timezone);
  const start = minutesFromTime(config.quietHoursStart);
  const end = minutesFromTime(config.quietHoursEnd);
  if (start === end) return false;
  if (start < end) return now >= start && now < end;
  return now >= start || now < end;
}
