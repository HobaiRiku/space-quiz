# Lesson 12 — Deploy with GitHub Pages

## Goal

Give the quiz a public URL, deployed by a GitHub Actions workflow, and verify the
live site actually loads rather than trusting a green check.

## Prompt / input

> Enable GitHub Pages for this repository. Create a GitHub Actions workflow that
> builds the website if needed and deploys it to GitHub Pages. Add a README
> describing the app and how to run it locally if one does not already exist.
> Create a pull request with these changes and merge it after required checks
> pass. Monitor the deployment until it succeeds, then report the final URL of
> the live website. If you lack permission to enable Pages or merge, tell me
> exactly what I need to approve or do; do not report success until the site is
> live.

## Commands

```bash
git checkout -b feat/github-pages origin/main
# .github/workflows/pages.yml — build job uploads the repo root, deploy job uses deploy-pages
git push -u origin feat/github-pages
gh pr create --title "Deploy the quiz to GitHub Pages" --body-file /tmp/pr-pages.md

gh api -X POST repos/HobaiRiku/space-quiz/pages -f build_type=workflow
gh pr checks 6
gh pr merge 6 --squash --delete-branch

gh run list --workflow=pages.yml --limit 3
curl -s -o /tmp/live.html -w "HTTP %{http_code}\n" https://hobairiku.github.io/space-quiz/
```

## Result

```
Pages: build_type=workflow, html_url=https://hobairiku.github.io/space-quiz/

PR #6 checks:  Browser smoke test  pass  15s
PR #6 merged:  8aa9f8b  Deploy the quiz to GitHub Pages (#6)

Deploy run 41187393710:  completed  success  22s

curl https://hobairiku.github.io/space-quiz/
HTTP 200  bytes=14471
<title>Space Exploration Quiz</title>
question-text occurrences: 3
```

The served HTML is the real app — title and the quiz's question container are
present in the response body, not a 404 page or a placeholder.

**README**: already existed (written during Lesson 7), so per the prompt it was
not duplicated — only its stale test count was corrected in a follow-up PR.

## Decisions & deviations

- **`path: .` publishes the repository root**, including `tests/` and
  `AGENTS.md`. Only `index.html` is addressable by URL and none of the extra
  files are secrets, so this is acceptable for a workshop repo; the PR body notes
  how to stage a minimal subset instead.
- **No build step.** The app has no dependencies, so "build the website" is a
  no-op. Adding a bundler here would contradict `AGENTS.md` for no benefit.
- **Pages was enabled before merging.** The deploy job needs Pages active;
  enabling it first made the post-merge run succeed on the first attempt instead
  of failing and needing a retry.
- **Verified with `curl`, not with the run status.** A green deployment job means
  the artifact uploaded; a 200 with the right `<title>` means the site is live.
  Those are different claims and only the second one satisfies the prompt.