# jstack

A personal stack of agent skills, a reviewer agent and a safety hook, adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack). You write it once in `src/`, and `build.mjs` turns it into a plugin for each harness: Claude Code and Codex. T3 Code runs those CLIs, so it picks jstack up through them.

## Install

You need Node.js 20 or newer on your `PATH`. The hook and the decision-log script run on it, and without it the hook fails on every shell command and blocks nothing.

The repo root is a marketplace for both harnesses.

**Claude Code**

```bash
claude plugin marketplace add joaocarloscruz/jstack
```

```bash
claude plugin install jstack@jstack
```

**Codex**

```bash
codex plugin marketplace add joaocarloscruz/jstack
```

```bash
codex plugin add jstack@jstack
```

Codex plugins can't ship custom agents, so copy `dist/codex/agents/jstack_reviewer.toml` into `~/.codex/agents/`. Codex also runs a plugin's hooks only after you approve them, so open Codex and approve the jstack hook in `/hooks`.

To install from a local clone instead, pass the clone's path to `marketplace add`.

## Updating

Both harnesses cache an installed plugin by its version, so a change reaches your sessions only after a version bump and an update:

1. Bump `version` in `jstack.json` and run `node build.mjs`.
2. Commit and push.
3. Update the plugin: `claude plugin update jstack@jstack` in Claude Code, and run `codex plugin add jstack@jstack` again in Codex.
4. Start a new session.

## Skills

Start with `lead`. It picks a playbook and calls the other skills as the work needs them.

| Skill | What it does |
|---|---|
| `lead` | The router. Matches the task to a playbook (Investigation, Bug fix, Feature, Refactoring, Prototype, Opening a PR), delegates code, and verifies before reporting. You start it yourself. |
| `principles` | The engineering principles every playbook cites, in one file. |
| `prove` | Verify against the real artifact before saying done. |
| `how` | Explain how code works, with parallel explorers for big questions. |
| `why` | Find why code is the way it is, from git and any connected tracker, docs or chat, with confidence labels. |
| `architect` | Sketch types and signatures from two or more independent designs before writing code. |
| `interrogate` | Adversarial review by reviewers on different models, judged into act on, consider, noted and dismissed. |
| `tdd` | Failing regression test first, when it's cheap. |
| `unslop` | Remove AI writing patterns. |
| `show-me-your-work` | A decision log for long or unattended runs. |
| `figure-it-out` | Design a custom playbook when none fits. `lead` routes large work here. |
| `reflect` | Turn a session's lessons into proposed skill edits. You start it yourself. |
| `correct` | Make a repeated agent mistake impossible in the repo. You start it yourself. |
| `automate-me` | Mine your transcripts into a `style` skill that `lead` follows. You start it yourself. |

"You start it yourself" means the skill is manual: agents can't trigger it on their own. Type `/jstack:lead` in Claude Code or `$jstack:lead` in Codex.

**Agent:** `reviewer`, a skeptical reviewer told not to edit files. In Claude Code it gets only read and shell tools, but a shell can still write, so in both harnesses read-only rests on its instructions.

**Hook:** `guard-shell` runs before every Bash or PowerShell command. It parses the command into simple commands and words first, so text that only mentions a flag (a commit message, an `echo`, a heredoc) never counts. It blocks:

