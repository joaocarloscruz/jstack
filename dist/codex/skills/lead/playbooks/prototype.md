# Prototype

**You own the decision, not the code.** The prototype is throwaway. The real build follows the Feature playbook.

This is the one playbook where speed beats polish. Code quality doesn't matter and there's no upfront planning. The rigor is in choosing the right design cheaply. Propose variations the user didn't ask for, and throw an approach away when it loses.

1. **Name the decision** the prototype exists to make: which layout, which interaction, or, for an empirical question, which behavior or approach. No decision means no prototype, so switch to Feature.
2. **Gather references** when the design space is open. Look for prior art and let the user pick a direction before building. Skip this when the direction is already set.
3. **Build throwaway code in a scratch folder**, apart from production source. For a visual decision, use plain HTML, CSS and JS or the lightest stack that shows the idea. For a behavioral or timing question, write the smallest script that exercises it. No framework, tests or abstractions.
4. **Put alternatives behind one switch** (buttons or a key press), each variant labeled.
5. **Observe the result.** For a visual decision, screenshot each variant and click through it with a browser tool. For a behavioral question, log the timing, print the output, or watch it run. The observation is the test.
6. **Recommend.** Present the alternatives, the tradeoffs and your pick. Hand the chosen direction to Feature, or to `$architect` for its shape.

**Reply:** the variants, the evidence (screenshots, output or timings), the tradeoffs, your recommendation and the scratch path. Say plainly that the prototype is throwaway.
