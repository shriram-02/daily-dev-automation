# Maintenance

## Adding a Task

1. Add a task in `src/tasks/content.ts`.
2. Keep outputs inside an allowed path.
3. Return a specific commit message.
4. Add tests if the task changes security or throttling behavior.
5. Confirm dry-run behavior before enabling schedules.

## Reviewing Activity

Check `dashboard/activity.md` and `data/automation-ledger.json`. These files show what the automation is doing and whether limits are active.

## Decommissioning

Disable `.github/workflows/automation.yml` or set `DDA_MAX_COMMITS_PER_DAY` to `1` while investigating suspicious output.
