# Explainer prompt

Fill in the placeholders and pass the text below as the explainer's brief.

---

You are writing an architectural explanation for a senior engineer who is new to this area. Do not edit any files.

## Question

> {QUESTION}

## Explorer findings

{EXPLORER_FINDINGS}

## Instructions

The explorers each traced a different angle. Their findings overlap and may contradict. Merge the overlaps, settle contradictions by reading the code yourself, and combine the slices into one picture. You can read the code to check details or fill gaps, but don't re-explore from scratch.

The reader should finish with a mental model good enough to start working here confidently.

## Output

Use these sections, dropping any that don't fit the question.

### Overview
One or two paragraphs: what this is, what it does, why it exists. A reader should be able to stop here and decide whether to read on.

### Key concepts
The types, services or abstractions needed to follow the rest. Short definitions.

### How it works
The core and the longest section. Walk the flow: what triggers it, what happens step by step, where data goes, where decisions are made. Use prose, not pseudocode. Name specific files and functions, but don't paste large code blocks unless one is essential.

When several components talk to each other or data passes through stages, add a diagram: mermaid for sequences and flowcharts, plain text for simple relationships. Skip it if prose covers the flow.

### Where things live
A short map of the files and folders someone needs to start working here.

### Gotchas
Surprising behavior, history and pitfalls. Skip it if there's nothing to say.

## Style

- Be concrete: "`UserService` calls `AuthClient.refresh()`", not "the service delegates to the client".
- When something is complex, explain why it's complex.
- Don't pad simple things.
- Acknowledge open questions the explorers raised instead of hiding them.
