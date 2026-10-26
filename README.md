# jstack

A personal stack of agent skills, subagents and hooks, adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack). You write it once in `src/`, and `build.mjs` turns it into a plugin for each harness in `dist/`: Claude Code and Codex today. T3 Code runs those CLIs, so it picks jstack up through them.

## Skills

Start with `lead`. It picks a playbook and calls the other skills as the work needs them.

| Skill | What it does |
|---|---|
| `lead` | The router. Matches the task to a playbook (Investigation, Bug fix, Feature, Refactoring, Prototype, Opening a PR), delegates code, and verifies before reporting. Manual only. |
| `principles` | The engineering principles every playbook cites, in one file. |
| `prove` | Verify against the real artifact before saying done. |
| `how` | Explain how code works, with parallel explorers for big questions. |
| `why` | Find why code is the way it is, from git and any connected tracker, docs or chat, with confidence labels. |
| `architect` | Sketch types and signatures from two or more independent designs before writing code. |
| `interrogate` | Adversarial review by reviewers on different models, judged into act on, consider, noted and dismissed. |
| `tdd` | Failing regression test first, when it's cheap. |
| `unslop` | Remove AI writing patterns. |
| `show-me-your-work` | A decision log for long or unattended runs. |
| `figure-it-out` | Design a custom playbook when none fits. Manual only. |
| `reflect` | Turn a session's lessons into proposed skill edits. Manual only. |
| `correct` | Make a repeated agent mistake impossible in the repo. Manual only. |
| `automate-me` | Mine your transcripts into a `style` skill that `lead` follows. Manual only. |

Agent: `reviewer`, a skeptical read-only reviewer. Hook: `guard-shell`, which blocks `--no-verify`, force-push and `rm -rf` on `/` or home.

## Layout

| Path | What it holds |
|---|---|
| `jstack.json` | Plugin name, version and description, shared by every harness. |
| `roles.json` | Model roles (`judge`, `coder`, `fast`) and the model and effort each harness uses. |
| `harness/<id>.json` | What differs per harness: manifest path, skill and agent naming, agent format, valid efforts, how to mark a skill manual, and named text snippets. |
| `src/skills/<name>/` | Skills in neutral terms. The frontmatter `name` must match the folder. |
| `src/agents/<name>.md` | Subagents with `name`, `description`, `role` and an optional `readonly: true`. |
| `src/hooks/` | `hooks.json` and its scripts. Both harnesses accept the same format. |
| `dist/` | Generated output. Don't edit it. |

## Writing neutral skills

Write "spawn a subagent", "ask the user" and "the task list", never a harness's tool names. Where text must name something harness-specific, use a token:

| Token | Claude Code | Codex |
|---|---|---|
| `{{skill:prove}}` | `` `/jstack:prove` `` | `` `$prove` `` |
| `{{agent:reviewer}}` | the `jstack:reviewer` subagent | the `reviewer` custom agent |
| `{{role:judge}}` | `opus` at `xhigh` effort | the session model at `high` reasoning effort |
| `{{harness:explorer}}` | the built-in `Explore` subagent | the built-in `explorer` agent |
| `{{harness:otherCli}}` | `codex exec "<prompt>"` | `claude -p "<prompt>"` |
| `{{harness:transcripts}}` | `~/.claude/projects/<workspace>/` | `~/.codex/sessions/` |
| `{{harness:instructionsFile}}` | `CLAUDE.md` | `AGENTS.md` |

`{{harness:<key>}}` reads `text.<key>` from the harness profile, so adding a key there adds a token.

Add `invocation: manual` to a skill's frontmatter to stop the model from triggering it on its own. The build turns it into `disable-model-invocation: true` for Claude Code and an `agents/openai.yaml` policy for Codex.

## Build

```bash
node build.mjs
```

```bash
node build.mjs --check
```

The build fails when:

- a token names a missing skill, agent, role or harness text key
- a role's effort isn't valid for a harness
- a skill's `name` doesn't match its folder, or it has no `description`
- a backticked file reference (`references/x.md`) doesn't exist in the skill
- source text uses a pstack or Cursor name, a hard-coded model, a harness tool name or a harness path

`--check` also fails when `dist/` doesn't match `src/`. Run it in CI.

## Install

**Claude Code.** The repo root is a marketplace. Add it from GitHub as `<owner>/jstack`, or from a local clone with its path:

```bash
claude plugin marketplace add <owner>/jstack
```

```bash
claude plugin install jstack@jstack
```

**Codex.** Copy `dist/codex` to `~/.codex/plugins/jstack`, add it to `~/.agents/plugins/marketplace.json`, and restart. Then review and trust the hook with `/hooks`. Codex plugins can't ship custom agents, so copy `dist/codex/agents/*.toml` into `~/.codex/agents/`.

## Differences between harnesses

- **Read-only agents.** Claude Code enforces read-only with a `tools:` list. A Codex custom agent can't override the sandbox, so its instructions are all that keeps it read-only.
- **Models.** Codex roles set `model: null`, which keeps the session model and varies only the effort. Put a model name in `roles.json` to pin one, which also gives `interrogate` and `architect` real model diversity on Codex.
- **Hooks.** Both harnesses send the same JSON on stdin and treat exit code 2 as a block. Codex also sets `CLAUDE_PLUGIN_ROOT`, so one `hooks.json` serves both.

## Not yet verified

- `claude plugin validate` passes on `dist/claude-code` and `dist/`, but neither plugin has run in a real session.
- Whether Codex calls plugin skills as `$prove` or `$jstack:prove`. Change `skillRef` in `harness/codex.json` if needed.
- The Codex transcript location and the marketplace entry's `policy` and `category` fields.

## Credits

Adapted from pstack by Lauren Tan, under the MIT License. See `LICENSE`.
