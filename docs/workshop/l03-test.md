# Lesson 3 — Inspect the session and test

## Goal

Open the session details, inspect the browser-level behaviour, and run a smoke
test that proves the quiz actually works rather than merely rendering.

## Prompt / input

> Add a browser smoke test for the quiz. Cover progress, scoring, correct and
> wrong feedback, the results screen, and restart. Also assert the accessibility
> contract: a live status region, button-based answers, and reduced-motion support.

## Commands

```bash
cd space-quiz/tests
npm install jsdom
node smoke.js
```

## Result

```
35/35 checks passed
```

The suite loads `index.html` with `JSDOM`, dispatches real `click` events, and
reads back `textContent` / `className` / `getAttribute`. Coverage groups:

- **Core flow** — start state, progress advance, score increment, feedback copy
  and class, Next → results transition, restart reset.
- **Scoring** — a deliberate wrong answer (question 2) yields 9/10, not 10/10.
- **Shuffle (added with issue #1)** — twelve consecutive restarts produce more
  than one ordering, and the answer set is always complete.
- **Accessibility** — `role="status"` on feedback, answers are `<button>`s,
  `prefers-reduced-motion` is honoured in the stylesheet.

## Decisions & deviations

- **First run failed, and the test was wrong, not the app.** The assertion read
  "Results score totals 10/10" while the script had deliberately answered one
  question incorrectly. Fixed the expectation to 9/10 — a reminder that a red
  test is a claim to verify, not a bug to paper over.
- **The app must be served from an origin for `localStorage`.** jsdom throws on
  `localStorage` access under `about:blank`; the harness sets
  `url: "https://space-quiz.test/"`.
- The manual says "run the smoke test in the browser". jsdom executes the same
  DOM APIs but does not do layout or paint, so anything purely visual (the shake
  animation actually looking right) is **not** covered. Stated plainly rather
  than overclaimed.