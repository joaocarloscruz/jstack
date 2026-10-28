---
name: models
description: Show or change the model and effort each jstack agent uses, as in /jstack:models coder opus or /jstack:models all sonnet.
disable-model-invocation: true
argument-hint: "[judge|coder|fast|all] [model] [effort] ..."
---

# Models

Arguments: $ARGUMENTS

The agents are judge.md, coder.md and fast.md in the `agents` folder two levels above this skill's base directory. That folder is the copy Claude Code runs, so edit it there and nowhere else. Don't commit or push.

1. **No arguments:** read the three files and show a table of agent, model and effort. Stop.
2. **Otherwise:** read the arguments loosely as one or more changes, each an agent (`judge`, `coder`, `fast` or `all`), a model, and an optional effort, as in `judge opus high coder sonnet`. Agents listed together all get the model after them, so `judge coder opus` sets both judge and coder to opus. Models are `opus`, `sonnet`, `haiku`, `fable` and `inherit` (follow the model picked in the app). Efforts are `low`, `medium`, `high`, `xhigh` and `max`. If something doesn't match, say what's valid and stop.
3. Make every edit at once. In each file you're changing, edit only the `model:` line, plus the `effort:` line if an effort was given.
4. Show the table again, then tell the user, in one or two sentences: the change takes effect in new sessions, and it lasts until jstack is next updated, which puts back the defaults from GitHub. To change a default for good, edit the same line in the jstack repo and push a new version.
