---
name: reflect
description: Review this session with three parallel reviewers, find durable lessons, and turn each into a proposed edit to a jstack skill. Use when the user says "reflect" or asks to capture what a session taught.
disable-model-invocation: true
---

# Reflect

Mine the current session for lessons that will still matter later, then route each to a skill edit.

Skip it when the session was trivial, off-topic, or fully covered by a skill that was followed correctly. One-offs aren't lessons.

## 1. Find this session's transcript

Transcripts live in `~/.claude/projects/<workspace>/`, where `<workspace>` is the project's absolute path with every character that isn't a letter or digit replaced by `-` (very long paths are shortened, so match the folder by prefix). Several sessions can share the folder, so open the newest few `.jsonl` files and pick the one whose first user message matches this session. Look only at this workspace's transcripts, never other projects', because those are unrelated private conversations. If you can't find the file, write a tight digest of the session instead.

## 2. Spawn three reviewers in parallel

Each reviewer reads the transcript and returns findings. None of them edits anything.

| Lens | Model | Brief |
|---|---|---|
| Judgment | `opus` at `medium` effort | `references/judgment-reviewer.md` |
| Tooling | `sonnet` at `high` effort | `references/tooling-reviewer.md` |
| Divergent | `opus` at `medium` effort | `references/divergent-reviewer.md` |

Pass each brief as written, with the transcript path or digest filled in.

## 3. Synthesize

Spawn one synthesizer on `opus` at `medium` effort with `references/synthesizer.md` and all three reviewers' output. It returns Accepted, Rejected and Backlog lists.

## 4. Prefer structure

Move any Accepted item that a lint, script, hook or check would enforce more reliably to Backlog, per Encode lessons in structure in `/jstack:principles`.

## 5. Apply only after approval

Show the full Accepted, Rejected and Backlog output, and wait for the user to approve rows. They may pick a subset or redirect a routing. Skill edits change every future session, so never apply them unasked.

Edit jstack's source, never an installed copy. Skills live in `src/skills/<name>/` in the jstack repo. Afterward, rebuild with `node build.mjs` and bump `version` in `jstack.json`. The edits reach sessions only after the user updates the installed plugin (the README's Updating section). If you don't know where the jstack repo is, ask.

For each approved row:

- **Small edit** (a bullet, a tightened sentence, a corrected fact): make it directly.
- **Larger edit** (a new section or more than about 10 lines): draft it, apply `/jstack:unslop`, and show the user the diff.
- **`tune description`** (the skill exists but didn't trigger): rewrite its `description` so it names the words and situations that should have triggered it.
- **New skill**: use the harness's skill-creator skill if one is installed. Otherwise copy the shape of an existing jstack skill.

Don't commit or push unless the user asks.

## 6. Summarize

- Edits applied: the skill path and one line on what changed.
- New skills: path and one line.
- Backlog: one line each, for the user to track.
- Dropped: one line per rejected finding, with the reason.
