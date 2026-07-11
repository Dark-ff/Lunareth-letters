# Lunareth — Animation System

**Status:** Living document — this is the most important technical document in the repository for anyone touching the reading experience.
**Owner:** Engineering + Design (jointly — this system is where the two disciplines are most tightly coupled)

---

## 0. Why This Document Exists

The envelope-opening reading experience is Lunareth's core differentiator (`PRD.md` §1). It has also been the single most fragile part of the codebase historically — small, well-intentioned changes have previously caused visible regressions (flickering, letters appearing before the envelope finishes opening, double-animations firing). This document exists so that never happens again silently. **Read this in full before modifying `ReadingExperience`, `Envelope`, `PaperReveal`, or `LetterRenderer`.**

## 1. The Core Model

```
                        ReadingExperience
                     (owns extractionProgress)
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
            Envelope       PaperReveal     LetterRenderer
        (progress → Y)   (always mounted,  (renders full letter
                           geometry-only     from frame one;
                           reveal)           visibility = geometry)
                │               │               │
                └───────────────┴───────────────┘
                                │
                    all three are PURE FUNCTIONS
                    of extractionProgress — none
                    of them own or mutate it
```

The entire reading experience is driven by a single number:

```
extractionProgress: number   // 0 → 1
```

- `0` = the letter is fully sealed inside the envelope; nothing is legible.
- `1` = the letter is fully extracted and readable; the envelope has scrolled away and been unmounted.

Every visual aspect of the reading experience — envelope position, paper position, blur amount, whether the envelope is still in the DOM — is a **pure function of this one value**. There is exactly one owner of this value, and exactly one place it's allowed to be set.

## 2. Component Roles

### 2.1 `ReadingExperience`
**Owns** `extractionProgress`. This is the only component in the system that calls the state setter for it. Everything else receives it (or a value derived from it) as a prop.

Responsibilities:
- Initializes `extractionProgress` at `0` on mount.
- Drives its change over time/interaction (scroll, drag, tap-and-hold, or whatever the confirmed interaction model is — verify against the actual implementation before documenting a specific gesture here).
- Passes `extractionProgress` down to `Envelope`, `PaperReveal`, and `LetterRenderer` (directly or via derived values).
- Owns the transition at `extractionProgress === 1`: unmounting `Envelope` entirely once the letter is fully extracted.

Responsibilities it must **not** take on:
- Rendering any part of the envelope, paper, or letter text itself. `ReadingExperience` is an orchestrator, not a renderer.

### 2.2 `Envelope`
**Converts** `extractionProgress` into a `translateY` value and nothing else. Its entire job is: given a progress float, where is the envelope vertically?

- At `extractionProgress === 0`: resting position, idle breathing animation active (a small, slow, looping scale/translate to suggest the envelope is "alive" and waiting, not a static image).
- As `extractionProgress` increases: the envelope sinks (moves further down/away), it does **not** fade. Sinking, not fading, is the specified motion — this preserves the physical metaphor of the letter being drawn *up and out* of an envelope that stays "grounded," rather than the envelope dissolving, which would break the physical illusion.
- At `extractionProgress === 1`: the envelope's job is done. `ReadingExperience` removes it from the DOM entirely — `Envelope` does not decide this itself; it simply stops being rendered once its parent's progress reaches 1. (Continuing the established motion direction: the exit at completion continues upward, out of view, rather than reversing or fading — see Section 4.)

### 2.3 `PaperReveal`
**Always mounted. Deliberately dumb.** `PaperReveal` holds no independent state, no animation timers of its own, no opinion about *why* the paper is where it is. It receives geometry (derived from `extractionProgress`) as props and renders accordingly.

- Handles the paper's blur-to-sharp transition during ascent — blurred while still emerging (associated with lower `extractionProgress`/earlier motion), sharp once fully extracted.
- Handles the paper becoming "the continuous reading surface" — i.e., there is no jarring hand-off between an "extraction" visual and a separate "now read the letter" visual. The same paper surface that emerges from the envelope *is* the surface you read from; it never disappears and gets replaced by a different reading UI.

**Why `PaperReveal` must stay dumb:** the previous architecture (per project history) had reveal logic and state distributed across multiple components, and this was the direct cause of prior animation regressions — two components independently deciding "is the paper visible yet?" could disagree, causing flicker or premature/delayed reveals. Centralizing all of that into a single upstream value (`extractionProgress`) and making every downstream component a pure function of it eliminated an entire category of bugs. See Section 6.

### 2.4 `LetterRenderer`
**Renders the full letter content from frame one.** This is the single most important, and most counter-intuitive, rule in the entire system:

