# Security

## Threat Model Summary

| Threat                            | Control                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------- |
| Hardcoded credentials             | `.env` ignored, no token config in source, GitHub Actions token only            |
| Secret leakage in generated files | Pre-write secret pattern checks and gitleaks config                             |
| Path traversal                    | Generated writes are restricted to `README.md`, `docs`, `data`, and `dashboard` |
| Empty or spam commits             | File content comparison and git status checks before commit                     |
| Commit flooding                   | Daily ledger, max commits per day, minimum interval, quiet hours                |
| Recursive workflows               | Automation workflow excludes push events                                        |
| Excess permissions                | Workflow uses only `contents: write`; CI uses `contents: read`                  |
| History manipulation              | No force-push code path and no history rewrite commands                         |
| Untrusted command execution       | No shell commands are built from user input                                     |

## Secrets

Do not add personal access tokens unless a future task truly requires one. The included workflow uses the built-in `GITHUB_TOKEN`, scoped by repository permissions.

## Operational Rules

- Keep generated content useful and reviewable.
- Do not add API calls that bypass rate limits.
- Do not interact with third-party users or repositories.
- Do not add browser automation for GitHub actions.
- Do not use fake timestamps or empty commits.
