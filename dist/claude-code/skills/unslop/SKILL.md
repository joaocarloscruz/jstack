---
name: unslop
description: Remove AI writing patterns from prose. Use on replies, PR descriptions, commit messages, docs and skill text, or when the user says "unslop" or that writing sounds like AI.
---

# Unslop

Find the patterns below and rewrite them. Keep the meaning and the intended tone.

Rule numbers are stable ids that other text can cite. A removed rule leaves a gap in the numbering.

## Content

1. **Empty -ing phrases.** "highlighting...", "ensuring...", "showcasing...", "fostering...". Delete them or replace them with the actual fact.
2. **Vague attributions.** "Experts believe", "Some argue". Name the source or delete the claim.

## Language

3. **AI vocabulary.** Additionally, crucial, delve, enhance, foster, garner, interplay, intricate, landscape, pivotal, showcase, tapestry, testament, underscore, vibrant, seamless, robust. Use the plain word.
4. **Fancy ways to say "is".** "serves as", "stands as", "boasts", "features". Say "is" or "has".
5. **"Not just X, but Y."** State the point directly.
6. **Forced threes.** Use the natural number of items.
7. **Synonym cycling.** Pick one name for a thing and repeat it.
8. **False ranges.** "From X to Y" where X and Y aren't on a scale. List the items.

## Style

9. **Dash overuse.** Don't string clauses together with dashes. End the sentence or use a comma.
10. **Colon as a connector.** Colons are fine before a list or an example, not to join two halves of a sentence.
11. **Bold overuse.** Don't bold every name or acronym.
12. **Labels that restate the line.** "**Performance:** Performance improved..." becomes prose. A bold lead-in is fine when the text after it adds new detail.
13. **Title Case Headings.** Use sentence case.
14. **Decorative emoji.** Remove them from headings and bullets.

## Chatbot habits

15. **Chatbot phrases.** "I hope this helps!", "Let me know if...", "Certainly!", "Great question!". Remove them.
16. **Sycophancy.** "You're absolutely right!" Respond to the substance.

## Filler

17. **Filler phrases.** "In order to" becomes "to". "Due to the fact that" becomes "because". Delete "It is important to note that".
18. **Stacked hedges.** "could potentially possibly" becomes "may".
19. **Generic conclusions.** "The future looks bright." State the actual plan or fact, or end.

## Plain speech

20. **Metaphor nouns.** Substrate, wedge, vector, locus, nexus, primitive, surface, bedrock, paradigm, north star, flywheel. Use the concrete word.
21. **Say what it does, not how it feels.** "SQL you can read" says nothing. "`.toSQL()` returns the exact query string" does. If a sentence could appear unchanged in another project's docs, cut it.
22. **Dense sentences.** If the reader has to reread, split it. One idea per sentence.
23. **Passive voice.** "Queries are validated" becomes "the compiler validates queries". Passive is fine when the actor is unknown or doesn't matter.
24. **Adverbs propping up weak verbs.** "Significantly improves" becomes the measured change.
25. **Fancy words.** Utilize and leverage become use. Facilitate becomes help. Numerous becomes many.
26. **Mannered prose.** Aphorisms, personified code ("the plan holds it"), figurative verbs ("rides along"). Say it literally.
27. **Over-compression.** Dropped articles, arrows and abbreviations the reader must decode. "Parser rejects bad date → exit 2" becomes "The parser rejects a bad date and exits with code 2."
