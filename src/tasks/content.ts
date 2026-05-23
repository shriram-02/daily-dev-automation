import fs from 'node:fs/promises';
import path from 'node:path';
import type { AppConfig } from '../config/schema.js';
import { assertNoSecrets } from '../security/secretGuard.js';
import { writeFileIfChanged } from '../security/safePaths.js';
import { getLocalDateKey } from '../utils/time.js';
import type { AutomationTask, AutomationTaskResult } from './types.js';

const tips = [
  'Prefer small pull requests that reviewers can reason about in one sitting.',
  'Write failing tests for bug fixes before changing production code.',
  'Document operational assumptions near the code that depends on them.',
  'Keep dependency updates boring: small batches, changelog review, and test runs.',
  'Make logs structured enough to answer who, what, when, and why quickly.',
  'Treat configuration validation as part of the application boundary.',
  'Use least-privilege tokens and rotate credentials on a predictable schedule.',
  'Skip automation work when there is no real content change.'
];

const ideas = [
  'Build a CLI that summarizes TODO comments by owner and due date.',
  'Create a dashboard for flaky test frequency by test file.',
  'Write a small utility that validates repository security settings.',
  'Prototype an offline-first learning log with markdown export.',
  'Generate dependency-risk reports from lockfile metadata.',
  'Build a personal incident-review template generator.',
  'Create a changelog classifier that groups changes by user impact.',
  'Track local coding sessions from editor-exported activity files.'
];

function dayIndex(dateKey: string, length: number): number {
  const digits = dateKey.replaceAll('-', '');
  return Number(digits) % length;
}

async function readOptionalText(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return '';
  }
}

async function collectLocalCodingMinutes(root: string): Promise<number> {
  const source = path.join(root, 'data', 'coding-time.json');
  try {
    const raw = await fs.readFile(source, 'utf8');
    const parsed = JSON.parse(raw) as { sessions?: Array<{ minutes?: number }> };
    return (parsed.sessions ?? []).reduce(
      (total, session) => total + Math.max(0, session.minutes ?? 0),
      0
    );
  } catch {
    return 0;
  }
}

