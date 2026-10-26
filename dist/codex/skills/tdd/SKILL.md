---
name: tdd
description: Write a failing regression test before fixing a bug. Use when the user asks for TDD, a failing test or a regression test, or when the bug has an obvious, cheap local test. Skip when the test would be expensive, integration-heavy or unclear.
---

# TDD bug fix

When a bug has a clear, cheap test path, make the broken behavior executable before changing production code. The goal is one focused test that fails before the fix and passes after.

Don't force a test when it's impractical. If it would need broad harness setup, brittle mocks, slow end-to-end infrastructure, production-only state, vague reproduction steps or a lot of unrelated fixture churn, skip it and use the closest useful check instead.

## Steps

1. **Understand the bug.** Name the intended behavior, the current behavior, the code path and the smallest reproduction.
2. **Pick the narrowest check.** Use the closest existing unit, component or integration test for that path. If no practical test path is obvious, don't build one from scratch.
3. **Write the failing test.** The smallest test that would have caught the bug. It encodes intended behavior, not the current implementation.
4. **Run it before fixing.** Confirm it fails for the right reason. If it passes, or fails for another reason, fix the test first.
5. **Fix the bug** with the smallest change that gives the intended behavior and keeps nearby contracts.
6. **Rerun the test** and confirm it passes.

## When a test is impractical

Use the closest executable check: a targeted script, a reproduction command, a browser run, a snapshot comparison or a log assertion.

No new test beats a bad one. A bad test mostly tests mocks, pins implementation details, depends on timing or global state, needs expensive setup for a small fix, or would be deleted right after.

## Guardrails

- Don't change a test to match a wrong implementation.
- Don't weaken existing assertions unless the expected behavior really changed and you can say why.
- Keep the test focused on the bug.
- For a flaky bug, make the test deterministic where you can, and say what signal it locks down.
- If the bug points to a whole class of failures, land the focused test first, then consider more coverage.

## Reply

- The test or check that failed before, and how it failed.
- The run that passes after, plus any nearby checks.
- If you couldn't show a failure before the fix, why not, and what you used instead.
