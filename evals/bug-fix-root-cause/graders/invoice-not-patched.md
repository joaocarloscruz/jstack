---
type: regex
target: { source: file, path: src/invoice.js }
pattern: 'Math\.|toFixed|EPSILON|parseFloat|\+\s*1\b'
match: not_contains
---
