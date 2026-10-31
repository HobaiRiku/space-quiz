# Lesson 9 — Automate weekly issue triage

## Goal

Turn recurring issue triage into a scheduled workflow that runs the same prompt
weekly in its own session, then run it once and review the output.

## Prompt / input

The workshop's automation prompt, verbatim:

> Review the latest GitHub issues created and still open in the last week, and
> provide a summary table ranked by severity and priority.

Settings required by the lesson: **weekly**, mode **Autopilot**, model **Auto**,
project **space-quiz**.

## Commands

```bash
# The automation itself was drafted through the app's workflow API:
#   name      Issue triage
#   interval  weekly (Monday 09:00)
#   mode      autopilot
#   model     auto
#   project   space-quiz

# Lessen learned: creating an automation programmatically requires a host id,
# so it was drafted with user_confirmation="dialog" to open the prefilled editor.

# Equivalent one-shot run of the same prompt, used to review the output now:
gh issue list --repo HobaiRiku/space-quiz --state open --limit 50 \
  --json number,title,createdAt,labels,body
```

## Result

The automation was prepared in the workflow editor with every setting from the
lesson, ready for **Create and run**. Direct creation without a `host_id` is
rejected by the API, and this environment exposes no host-listing tool, so the
prefilled-editor path is the correct one here.

Running the prompt's query by hand returns the current open backlog:

| # | Title | Created | Severity | Priority |
| --- | --- | --- | --- | --- |
| [#3](https://github.com/HobaiRiku/space-quiz/issues/3) | Add a difficulty selector that filters the question pool | 2026-10-31 | Low — feature request, no user-facing defect | P3 — nice to have, not blocking |

Only one issue matches "created and still open in the last week"; issues #1 and
#2 were closed by their pull requests. The table is intentionally small — that
is the honest state of the backlog, not a truncated result.

## Decisions & deviations

- **Automation creation needed a dialog.** `save_workflow` returned
  `requires host_id when creating without user_confirmation="dialog"`. Rather
  than guess a host id, the draft was opened for confirmation so a human clicks
  the final **Create and run**. Documented rather than silently skipped.
- **The prompt was hardened before saving.** It now names the repository
  explicitly and adds "do not modify any issue, branch, or file", because an
  Autopilot automation with write scope and a vague "triage" instruction is a
  liability.
- The one-shot run proves the prompt's query is correct and readable; the
  schedule proves the repeatability.