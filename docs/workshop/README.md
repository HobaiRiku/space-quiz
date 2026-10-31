# Copilot App Workshop — Engineering Log

Structured record of the [GitHub Copilot app first-steps workshop](https://github-samples.github.io/copilot-workshops/first-steps/copilot-app/),
executed end to end on 2026-10-31 during GitHub Dev Days.

Everything is recorded per lesson with the same five headings so the log can be
diffed, grepped, and audited:

| Heading | What it holds |
| --- | --- |
| **Goal** | The lesson's stated outcome |
| **Prompt / input** | The literal prompt used, or the CLI equivalent when the app UI is unavailable |
| **Commands** | Reproducible shell commands |
| **Result** | What actually happened, with observable evidence |
| **Decisions & deviations** | Trade-offs, failures, and why I chose the fallback |

| Lesson | Topic | Status | Artifact |
| --- | --- | --- | --- |
| [0](./l00-prerequisites.md) | Prerequisites | ✅ | tool versions, `gh auth status` |
| [1](./l01-workspace.md) | Create the workspace | ✅ | `space-quiz/` scaffold |
| [2](./l02-build.md) | Build and polish | ✅ | `index.html` |
| [3](./l03-test.md) | Inspect and test | ✅ | `tests/smoke.js` (35 checks) |
| [4](./l04-instructions.md) | Project instructions | ✅ | `AGENTS.md` |
| [5](./l05-publish.md) | Publish | ✅ | github.com/HobaiRiku/space-quiz |
| [6](./l06-issues.md) | Issues and sessions | ✅ | issues #1–#3, PR #4 |
| [7](./l07-plan.md) | Plan mode | ✅ | `plan-issue-1-best-score.md`, `tests/best.js` |
| [8](./l08-review.md) | Review loop | ✅ | PR #4 merged, self-review finding |
| [9](./l09-automations.md) | Automations | ✅ (drafted) | weekly *Issue triage* |
| [10](./l10-remote.md) | Remote session | ⚠️ N/A | documented substitute |
| [11](./l11-canvas.md) | Canvas | ⚠️ substitute | issue-grounded session via CLI |
| [12](./l12-pages.md) | Deploy with Pages | ✅ | https://hobairiku.github.io/space-quiz/ |
| [13](./l13-review.md) | Review and next steps | ✅ | this log |

## Why an engineering log

The workshop asks for working software, not a screenshot. Each lesson therefore
leaves a **reproducible artifact** — a test, a workflow, a document, a merged PR —
and this directory explains how to regenerate it. Every claim in the *Result*
sections is backed by a command whose output is quoted verbatim.

## Repository under construction

| Item | Value |
| --- | --- |
| Repo | https://github.com/HobaiRiku/space-quiz |
| Live site | https://hobairiku.github.io/space-quiz/ |
| Default branch | `main` |
| Merged PRs | #4 shuffle, #5 personal best + README, #6 Pages deploy, #7 docs fix |
| Open issues | #3 difficulty selector |
| Test suites | `tests/smoke.js` 35/35, `tests/best.js` 22/22 |
| CI | `.github/workflows/ci.yml` on every push and PR |