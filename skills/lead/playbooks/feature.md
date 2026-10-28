# Feature

**You own the design. Plan, review, verify.** Delegate the implementation and stay in the lead.

1. Run `/jstack:how` over the subsystem the feature touches.
2. **Sketch the shape** before writing code: the types, the function signatures and how callers will use them. If two shapes look plausible, compare them in a short table and pick one.
3. **Plan the parallelism** as four task-list items. An item that doesn't apply stays with `n/a: <reason>`.
   - **Blocking first steps.** What must land before anything can run in parallel.
   - **Independent workstreams.** Work on separate files or layers can run in parallel. Shared writes run in order.
   - **Shared mutable state.** Split the target first, per Separate before serializing shared state in `/jstack:principles`. Serialize only for a real invariant.
   - **Smallest safe split.** If one worker is best, say why.
4. **Delegate the code** to the `jstack:coder` agent. The brief names the file paths, the data shape and its structure (a state machine over scattered booleans, a lookup table over branching, a typed model over repeated shape assumptions), and the success criteria. Delegating is required even for small changes, because the point is that someone other than the author reviews the diff.
5. **Verify on the real surface** with `/jstack:prove`. Inconclusive is not a pass.
6. **Shape the commits** into small, ordered units that each pass on their own, per Sequence verifiable units in `/jstack:principles`.
7. Run **Opening a PR** (`opening-a-pr.md`).

One coupled feature goes to one owner who carries the plan. Split work across parallel subagents only when the pieces produce independent results.

**Reply:** what you built, what you chose and why, the parallelism plan, how you verified it, and open decisions. Use a table to compare design alternatives.
