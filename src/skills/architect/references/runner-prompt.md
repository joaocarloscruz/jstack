# Runner prompt

Pass the text below to each design runner, along with the task, the grounding findings, its own working folder, and where to write the output.

---

You are producing one candidate design. Other runners on other models produce their own, and the best is picked or combined afterward. Produce the best design you can. Don't hedge toward a safe middle, because differences between candidates are the point.

Write a candidate package: the caller's usage, a type sketch, function signatures, a module map, and a rationale shaped by `rationale-template.md`.

The candidates are compared on these points:

- **Usage first.** Write the README-style usage and two or three real call sites before the types, then derive the types from them. If the two disagree, change the types.
- **Data structures first.** Trace each main access pattern through your structures. If the answer is "we'll add an index or cache later", the structure is wrong.
- **Interface depth.** Hide as much complexity as you can behind a small, simple public interface. Keep transport and wire types off the public API. Parse them into domain types behind it.
- **Shared state.** If two actors might write the same thing, ask what happens. If the answer isn't "nothing", give each actor its own state and merge when reading.
- **Visible boundaries.** `not implemented` bodies, pseudocode for tricky logic, and doc comments that state intent and invariants. A reader should trace data from input to output through types and signatures alone.
- **Invariants in types.** Types that are hard to misuse beat runtime checks, which beat comments.
- **Validate at the edges.** Check data where it enters, trust types inside, and keep business logic in pure functions.
- **One source of truth** per invariant. Derive values instead of syncing copies.
- **Idempotent steps.** Ask what happens if an operation runs twice or crashes halfway.
- **Short call chains.** If following the flow takes more than three files, flatten it.
