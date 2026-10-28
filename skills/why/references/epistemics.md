# Epistemics

Code shows what it does, not why it exists. The why lives in commits, PRs, tickets, docs and conversations, all of them incomplete and sometimes contradictory. Report confidence honestly instead of flattening it into false certainty.

## Confidence tiers

Every claim sits in one tier. The tier decides its section and its phrasing.

1. **Direct.** Someone wrote down why: a PR description, a ticket, a code comment, a design doc, a chat message from the author. Phrase it plainly and cite it: "This exists because X [source]."
2. **Supported.** Several indirect items point the same way, but none states it. Phrase it as derived and cite each item: "The evidence points strongly to X: [items]."
3. **Inferred.** A reasonable reading of context that nothing states. Hedge it and show the chain: "Given A and B, C seems likely because D."
4. **Speculative.** A plausible guess on thin evidence, where other explanations fit as well. Mark it as a guess: "One possibility is X, but we found no direct evidence." It usually belongs under Competing hypotheses.
5. **Unknown.** You looked and couldn't find out. Say exactly what you searched: "We searched the tracker for A and B, read the 6 PRs that touched this file since 2023, and grepped for the threshold value. None gave a reason."

## Phrasing

Words that claim certainty need a citation right next to them, and never go on an inference: "because", "the reason is", "was designed to", "fixes", "the team decided".

Hedges mark interpretation: "appears to", "likely", "suggests", "is consistent with", "may have been".

Avoid "obviously", "clearly", "of course", "just", and "I think". You're reporting evidence, not opinion.

## Traps

- **Rationalizing.** Code that makes sense today may have been written for reasons that no longer apply, or were wrong. Don't retrofit a clean story onto messy history. Consistency may be copy-paste, not intent. Absence of evidence is not evidence of absence.
- **Confirming the user's guess.** "Why do we do this, I assume for performance?" The guess is one hypothesis to test, not a conclusion. Check it independently.
- **Picking a side.** When sources contradict, show both with citations and let the user decide.
- **Filling gaps.** An honest "we don't know" is valuable. A confident guess in its place harms the user, because they'll act on it.

## Before finalizing

Every claim in What we found has a citation, or it moves down a tier. Phrasing matches the tier. No claim uses code as evidence for its own intent. The What we don't know section exists. If it's empty, be suspicious.
