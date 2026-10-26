---
name: architect
description: Sketch types, signatures and module structure before writing code, compare at least two designs, then implement against the chosen sketch. Use for "architect this", "design this", or nontrivial work where jumping into code would lock in the wrong shape.
---

# Architect

Sketch types, function signatures and module boundaries with `not implemented` bodies and pseudocode. Compare independent designs, pick or combine the best, then fill in the code against it.

Start the task list with the five phases: Ground, Sketch, Agree, Implement, Scrap.

## Phase A: Ground

Build a real mental model of every system the new code touches. Run `/jstack:how` over them. Naming a file isn't grounding. If the design changes ownership or layering, also run `/jstack:why` on the current shape, so its rationale becomes a constraint instead of a guess.

Skip this phase only for greenfield work with nothing around it.

## Phase B: Sketch

Design it at least twice. Spawn two or more runners in parallel, each with `references/runner-prompt.md`, the task and the Phase A findings. Give each runner its own folder or worktree so they can't see each other. Run them on different models when you can: one on `opus` at `xhigh` effort and one on `sonnet` at `high` effort. For a third, different model family, run one through `codex exec "<prompt>"` if it's installed.

Require structurally different candidates, whole-shape alternatives rather than tweaks of one shape.

Screen every candidate against `references/design-red-flags.md`. Assume the next contributor is an agent that sees only the files it opened, copies the nearest example and takes the shortest path that compiles. Prefer the design where a change that looks right from one file is right for the whole repo.

Compare the viable candidates on interface depth: prefer the one that hides more complexity behind a smaller, simpler public interface. Then pick a base, take what's better from the others, and record the decision in the rationale (`references/rationale-template.md`).

## Phase C: Agree (opt-in)

By default, go straight to implementation. Pause for sign-off only when the user asked for a checkpoint ("stop and show me before implementing").

The sketch can land as its own commit either way. For adversarial pressure before implementing, run `/jstack:interrogate` on it.

If the user pushes back on the shape, treat that as new Phase A evidence: re-ground and redo Phase B before writing more code.

## Phase D: Implement

Replace `not implemented` bodies with code and pseudocode with logic. The sketch is the contract. A deviation is a signal to surface, not friction to absorb. If a function needs a parameter the sketch didn't plan for, ask whether the sketch was wrong, a requirement was missed, or the implementation is overreaching.

## Phase E: Scrap when the shape is wrong

If implementation keeps producing friction the sketch can't absorb, throw the sketch out instead of bolting fixes on. The signal is a pattern, not one instance:

- The same workaround appearing in unrelated places.
- Several unrelated edge cases that each need a special branch.
- Types that need escape hatches (`any`, casts, optional fields that are always set) to compile.
- Reaching for a lock when the sketch said the state wasn't shared.
- Callers needing to know the abstraction's internal rules.

A few edge cases don't condemn a design. Complex data isn't a complex design.

To scrap: run `/jstack:how` over what's been built, redesign as if the new constraints had been there from day one, make the new sketch smaller than the old one before it grows, and return to Phase B.

## Outputs

Write the caller's usage first and derive the types from it. For small changes, one file of new types and signatures. For larger work, a module map plus type definitions. The rationale ships alongside, shaped by `references/rationale-template.md`.
