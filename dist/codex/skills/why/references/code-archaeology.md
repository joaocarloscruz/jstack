# Code archaeology

Source control is the most trustworthy source, because it's tied directly to the code. It holds commit messages and diffs, PR descriptions and review threads, code comments and TODOs, decision records, tests whose names encode the edge cases that motivated a change, files changed together, changelogs, and ticket IDs.

## History

```bash
git log --follow --oneline -- <file>        # history through renames
git log -S '<exact string>' -- <file>       # commits that added or removed this text
git log -G '<regex>' -- <file>              # same, for a pattern
git blame -L <start>,<end> <file>           # who last wrote each line, and when
git show <hash>                             # one commit in full
gh pr view <number> --comments              # PR description and discussion
```

## Out-of-band docs

```bash
rg -l -i 'architecture decision' --glob '*.md'   # decision records
rg -n -C2 '(TODO|FIXME|HACK|XXX)' <file>          # notes near the target
rg -l '<symbol>' --glob '*test*'                  # tests that exercise it
```
