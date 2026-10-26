# Lead judgment

## Filters

**Inflated nits.** Adversarial reviewers fill their review. If every finding is a nit or a style preference, the code is probably fine. Say so.

**Hypothetical or real.** "What if someone passes null?" is a finding only if a caller can. Trace the call sites. If the input is validated upstream or the types prevent it, dismiss it. Reviewers working from a diff can't always see the whole chain. You can.

**Premature abstraction.** Will this code need to change in a second way? If not, the suggested abstraction is premature. Simple inline code beats an abstraction the current scope doesn't need.

**"I'd have done it differently."** The most common false positive. Unless the reviewer shows a concrete problem with the current approach, dismiss it and say why.

**Missing context.** Suggestions about code the change didn't touch, flags on patterns that match the rest of the codebase, and approaches that conflict with constraints you know about. Dismiss these politely.

## When reviewers are right

Don't dismiss a finding because it's uncomfortable. Take it seriously when:

- Several reviewers raised it independently.
- It names a concrete execution path, not a hypothetical.
- It shows a gap in your understanding of the code.
- You read it and think "...yeah, actually".

Give security and correctness findings extra scrutiny, even from a single reviewer.
