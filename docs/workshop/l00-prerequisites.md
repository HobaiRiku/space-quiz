# Lesson 0 — Prerequisites

## Goal

Confirm the toolchain the workshop assumes: the Copilot app, a GitHub account
with Copilot access, `git`, and the `gh` CLI authenticated.

## Prompt / input

No agent prompt — this lesson is environment verification.

## Commands

```bash
gh --version
gh auth status
git --version
node --version && npm --version
```

## Result

```
gh version 2.102.1
git version 2.56.0
node v22.22.0
npm 10.9.4
```

`gh auth status` reported an active session for **HobaiRiku** (id `26238803`)
with the `repo`, `workflow`, and `read:org` scopes — enough for repository
creation, workflow runs, Pages, and pull request merges.

## Decisions & deviations

- **The Copilot app UI is not drivable in this environment.** The session is a
  folder-backed CLI session: the browser canvas and the Automations view are
  described by the manual but are not reachable as UI surfaces here. Every
  lesson that says "click X" is therefore executed through the **equivalent CLI
  or API call**, and the deviation is called out in that lesson's log.
- Because the working directory is not a git repository root, all commits set
  the author explicitly with `-c user.name` / `-c user.email` instead of relying
  on global config.