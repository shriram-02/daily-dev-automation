import { loadConfig } from './config/loadConfig.js';
import { GitClient } from './git/gitClient.js';
import { readState, writeState } from './git/state.js';
import { canCommit } from './git/throttle.js';
import { createTasks } from './tasks/content.js';
import { logger } from './utils/logger.js';
import { isQuietHours } from './utils/time.js';

async function main(): Promise<void> {
  const now = new Date();
  const config = loadConfig();
  logger.info('automation run started', {
    dryRun: config.dryRun,
    localMode: config.localMode,
    timezone: config.timezone
  });

  if (isQuietHours(now, config)) {
    logger.info('quiet hours active; skipping write operations');
    return;
  }

  const state = await readState(config, now);
  const throttle = canCommit(config, state, now);
  if (!throttle.allowed) {
    logger.info('commit throttle active; skipping run', { reason: throttle.reason });
    return;
  }

  const git = new GitClient(config);
  if (!config.localMode) {
    await git.assertSafeRepository();
  }

  const tasks = createTasks(config, now);
  const selectedTask = tasks[state.commitsToday % tasks.length];
  if (!selectedTask) throw new Error('No automation task selected');

  const result = await selectedTask.run();
  logger.info('task completed', { task: result.name, changed: result.changed });

  if (!result.changed) {
    logger.info('no meaningful content change; skipping commit');
    return;
  }

  const changedFiles = await git.changedFiles();
  const relevantFiles = result.files.filter((file) => changedFiles.includes(file));
  if (relevantFiles.length === 0) {
    logger.info('no git-visible relevant changes; skipping commit');
    return;
  }

  if (!config.dryRun) state.commitsToday += 1;
  state.lastCommitAt = now.toISOString();
  state.lastCommitMessages = [result.commitMessage, ...state.lastCommitMessages].slice(0, 20);
  await writeState(config, state);
  const filesToCommit = [...new Set([...relevantFiles, 'data/automation-ledger.json'])];

  await git.commit(filesToCommit, result.commitMessage);
  await git.push();

  logger.info('automation run completed', {
    committed: !config.dryRun,
    files: relevantFiles.length
  });
}

main().catch((error: unknown) => {
  logger.error('automation run failed', {
    error: error instanceof Error ? error.message : String(error)
  });
  process.exitCode = 1;
});
