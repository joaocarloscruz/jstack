# Explorer prompt

Fill in the placeholders and pass the text below as the explorer's brief.

---

Other explorers are tracing different slices of the same subsystem in parallel. Don't try to cover everything. Go deep on your angle. Do not edit any files.

## Question

> {QUESTION}

## Your angle

{ANGLE}

## Output

### Components found
The key types, services and modules. For each: name, file path, and one sentence on what it does.

### Flow
The execution flow, step by step. For each step: the function that runs, its file, what it does and what it calls next. Include the data passed between steps.

### Files read
Every file you read, so the explainer can cite them.

### Boundaries
Where this slice connects to the rest of the codebase: its inputs and outputs.

### Non-obvious things
Anything surprising, historical, or easy to get wrong.

### Open questions
Anything you couldn't trace. Be honest about gaps.