export function createTasks(config: AppConfig, now = new Date()): AutomationTask[] {
  const dateKey = getLocalDateKey(now, config.timezone);
  const tip = tips[dayIndex(dateKey, tips.length)];
  const idea = ideas[dayIndex(dateKey, ideas.length)];

  return [
    {
      name: 'daily-learning-notes',
      async run(): Promise<AutomationTaskResult> {
        const content = `# Daily Engineering Notes

Date: ${dateKey}
Timezone: ${config.timezone}

## Learning Focus

- ${tip}
- Review one recent change and confirm the README or docs still match the behavior.
- Capture one follow-up task only if it is actionable.

## Notes

This file is generated from static, API-free engineering guidance. It is committed only
when content differs from the previous version.
`;
        assertNoSecrets(content, 'docs/daily-notes.md');
        const changed = await writeFileIfChanged(
          config.workspaceRoot,
          'docs/daily-notes.md',
          content
        );
        return {
          name: 'daily-learning-notes',
          changed,
          files: ['docs/daily-notes.md'],
          commitMessage: 'docs: update daily learning notes'
        };
      }
    },
    {
      name: 'developer-statistics',
      async run(): Promise<AutomationTaskResult> {
        const minutes = await collectLocalCodingMinutes(config.workspaceRoot);
        const data = {
          date: dateKey,
          timezone: config.timezone,
          localCodingMinutes: minutes,
          activeAutomationTasks: 8,
          policy: {
            emptyCommits: false,
            forcePushes: false,
            apiAbuse: false,
            browserAutomationForGitHub: false
          }
        };
        const content = `${JSON.stringify(data, null, 2)}\n`;
        assertNoSecrets(content, 'data/developer-stats.json');
        const changed = await writeFileIfChanged(
          config.workspaceRoot,
          'data/developer-stats.json',
          content
        );
        return {
          name: 'developer-statistics',
          changed,
          files: ['data/developer-stats.json'],
          commitMessage: 'data: update developer statistics'
        };
      }
    },
    {
      name: 'engineering-resources',
      async run(): Promise<AutomationTaskResult> {
        const content = `# Engineering Resource Archive

Last refreshed: ${dateKey}

## Useful Practices

- Threat model automation before granting write credentials.
- Prefer generated documentation changes over empty commits.
- Run dry mode locally before enabling scheduled repository writes.
- Keep generated datasets deterministic and reviewable.

## Daily Tip

${tip}
`;
        assertNoSecrets(content, 'docs/resources.md');
        const changed = await writeFileIfChanged(
          config.workspaceRoot,
          'docs/resources.md',
          content
        );
        return {
          name: 'engineering-resources',
          changed,
          files: ['docs/resources.md'],
          commitMessage: 'chore: refresh engineering resources'
        };
      }
    },
    {
      name: 'project-ideas',
      async run(): Promise<AutomationTaskResult> {
        const content = `# Project Ideas

Current rotation date: ${dateKey}

## Featured Idea

${idea}

## Backlog

${ideas.map((item) => `- ${item}`).join('\n')}
`;
        assertNoSecrets(content, 'docs/project-ideas.md');
        const changed = await writeFileIfChanged(
          config.workspaceRoot,
          'docs/project-ideas.md',
          content
        );
        return {
          name: 'project-ideas',
          changed,
          files: ['docs/project-ideas.md'],
          commitMessage: 'docs: rotate project ideas'
        };
      }
    },
    {
      name: 'activity-dashboard',
      async run(): Promise<AutomationTaskResult> {
        const stats = await readOptionalText(
          path.join(config.workspaceRoot, 'data', 'developer-stats.json')
        );
        const content = `# Activity Analytics Dashboard

Updated: ${dateKey}

## Current Snapshot

\`\`\`json
${stats.trim() || '{ "status": "pending first statistics run" }'}
\`\`\`

## Automation Health

- Meaningful-change detection: enabled
- Commit throttling: enabled
- Quiet hours: ${config.quietHoursStart}-${config.quietHoursEnd} ${config.timezone}
- Daily commit limit: ${config.maxCommitsPerDay}
- Dry run mode: ${config.dryRun}
`;
        assertNoSecrets(content, 'dashboard/activity.md');
        const changed = await writeFileIfChanged(
          config.workspaceRoot,
          'dashboard/activity.md',
          content
        );
        return {
          name: 'activity-dashboard',
          changed,
          files: ['dashboard/activity.md'],
          commitMessage: 'docs: update activity dashboard'
        };
      }
    },
    {
      name: 'todo-tracking',
      async run(): Promise<AutomationTaskResult> {
        const content = `# Maintenance TODO

Updated: ${dateKey}

## Today

- [ ] Review generated notes for accuracy.
- [ ] Confirm automation limits still match repository goals.
- [ ] Remove any generated item that is no longer useful.

## Standing Rules

- Do not create empty commits.
- Do not use automation to interact with third-party accounts.
- Do not expand repository permissions without documenting why.
`;
        assertNoSecrets(content, 'docs/todo.md');
        const changed = await writeFileIfChanged(config.workspaceRoot, 'docs/todo.md', content);
        return {
          name: 'todo-tracking',
          changed,
          files: ['docs/todo.md'],
          commitMessage: 'docs: update maintenance todo'
        };
      }
    },
    {
      name: 'changelog-summary',
      async run(): Promise<AutomationTaskResult> {
        const content = `# Changelog Summary

Updated: ${dateKey}

## Automation Scope

- Generated documentation is deterministic and reviewable.
- Generated data is API-free unless a future task documents a safe integration.
- Commit frequency is limited by the committed automation ledger.

## Latest Maintenance Theme

${tip}
`;
        assertNoSecrets(content, 'docs/changelog-summary.md');
        const changed = await writeFileIfChanged(
          config.workspaceRoot,
          'docs/changelog-summary.md',
          content
        );
        return {
          name: 'changelog-summary',
          changed,
          files: ['docs/changelog-summary.md'],
          commitMessage: 'docs: generate changelog summary'
        };
      }
    },
    {
      name: 'programming-tips-dataset',
      async run(): Promise<AutomationTaskResult> {
        const content = `${JSON.stringify(
          {
            date: dateKey,
            source: 'static project-maintained list',
            tips: tips.map((item, index) => ({
              id: index + 1,
              text: item
            }))
          },
          null,
          2
        )}\n`;
        assertNoSecrets(content, 'data/programming-tips.json');
        const changed = await writeFileIfChanged(
          config.workspaceRoot,
          'data/programming-tips.json',
          content
        );
        return {
          name: 'programming-tips-dataset',
          changed,
          files: ['data/programming-tips.json'],
          commitMessage: 'data: update programming tips dataset'
        };
      }
    }
  ];
}
