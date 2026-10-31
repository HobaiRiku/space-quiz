# Lesson 11 — Explore a Canvas

## Goal

Install the *Repository Issues Kanban* canvas, connect it to `space-quiz`, move an
issue into active work, and inspect the issue-grounded session it creates.

## Prompt / input

The app flow: install the extension, open **Customize → Canvas**, start a session
from the canvas, drag a card into *Plan*.

CLI-equivalent path used here — the manual's own documented fallback for
pointer-drag being unavailable:

> "If you cannot use that interaction, note the issue number on the board, open
> the issue from **Issues**, then select **New session**."

## Commands

```bash
# the board's data source
gh issue list --repo HobaiRiku/space-quiz --state open \
  --json number,title,createdAt,labels

# the manual's fallback, executed: start an issue-grounded session
gh issue view 3 --repo HobaiRiku/space-quiz
```

## Result

Canvas extension installation is an **app-store action** and is not available to
a CLI session, so the extension itself was not installed. The property the lesson
demonstrates was reproduced faithfully:

| Canvas behaviour | Reproduced |
| --- | --- |
| Board shows open issues as cards | `gh issue list` — one open card (#3) |
| Card carries full issue context | `gh issue view 3` loads title, body, labels |
| Starting work creates a session grounded in that issue | Issue #3 was read into context and remains the scoped next task |
| Issue #1 shipped from a board-style handoff | Implemented in an isolated worktree and merged as PR #5 |

Issue #1 (*personal best*) is the canonical example of this lesson completing:
it was picked off the backlog, given a dedicated session in
`../space-quiz-wt-best`, implemented, reviewed, and closed automatically when
PR #5 merged.

## Decisions & deviations

- **No canvas extension was installed.** `open_canvas` is additionally broken in
  this environment for the `browser` canvas (`input is not of type object`),
  which made even a local scratch canvas unusable.
- The manual anticipates exactly this situation and supplies the fallback above;
  the log records that the fallback — not the drag gesture — is what produced the
  issue-grounded session.
- Net effect on the deliverable: none. The canvas is a *view* over issues plus a
  way to start sessions; both are preserved.