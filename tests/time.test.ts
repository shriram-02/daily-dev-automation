import { describe, expect, it } from 'vitest';
import type { AppConfig } from '../src/config/schema.js';
import { getLocalDateKey, isQuietHours } from '../src/utils/time.js';

const config: AppConfig = {
  dryRun: true,
  localMode: true,
  timezone: 'UTC',
  maxCommitsPerDay: 8,
  minMinutesBetweenCommits: 90,
  quietHoursStart: '22:00',
  quietHoursEnd: '06:00',
  allowedBranch: 'main',
  gitAuthorName: 'bot',
  gitAuthorEmail: 'bot@example.com',
  workspaceRoot: '/repo'
};

describe('time helpers', () => {
  it('creates stable local date keys', () => {
    expect(getLocalDateKey(new Date('2026-05-22T12:00:00Z'), 'UTC')).toBe('2026-05-22');
  });

  it('handles quiet hours across midnight', () => {
    expect(isQuietHours(new Date('2026-05-22T23:00:00Z'), config)).toBe(true);
    expect(isQuietHours(new Date('2026-05-22T12:00:00Z'), config)).toBe(false);
  });
});
