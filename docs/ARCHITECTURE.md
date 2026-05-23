# Architecture

The automation has four layers:

1. Configuration validation with `zod`
2. Task generation for deterministic, API-free maintenance content
3. Safety checks for secrets, output paths, throttling, and quiet hours
4. Git commit and push logic through `simple-git`

Tasks return a list of expected changed files and a human-readable commit message. The runner commits only those files plus the automation ledger. If content is unchanged, the run exits without a commit.

GitHub Actions provides scheduling, concurrency, dependency caching, and the repository-scoped `GITHUB_TOKEN`. The workflow is not triggered by pushes, which prevents recursive workflow loops.
