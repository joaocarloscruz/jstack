# Refactoring

**You own the contract. The structure changes. The behavior doesn't.**

If the cleanup reveals a missing feature or a real bug, split it out. Ship the structural change first, against the pinned behavior. A redesign is allowed, but call it one and switch to the Feature playbook. Large or cross-cutting structural work goes to `/jstack:figure-it-out`.

1. **Pin the behavior first.** Run `/jstack:how` to learn the contract. Then write a characterization test, snapshot, or comparison script that captures current behavior before anything moves. Type checks and lint are not a pin.
2. **Name the structure the code is missing**, per Model the domain in `/jstack:principles`. The reshape must delete branches or invalid states, not add indirection. Leave boring code alone when its shape is already clear and local.
3. **Name the target shape.** Describe the module layout, types and call graph you'd build today. If the target crosses a function boundary, run `/jstack:architect` first.
4. **Subtract first.** Delete dead code, collapse one-caller wrappers and remove redundant checks before adding the new shape. The smallest change that reaches the target ships.
5. **Move in small steps** that keep the pin green. For an internal API reshape, move every caller and delete the old API in the same change, with no compatibility shims. If code outside this repo calls the API (a published library, a public endpoint), keep the old API working and ask the user how to deprecate it. Check every rename against the files, because renames miss uses in strings, docs and comments. Delegate mechanical edits to a subagent on `haiku` at `low` effort with the names being moved and the behavior to hold.
6. **Prove behavior is unchanged** on the real artifact with `/jstack:prove`. For larger reshapes, diff the old and new outputs with a script or replay a recorded baseline.
7. **Check it was worth it.** The measure is lower reader load, per Minimize reader load in `/jstack:principles`. If the diff doesn't make the code easier to follow somewhere, revert it.
8. Order the commits: the subtraction, then the reshape, then any follow-up cleanup. Run **Opening a PR** (`opening-a-pr.md`).

**Reply:** the structure that changed, the pin it was held against, the proof of equal behavior, what got easier to read, and what was reverted.
