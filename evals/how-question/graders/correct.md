---
type: llm
weight: 3
---

The question was how cartTotal in src/cart.js computes a total, and whether anything could make it a cent wrong.

PASS if the answer traces cartTotal through toCents and formatCents in src/money.js, and identifies that toCents uses Math.floor on amount * 100, so a price like 19.99 (which is 1998.999... in floating point) loses a cent.
FAIL if it misses the Math.floor problem, blames the wrong function, or is mostly guesswork without naming the files.
