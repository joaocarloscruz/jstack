# Review rubric

Use the lenses that fit the change.

## Correctness

Does the code do what the intent says?

- Edge cases: empty input, null, boundary values, concurrent access.
- Errors: caught, propagated, or silently swallowed?
- Off-by-one, type coercion, overflow, string encoding.
- State: races, stale closures, dangling references.
- Both the happy path and the failure path.
- Idempotency: what happens if this runs twice, or after a crash halfway?
- Concurrency: if several actors touch the same state, is access controlled by structure (locks, ownership, ordering) or by convention?

Trace the path when you suspect a bug. Show the call chain that makes the value null instead of saying "this could be null".

## Root cause or symptom

Does the change fix the actual problem? Read the callers, callees and types around it to judge.

- A guard that hides a broken invariant.
- A retry that hides a broken contract.
- A cast that silences a modeling error.
- A fix in module A that belongs in module B's contract.
- A comment saying "don't do X" where a type, lint or check could make X impossible.

## Structure

Does the change fit the system?

- Validation at the boundaries, not scattered through business logic.
- High-level orchestration mixed with low-level detail.
- New coupling that will make future changes harder.
- Data structures that don't match how the data is accessed.
- Bolted on rather than integrated: would it look like this if the requirement had been known from the start?
- A new API next to the old one with no plan to remove the old one.

Don't penalize simple code for lacking abstraction. Premature abstraction is worse than duplication.

## Verification

- Tests exist, and they test behavior rather than implementation.
- A bug fix has a test for the bug.
- An integration boundary is tested end to end.
- Checks read the real value, not a proxy like a file timestamp or cached state.
- Delegated or async work verifies actual output, not a self-report.

## Complexity

- Code that could be simpler without losing correctness.
- Abstractions with one call site.
- Configuration for cases that don't exist.
- Dead code, unused imports, leftover parameters.
- Compatibility paths kept after the migration finished.
- Features or options that don't earn their place.

## Security

Trace the input path for each finding.

- User input reaching SQL, shell, eval or HTML without sanitizing.
- Missing authentication or authorization on new endpoints.
- Secrets in code, logs or error messages.
- Time-of-check to time-of-use gaps in security checks.