> **Visibility through geometry only. Never opacity. Never programmatic/conditional reveal.**

`LetterRenderer` is not told "don't render the text yet." It always renders the complete letter. What changes as `extractionProgress` increases is *where that rendered content sits relative to the visible viewport/envelope opening* — i.e., it's covered, clipped, or positioned such that it isn't visually accessible yet, not that it doesn't exist or is set to `opacity: 0`.

**Why this matters, concretely:**
- Using `opacity` or conditional rendering to "reveal" the letter creates a seam — a moment where the DOM state and the visual state can desync (e.g., a fast scroll/drag causing the opacity transition to lag behind the geometric motion, or a re-render wiping and re-mounting the text, causing a flash).
- Rendering the full content from frame one means the *only* moving part is geometry (transform/position), which is cheap, GPU-composited, and — critically — cannot "desync" from itself the way two independent state systems (position AND opacity) can.
- This also means the letter's text is present in the DOM (and to screen readers, pending correct ARIA handling) even before the animation completes, which has accessibility implications that should be handled thoughtfully (e.g., `aria-hidden` toggled based on progress, rather than the text being genuinely absent) — see Section 7.

## 2.5 Sequence Diagram — A Single Interaction Tick

This shows the runtime call flow for one interaction event (e.g., one scroll/drag tick) moving the animation forward. Note that data flows in exactly one direction (down) and calls flow in exactly one direction (up) — there is no cross-talk between siblings.

```
 User                ReadingExperience        Envelope    PaperReveal   LetterRenderer
  │                         │                     │            │             │
  │  scroll/drag tick       │                     │            │             │
  ├────────────────────────►│                     │            │             │
  │                         │ setExtractionProgress(next)       │             │
  │                         ├──┐                  │            │             │
  │                         │◄─┘ (state updates)   │            │             │
  │                         │                     │            │             │
  │                         │  props: progress    │            │             │
  │                         ├────────────────────►│            │             │
  │                         │  props: progress-derived geometry │             │
  │                         ├─────────────────────────────────►│             │
  │                         │  props: progress-derived geometry (covering)   │
  │                         ├──────────────────────────────────────────────►│
  │                         │                     │            │             │
  │                         │   re-render (translateY, blur, clip all update simultaneously,
  │                         │   because all three derive from the SAME committed state value)
  │◄─────────────────────────────────── visual frame ──────────────────────────────────┤
```

**Why this matters:** because `Envelope`, `PaperReveal`, and `LetterRenderer` all receive their geometry from the same `extractionProgress` value in the same React commit, they can never visually disagree about "how open" the letter is — there's no window where one has updated and another hasn't. This is the practical payoff of the single-writer/pure-derivation rules in Section 4.

## 3. Animation Timeline

```
extractionProgress:  0 ─────────────────────────────────────────► 1

Envelope:            resting, breathing idle  ──►  sinking  ──►  fully sunk, unmounted
PaperReveal:         paper mostly hidden        ──►  ascending, blurred → sharpening
LetterRenderer:      fully rendered (always)    ──►  progressively uncovered via geometry
```

There is no separate "phase 2" component swap-in. The same three components (`Envelope`, `PaperReveal`, `LetterRenderer`) exist across the entire timeline; only their derived geometric props change as `extractionProgress` moves from 0 to 1.

## 4. Ownership & Transition Rules

1. **Single writer rule:** only `ReadingExperience` may call the setter for `extractionProgress`. If a new interaction needs to affect the animation (e.g., a future "skip" control — see `AppFlow.md` §4), it must do so by calling back up into `ReadingExperience`, never by introducing a second state variable elsewhere that also influences the visuals.
2. **Pure derivation rule:** `Envelope`, `PaperReveal`, and `LetterRenderer` must derive all their visual output from `extractionProgress` (or values passed down that were themselves derived from it) — no independent timers, no local animation state that isn't reset/driven by the parent.
3. **Direction continuity rule:** the exit-at-completion motion (envelope scrolling upward and out) continues the same motion direction already established during ascent — it must not reverse, bounce back, or introduce a new direction. Motion direction is part of the choreography's internal logic and switching it breaks the physical illusion.
4. **Unmount timing rule:** `Envelope` is removed from the DOM only once `extractionProgress === 1`, and only by its parent (`ReadingExperience`) ceasing to render it — never by `Envelope` unmounting itself based on an internal check, which would violate the single-writer/pure-derivation rules above.

## 5. Why Only One `PaperReveal` Exists

There is exactly one `PaperReveal` instance per reading experience, always mounted for the full lifetime of `ReadingExperience`. This is deliberate, for two reasons:

