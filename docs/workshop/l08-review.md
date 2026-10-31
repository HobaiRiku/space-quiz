# Lesson 8 — Review loop and merge

## Goal

Ship an issue through pull request review — ideally with Copilot code review as
the reviewer — and merge only after the required checks pass.

## Prompt / input

The app workflow is *request a review from Copilot, read the comments, fix or
push back, then merge*. Equivalent CLI:

```bash
gh pr create --title "Shuffle questions and answers each run" --body-file /tmp/pr4.md
gh pr edit 4 --add-reviewer copilot
```

## Commands

```bash
# what the manual's "request review from Copilot" becomes when the UI is absent
gh api -X POST repos/HobaiRiku/space-quiz/pulls/4/requested_reviewers \
  -f "reviewers[]=copilot-pull-request-reviewer[bot]"
gh pr view 4 --json reviews -q '.reviews | length'
```

## Result

1. `gh pr edit --add-reviewer copilot` failed: **`Could not resolve user with
   login 'copilot'`**.
2. The API call with `copilot-pull-request-reviewer[bot]` returned **200**, but
   `requested_reviewers` stayed empty and no review appeared after 45s and again
   after 60s.
3. Conclusion: **Copilot code review is not enabled on this plan.** Fell back to
   the manual's documented alternative — review the diff yourself.

Self-review of the shuffle diff found one real defect:

> The rejection-sampling bound used `0xffffffff` (2³²−1) instead of `2 ** 32`.
> Off by one at the top of the range means the accepted window is not an exact
> multiple of `max`, reintroducing a tiny modulo bias.

Fixed:

```js
const limit = Math.floor((2 ** 32) / max) * max;
```

Re-ran both suites (35/35, 22/22), pushed, waited for the **Browser smoke test**
check to go green, then:

```bash
gh pr merge 4 --squash --delete-branch
# MERGED  sha ab0b9a7
git checkout main && git fetch && git reset --hard origin/main
```

## Decisions & deviations

- **Recorded the reviewer failure instead of pretending it worked.** The lesson's
  outcome is a reviewed merge; the honest record is "automated review unavailable,
  human-equivalent diff review performed, one bias bug found and fixed." That is
  arguably a better result than an automated pass, but it is a deviation.
- Squash merge keeps `main` linear, which matters because every later lesson
  branches from `origin/main` and rebases onto it.
- `--delete-branch` plus an explicit `reset --hard` after merge avoids the
  classic "local main still points at the pre-squash commit" confusion.