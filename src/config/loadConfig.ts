import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { appConfigSchema, type AppConfig } from './schema.js';

dotenv.config();

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function loadConfig(): AppConfig {
  const jsonConfigPath = path.resolve(process.cwd(), 'config.json');
  const jsonConfig = fs.existsSync(jsonConfigPath)
    ? (JSON.parse(fs.readFileSync(jsonConfigPath, 'utf8')) as Partial<{
        timezone: string;
        maxCommitsPerDay: number;
        minMinutesBetweenCommits: number;
        quietHours: { start?: string; end?: string };
        allowedBranch: string;
      }>)
    : {};

  const config = {
    dryRun: parseBoolean(process.env.DDA_DRY_RUN, false),
    localMode: parseBoolean(process.env.DDA_LOCAL_MODE, false),
    timezone: process.env.DDA_TIMEZONE ?? jsonConfig.timezone ?? 'UTC',
    maxCommitsPerDay: parseNumber(
      process.env.DDA_MAX_COMMITS_PER_DAY,
      jsonConfig.maxCommitsPerDay ?? 8
    ),
    minMinutesBetweenCommits: parseNumber(
      process.env.DDA_MIN_MINUTES_BETWEEN_COMMITS,
      jsonConfig.minMinutesBetweenCommits ?? 90
    ),
    quietHoursStart: process.env.DDA_QUIET_HOURS_START ?? jsonConfig.quietHours?.start ?? '22:00',
    quietHoursEnd: process.env.DDA_QUIET_HOURS_END ?? jsonConfig.quietHours?.end ?? '06:00',
    allowedBranch: process.env.DDA_ALLOWED_BRANCH ?? jsonConfig.allowedBranch ?? 'main',
    gitAuthorName: process.env.DDA_GIT_AUTHOR_NAME ?? 'daily-dev-automation',
    gitAuthorEmail:
      process.env.DDA_GIT_AUTHOR_EMAIL ?? '41898282+github-actions[bot]@users.noreply.github.com',
    workspaceRoot: path.resolve(process.cwd())
  };

  return appConfigSchema.parse(config);
}
