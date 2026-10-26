---
name: figure-it-out
description: Design a custom, auditable playbook when no standard one fits, such as a large migration, an ambitious multi-part change, or work the user reviews after stepping away. Use when lead routes a task here, or when the user says "figure it out".
---

# Figure it out

When no playbook fits the task, design one. Before any code, the deliverable is the workflow itself: phases that match the rigor to the stakes, test each step like an experiment, and leave a decision trail the user can audit later.

Start the task list with "Read {{skill:principles}}", then the phases below.

## Phase A: Frame

Investigate first, then commit. Don't start until you can state:

- **Done**, as a predicate that can be false (per Prove it works).
- **Scope**, with rough numbers: units of work, effort, and the blockers you found.
- **Rigor level**, biased high. One-way doors and wide blast radius get more. Reversible, low-stakes steps get less. Rigor means gates and artifacts, not "try harder".

Present the framing and tradeoffs before a long run. Reversible work proceeds without waiting, but a multi-hour run earns one checkpoint with the user.

## Phase B: Design the workflow

Split the work into small units that can each land on their own. Put the riskiest unknown first. Build the scaffold and the verification before the features.

- Build the verification harness before the work, with a baseline captured from the current state, so every check reads "old value vs new value".
- For one-way design decisions, run {{skill:architect}}. Skip it for mechanical work whose shape is already clear.
- Decide what runs in parallel. Split only along real seams, and give each worker its own worktree or branch. Don't over-split.
- Write the phase list down. That list is what the user reviews.

Then add the designed steps to the task list and run each one under Phase C, logging as you go (Phase D).

## Phase C: Run the loop

Each unit is an experiment. State the hypothesis, make the smallest change, measure against the predicate on the real artifact, and keep it only if it moved the predicate. Otherwise revert it. Verify each unit before starting the next.

- Verify by inspecting the artifact, never a self-report. When something passes too easily, suspect the check.
- Pair delegated work with a judge ({{agent:reviewer}}). If a worker games the gate, reset and tighten the contract. If the gate itself is wrong, fix it in its own change.
- A verdict is VERIFIED, NOT VERIFIED or INCONCLUSIVE. Inconclusive is not a pass. Don't hide a negative result.

## Phase D: Keep the audit trail

Log the run with {{skill:show-me-your-work}}. This work is usually big enough to commit the log so the reviewer can read it with the PR.

## Phase E: Verify and hand back

Check the whole result against the Phase A predicate on the real product, not only the harness. Turn any correction you made more than once into a check or script.

**Reply:** the playbook you designed, the rigor level and why, the path to the decision log, what's verified against the predicate, and what's still open.
