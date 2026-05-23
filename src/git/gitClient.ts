import { simpleGit, type SimpleGit } from 'simple-git';
import type { AppConfig } from '../config/schema.js';
import { logger } from '../utils/logger.js';
import { withRetry } from '../utils/retry.js';

export class GitClient {
  private readonly git: SimpleGit;

  constructor(private readonly config: AppConfig) {
    this.git = simpleGit({
      baseDir: config.workspaceRoot,
      binary: 'git',
      maxConcurrentProcesses: 1
    });
  }

  async assertSafeRepository(): Promise<void> {
    const branch = (await this.git.branch()).current;
    if (branch !== this.config.allowedBranch) {
      throw new Error(
        `Refusing to commit on branch "${branch}". Expected "${this.config.allowedBranch}".`
      );
    }
    const remotes = await this.git.getRemotes(true);
    if (remotes.length > 1) {
      throw new Error('Refusing to run with multiple git remotes configured.');
    }
  }

  async changedFiles(): Promise<string[]> {
    const status = await this.git.status();
    return [
      ...status.created,
      ...status.modified,
      ...status.deleted,
      ...status.renamed.map((file) => file.to)
    ];
  }

  async commit(files: string[], message: string): Promise<void> {
    if (this.config.dryRun) {
      logger.info('dry run: skipping git commit', { message, files: files.length });
      return;
    }

    await this.git.add(files);
    const status = await this.git.status();
    if (status.staged.length === 0) {
      logger.info('no staged changes after add; skipping commit');
      return;
    }

    await this.git.addConfig('user.name', this.config.gitAuthorName);
    await this.git.addConfig('user.email', this.config.gitAuthorEmail);
    await withRetry(async () => this.git.commit(message), { retries: 2, delayMs: 1000 });
  }

  async push(): Promise<void> {
    if (this.config.dryRun || this.config.localMode) {
      logger.info('dry/local mode: skipping git push');
      return;
    }
    await withRetry(
      async () => this.git.push('origin', this.config.allowedBranch, ['--no-verify']),
      {
        retries: 2,
        delayMs: 2000
      }
    );
  }
}
