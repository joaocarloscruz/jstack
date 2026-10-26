---
name: show-me-your-work
description: Keep a reviewable decision log for long or unattended work, one row per decision with the reason, evidence and result. Use for autonomous or multi-phase runs, work the user reviews after stepping away, or when the user asks to see the reasoning trail.
---

# Show me your work

Keep one decision log per effort.

## Format

A TSV file with one row per decision. Cells stay on one line. Evidence is a pointer, not prose.

| Column | Contents |
|---|---|
| `ts` | ISO 8601 timestamp. |
| `phase` | The phase or workstream. |
| `decision` | What was chosen or done, in one line. |
| `why` | The reason, in plain words. |
| `evidence` | A commit, PR number, `file:line`, or artifact path that proves it. Never a paragraph. |
| `result` | The outcome: `tests pass`, `reverted`, `INCONCLUSIVE`, `open`. |

Example:

```
ts	phase	decision	why	evidence	result
2026-05-24T09:02:00Z	frame	counted the work first: about 100 components	wanted the size before a long run	commit 3a9f1c2	found 5 blockers to sort out first
2026-05-24T09:40:00Z	harness	screenshotted the old version before changing anything	to compare old against new	scripts/snapshot.mjs, baseline/	saved 120 reference screenshots
2026-05-24T12:30:00Z	widget	threw out a helper's work because its screenshots were blank	checked the files instead of trusting its summary	worktree reset	reverted, tightened its brief
```

## Logging a row

Write each row the way you'd tell a teammate what you did. Plain words, no jargon. {{skill:unslop}} applies.

Use the script in this skill's folder:

```bash
node <this skill's folder>/scripts/log.mjs <logfile> <phase> <decision> <why> <evidence> <result>
```

It adds the timestamp, writes the header on first use, flattens tabs and newlines, and prefixes cells starting with `=`, `+`, `-` or `@` with a quote so spreadsheets don't run them as formulas.

Log decision points, not every action: a fork chosen, a unit finished with its check result, a pivot or revert and what triggered it, a blocker, a fixed gate. For loops, one row per iteration.

When you add to a log another session started, make your first row `phase` = `start`, with your session in the evidence. Read the log's last rows first to see whether anyone else wrote since. Use `start` for nothing else.

## Where it lives

By default the log is a working file, not committed: `decisions.tsv` in the work folder, or `.audit/<task>.tsv` when several efforts run at once. In a git repo, add its path to `.git/info/exclude` when you create it, so a later commit can't sweep it in. Commit it only when a reviewer needs the trail to trust the result.

## Rules

- Append only. A wrong call gets a new row that supersedes it. Never edit or delete rows.
- Prefer evidence from committed scripts over one-off checks.

## Audit before handing back

Check the log against what actually happened. This session's transcript is in {{harness:transcripts}}. Read only this workspace's.

- Every row maps to a real decision or action.
- Every evidence pointer resolves and shows what the row claims.
- A fork, pivot or abandoned approach that shaped the work but isn't logged is a gap. Add it.

Fix the log by adding rows, never by editing them.

## Second-model review

Before handing back, have a different model read the log and the transcript and flag what the user should look at: decisions with weak evidence, verification claimed without proof, risky calls, and gaps a quick skim would miss. If it's installed and the user is fine with the transcript going to another vendor, use {{harness:otherCli}}. Otherwise use a subagent on a role whose model differs from the one that did the work. Self-review doesn't count. If no different model is available, say so instead of claiming a second-model review.

End the reply with an **Attention** section. First line: `reviewed by <model>`, or `not reviewed by a second model: <reason>`. Then each flag, pointing at specific rows. "No flags" is a valid answer.
