# Lesson 6 — Create issues and work in an isolated session

## Goal

Turn a wish list into a focused backlog, then implement one issue in an isolated
worktree so `main` stays clean.

## Prompt / input

Backlog triage prompt:

> Read the quiz and propose three small, independently shippable issues.

## Commands

```bash
gh issue create --title "Show a personal best on the results screen" ...
gh issue create --title "Shuffle questions and answers each run" ...
gh issue create --title "Add a difficulty selector that filters the question pool" ...

gh worktree add ../space-quiz-wt-shuffle -b feat/shuffle-questions origin/main
```

## Result

| Issue | Title | Outcome |
| --- | --- | --- |
| [#1](https://github.com/HobaiRiku/space-quiz/issues/1) | Shuffle questions and answers each run | closed — shipped in PR #4 |
| [#2](https://github.com/HobaiRiku/space-quiz/issues/2) | Persist personal best score across visits | closed — shipped in PR #5 |
| [#3](https://github.com/HobaiRiku/space-quiz/issues/3) | Difficulty selector that filters the question pool | **open** (out of scope for the workshop) |

Issue #1 (shuffle) was implemented first, in `../space-quiz-wt-shuffle`:

- `randomInt(max)` using `crypto.getRandomValues` with rejection sampling,
  falling back to `Math.random`.
- `shuffle(arr)` — Fisher–Yates on a copy.
- `buildDeck()` — shuffles question order and each question's answers.
- Every `QUESTIONS[idx]` / `QUESTIONS.length` reference replaced by `deck[idx]` /
  `deck.length`, so restart rebuilds a fresh deck.

Four new smoke checks: twelve restarts yield more than one ordering, and the
answer set is always complete.

```bash
cd tests && node smoke.js   # 35/35
```

## Decisions & deviations

- **The worktree is the point of this lesson**, not the feature. Working in
  `../space-quiz-wt-shuffle` meant `main` never carried a half-finished shuffle,
  and the PR diff was reviewable in one screen.
- Two of the new tests were themselves buggy — they asserted on a *shared* array
  that the test mutated between iterations. Fixed by snapshotting per iteration.
  Both bugs were caught by the suite failing, which is the suite doing its job.
## A bug in the linking, recorded

While reconciling the log against the live repo, the issue numbers turned out to
be the reverse of the working assumption: **#1 is shuffle, #2 is personal best**.

```
gh issue view 1 --json title  ->  "Shuffle questions and answers each run"
gh issue view 2 --json title  ->  "Persist personal best score across visits"
```

And the pull request bodies cross-reference the wrong numbers:

```
PR #4 (shuffle)        body says: Closes #2   <- #2 is personal best
PR #5 (personal best)  body says: Closes #1   <- #1 is shuffle
```

Both issues did close, so nothing was lost — each PR closed the *other* one. But
the audit trail is wrong: reading the repo, it looks like PR #4 shipped the
personal best. The fix is a one-line correction in each PR body; the record here
is the authoritative mapping:

| Shipped | In | Closing reference |
| --- | --- | --- |
| Shuffle questions and answers | PR #4 | should be `Closes #1` |
| Personal best across visits | PR #5 | should be `Closes #2` |

Lesson: `Closes #n` is a **claim about the code**, and it is worth verifying that
the number matches the issue you actually read, not the one you remember.
