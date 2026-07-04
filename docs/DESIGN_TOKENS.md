# Lunareth — Design Tokens

**Status:** Living document
**Owner:** Design + Engineering
**Companion documents:** `DESIGN.md` (rationale and usage principles), `ARCHITECTURE.md` §11 (theme registry ownership rules)

---

## 0. How to Read This Document

Tokens here are organized into three confidence tiers, and it matters which tier a value is in before you use it in code:

- **Confirmed** — directly observed in shipped production code (`MyLetters.jsx` as originally written, before the visual redesign).
- **Proposed** — introduced in the recent `MyLetters.jsx` visual redesign deliverable or in `DESIGN.md`'s design language, but not yet verified as merged into the live codebase. Treat these as a strong recommendation, not an established fact, until confirmed.
- **Future / Needs Definition** — required by the architecture (e.g., per-theme tokens for Moonlit/Old Paper/Dark Aesthetic/Minimal) but not yet formally specified anywhere, including in this document. Exact hex/font values for the four reading themes fall here — only the *font family per theme* is confirmed via prior project context; specific color tokens for each theme have not been observed in any inspected source.

Do not upgrade a token's tier in this document without actually verifying it against source — see `CONTRIBUTING.md` §8.

---

## 1. Color Tokens

### 1.1 Confirmed (observed in `MyLetters.jsx` prior to the visual redesign)

| Token | Value | Usage |
|---|---|---|
| Accent / primary | `#b8a2ff` | Links, primary borders, focus rings, eyebrow labels |
| Accent secondary text | `#d6ccff` | Supporting copy on dark surfaces |
| Background | `#000000` (`bg-black`) | Page background |
| Surface | `white / 5%` (`bg-white/5`) | Card backgrounds |
| Text primary | `#ffffff` (`text-white`) | Primary text on dark background |
| Text muted | Tailwind `zinc-400` / `zinc-500` | Secondary metadata (dates, recipient lines) |
| Destructive | Tailwind `red-400` (borders/fills), `red-200`/`red-300` (text) | Delete actions, delete error messaging |
| Modal surface | `#09090f` | Delete confirmation modal background |

### 1.2 Proposed (introduced in the `MyLetters.jsx` redesign / `DESIGN.md`)

| Token | Value (approximate) | Usage |
|---|---|---|
| `void` (ambient background) | `#07060c` | Deepened page background with ambient glow blobs |
| `parchment` gradient | `#efe8d8` → `#dfd3b6` | Featured/paper-surfaced letter card |
| `seal` (wax-seal accent) | `#c1594a` → `#7a2318` gradient | Password-protection indicators exclusively — never reused for generic destructive UI (`DESIGN.md` §4) |
| Ink on parchment | `#241f19` / `#2a241d` | Text rendered on the parchment surface |

**Confirm before relying on these:** these values exist in the redesign artifact delivered for `MyLetters.jsx`; verify they were actually merged into the live component before treating this table as ground truth for the running app.

### 1.3 Future / Needs Definition

Per-theme color tokens for the four reading themes are **not yet formally specified anywhere**. Only the font-family assignment per theme is confirmed via prior project context:

| Theme | Font (confirmed) | Color tokens |
|---|---|---|
| Moonlit | Georgia | Needs Definition |
| Old Paper | Palatino | Needs Definition |
| Dark Aesthetic | Courier New | Needs Definition |
| Minimal | Inter | Needs Definition |

These should be defined in `lib/letterConfig.js` (the intended theme registry per `ARCHITECTURE.md` §11) and mirrored here once they exist, so this document stays the canonical cross-reference rather than a second, possibly-drifting copy.

---

## 2. Typography Scale

### 2.1 Confirmed

Observed in `MyLetters.jsx`: standard Tailwind default type scale used directly (`text-sm`, `text-2xl`, `text-4xl`), no custom `fontSize` scale confirmed in a Tailwind config. Font weight usage observed: `font-semibold` (card/section titles), `font-bold` (page `h1`).

### 2.2 Proposed

The redesign introduces a serif display face (Georgia) for headlines and letter titles, paired with the existing default sans stack for UI chrome and body copy (`DESIGN.md` §3). This pairing is a design recommendation, not a confirmed Tailwind config change — no custom `fontFamily` extension has been confirmed as added to the project's Tailwind config.

