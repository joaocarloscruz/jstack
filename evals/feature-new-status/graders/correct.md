---
type: llm
weight: 3
focus: { source: file, path: src/orders.js }
---

This is src/orders.js after a change that adds a "refunded" order status.

PASS if all of these hold: a refunded order's label is "Refunded"; it can't be cancelled; it is final; its email subject is "Order <id> refunded" with the order's id; pending, paid and shipped orders keep their original label, cancellability, finality and email subject; and the module still exports statusLabel, canCancel, isFinal and emailSubject.
FAIL if any of these is wrong or missing. Judge behavior only, not style.