1. **State continuity.** If `PaperReveal` were conditionally mounted/unmounted at some threshold, any internal animation state (even transient, like a CSS transition mid-flight) would reset on remount, causing a visible stutter. Keeping it permanently mounted and purely prop-driven avoids this entirely.
2. **Single source of "the paper."** If a second `PaperReveal`-like component were ever introduced (e.g., a naive attempt to show "the paper" differently before vs. after some threshold), the system would regain the exact two-components-with-an-opinion problem that caused prior regressions (Section 2.3). There must only ever be one component responsible for paper geometry.

## 6. Why Only One `LetterRenderer` Exists

Same underlying reasoning as `PaperReveal`, with an additional, more severe risk: if a second `LetterRenderer`-like instance were introduced (for example, a "preview" render shown during extraction and then swapped for a "final" render once complete), the content could diverge between the two — different line-wrapping, different scroll position, a visible re-flow at the swap point. A single, always-mounted `LetterRenderer`, visible-by-geometry only, guarantees the reader is looking at the *same* rendered instance of the letter throughout the entire experience, with zero risk of a swap-induced visual discontinuity.

## 7. Known Pitfalls

- **Reaching for `opacity` "just for this one small case."** This is the single most common way this system regresses. Any PR introducing an opacity-based reveal/hide anywhere in this component tree should be treated as a correctness bug, not a style nitpick — flag it in review even if it "looks fine" in the specific case tested.
- **Introducing a second progress-like variable.** E.g., a component adding its own `localOpenAmount` state "just to smooth things out." This reintroduces the two-sources-of-truth problem this architecture was specifically built to eliminate.
- **Conditionally rendering `LetterRenderer`'s content** (e.g., `{extractionProgress > 0.5 && <LetterBody />}`) instead of always rendering and covering/positioning it. This breaks the "visibility through geometry" rule even if it happens to look correct in the tested case — it is not correct in principle and will regress under different letter lengths, different viewport sizes, or fast interaction.
- **Accessibility gap:** because `LetterRenderer` always renders its content, screen readers may announce the letter text before it's "supposed" to be revealed, unless `aria-hidden`/focus management is explicitly tied to `extractionProgress` crossing a completion threshold. This is a real, currently-open gap — track it in `ROADMAP.md` rather than assuming it's handled by default.
- **Reduced-motion users:** the whole system assumes a continuous, scrubbing-style progress value. A `prefers-reduced-motion` mode should jump `extractionProgress` to `1` quickly (a fast, simple transition) rather than disabling the animation in a way that leaves `Envelope` stuck rendering a mid-transition frame.

## 8. Lessons Learned From Previous Animation Regressions

(Documented from prior project context — verify against actual git history/PRs if available, and update this section with specifics once concrete incidents can be cited.)

- Distributing "is it visible yet" logic across more than one component was the root cause of prior flicker/desync bugs. The fix was centralizing all of it into the single `extractionProgress` value and making every downstream component a pure function of it — this is not a stylistic preference, it's a bug-fix-derived architectural constraint.
- Using opacity transitions for the paper/letter reveal previously caused visible seams under fast interaction (e.g., a quick scroll gesture outrunning a CSS transition). Switching to geometry-only visibility resolved this class of bug entirely.
- Conflating the envelope's exit animation with a generic "fade out" previously broke the physical illusion of the letter being drawn upward — re-specifying it as "sinks, doesn't fade" and "continues the established motion direction on exit" fixed the perceptual issue.

## 9. How Future Developers Should Extend the System

**Safe extensions** (consistent with the architecture):
- Adding a new derived visual effect that's a pure function of `extractionProgress` (e.g., a subtle ambient light change as the letter emerges) — add it as a new derived prop, computed from the existing value, passed to whichever component needs it.
- Adding a skip/instant-complete control, implemented by having it call into `ReadingExperience`'s existing setter to jump `extractionProgress` to `1` — see `AppFlow.md` §4 for the full specification.
- Adding reduced-motion handling by having `ReadingExperience` choose a different transition *rate* toward `extractionProgress = 1`, without introducing new state elsewhere.

**Unsafe extensions** (will reintroduce past bugs):
- Any new component in this tree that maintains its own visibility/progress state independent of `extractionProgress`.
- Any reveal implemented via opacity, `display`, or conditional rendering rather than geometric position/clipping.
- Splitting `PaperReveal` or `LetterRenderer` into "before" and "after" variants.

If a proposed feature seems to require breaking one of these rules, that's a signal to bring the design back to `ReadingExperience`'s orchestration model rather than working around it locally — the fix is almost always "derive this from `extractionProgress` differently," not "add a new independent state."
