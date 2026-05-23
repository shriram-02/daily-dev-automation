import fs from 'node:fs/promises';
import path from 'node:path';
import type { AppConfig } from '../config/schema.js';
import { getLocalDateKey } from '../utils/time.js';

export interface RuntimeState {
  date: string;
  commitsToday: number;
  lastCommitAt?: string;
  lastCommitMessages: string[];
}

export async function readState(config: AppConfig, now = new Date()): Promise<RuntimeState> {
  const statePath = path.join(config.workspaceRoot, 'data', 'automation-ledger.json');
  const date = getLocalDateKey(now, config.timezone);
  try {
    const parsed = JSON.parse(await fs.readFile(statePath, 'utf8')) as RuntimeState;
    if (parsed.date === date) return parsed;
  } catch {
    // Fresh state is expected on first run.
  }
  return { date, commitsToday: 0, lastCommitMessages: [] };
}

export async function writeState(config: AppConfig, state: RuntimeState): Promise<void> {
  const statePath = path.join(config.workspaceRoot, 'data', 'automation-ledger.json');
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await fs.writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}
