---
name: correct
description: Find the mistakes agents keep repeating in a repo and make each one impossible, preferring architecture, then types, then lints, then tests, and docs last. Use when the user invokes correct or is tired of correcting the same mistake.
invocation: manual
---

# Correct

The user keeps correcting agents in this repo for the same mistakes. Change the repo so the next agent can't make them.

Assume every contributor is an agent that sees only the files it opened, copies the nearest example and takes the shortest path that compiles. Design the repo so a change that looks right from one file is right for the whole repo.

## 1. Find the mistake classes

Read recent commits, reverts, review comments, the agent instruction file ({{harness:instructionsFile}}) and comments that explain workarounds. Group the mistakes into classes. A class counts once it has happened twice.

## 2. Fix each class at the highest level that works

1. **Architecture.** Give each piece of state one owner and each task one supported way. Hide internals so the wrong import fails. Replace hand-synced lists with one source of truth. Delete old ways and dead code an agent would copy.
2. **Types**, so the bad state can't be written. If bad code still compiles, add a lint or CI check whose error message names the right file, type or function. If the bad pattern is already common, fail only when a change adds more of it.
3. **Tests.** Fix or delete any test that still passes when its behavior breaks, or fails when only internals change.
4. **Docs or agent rules**, last and only for judgment calls. Nothing fails when an agent skips them.

## 3. Fix and prove

Fix the most frequent classes now, one commit each. Prove each new check fails on a real past mistake. Run the same command locally and in CI. An exception goes on the offending line with a reason and an expiry date, and a person approves it.

## 4. Keep the rule table

Keep a table in {{harness:instructionsFile}} that pairs each rule with what enforces it. When the user corrects you, fix the mistake and add the rule. If the rule was already there with nothing enforcing it, that's a repeat, so move it up a level in the same change. Drop a rule once its mistake can't happen.

**Reply:** each class with its evidence, the level you chose, and why a higher level didn't work.
