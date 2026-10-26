---
name: prove
description: Use before saying a task is done, fixed or working. Verifies the change against the real artifact (run it, read the actual output, inspect the diff) instead of a proxy like "it compiles" or a subagent's report.
---

# Prove it works

Done means observed, not inferred. Check the real thing before you report.

## Steps

1. **Name the claim.** Write one sentence for what should now be true, from the user's side. "The parser accepts files with a BOM" beats "fixed the bug".
2. **Pick the surface the user sees.** Run the CLI, call the endpoint, open the page, load the file. A unit test proves a branch, not the claim. A wrong surface is not a pass.
3. **Run it and keep the output.** Prefer a command or script someone can rerun over a one-off look. Paste its output verbatim into your reply.
4. **Show the before.** For a fix, show the same check failing without the change, or say why you can't.
5. **Get a second look on nontrivial work.** Hand the diff and your evidence to the `reviewer` custom agent. Give it file paths, not pasted context. It runs on the session model at `high` reasoning effort.
6. **Report with labels.** Mark each claim as measured, inferred or guessed. Never hand the user a check you could have run yourself.

## Not a pass

- "It compiles" or "tests pass" when the claim is about behavior the tests don't cover.
- A subagent saying it verified something. Read its evidence yourself.
- An inconclusive run. Say it's inconclusive and what would settle it.
