import { describe, expect, it } from 'vitest';
import type { AppConfig } from '../src/config/schema.js';
import { canCommit } from '../src/git/throttle.js';

const config: AppConfig = {
  dryRun: false,
  localMode: false,
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

describe('commit throttling', () => {
  it('blocks after the daily limit', () => {
    expect(
      canCommit(config, { date: '2026-05-22', commitsToday: 8, lastCommitMessages: [] })
    ).toEqual({
      allowed: false,
      reason: 'daily commit limit reached'
    });
  });

  it('blocks commits inside the minimum interval', () => {
    const now = new Date('2026-05-22T12:00:00Z');
    const state = {
      date: '2026-05-22',
      commitsToday: 2,
      lastCommitAt: '2026-05-22T11:00:00Z',
      lastCommitMessages: []
    };
    expect(canCommit(config, state, now)).toEqual({
      allowed: false,
      reason: 'minimum interval between commits has not elapsed'
    });
  });
});