- skipping git hooks: `--no-verify` on any git command, `-n` on `git commit`, and `git -c core.hooksPath=...`
- force-pushing: `--force`, `-f` in any short-flag cluster, or a `+refspec`. `--force-with-lease` is allowed.
- recursive deletes of `/`, `~`, `$HOME`, `$env:USERPROFILE` or a drive root (`C:\`, or `/c` in Git Bash and `/mnt/c` in WSL), through `rm` or `Remove-Item`

It follows line continuations and also looks inside `bash -c` (including clusters like `bash -lc`), `sh -c`, `pwsh -Command` and backtick substitutions. It's a guardrail against slips, not a sandbox. A determined command (a script file, an alias) can get past it.

## Layout

| Path | What it holds |
|---|---|
| `jstack.json` | Plugin name, version and description, shared by every harness. |
| `roles.json` | Model roles (`judge`, `coder`, `fast`), each with a purpose and the model and effort each harness uses. |
| `harness/<id>.json` | What differs per harness: manifest path, skill and agent naming, agent format, valid efforts, how to mark a skill manual, and named text snippets. Each file here is one harness. |
| `src/skills/<name>/` | Skills in neutral terms. The frontmatter `name` must match the folder. |
| `src/agents/<name>.md` | Agents with `name`, `description`, `role` and an optional `readonly: true`. |
| `src/hooks/` | `hooks.json`, the hook script and its rules. Both harnesses accept the same format. |
| `dist/` | Generated output. Don't edit it. |
| `test/` | Tests for the hook, the log script and the build. |

## Writing neutral skills

Write "spawn a subagent", "ask the user" and "the task list", never a harness's tool names. Where text must name something harness-specific, use a token:

| Token | Claude Code | Codex |
|---|---|---|
| `{{skill:prove}}` | `` `/jstack:prove` `` | `` `$jstack:prove` `` |
| `{{agent:reviewer}}` | the `jstack:reviewer` subagent | the `jstack_reviewer` custom agent |
| `{{role:judge}}` | `opus` at `medium` effort | the session model at `high` reasoning effort |
| `{{harness:explorer}}` | the built-in `Explore` subagent | the built-in `explorer` agent |
| `{{harness:otherCli}}` | the `codex` CLI, brief piped in on stdin | the `claude` CLI, brief piped in on stdin |
| `{{harness:transcripts}}` | `~/.claude/projects/<workspace>/` | `~/.codex/sessions/` |
| `{{harness:instructionsFile}}` | `CLAUDE.md` | `AGENTS.md` |

`{{harness:<key>}}` reads `text.<key>` from the harness profile, so adding a key there adds a token. Cite a principle as "<Principle name> in `{{skill:principles}}`", using its exact name.

Add `invocation: manual` to a skill's frontmatter to keep agents from triggering it on their own. The build turns it into `disable-model-invocation: true` for Claude Code and an `agents/openai.yaml` policy for Codex.

## Build and test

```bash
node build.mjs
```

```bash
npm run check
```

```bash
npm test
```

The build fails when:

- a token names a missing skill, agent, role or harness text key, or is malformed
- a role's effort isn't valid for a harness
- a skill's `name` doesn't match its folder, or it has no `description`
- a backticked file reference (`references/x.md`) doesn't exist in the skill
- a principle citation names no principle
- source text uses a pstack or Cursor name, a model name, a harness name, tool name or path, or an already-rendered skill name

`npm run check` also fails when `dist/` or the marketplace files don't match `src/`. CI runs the check and the tests on Ubuntu and Windows.

## Differences between harnesses

- **Skill and agent names.** Both harnesses prefix plugin skills with `jstack:`. Codex agent names are global, so the build names the agent `jstack_reviewer` there.
- **Models.** Codex roles set `model: null`, which keeps the session model and varies only the effort. On Codex, `interrogate` and `architect` say so when two reviewers share a model. Put a model name in `roles.json` to pin one.
- **Hooks.** Both harnesses send the same JSON on stdin and treat exit code 2 as a block. Codex sets `CLAUDE_PLUGIN_ROOT` for compatibility, so one `hooks.json` serves both.

## Known gaps

- The hook hasn't run inside Codex yet, because Codex needs the one-time `/hooks` approval first. Its behavior is covered by the tests, but the `CLAUDE_PLUGIN_ROOT` path on Codex is unconfirmed until then.
- No end-to-end `lead` run has completed in either harness yet.

## Credits

Adapted from pstack by Lauren Tan, under the MIT License. See `LICENSE`.
