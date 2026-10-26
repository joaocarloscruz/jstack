---
name: how
description: Explain how code works. Use for "how does X work", walkthroughs before changing unfamiliar code, and placement questions like "where should this live" or "which module owns this". For why code is the way it is, use why.
---

# How

Answer "how does X work?" at the level a senior engineer needs to start working in the area: a working mental model, not annotated source.

Every subagent here is read-only, so use the built-in `Explore` subagent and tell it not to edit files. Explorers run on `haiku` at `low` effort. The explainer runs on `opus` at `medium` effort.

## 1. Size the question

If the scope is ambiguous, state your reading and go. The user can redirect.

- **Simple** (one module, one function, a narrow question): no explorers. Spawn one explainer from `references/explainer-prompt.md`, without the explorer-findings section. It explores and explains in one pass. Go to step 4.
- **Complex** (a subsystem across several files or services, a cross-cutting feature, an architecture overview): go to step 2.

When in doubt, take the simple path.

## 2. Explore (complex only)

Split the question into two to four distinct angles. Spawn one explorer per angle, all at once, each with `references/explorer-prompt.md` and its angle filled in.

## 3. Explain (complex only)

When every explorer has returned, spawn one explainer with `references/explainer-prompt.md` and all their findings.

## 4. Present

Present the explainer's output. Light edits for clarity or conversation context are fine. Don't rewrite it.

The sections are Overview, Key concepts, How it works, Where things live and Gotchas. Drop any that don't apply.
