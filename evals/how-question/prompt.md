---
description: A read-only question about the money fixture. The answer should trace cartTotal through toCents and spot the floating-point floor.
tags: [how]
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Agent, TodoWrite, TaskCreate, TaskGet, TaskList, TaskUpdate]
---

/jstack:how How does cartTotal compute a cart's total, down to the cents? Is there anything on that path that could make a total come out a cent wrong? Don't change any files.
