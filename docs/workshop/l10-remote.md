# Lesson 10 — Continue a session remotely (optional)

## Goal

Keep a session running locally while making it reachable from the web and the
GitHub Copilot mobile app via `/remote`.

## Prompt / input

```
/remote
```

## Result

**Not executable in this environment.** `/remote` is an app-level command that
registers the local session with the Copilot web/mobile front end. This session
runs headless from a CLI, so there is no app session to expose and no returned
link to open.

What the lesson is actually testing, and the closest honest substitute:

| Lesson intent | Substitute used here |
| --- | --- |
| Session keeps running locally | True — every command ran on this machine |
| Follow progress from another device | Cross-session messaging: a child session can be created and steered while this one continues |
| Review changes as a pull request | Fully satisfied — all work landed as PRs #4–#7 reviewed through `gh` |

## Decisions & deviations

- **Marked N/A rather than faked.** Recording a `/remote` invocation that never
  happened would poison the log.
- The property the lesson cares about — *the work is observable and reviewable
  from outside the session* — is covered here by the pull request workflow, which
  is a stronger guarantee than a live view: every change is a reviewable diff with
  a CI result, not a scrolling transcript.
- The lesson is explicitly optional ("worth saving until the local loop feels
  natural"), so skipping it costs nothing.