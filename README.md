# ⚙️ Daily Dev Automation

> Security-first developer productivity automation built with TypeScript, Node.js, Git, and GitHub Actions.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/) [![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions) [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🎯 Overview

**Daily Dev Automation** is a TypeScript-based automation system designed to perform meaningful developer-maintenance tasks through **GitHub Actions** while applying safeguards against unnecessary commits, excessive activity, and security risks.

The application evaluates configuration, quiet hours, commit limits, repository safety, and actual file changes before creating and pushing a commit. fileciteturn11file0

## ✨ Key Features

- ⚙️ Scheduled and manual GitHub Actions automation
- 🔐 Security-focused repository and secret safeguards
- 🧠 Configurable maintenance task selection
- 🚦 Commit throttling and quiet-hour controls
- 🧾 Persistent automation ledger and execution state
- 🔍 Meaningful-change detection before commits
- 🧪 Automated linting, testing, and TypeScript builds
- 🐳 Docker support

## 🛠️ Tech Stack

**TypeScript · Node.js 20+ · GitHub Actions · simple-git · Zod · Vitest · ESLint · Prettier · Husky · Docker** fileciteturn10file0

## 🏗️ Architecture

```text
GitHub Actions
      ↓
Validation (Lint / Test / Build)
      ↓
Configuration & State
      ↓
Safety + Throttling Checks
      ↓
Task Selection & Execution
      ↓
Git Change Detection
      ↓
Commit & Push
```

The workflow runs validation before executing automation and uses repository-level configuration for timezone, commit limits, minimum intervals, and quiet hours. fileciteturn12file0

## 📂 Project Structure

```text
.github/workflows/   # CI and scheduled automation
src/config/          # Configuration and schemas
src/tasks/           # Automation task definitions
src/git/             # Git operations, state and throttling
src/security/        # Safe-path and secret protection
src/utils/           # Logging, retries and utilities
data/               # Automation state/ledger
docs/               # Architecture, installation and security docs
Dockerfile           # Container configuration
```

## 🚀 Run Locally

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run dry-run
npm test
npm run lint
npm run build
```

## 🔐 Security

The project includes controls for **secret leakage, path traversal, empty/spam commits, commit flooding, recursive workflows, excessive permissions, force-push/history manipulation, and untrusted command execution**. fileciteturn13file0

## 💼 Placement Value

Demonstrates practical experience with **TypeScript backend scripting, CI/CD, Git automation, automated testing, configuration management, security engineering, and developer productivity tooling**.

📖 **[Live Documentation](https://dda-five.vercel.app/)** · 📊 **[Detailed Project Report](https://drive.google.com/file/d/1A_7FNnvhso6z599ERiDhHAH-taXaNrPa/view?usp=drive_link)**

---

⭐ If you find the project useful, consider starring the repository.
