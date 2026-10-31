# 🚀 Space Quiz

A ten-question space exploration quiz that runs entirely from a single HTML file.
No build step, no server, no dependencies — open it and play.

Built during the [GitHub Copilot app first-steps workshop](https://github-samples.github.io/copilot-workshops/first-steps/copilot-app/),
issue by issue, through the full agent loop: prompt → build → test → publish →
issue → worktree → plan → pull request → review → merge.

## Play

Open [`index.html`](index.html) in any browser. That is the whole setup.

```bash
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

Or play the deployed copy on GitHub Pages: **https://hobairiku.github.io/space-quiz/**

## What it does

- **10 space-exploration questions** with four answers each.
- **Progress bar and live score counter**, both announced to screen readers.
- **Animated feedback** — a green `pop` for correct, a red `shake` for wrong —
  suppressed when the OS asks for reduced motion.
- **Results screen** with an emoji reaction that scales with your score.
- **Personal best** stored in `localStorage` and called out when you beat it.
- **Shuffled questions and answers** on every run, so you cannot memorise the order.

## Design constraints

These are deliberate and enforced by the project's agent instructions
([`AGENTS.md`](AGENTS.md)) and the test suite:

| Constraint | Why |
| --- | --- |
| One `index.html` | Works over `file://`, nothing to install |
| Zero runtime dependencies | No CDN, no bundler, no supply chain |
| Accessible by default | Native `<button>`s, ARIA progress semantics, text (not just color) for every state |
| Light and dark themes | Via `prefers-color-scheme` |
| Motion is optional | Via `prefers-reduced-motion` |

## Tests

The quiz itself has no dependencies. The test harness is a separate npm project
under [`tests/`](tests/) that drives the real `index.html` in [jsdom](https://github.com/jsdom/jsdom)
and asserts on rendered DOM, not internals.

```bash
cd tests
npm ci
node smoke.js    # core behavior: progress, scoring, feedback, results, a11y
node best.js     # personal-best persistence, corrupt and blocked storage
```

Expected output: **35/35** and **22/22** checks passing.

Both suites run on every push and pull request via [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

> Answer keys are matched by question and answer **text**, so the suites keep
> passing while the question and answer order is shuffled on every run.

## Project layout

```
space-quiz/
├── index.html            # the entire application
├── AGENTS.md             # instructions every agent session reads first
├── tests/
│   ├── smoke.js          # core behavior + accessibility
│   └── best.js           # localStorage persistence and failure modes
└── .github/workflows/
    └── ci.yml            # runs both suites on push and pull request
```

## Accessibility notes

- Every interactive control is a native `<button>`; there is no synthetic keyboard handling.
- The progress bar exposes `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.
- Feedback uses `role="status"` inside an `aria-live="polite"` region, so answers are announced.
- Correct and incorrect states are also stated in text ("Correct!" / "Not quite."), never color alone.
- `:focus-visible` outlines are preserved on every button.

## Contributing

1. Read [`AGENTS.md`](AGENTS.md) — it encodes the constraints above.
2. Run `cd tests && node smoke.js && node best.js` before and after your change.
3. Keep it a single file. If a feature needs a dependency, it does not belong here.

## License

No license file is included; the repository is public for workshop purposes.