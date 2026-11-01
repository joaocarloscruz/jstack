# jstack

A personal stack of Claude Code skills and three helper agents, adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack). Start a task with `/jstack:lead`.

## Install

```bash
claude plugin marketplace add joaocarloscruz/jstack
```

```bash
claude plugin install jstack@jstack
```

Nothing else to install.

## Updating

Claude Code caches the plugin by version, so pushes reach your sessions only after a version bump. Let several changes land first, then bump the patch number (`2.5.0` to `2.5.1`):

1. Bump `version` in `.claude-plugin/plugin.json`, then commit and push.
2. Run `claude plugin marketplace update jstack`, then `claude plugin update jstack@jstack`.
3. Start a new session.

## Skills

| Skill | What it does |
|---|---|
| `lead` | The entry point. Matches the task to a playbook (Investigation, Bug fix, Feature, Refactoring, Prototype, Opening a PR), hands code to the agents below, and verifies before reporting. You start it yourself with `/jstack:lead`. |
| `principles` | The engineering principles the playbooks cite, in one file. |
| `prove` | Verify against the real thing before saying done, with a second look from `jstack:judge` on nontrivial work. |
| `how` | Explain how code works, with parallel explorers for big questions. |
| `why` | Find why code is the way it is, from git and any connected tracker, docs or chat, with confidence labels. |
| `unslop` | Remove AI writing patterns from prose. |
| `models` | Show or change which model each agent below uses. You start it yourself with `/jstack:models`. |

## Agents and models

The skills hand work to three agents. Each agent's model and effort are one line each in its own file:

| Agent | Does | Default model | File |
|---|---|---|---|
| `jstack:judge` | Design calls, reviews, explanations, synthesis, the hardest code | `opus`, medium effort | `agents/judge.md` |
| `jstack:coder` | Code from `lead`'s brief | `claude-sonnet-5-5`, high effort | `agents/coder.md` |
| `jstack:fast` | Bulk reading, lookups, exploring code, the same edit across many files | `claude-haiku-5-5`, low effort | `agents/fast.md` |

`coder` and `fast` name the full model IDs because older Claude Code versions run Sonnet 5 and Haiku 4.5 for the short names `sonnet` and `haiku`. The tests reject the short names and any 4.x model.

To change them, run `/jstack:models`:

- `/jstack:models` shows what each agent uses now.
- `/jstack:models coder opus` sets one agent's model. Add an effort to set that too, as in `/jstack:models judge opus high`.
- `/jstack:models judge coder sonnet` sets both to the same model, and `/jstack:models judge opus high coder haiku` sets each its own.
- `/jstack:models all sonnet` sets all three.

Models are `opus`, `sonnet`, `haiku`, `fable`, or `inherit` to follow the model you picked in the app. The command writes `sonnet` and `haiku` as their 5.5 IDs. Efforts are `low`, `medium`, `high`, `xhigh` and `max`. Claude Code asks you to allow the edit, because it protects agent files.

The change applies to new sessions and lasts until the next jstack update, which puts back the defaults above. To change a default for good, edit the line in `agents/` here and push a new version. The skills never pass a model, so the file always wins.

The skill you run, such as `lead`, uses the model you picked in the app. It makes a change itself only when the change is shorter than a brief would be: a few lines it already knows, or one plain find-and-replace with `sed`. Every other edit it can spell out goes to `fast`, along with bulk reading and exploration. With Opus 5.5 leading and Haiku 5.5 as `fast`, measured with the app's Claude Code:

| Edit | Done by the main agent | Handed to `fast` |
|---|---|---|
| One line | $0.19, 7–10s | $0.21, 17–21s |
| 36 calls of 12 shapes in one file, under `lead` | $0.56–0.76 (5 runs) | $0.47–0.51 (2 runs) |

A plain swap across 25 files cost $0.37–0.41 under `lead`, done with one `sed`. Every run was correct.

## Layout

| Path | What it holds |
|---|---|
| `.claude-plugin/` | The plugin manifest and the marketplace that serves this repo. |
| `skills/<name>/` | One folder per skill. The frontmatter `name` must match the folder. |
| `agents/` | The three agents, each with its model and effort. |
| `test/` | Tests for the plugin's references. |
| `evals/` | `claude plugin eval` cases that run `lead` on small fixture tasks. |

## Tests and evals

```bash
npm test
```

The tests check that every skill, agent and file a skill names exists, and that each agent sets a valid model and effort. CI runs them on Ubuntu and Windows, so you don't need Node locally to edit a skill.

```bash
claude plugin eval . --scaffold --trust-plugin --allow-tools Write Edit --runs 1
```

The evals run real sessions on your account. Use them before a change you're unsure of, to compare its results and cost against the current version. On native Windows the runs get no shell, so the cases grade the files the agent leaves behind.

## Codex

jstack is Claude Code only for now. Version 1.0.1 in git history has a build that also produced a Codex plugin. Bringing Codex back means a `.codex-plugin/plugin.json`, the three agents as TOML files in `~/.codex/agents/`, and `$jstack:<name>` in place of `/jstack:<name>`.

## Credits

Adapted from pstack by Lauren Tan, under the MIT License. See `LICENSE`.
