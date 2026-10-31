# Lesson 2 — Build and polish the quiz

## Goal

Produce a playable ten-question space quiz in a single HTML file, with a
progress bar, scoring, per-answer feedback, and a results screen.

## Prompt / input

The workshop's build prompt, roughly:

> Build a space quiz as a single `index.html`. Ten multiple-choice questions with
> four answers each, a progress bar, a running score, immediate green/red feedback,
> and a results screen with a restart button. No dependencies, no build step.

## Commands

```bash
# verification substitute for the in-app browser preview
npm install --prefix tests jsdom
```

## Result

`space-quiz/index.html` — one file, ~490 lines, no external requests. What it contains:

| Area | Implementation |
| --- | --- |
| Markup | `#question-text`, `.answers`, `#feedback` (`role="status"`), `#next-btn`, `#results`, `#result-emoji`, `#result-title`, `#result-text`, `#result-best`, `#restart-btn` |
| Theming | CSS custom properties, light/dark via `prefers-color-scheme` |
| Motion | `pop` on correct, `shake` on wrong, both disabled under `prefers-reduced-motion` |
| A11y | status region for feedback, `<button>` answers, focus moved to Next, `aria-*` on the progress bar |
| State | `state = { deck, idx, score }` with `render()`, `pick()`, `showResults()` |

## Decisions & deviations

- **No live browser preview.** `open_canvas` for the `browser` canvas failed
  consistently (`input is not of type object`) regardless of payload shape, so
  the "watch it in the browser" step was replaced by a real DOM harness (Lesson 3)
  that loads `index.html` in jsdom and asserts on actual rendered output. This is
  weaker than a human looking at the page but stronger than trusting the model.
- **Answers are addressed by text, not index.** The render/pick functions key off
  question text and answer text so that a later shuffle feature (issue #1) does
  not invalidate every test assertion.