---
type: regex
target: { source: file, path: src/orders.js }
pattern: '//\s*(add|added|new|now\b|changed|updated|handle|refunded status)'
flags: i
match: not_contains
---
