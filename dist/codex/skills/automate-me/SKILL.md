---
name: automate-me
description: Turn the user's working habits into a jstack style skill that every session follows. Mines recent transcripts for repeated preferences, confirms them with the user, and drafts or updates the skill. Use for "automate me", "capture how I work", or "update my style skill".
---

# Automate me

Turn how the user works into a skill agents follow. The output is one skill, `style`, in jstack's source at `src/skills/style/SKILL.md`. If you don't know where the jstack repo is, ask.

jstack is installed for every project, so `style` applies everywhere. Capture habits that hold across projects. A rule that only fits one project belongs in that project's `AGENTS.md` instead.

## 0. Check for an existing style skill

If `src/skills/style/SKILL.md` exists, update it unless the user asked to start over. In update mode:

- Mine only history since the skill last changed (`git log -1 --format=%cI -- src/skills/style/SKILL.md`).
- Ask what changed or is missing, not what to capture from scratch.
- Edit in place. Keep rules the user hasn't contradicted, revise ones with new evidence, and add sections only for new patterns.

## 1. Mine their history

Transcripts live in `~/.codex/sessions/`, in dated folders of `rollout-*.jsonl` files. Several sessions can run at once, so pick the file whose working directory and first user message match this session. Other projects' transcripts are private conversations, so ask the user which projects to mine. With no answer, mine only this workspace's.

Split the last two to four weeks into three slices and spawn one subagent per slice on the session model at `low` reasoning effort. Each returns a short list of patterns with pointers to where it saw them. Signals to look for:

- How they like replies: length, tone, format, "simpler please" corrections.
- How they delegate: subagents, models, parallel work.
- What "done" means to them: unit tests, live checks, reviewers.
- Code and prose habits: style rules, principles they cite, tools they run.
- Process: branches, worktrees, commits, PRs.
- How they treat skills: fixing them mid-task, proposing new ones.

Keep a pattern only if it shows up in at least two slices. Drop lone signals.

## 2. Ask the user

Mining misses intent that hasn't come up yet. Ask one or two multiple-choice questions with four to six options each, using the harness's question tool if it has one. Start broad ("Which areas matter most?"), then follow up on what they pick. End with one open question for anything the options missed. Don't ask twenty questions.

## 3. Group the findings

Sort the patterns into sections, using only the ones that apply: Response style, Autonomy, Understanding first, Subagents, Code and prose, Review and verification, Process, Skills.

## 4. Draft the skill

- `name: style`.
- `description`: say it holds the user's working preferences and applies to every task. Avoid generic triggers like "write code".
- Write rules as instructions, with "the user", not their name.
- Refer to other jstack skills by name instead of pasting their content.
- Add a section only when the user has a specific, non-default rule there. "Communicate clearly" is not a rule. "Short paragraphs, tables to compare options" is.

## 5. Tighten

Apply `$jstack:unslop` to every line. Show the draft and take feedback. Expect a few rounds. Cut hard: this is a style guide, not a manual.

## 6. Land it

Rebuild with `node build.mjs` and bump `version` in `jstack.json`. Commit on a branch and open a PR if the user wants one. The change reaches sessions only after the user updates the installed plugin (the README's Updating section).

## Guardrails

- **Don't overfit.** A preference stated once and contradicted later is noise.
- **Don't be clever.** No metaphors or flourishes in agent-facing text.
- **Don't force symmetry.** No process rules worth writing down means no Process section.

## When not to use

For one specific workflow ("how I write commit messages"), write a regular skill instead.
