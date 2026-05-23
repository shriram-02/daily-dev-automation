import type { AppConfig } from '../config/schema.js';
import type { RuntimeState } from './state.js';

export function canCommit(
  config: AppConfig,
  state: RuntimeState,
  now = new Date()
): { allowed: true } | { allowed: false; reason: string } {
  if (state.commitsToday >= config.maxCommitsPerDay) {
    return { allowed: false, reason: 'daily commit limit reached' };
  }
  if (state.lastCommitAt) {
    const elapsedMinutes = (now.getTime() - new Date(state.lastCommitAt).getTime()) / 60_000;
    if (elapsedMinutes < config.minMinutesBetweenCommits) {
      return { allowed: false, reason: 'minimum interval between commits has not elapsed' };
    }
  }
  return { allowed: true };
}
