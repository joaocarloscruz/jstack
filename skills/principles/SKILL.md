---
name: principles
description: Engineering principles behind every jstack playbook. Use when designing, refactoring, debugging, reviewing, verifying or delegating, or when another skill cites a principle by name.
---

# Principles

Each principle starts with when it applies. Cite one in a reply only when it changed a decision, and name the decision.

## Core

**Laziness protocol.** Sizing a diff, or tempted to add an abstraction, layer or new parameter. Make the smallest change that solves the problem. Put a repeated decision behind one source of truth. Fewer lines beat elegant boilerplate.

**Foundational thinking.** Before writing logic. Get the data structures right first, trace each access pattern through them, and the code becomes obvious. Build what every later step benefits from first: shared types, test setup, CI. Ask what concurrent actors share before they share it.

**Redesign from first principles.** Adding a requirement to an existing design. Don't bolt it on. Ask what you'd build if the requirement had been there from day one, then deliver that in steps. Carry the change through types, docs and examples.

**Attack the premise.** Two fixes that share one assumption have both failed. Write the assumption down and test it directly before writing a third fix. If the test contradicts it, look for what the failures have in common that the assumption didn't predict.

**Subtract before you add.** Sequencing any addition, refactor or rewrite. Remove dead code, redundant checks and stale references first, then build on the simpler base. Design for observed use, not imagined edge cases.

**Minimize reader load.** Shaping or reviewing code that's hard to follow. Count the layers between a question and its answer, and the hidden state a reader must hold. Collapse one-caller wrappers and pass-through layers. Prefer pure functions and the smallest state scope. Test: can a new reader answer "where does X come from?" and "what can change X?" in 30 seconds?

**Outcome-oriented execution.** Planned rewrites and migrations. Aim for the verified end state instead of keeping every intermediate step working with throwaway compatibility code. Declare where temporary breakage is allowed, and verify fully at the end.

**Experience first.** Product, UX or scope tradeoffs. Choose what's better for the user over what's easier to build. Fewer polished features beat many rough ones. The user is whoever consumes the work: an end user, a colleague importing the library, or the next maintainer.

**Exhaust the design space.** A new interaction or architecture with no precedent in the codebase. Build two or three competing versions and compare them before committing.

**Build the lever.** Any work that isn't trivial. Write the script, codemod or generator that does or checks the work, instead of doing it by hand. Do the first unit by hand to learn the recipe, then automate it and diff against your hand version. If you cite this and there's no script in the diff, you didn't apply it.

## Architecture

**Model the domain.** Stateful logic, or code that branches a lot or repeats a shape assumption across files. Encode the domain in a structure: a state machine over scattered booleans, a typed model over loose parameters, a lookup table or tagged union over branching spread across files. The sign you skipped this is a feature that adds one more branch to an existing if/else chain. Don't force a structure onto code that's already clear and local.

**Boundary discipline.** Wiring validation, error handling or framework adapters. Validate and parse where data enters the system (CLI args, config, network, external APIs). Inside, trust the types and don't re-check. Keep business logic in pure functions, and don't leak transport or storage types through the public interface.

**Type system discipline.** Designing types or signatures. Make illegal states impossible to write. Give primitives that mean different things different types (`UserId` vs `OrderId`). Treat external data as untyped until parsed. Derive types from the schema that owns the shape instead of hand-copying it.

**Make operations idempotent.** Commands, lifecycle steps or loops that can crash and retry. Read the current state, compare it to the goal, and apply only the difference. Anything a run leaves behind (locks, temp files, half-written records) must be recognizable as stale by the next run. Ask what happens if it runs twice, or crashes at each point.

**Migrate callers, then delete legacy APIs.** Adding a new internal API while old callers exist. Move every caller and delete the old API in the same change. Update tests to the new contract and delete tests that only protected the old internals. This applies when no external users depend on the old API.

**Separate before serializing shared state.** Two actors might write the same file, branch, key or object. First remove the sharing: give each actor its own target and merge when reading. Lock or serialize only when one shared writer is a real invariant. Instructions are not concurrency control.

## Verification

**Prove it works.** Before saying a task is done. Check the real artifact, not a proxy, a cache or a self-report. When a check fails, suspect the observation before the system. A rerunnable script beats a one-time look. `/jstack:prove` has the steps.

**Fix root causes.** Debugging. Reproduce first. Ask "why" until the answer is a wrong decision in the code, not a consequence of one. If the state that triggered the symptom is legitimate, handle it where it broke. If it should never exist, find what produced it, because a guard there hides the bug. Fix every instance of the pattern. A workaround that needs a paragraph of comment means the code is wrong.

**Sequence verifiable units.** Multi-step work, and how you order commits and PRs. Break the work into small units that each end in a state you can check, and don't start the next until the current one passes. Order the delivery so it proves itself: the failing test, then the fix. That failing-test commit is the only one allowed to fail on its own.

**Test behavior, not implementation.** Writing, changing or keeping a test. Imagine two edits. Break the behavior: the test must fail. Restructure the internals without changing results: the test must still pass. Keep tests that do both. Derive expected values from the requirement, not from running the code.

**Explain the number.** Before measuring, and before trusting or reporting a measurement (speedup, latency, eval score). First write down which result would change your decision, and how much the number moves between runs. If that spread is bigger than the effect, stop, because the number can't decide anything. Name what limits it, from a profile or counters, not a guess. List what else it could be measuring (errors, cached or skipped work, noise) and rule each out. Keep the run count and spread with the number.

## Delegation

**Guard the context window.** Large outputs, long files, repeated reads, wide fan-out. Send bulk reading to subagents and keep summaries in the main thread. Cap the scope of each phase.

**Never block on the human.** Tempted to ask "should I do X?" about reversible work. Do it, show the result, and let the user correct course. Irreversible actions still need confirmation. Product direction comes from the user. Execution doesn't wait on them.

## Meta

**Encode lessons in structure.** You catch yourself writing the same instruction a second time. Turn it into a lint, type, test, hook or script instead of more text. If a lesson needs judgment and can't be encoded, make the instruction more prominent and add an example of the failure.
