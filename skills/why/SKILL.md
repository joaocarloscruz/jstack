---
name: why
description: Find out why code is the way it is. Use for "why does X work this way", "why did we pick Y", design rationale, regressions, postmortems and unexplained thresholds. Searches git history plus any connected tracker, docs, chat or monitoring tools, and returns a cited, confidence-labeled answer. For how code works, use how.
---

# Why

Find the forces that shaped a piece of code. `/jstack:how` answers what code does. This skill answers why it exists in this shape.

Work as a careful, precise investigator. Keep what you know apart from what you infer. `references/epistemics.md` has the confidence tiers and phrasing, and the synthesizer must follow it.

## 1. Pin down the target and the question

The target is usually some code, a pattern, a feature or a named decision. The question is usually rationale, a tradeoff, a motivating edge case, an outside constraint, dead code or a history sweep.

If the target is vague, make your best guess from context (open files, recent edits, the conversation), state it, and go. The user can redirect.

## 2. Build the code anchor

Before spawning anyone, collect the seed context yourself: file paths and line ranges, key symbols, recent commits on the target, PR numbers from merge commits, and ticket IDs in commit messages.

```bash
git blame -L <start>,<end> <file>
git log --follow --oneline -20 -- <file>
git log -1 --format=%B <commit>
gh pr view <number> --json title,body,author,createdAt,mergedAt,comments,reviews
```

Every investigator and the synthesizer get this anchor.

## 3. Spawn investigators in parallel

Map the tools available in this session to evidence categories:

1. **Source control.** Git and `gh`. Always available, always searched. Best for rationale captured during review.
2. **Issue tracker** (Linear, Jira, GitHub Issues). Best for the product or business reason.
3. **Long-form docs** (Notion, Confluence, Google Docs). Best for design rationale written before the code.
4. **Team chat** (Slack, Teams). Best for decisions that never reached a doc.
5. **Observability** (Datadog, Grafana). Best for runtime reality behind timeouts, retries and limits.
6. **Error tracking** (Sentry). Best for the errors behind defensive code.
7. **Analytics warehouse** (Snowflake, BigQuery, Databricks). Best for data behind thresholds and flag-gated code.

Spawn one investigator per category that has a connected tool, all at once, each owning exactly one source. Investigators are `jstack:fast` agents, which keep the session's connectors. Tell each not to write anything.

Each investigator's brief is `references/investigator-prompt.md` filled in, plus the anchor and the user's question. The source-control investigator also gets `references/code-archaeology.md`. If the target looks defensive (null checks, retries, timeouts, rate limits, feature flags), tell every investigator to look for incidents or outages behind it.

A category with no connected tool is a gap, not a choice. Record it as one. Skip a connected category only when it's provably irrelevant, with the reason written down.

## 4. Synthesize

Spawn one `jstack:judge` agent as the synthesizer, with every investigator's findings (including empty results and skips), the anchor, the question, `references/epistemics.md` and `references/synthesizer-prompt.md`.

## 5. Present

Present the synthesizer's output. You may edit lightly for clarity, but don't change the confidence language.

The sections are The question, The code, What we found, What we can reasonably infer, Competing hypotheses, What we don't know, Sources consulted and Confidence summary. If the question leads to changing this code, end with a Preserve / Change / Avoid / Risk list for planning the change.

## Common failure

Recency bias: treating the latest commit as the whole story. The current shape is usually many earlier decisions stacked up. Trace back.
