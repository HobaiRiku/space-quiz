# Space Quiz — Agent Instructions

## Project shape
- One deliverable: `index.html`. HTML, CSS and JavaScript live in that single file.
- No build step, no bundler, no server, no runtime or dev dependencies. It must work over `file://`.
- Keep it that way. Do not split into `styles.css` / `app.js` or add frameworks, CDNs, or npm packages.

## Code conventions
- Plain ES2020 in a single `<script>` at the end of `<body>`; no modules, no transpiling.
- CSS custom properties in `:root` for every color. Never hardcode a hex value inside a rule.
- 2-space indentation. Semicolons. `const`/`let` only.
- Comments only where intent is not obvious from the code. Do not narrate obvious lines.

## Accessibility is a hard requirement
- All interactive controls are native `<button>` elements.
- Every state change must be conveyed by text, not color alone (the feedback line says "Correct"/"Not quite").
- Keep `role="progressbar"` + `aria-valuenow/min/max` on the progress bar, `role="status"` on feedback, `aria-live="polite"` on `<main>`.
- Visible `:focus-visible` outlines must remain.
- Respect `prefers-color-scheme` (light and dark) and `prefers-reduced-motion` (disable shake/pop/blink).

## Design
- Narrow centered column, max-width 420px.
- Polished, sans-serif, 14–16px body text.
- Mission-control flavor for headings is fine, but never at the cost of contrast or legibility.

## Testing
- Run `cd tests && node smoke.js` before claiming a change works. It must report all checks passing.
- Do not add a dependency to `space-quiz/` to make a test pass.
- `tests/` is a separate npm project holding only the jsdom harness; the quiz itself stays dependency-free.