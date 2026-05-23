# daily-dev-automation

`daily-dev-automation` is a security-first developer maintenance utility. It creates legitimate repository activity by updating useful documentation, local statistics, project ideas, resource notes, and a small activity dashboard only when the generated content actually changes.

This is not a contribution farming bot. It does not create empty commits, fake history, browser-driven GitHub actions, auto-stars, auto-follows, or spam.

## What It Updates

- Daily engineering notes in `docs/daily-notes.md`
- Developer statistics in `data/developer-stats.json`
- Engineering resource notes in `docs/resources.md`
- Project idea rotations in `docs/project-ideas.md`
- Activity dashboard in `dashboard/activity.md`
- Maintenance TODO tracking in `docs/todo.md`
- Changelog summaries in `docs/changelog-summary.md`
- Programming tips datasets in `data/programming-tips.json`
- A committed automation ledger in `data/automation-ledger.json`

## Safety Controls

- Uses `GITHUB_TOKEN` through GitHub Actions only
- Least-privilege workflow permissions: `contents: write` for automation, `contents: read` for CI
- No hardcoded tokens or shell execution from user input
- Path traversal protection for every generated file
- Secret-pattern detection before writes
- Meaningful-change detection before commits
- Daily commit limit and minimum interval throttling
- Quiet hours and timezone support
- Dry-run and local testing modes
- Concurrency controls and no push-triggered automation workflow
- No force pushes and no history rewriting

## Install

```bash
npm install
cp .env.example .env
npm run build
npm test
```

## Local Usage

Dry run:

```bash
npm run dry-run
```

Local mode with file writes but no push:

```bash
DDA_LOCAL_MODE=true npm run dev
```

Production mode is intended for GitHub Actions. Keep `DDA_LOCAL_MODE=false` only inside the scheduled workflow.

## Deployment

1. Create a GitHub repository named `daily-dev-automation`.
2. Push this project to the `main` branch.
3. In repository settings, keep Actions enabled and allow the default `GITHUB_TOKEN` to write contents.
4. Optionally add repository variables:
   - `DDA_TIMEZONE`
   - `DDA_MAX_COMMITS_PER_DAY`
   - `DDA_MIN_MINUTES_BETWEEN_COMMITS`
   - `DDA_QUIET_HOURS_START`
   - `DDA_QUIET_HOURS_END`
5. Run the `CI` workflow.
6. Manually trigger `Daily Developer Automation` once to confirm behavior.

The workflow has eight scheduled runs per day with a small random delay. Each run still skips commits when quiet hours, daily limits, interval limits, or unchanged content apply.

## Example Output

```json
{"level":"info","message":"automation run started","time":"2026-05-22T14:00:00.000Z","dryRun":false,"localMode":false,"timezone":"America/Indianapolis"}
{"level":"info","message":"task completed","time":"2026-05-22T14:00:01.000Z","task":"developer-statistics","changed":true}
{"level":"info","message":"automation run completed","time":"2026-05-22T14:00:03.000Z","committed":true,"files":1}
```

Example commit messages:

- `docs: update daily learning notes`
- `chore: refresh engineering resources`
- `data: update developer statistics`

## Maintenance

Review generated files periodically. If a task stops producing useful information, remove it or replace it with a real maintenance task. Keep commit limits conservative and avoid adding tasks that exist only to increase contribution counts.
