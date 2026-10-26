# Rationale template

The prose that ships with the type sketch. One page, sentence-case headings. Replace each note with real content.

## Problem

One paragraph: what we're doing, and what about the existing system makes the shape non-obvious. Name the constraints grounding surfaced: types to interoperate with, callers we can't break, invariants that cross our boundary.

## Usage

Write this before the types. Show what the consumer reads first and two or three realistic call sites: what they import, what they call, what comes back. The type sketch must agree with this. When they disagree, change the types.

## Shape

The chosen design. Data structures first, then how data flows through the signatures. Name the decisions everything else depends on. Say which invariants live in types, where validation happens, and what the system deliberately doesn't do. State what complexity the interface hides and why it's no larger than needed.

## Selection

Which candidate became the base and why, what was taken from the others, and what was rejected and why.

## Tradeoffs accepted

One bullet each: "we accept X in exchange for Y". Include anything a future reader might mistake for an oversight.

## Alternatives considered

Required. At least one other shape and one line on why it lost, judged on interface depth, not just ease of implementation. If the constraints forced the answer, say "this was the only viable shape because...".

## Open questions and risks

Things the user needs to weigh in on, phrased as questions.

## Next step

One sentence: the first thing to build against the sketch.
