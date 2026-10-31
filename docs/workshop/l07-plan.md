# Lesson 7 — Plan before coding

## Goal

Use plan mode on issue #1 so the design is reviewable *before* any code changes.

## Prompt / input

```
Plan the implementation of issue #1 (personal best on the results screen).
Do not write code yet — produce the plan, the risks, and the test strategy.
```

## Commands

```bash
git worktree add ../space-quiz-wt-best -b feat/personal-best origin/main
```

## Result

Plan written to `files/plan-issue-1-best-score.md` (session artifact). Summary:

| Element | Plan |
| --- | --- |
| Storage key | `spacequiz.best` in `localStorage` |
| Read path | `readBest(max)` — parse, validate `Number.isFinite`, clamp to `0..max`, fall back to `null` |
| Write path | `writeBest(n)` — only when strictly greater than the stored value |
| Failure mode | Every storage access wrapped in `try/catch`; `localStorage` can throw in private mode or when the quota is full |
| UI | `#best-counter` in the HUD, `#result-best` line on the results screen |
| Test strategy | Inject a **shared** `Storage` object via jsdom's `beforeParse` so a simulated reload sees the previous run's value |

Implementation followed the plan without deviation: `BEST_KEY`, `readBest`,
`writeBest`, `renderBest()`, plus the two DOM nodes.

New suite `tests/best.js` — **22 checks**:

- Fresh visitor shows no best.
- A score is persisted and survives a simulated reload (shared `Storage`).
- Corrupt values (`"not-a-number"`, `"-3"`, `"999"`, `""`) are ignored, not crashed on.
- A blocked/throwing `Storage` degrades gracefully — the quiz still completes.
- Beating the best updates it; tying or losing does not.

```bash
cd tests && node smoke.js && node best.js
# 35/35 checks passed
# 22/22 checks passed
```

README was written during this lesson (the workshop had left it out) covering
how to play, the feature list, the test commands and their expected counts, the
directory tree, and the accessibility contract. CI gained a `node best.js` step.

## Decisions & deviations

- **Plan mode produced a document, not a diff.** That is the value: the storage
  failure modes were enumerated before a line of code existed, which is why
  `readBest` validates and clamps instead of trusting `localStorage`.
- **Rebase conflict on the way in.** PR #4 (shuffle) merged first, so
  `feat/personal-best` conflicted in `index.html`. Resolution kept both features
  and unified the question-count source on `deck.length`; a stray duplicated
  `resultText` line introduced by the merge script was removed.
- After the squash merge, `main` had to be re-synced:
  `git fetch && git reset --hard origin/main`.