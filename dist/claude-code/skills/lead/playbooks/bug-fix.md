# Bug fix

**You own the fix. Plan, review, verify.** Delegate the investigation and the code to subagents.

Be scientific. Every line you ship traces back to runtime evidence. A change that "might help" is a hypothesis, not a fix, and it doesn't ship. When evidence refutes a hypothesis, revert what it motivated.

1. **Reproduce it yourself** on the surface where the user saw it: run the CLI, call the endpoint, drive the UI with a browser tool. Ask the user to reproduce only when you can name why you can't reach it, and only after getting as far as you can. If it won't reproduce, synthesize the trigger, tighten the conditions, or add logging until it does.
2. **Binary-search the cause.** List the candidate hypotheses. Seed them with `/jstack:how` over the subsystem and `/jstack:why` for regression history. Each round, take the test that rules out the most, get runtime evidence, and eliminate. When state is unclear, instrument and read it as the code runs. Confirm the surviving mechanism with evidence before planning the fix. One symptom can have more than one cause, so keep testing the other hypotheses after the first one is confirmed.
3. **Land the failing check first** when a cheap test exists. Write it, watch it fail for the right reason, and commit it before any fix. This is the one commit allowed to fail on its own (see Opening a PR). `/jstack:tdd` has the cadence. Skip it when the test would be expensive or unclear, and say why.
4. **Fix it.** If the fix crosses a function boundary, run `/jstack:architect` first. Delegate the change to a subagent on `sonnet` at `high` effort with the confirmed causes, the files it may touch, and the failing check as its success criterion.
5. **Verify on the same surface yourself.** Don't take the subagent's report as proof. The original reproduction now passes, and so does the failing check. A unit test shows a branch works, not that the bug is gone. An inconclusive or wrong-surface run is not a pass, so say so.
6. Run **Opening a PR** (`opening-a-pr.md`).

**Reply:** what was broken, the root cause, the fix, and how you verified it. Paste the failing and then passing output as it was printed.
