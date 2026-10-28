---
description: A rounding bug in a shared helper. The root-cause fix is one line in money.js; patching cart.js only hides it from one caller.
tags: [lead]
max_turns: 50
timeout_seconds: 1200
allowed_tools: [Read, Glob, Grep, Skill, Agent, TodoWrite, TaskCreate, TaskGet, TaskList, TaskUpdate]
---

/jstack:lead Customers say the cart shows $19.98 for a single $19.99 item. test/cart.test.js is the failing test. Fix it.

This environment has no shell, so nobody can run commands or tests, and there's nobody to ask. Read the code, make the fix, and verify by reading.