### 2.3 Future / Needs Definition

A formal type scale (display/headline/body/label sizes with defined line-height and letter-spacing, similar in spirit to the scale sketched in the early Stitch-generated reference mockup) has not been adopted. If Lunareth's UI grows more complex, defining one explicitly in `tailwind.config` (rather than relying on default Tailwind sizes ad hoc) would reduce inconsistency — flagged here as a candidate for future design system work, not a current requirement.

---

## 3. Font Hierarchy

| Tier | Confirmed / Proposed | Typeface |
|---|---|---|
| Reading-experience display (per theme) | Confirmed (fonts only, per theme) | Georgia / Palatino / Courier New / Inter — see Section 1.3 |
| General UI headline | Proposed | Georgia (serif), for continuity with the Moonlit default without making every UI element look like a letter |
| General UI body | Confirmed (implicit — no override observed) | System/Tailwind default sans stack |
| Metadata / labels | Confirmed | Same default sans stack, often at reduced size/opacity |

---

## 4. Radius

### 4.1 Confirmed

| Token | Value | Usage |
|---|---|---|
| Card radius | `rounded-3xl` (Tailwind, 1.5rem/24px) | Archive cards, empty state, delete modal |
| Pill radius | `rounded-full` | Buttons, badges, avatar-style elements |

### 4.2 Proposed

| Token | Value | Usage |
|---|---|---|
| Featured card radius | `rounded-[28px]`–`rounded-[32px]` | Larger radius for the full-width featured/paper card, scaling with element size per `DESIGN.md` §6 |

---

## 5. Shadows

### 5.1 Confirmed

No explicit shadow utility classes were observed in the original `MyLetters.jsx`. Depth was communicated primarily through background opacity and border color, not shadow.

### 5.2 Proposed

| Token | Approximate value | Usage |
|---|---|---|
| Ambient glow (accent) | `box-shadow: 0 0 30px -6px rgba(184,162,255,0.6)` | Primary button hover state |
| Featured card shadow | `box-shadow: 0 30px 70px -30px rgba(184,162,255,0.35)` | Grounded, warm shadow for the parchment card — distinct in character from the ambient glow, per `DESIGN.md` §5 |

These two shadow "jobs" (ambient glow vs. material weight) should remain visually distinct per `DESIGN.md` §5 — do not converge them into a single generic shadow token.

---

## 6. Borders

### 6.1 Confirmed

Hairline borders using the accent color at varying opacity: `border-[#b8a2ff]/10`, `/20`, `/25`, `/30`, `/50`, depending on emphasis (resting vs. hover vs. focus). Destructive borders: `border-red-400/50`, `border-red-400` (solid, on the delete confirmation button).

### 6.2 Proposed

Neutral hairline borders on dark surfaces using `border-white/10` in addition to the accent-tinted borders, for the redesigned archive grid cards — a slightly more neutral resting state with the accent reserved for hover/focus emphasis.

---

## 7. Blur & Glass Effects

### 7.1 Confirmed

None. The original `MyLetters.jsx` does not use `backdrop-blur` or any glassmorphism treatment.

### 7.2 Proposed

`backdrop-blur-sm` on the delete modal's overlay, introduced in the redesign, for a softer transition into the modal state.

### 7.3 Explicitly Rejected

The earlier Stitch-generated reference mockup ("Aether") made heavy use of glass-panel treatments (`backdrop-filter: blur(40px)`, translucent bordered panels) across nearly every surface. This was **not adopted** — per `DESIGN.md` §16 and the original redesign brief, Lunareth avoids "overuse of glassmorphism" as a general rule. Glass/blur effects should stay occasional and purposeful (e.g., a modal overlay), not the default card treatment.

---

## 8. Motion Durations

### 8.1 Confirmed

Original `MyLetters.jsx` uses bare Tailwind `transition` utility classes without explicit duration overrides, meaning Tailwind's default (150ms) applies throughout.

### 8.2 Proposed

| Token | Value | Usage |
|---|---|---|
| Standard UI transition | 200–300ms | Hover states, card lift, border/background changes (`DESIGN.md` §7) |
| Emphasis transition | 400–500ms | Featured card shadow transition, larger surface changes |

