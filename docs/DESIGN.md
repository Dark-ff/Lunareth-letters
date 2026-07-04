# Lunareth — Design Handbook

**Status:** Living document
**Owner:** Design
**Companion documents:** `ANIMATION_SYSTEM.md`, `COMPONENT_GUIDE.md`

---

## 1. Design Philosophy

Lunareth's design job is to make an ordinary act — typing text into a box — feel like an act of care. Every design decision should be evaluated against one question: **does this make the letter feel more like a letter, or more like a form?**

The product borrows its visual vocabulary from physical correspondence — paper, ink, wax, moonlight, handwriting — but the execution should read as considered and contemporary (closer to Linear, Notion, Raycast, and Apple's own restraint) rather than literal skeuomorphism. Texture and metaphor are used deliberately and sparingly, in the places that carry the most emotional weight (the featured/opening letter surface, the protection badge), not smeared across every surface.

## 2. Brand Personality

If Lunareth were a person, they would be: quiet, warm, precise, a little old-fashioned but not costume-y, more interested in what you're trying to say than in impressing you with how the app looks. The brand is calm confidence, not maximalist spectacle. Confidence shows up as restraint: one considered accent color, one deliberate animated moment, one signature material metaphor per surface — not five competing ones.

## 3. Typography

Lunareth uses typography as the primary carrier of each theme's personality — not merely a stylistic detail.

| Theme | Display/body font | Personality |
|---|---|---|
| Moonlit | Georgia | Literary, gentle serif warmth — the "default" emotional register |
| Old Paper | Palatino | Classical, archival, formal correspondence |
| Dark Aesthetic | Courier New | Typewriter, confessional, unpolished honesty |
| Minimal | Inter | Clean, contemporary, gets out of the way of the words |

Outside the four reading themes, general product UI (navigation, `My Letters`, dashboards) should use a restrained pairing: a serif display face (Georgia, matching the Moonlit default) for headlines and letter titles, and a clean sans body face (Inter or system default) for UI chrome, labels, and metadata. This creates continuity between "the app" and "the letter" without making every UI element look like a letter itself.

**Rule:** never introduce a fifth typeface into a theme's rendering path. Themes are meant to feel finite and intentional, not like an open-ended font picker.

## 4. Color Palette

Lunareth's core brand accent, carried over from the existing product, is a soft lavender/moonlight tone:

| Token | Hex | Usage |
|---|---|---|
| `moonlight` (primary accent) | `#b8a2ff` | Links, primary buttons, focus rings, eyebrows/labels |
| `moonlight-soft` | `#d6ccff` | Secondary text on dark surfaces, supporting copy |
| `void` (background) | near-black, e.g. `#07060c` | Base app background outside the reading experience |
| `parchment` | warm ivory/tan (e.g. `#e9e2d0`–`#dfd3b6` range) | Featured/paper-surfaced letter treatments |
| `seal` (wax-seal accent) | deep crimson (e.g. `#b8452e`–`#7a2318` range) | Password-protection indicators exclusively — this color should not be reused for generic destructive actions (delete uses a separate red) so that "protected" and "dangerous" remain visually distinct concepts |

Per-theme reading colors (Moonlit, Old Paper, Dark Aesthetic, Minimal) are a separate token set scoped to the reading experience and should not bleed into general product chrome — see `letterConfig.js` as the intended single source of truth for theme tokens (per `TRD.md` §17).

**Rule:** Lunareth uses accent color sparingly. A screen with more than one saturated accent competing for attention (beyond the lavender primary and, where relevant, the wax-seal crimson) should be treated as a design defect, not a stylistic choice.

## 5. Shadows

Shadows in Lunareth do two different jobs and should not be conflated:
1. **Ambient depth** (glass panels, cards) — soft, low-opacity, large-radius shadows/glows, often colored with the lavender accent rather than pure black, to keep the dark UI feeling atmospheric rather than heavy.
2. **Material weight** (the featured/paper letter surface) — a more grounded, warmer shadow that suggests an actual object resting on a surface, distinct from the ambient glow used elsewhere.

Avoid sharp, high-contrast drop shadows generally — they read as generic UI-kit default rather than considered.

## 6. Radius

Lunareth favors generous, soft radii (24–32px on cards, fully rounded/pill shapes on buttons and badges) over sharp corners. Sharp, zero-radius UI would read as the "broadsheet/newspaper" aesthetic, which is not Lunareth's register (see `frontend-design` guidance on default AI aesthetics to avoid). Radius should scale with element size — a full-width featured card can afford a larger radius (28–32px) than a small pill badge (fully rounded).

## 7. Motion

See `ANIMATION_SYSTEM.md` for the full architecture of the reading experience specifically. General motion principles for the rest of the product:

- Transitions are quick (200–400ms) and use easing that decelerates into rest (never linear, never bouncy/elastic outside of genuinely playful, low-stakes UI moments).
- Hover states should feel like the element is responding to attention, not performing — subtle lift (translateY of a few pixels), a border or glow intensity change, not scale-and-rotate theatrics.
- Motion should never be the only signal of a state change — always pair with a non-motion cue (color, text, icon) for accessibility and for users with `prefers-reduced-motion` set.

## 8. Layout

- Primary content max-width: roughly `max-w-6xl`–`max-w-7xl`, centered, with generous horizontal padding on mobile.
- Vertical rhythm favors generous whitespace between sections (12–16 spacing units) over dense stacking — Lunareth's pacing should feel unhurried, matching the product's philosophy.
- The reading experience is the one place layout should feel different from the rest of the app — full-bleed, no navigation chrome, the letter as the only object in the frame.

## 9. Cards

Two distinct card languages exist and should not be merged:
1. **Archive cards** (dark surface, e.g. `My Letters` grid) — translucent dark panels (`bg-white/[0.03]`–`[0.06]`), hairline borders, hover state brightens border and background slightly and lifts the card a few pixels.
2. **Featured/paper cards** — warm parchment gradient background, subtle grain texture (achievable via a layered SVG noise data-URI, no image asset required), serif typography, and a grounded (not glowing) shadow — this is the one place skeuomorphism is intentional and welcome.

## 10. Buttons

- **Primary action:** solid lavender pill (`bg-[#b8a2ff]`), dark text for contrast, glow-on-hover rather than a color change — reinforces the "moonlight" motif.
- **Secondary action:** outlined pill, transparent background, inverts to solid white/black on hover.
- **Destructive action:** red, used sparingly, ideally de-emphasized (icon-only, revealed on hover) so it never visually competes with the primary action on the same card — see the `MyLetters` redesign for the applied pattern.
- All buttons: visible focus ring (`focus:ring-2`) — never suppressed, even when it slightly disrupts the visual purity of a screenshot. Accessibility is not optional polish.

## 11. Inputs

- Inputs use the same dark-glass surface language as cards (`bg-white/5`, hairline border), rounded generously (`rounded-2xl`), with a lavender focus border, never a harsh browser-default outline.
- Error states use a distinct red border plus adjacent inline text — never color alone (see Accessibility, Section 14).

## 12. Icons

Lunareth currently uses inline SVG icons rather than an icon library dependency (see `TRD.md` §1). This should remain the default unless a genuine need for a large, consistent icon set emerges — inline SVGs keep the bundle lean and let icon strokes match the product's specific line weight rather than an off-the-shelf library's default. Icon strokes should be consistently 1.5px-ish weight, rounded line caps/joins, no filled icons except where a filled state communicates something specific (e.g., a lock literally "closed").

## 13. Empty States

Empty states are a moment of invitation, not just an absence notice (see `frontend-design` writing guidance and `PRD.md` UX Philosophy). A Lunareth empty state should:
- Never simply say "No letters yet."
- Include a warm, on-brand icon (e.g., a feather/quill) rather than a generic illustration.
- End with a clear, single call to action that begins the creation flow.

## 14. Accessibility

- Color is never the only signal — pair with icon, text, or shape.
- Focus states are always visible.
- The reading experience must respect `prefers-reduced-motion`, offering a substantially shortened or instant reveal (see `TRD.md` §11; currently an open item, tracked in `ROADMAP.md`).
- Text contrast: on the near-black backgrounds, body copy should stay near-white/light-lavender (`#e2e1ed`-ish range) rather than dropping to low-contrast grays for anything load-bearing; metadata/labels can go dimmer, but primary reading content cannot.

## 15. Responsive Design

- Mobile is not an afterthought — recipients frequently open shared letter links on mobile with zero warning (see `PRD.md` persona notes). The reading experience must be tuned and tested on mobile first, not scaled down from desktop.
- Grids (e.g., `My Letters` archive) collapse to a single column below `md`; featured/hero cards remain full-width at all sizes but adjust internal padding down.
- Touch targets (buttons, delete icons) must remain comfortably tappable (44px-ish minimum) even when visually de-emphasized (e.g., hover-revealed delete icons need a non-hover-dependent way to appear/be reachable on touch devices — a real gap to solve: hover-only reveal patterns do not work on touch, so touch layouts should show these controls at reduced opacity by default rather than fully hidden).

## 16. Inspiration Sources

Lunareth borrows layout and interaction discipline (not literal visual style) from Linear, Notion, Raycast, and Apple's first-party apps — restraint, confident typography, purposeful motion. It borrows its material metaphor (paper, wax, ink) from physical correspondence, not from any specific competitor product. When exploring new UI directions, resist defaulting to generic "premium SaaS dashboard" tropes (bento grids, glassmorphism, gradient-everything) unless they're being used in service of a specific piece of Lunareth's own content — decoration for its own sake works against the brand's restraint.

## 17. UI Principles (Quick Reference)

1. One accent color doing the work, not several fighting for attention.
2. Skeuomorphism is reserved for the one or two surfaces where it's the point (the letter itself); everywhere else, restraint.
3. Motion communicates meaning (progress, response to input) — never decoration alone.
4. Every screen should be legible and appropriate to someone with zero prior context (the Recipient persona is the hardest one to design for, and the best test case).
5. Accessibility constraints (focus, contrast, motion preference, non-color signaling) are non-negotiable, not the last 10% to be cut under deadline pressure.
