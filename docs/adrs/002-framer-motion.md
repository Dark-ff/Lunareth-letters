# ADR 002: Framer Motion for Animation

**Status:** Accepted
**Date:** Backfilled — written after the fact from observed project context.

## Context

Lunareth's core differentiator is the envelope-opening reading experience (see `PRD.md` §1, `ANIMATION_SYSTEM.md`). This requires smooth, interruptible, gesture-driven animation of multiple coordinated elements (`Envelope`, `PaperReveal`, `LetterRenderer`), all derived from a single progress value, running well on mid-range mobile devices.

## Decision

Use **Framer Motion** as the animation library for the reading experience and any other choreographed transitions in the product.

## Why

- Framer Motion's declarative API (`motion.div`, `animate`, `useMotionValue`/`useTransform`-style patterns) maps naturally onto the "single progress value drives multiple derived visual properties" architecture that `ANIMATION_SYSTEM.md` specifies — it's built for exactly this pattern of deriving several animated properties from one source value.
- It handles gesture-driven, interruptible animation well (a user scrubbing/dragging mid-animation should feel responsive, not locked into a fixed-duration CSS transition) — plain CSS transitions/keyframes are a poor fit for a progress value that can move forward, pause, or (in a future skip flow) jump directly to completion.
- It integrates with React's component model directly, rather than requiring an external timeline library with its own imperative API bolted onto React's declarative one.

## Alternatives Considered

- **Plain CSS transitions/animations:** insufficient for gesture-driven, interruptible, multi-element-coordinated motion without significant custom JS glue — would have pushed the project toward reinventing what Framer Motion already provides.
- **GSAP:** a capable alternative, generally more imperative in style; would work but fits less naturally with React's declarative rendering model and the "props derive from one state value" architecture this project standardized on.
- **React Spring:** a reasonable alternative with a similar physics-based philosophy; Framer Motion was chosen primarily for its broader ecosystem familiarity and gesture-handling ergonomics, not because React Spring is deficient.

## Consequences

- All animation in the reading experience must respect the ownership rules in `ANIMATION_SYSTEM.md` §4 regardless of which Framer Motion primitives are used to implement them — the library choice does not relax the single-writer/pure-derivation architecture.
- Bundle size: Framer Motion is not the smallest possible animation dependency; this tradeoff was accepted given how central animation quality is to the product's core value proposition (see `PRD.md` NFR1).
- Any future animation work (e.g., ambient effects, hover microinteractions elsewhere in the product per `DESIGN.md` §7) should default to Framer Motion rather than introducing a second animation library, to keep the dependency surface and mental model consistent.