### 8.3 Future / Not Applicable by Design

The reading experience's animation (`Envelope`, `PaperReveal`, `LetterRenderer`) is **not** duration-based in the traditional CSS sense — it is driven by a continuous, gesture/interaction-derived `extractionProgress` value (`ANIMATION_SYSTEM.md` §1). Do not attempt to express its timing as a fixed millisecond token here; that would misrepresent the architecture. Any fixed-duration fallback (e.g., a reduced-motion "jump to complete" transition) should be specified in `ANIMATION_SYSTEM.md` directly, not here.

---

## 9. Easing Curves

### 9.1 Confirmed

None explicitly specified in observed code (default Tailwind/browser easing applies to the bare `transition` utility).

### 9.2 Proposed

`DESIGN.md` §7 specifies transitions should "decelerate into rest" (ease-out family) and never use linear or bouncy/elastic easing outside of genuinely playful, low-stakes moments. No specific cubic-bezier values have been formally adopted — treat this as a principle to apply per-transition, not yet a fixed named token.

---

## 10. Spacing Scale

### 10.1 Confirmed

Standard Tailwind default spacing scale, used directly (`p-6`, `p-7`, `gap-5`, `mb-10`, etc.) — no custom `spacing` scale extension confirmed in a Tailwind config.

### 10.2 Future / Needs Definition

The early Stitch reference mockup proposed named semantic spacing tokens (`section-padding`, `stack-sm/md/lg`, `gutter`, `container-padding`) — these were part of a rejected/exploratory design direction ("Aether") and have **not** been adopted into Lunareth's actual Tailwind config. If Lunareth's spacing usage grows inconsistent, formally adopting a small set of semantic spacing tokens could be revisited — but this is speculative, not planned work.

---

## 11. Z-Index Scale

### 11.1 Confirmed

| Token | Value | Usage |
|---|---|---|
| Delete modal | `z-[60]` | The only confirmed explicit z-index value in observed code |

### 11.2 Future / Needs Definition

No formal z-index scale (e.g., a documented ladder of `z-nav`, `z-modal`, `z-toast`) exists yet. As more overlay-style UI is added (toasts, tooltips, nested modals), a defined scale should be adopted to avoid ad hoc, colliding z-index values — flagged as a candidate for future design system hardening.

---

## 12. Breakpoints

### 12.1 Confirmed

Standard Tailwind default breakpoints, used directly: `sm:` and `md:` are the only breakpoint prefixes observed in `MyLetters.jsx` (e.g., `sm:flex-row`, `md:grid-cols-2`). No custom breakpoint values confirmed.

---

## 13. Container Widths

### 13.1 Confirmed

| Token | Value | Usage |
|---|---|---|
| Page content max-width | `max-w-6xl` | Confirmed in both the original and redesigned `MyLetters.jsx` |

`DESIGN.md` §8 also references `max-w-7xl` as an acceptable upper bound for primary content — treat `max-w-6xl` as the confirmed value for `MyLetters` specifically, and `max-w-7xl` as an acceptable alternative for other pages until a single standard is confirmed across the whole app.

---

## 14. Icon Sizes

### 14.1 Confirmed

None — the original `MyLetters.jsx` used a raw emoji character (🔒) rather than sized SVG icons.

### 14.2 Proposed

Introduced in the redesign's inline SVG icon set:

| Size | Usage |
|---|---|
| `h-3.5 w-3.5`–`h-4 w-4` | Small inline icons (arrows, compact seal icon interior) |
| `h-5 w-5`–`h-6 w-6` | Standard icons (trash, warning) |
| `h-8 w-8`–`h-11 w-11` | Badge containers (compact vs. full `SealBadge`) |

---

## 15. Elevation System

Lunareth does not currently have a formalized elevation system (a named ladder like `elevation-1`/`elevation-2` mapping to specific shadow + z-index + surface-color combinations). Depth is currently communicated ad hoc through a combination of background opacity, border color/opacity, and (in the proposed redesign) shadow — see Sections 5 and 6. Formalizing an elevation system is a **Future / Needs Definition** item, worth considering once the component library grows past its current small surface area (see `UI_INVENTORY.md` for the current inventory).
