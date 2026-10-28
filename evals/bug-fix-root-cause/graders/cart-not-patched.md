---
type: regex
target: { source: file, path: src/cart.js }
pattern: 'Math\.|toFixed|EPSILON|parseFloat|\+\s*1\b'
match: not_contains
---
