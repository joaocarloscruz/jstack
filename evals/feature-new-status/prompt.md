---
description: Add an order status to a small module that branches on status in four functions.
tags: [lead]
max_turns: 50
timeout_seconds: 1200
allowed_tools: [Read, Glob, Grep, Skill, Agent, TodoWrite, TaskCreate, TaskGet, TaskList, TaskUpdate]
---

/jstack:lead Add a "refunded" order status in src/orders.js. A refunded order is labeled "Refunded", can't be cancelled, is final, and gets the email subject "Order <id> refunded".

This environment has no shell, so nobody can run commands or tests, and there's nobody to ask. Read the code, make the change, and verify by reading.
