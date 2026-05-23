# Installation Guide

## Prerequisites

- Node.js 20 or newer
- Git
- A GitHub repository where you control Actions settings

## Setup

```bash
npm install
cp .env.example .env
npm run lint
npm test
npm run build
```

## Configuration

Edit `.env` locally or repository variables in GitHub:

- `DDA_TIMEZONE`
- `DDA_MAX_COMMITS_PER_DAY`
- `DDA_MIN_MINUTES_BETWEEN_COMMITS`
- `DDA_QUIET_HOURS_START`
- `DDA_QUIET_HOURS_END`

Never commit `.env`.

## GitHub Actions

The scheduled workflow lives at `.github/workflows/automation.yml`. It runs eight times per day, waits up to four minutes, validates the project, and runs the automation.

The app may still skip committing when there is no meaningful change.
