# Lesson 4 — Capture project instructions

## Goal

Record the rules an agent must follow in this repository so future sessions do
not have to rediscover them. In the app this is `/init`.

## Prompt / input

```
/init
```

## Commands

```bash
# equivalent of /init: inspect the repo, then write the rules file
cat space-quiz/AGENTS.md
```

## Result

`space-quiz/AGENTS.md` encodes five hard constraints:

| Rule | Reason |
| --- | --- |
| One file, `index.html` | The workshop's premise: no build step |
| Zero runtime dependencies | Opens from `file://` with no network |
| Accessibility is not optional | Status region, real buttons, reduced motion |
| `cd tests && node smoke.js` must pass before any commit | Cheap regression net |
| Shuffle/best-score features may not break the text-based test keys | Keeps assertions stable |

The file also documents the project layout and the commit-message convention.

## Decisions & deviations

- The workshop expects `/init` to *generate* the file from the repository. Here
  the rules were written directly, because the repository was two files old and
  a generated summary would have restated the HTML rather than capturing intent.
- `AGENTS.md` is the agent-facing file; human-facing prose lives in `README.md`
  (added in Lesson 7). Splitting them keeps the rules terse and the docs readable.