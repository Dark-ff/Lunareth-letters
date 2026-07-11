# ADR 005: Single-Progress-Value Animation Architecture for the Reading Experience

**Status:** Accepted
**Date:** Backfilled — written after the fact, informed by documented prior regressions.

## Context

Early implementations of the envelope-opening reading experience distributed "is this visible yet" logic across multiple components, each with some independent opinion about state. This produced real, shipped regressions: flicker, letters appearing before the envelope finished opening, and visual desync under fast user interaction (see `ANIMATION_SYSTEM.md` §8 for the specific failure modes as best as they can be reconstructed from prior project context).

## Decision

Centralize the entire reading experience's visual state into a single value, `extractionProgress` (0→1), owned exclusively by `ReadingExperience`. Every other component in the tree (`Envelope`, `PaperReveal`, `LetterRenderer`) must be a **pure function** of this value — no independent state, no opacity-based or conditionally-rendered visibility, geometry only.

## Why

- A single source of truth eliminates, by construction, the entire class of bug where two components disagree about the current animation state — there is no longer a "state A" and "state B" that can desync, because there is only ever one state.
- Geometry-based visibility (position/clipping) rather than opacity or conditional rendering means the DOM tree doesn't change shape as the animation progresses — nothing mounts, unmounts, or fades independently, which removes an entire category of race condition between React's render commits and CSS transition timing.
- This architecture is *simpler to reason about*, not just more correct: any future contributor asking "why does the paper look like X at progress 0.6" has exactly one place to look (the derivation logic), not three components' worth of independent state to cross-reference.

## Consequences

- **This is a hard constraint, not a style preference.** Any future PR that reaches for opacity-based reveal, conditional rendering of letter content, or a second progress-like state variable anywhere in this component tree should be treated as reintroducing a known, previously-shipped bug class — see `ANIMATION_SYSTEM.md` §7 "Known Pitfalls" and §9 "How Future Developers Should Extend the System," and `CONTRIBUTING.md` §6 PR checklist, which explicitly requires reviewers to check for this.
- New reading-experience features (skip control, reduced-motion handling, future ambient effects) must be implemented as new ways of *setting or deriving from* `extractionProgress`, never as new, independent state living alongside it.
- Accessibility handling (e.g., `aria-hidden` on not-yet-revealed letter text) must also be derived from `extractionProgress` crossing a threshold, rather than implemented as separate DOM presence logic — otherwise the same class of desync risk reappears at the accessibility layer even if the visual layer stays correct.

## Alternatives Considered

- **A finite-state machine with named states** (`sealed`, `opening`, `open`) instead of a continuous float: considered, but rejected for this use case because the interaction is fundamentally continuous/gestural (a drag or scroll), not a series of discrete, named steps — a continuous 0→1 value maps far more naturally onto "how far through the gesture is the user" than a small set of named states would, and avoids awkward interpolation *between* named states for smooth animation.
- **Independent local animation state per component, synchronized via a shared context or event bus:** this is close to what caused the original regressions and was explicitly rejected in favor of true single-ownership.
