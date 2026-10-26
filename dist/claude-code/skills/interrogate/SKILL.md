---
name: interrogate
description: Adversarial review of a change by several independent reviewers on different models, judged into act-on, consider, noted and dismissed. Use for "interrogate", "adversarial review", "challenge this", "stress test this", "find blind spots" or "tear this apart".
---

# Interrogate

Have independent reviewers on different models attack a change, then judge their findings yourself. The signal comes from model diversity, not assigned personas. The deliverable is a verdict. Don't apply any changes.

## 1. Scope

Work out what to review:

- Files or a diff the user pointed at.
- On a feature branch, the full change: `git diff <base>...HEAD`.
- Otherwise, the files from the recent work the user refers to.

Collect the diff plus any surrounding files a reviewer needs.

## 2. Intent

Write the intent in one paragraph, from the user's message, commit messages, any PR description and the code. If you can't tell what the change is for, ask before going on.

## 3. Spawn reviewers

Spawn all reviewers at once, as read-only subagents (the `jstack:reviewer` subagent works), each on a different model:

- **Reviewer A** on `opus` at `medium` effort.
- **Reviewer B** on `sonnet` at `high` effort.
- **Reviewer C**, a different model family, if it's installed: run it through the `codex` CLI, with the brief written to a file and piped in on stdin (`codex exec --sandbox read-only - < brief.md`), never pasted as a command-line argument. Give it the same brief and tell it not to edit files. This sends the diff to another vendor, so skip it if the user wants their code kept with one vendor. Skip it and say so if the CLI isn't available.

If two reviewers end up on the same model, say so in the Reviewers list. Agreement between them is a weaker signal than agreement across models.

Every reviewer gets the same brief: `references/reviewer-prompt.md` filled in with the intent, the diff, `references/rubric.md` and `references/code-quality.md`.

## 4. Merge

Parse every reviewer's findings. Merge findings that describe the same problem, and note which reviewers raised each. A finding two reviewers raised independently is the strongest signal. Weigh a lone finding on its merits. Note where reviewers disagree.

## 5. Judge

You're the lead reviewer: a pragmatic senior engineer, not a neutral aggregator. `references/lead-judgment.md` has the filters. Put each finding in one bucket, with who raised it and a one-line reason:

- **Act on.** Real problems with correctness, security or maintainability that would block a real PR.
- **Consider.** Legitimate, but maybe not worth the cost now. The user decides.
- **Noted.** Valid but not actionable at this stage.
- **Dismissed.** Wrong, nitpicking or missing context, with the reason.

## Output

```
### Intent
> the intent paragraph

### Reviewers
- Reviewer A: <model>, <N> findings

### Act on
Each: the problem, who raised it, why it matters.

### Consider
Each: the problem, who raised it, the tradeoff.

### Noted
Short list.

### Dismissed
Each with its reason.

### Agreement map
Where reviewers agreed and differed, and what that suggests.
```
