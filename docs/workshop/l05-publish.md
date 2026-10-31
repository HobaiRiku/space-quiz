# Lesson 5 — Publish to GitHub

## Goal

Turn the local folder into a public GitHub repository with the quiz on `main`.

## Prompt / input

> Publish this project as a public GitHub repository named `space-quiz`.

## Commands

```bash
cd space-quiz
git init -b main
git add -A
git -c user.name="HobaiRiku" -c user.email="26238803+HobaiRiku@users.noreply.github.com" \
  commit -m "Add the space quiz"
gh repo create space-quiz --public --source=. --remote=origin --push
```

## Result

```
https://github.com/HobaiRiku/space-quiz
default branch: main
visibility: PUBLIC
```

Then the test harness was moved *into* the repository so CI could run it:

```bash
mv ../tests ./tests
printf '.DS_Store\nnode_modules/\n' > .gitignore
```

`.github/workflows/ci.yml` runs on every push and pull request:

```yaml
- run: npm ci
  working-directory: tests
- run: node smoke.js
  working-directory: tests
```

## Decisions & deviations

- **Moving the tests broke them, and CI caught it.** `smoke.js` still pointed at
  `path.join(__dirname, "..", "space-quiz", "index.html")` from the old location.
  Corrected to `path.join(__dirname, "..", "index.html")`. Recording this because
  it is exactly the kind of path bug that a green local run can hide.
- The job is named **"Browser smoke test"** so the required status check reads
  sensibly in the PR list even though it runs jsdom.