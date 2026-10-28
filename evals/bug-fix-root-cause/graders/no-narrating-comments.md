---
type: regex
target: { source: file, path: src/money.js }
pattern: '//\s*(fix|fixed|changed|updated|now\b|was\b|bug|use math|round instead)'
flags: i
match: not_contains
---
