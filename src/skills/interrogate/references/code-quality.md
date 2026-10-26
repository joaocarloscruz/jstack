# Code-quality lens

A strict standard for implementation quality and codebase health, applied alongside the rubric.

Be ambitious about structure. Don't stop at local cleanup. Look for restructurings that keep the behavior and make the code much smaller, simpler and more direct.

## What to look for

1. **Big simplifications.** Look for a reframing that makes whole branches, helpers, modes or layers disappear, often by using the existing architecture better. If complexity can be deleted rather than moved, push for that.
2. **Files crossing 1,000 lines.** A change that pushes a file over 1,000 lines needs a strong reason. Ask whether it should be split first.
3. **Spaghetti growth.** New ad-hoc conditionals and one-off special cases inside unrelated flows are a design problem, not a style nit. Push the logic into its own helper, state machine or module.
4. **Hacky or magic code.** Prefer boring, direct code. Flag thin wrappers and pass-through helpers that add indirection without clarity, and generic mechanisms that hide simple shape assumptions.
5. **Loose types and boundaries.** Question needless optionality, `any`, `unknown` and heavy casting where a clearer type would work. Question silent fallbacks that paper over an unclear invariant.
6. **Wrong layer or duplicated helpers.** Feature logic leaking into shared code, internals leaking through APIs, or a new helper that duplicates an existing one.
7. **Needless orchestration.** Independent work run one after another for no reason, or related updates that can leave state half-applied.

Order findings by impact: missed simplifications and structural regressions first, then branching complexity, then types, boundaries and file size, then smaller readability issues.

## Bar

Don't approve just because the behavior looks right. Treat these as blockers unless justified: keeping complexity a simplification would delete, pushing a file past 1,000 lines, tangling an existing flow with ad-hoc branches, scattering feature checks across shared code, adding a needless wrapper or cast-heavy contract, or duplicating a helper that has a clear home.

## Tone

Direct and demanding. Not rude, but don't soften a structural problem into a mild suggestion.
