# Lesson 1 — Create the workspace

## Goal

Create a local project for the quiz. In the app this is *New session → Interactive
mode*, which produces an empty folder-backed workspace.

## Prompt / input

Equivalent of selecting **Interactive** mode and naming the session `space-quiz`.

## Commands

```bash
mkdir -p /Users/lubb/Desktop/github-dev-days/space-quiz
mkdir -p /Users/lubb/Desktop/github-dev-days/workshop-logs
```

## Result

```
space-quiz/         # the app under construction (not yet a git repo)
workshop-logs/      # this engineering record
```

## Decisions & deviations

- **Interactive, not Autopilot, is the manual's recommendation** for this step so
  the human stays in the loop while the app is still being shaped. In practice
  this session runs in Autopilot but mirrors Interactive behaviour by writing a
  full file per step rather than iterating blindly.
- The folder stays outside any existing repository so that Lesson 5 can run
  `git init` cleanly and `gh repo create --source=.` has an unambiguous root.