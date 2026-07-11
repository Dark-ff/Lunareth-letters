# Lunareth — Architecture Documentation

**Status:** Living document
**Owner:** Engineering
**Companion documents:** `TRD.md`, `ANIMATION_SYSTEM.md`, `COMPONENT_GUIDE.md`, `ROUTES.md`

---

> This document explains *where things live and why*, and — just as importantly — *where things must never live*. It should be the first document a new engineer or an AI coding assistant reads before touching the codebase.

## 1. High-Level Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                            App.jsx                            │
│  (route table lives here directly — no routes/ folder exists) │
└───────────────┬─────────────────────────────────────────────┘
                 │
        ┌────────┴────────┬─────────────────┬──────────────────┐
        ▼                 ▼                 ▼                  ▼
   / (landing)      /create           /my-letters         /letter/:id
   [not yet         CreateLetter      MyLetters           ViewLetter
    inspected]                                                │
                                                                ▼
                                                        ReadingExperience
                                                        ┌───────┼────────┐
                                                        ▼       ▼        ▼
                                                    Envelope PaperReveal LetterRenderer
```

## 2. Pages

| Page | Route | Navbar present? | Owns |
|---|---|---|---|
| `MyLetters` | `/my-letters` (inferred) | Yes | `letters`, `letterToDelete`, `deletePassword`, `deleteError` |
| `CreateLetter` | `/create` | Presumed yes (not yet inspected) | Draft letter fields, theme selection, save action |
| `ViewLetter` | `/letter/:id` | **No — intentional** | Delegates reading state entirely to `ReadingExperience` |
| Landing | `/` | Presumed yes | Not yet inspected |

`ViewLetter` deliberately omits `Navbar` to make the reading experience feel like a distinct, immersive place rather than "a page within the app" (see `PRD.md` §13, `DESIGN.md` §8). **Do not reintroduce it.** If a future requirement seems to need navigation from within the reading experience (e.g., a "reply" CTA), solve it with a purpose-built control inside `ReadingExperience`, not by bringing back the global `Navbar`.

## 3. Components

### 3.1 Shared/global
- `Navbar` — global navigation, rendered on every page except `ViewLetter`.

### 3.2 Reading experience (see `ANIMATION_SYSTEM.md` for full detail)
- `ReadingExperience` — owner of `extractionProgress` (0→1), the single source of truth for the entire reading animation.
- `Envelope` — converts `extractionProgress` into a `translateY` value; purely a function of that one input.
- `PaperReveal` — always mounted, deliberately "dumb": renders based on props/geometry only, holds no independent state.
- `LetterRenderer` — renders the complete letter from frame one; visibility is achieved through geometry (being covered/positioned off-frame), never through opacity or conditional rendering.

### 3.3 Page-local presentational components
- `Badge` (in `MyLetters.jsx`) — small metadata pill, theme/style display. Currently page-local; only promote to a shared `components/` location if a second, unrelated page needs the identical component — premature extraction adds indirection without benefit.
- `SealBadge` (in `MyLetters.jsx`, introduced in the visual redesign) — wax-seal-styled password-protection indicator. Same extraction rule applies.

## 4. Utilities / Libraries

- `lib/letterConfig.js` — confirmed export: `formatLetterDate()`. Almost certainly also the intended home for the theme registry (font/color/texture tokens per theme — Moonlit, Old Paper, Dark Aesthetic, Minimal). **This should be the single source of truth for theme tokens** — see Section 6, "Where logic belongs."
- `lib/letterStorage.js` — confirmed exports: `getSavedLetters()`, `deleteLetter(id)`. This is the sole abstraction boundary between the app and its persistence layer (currently LocalStorage). Any future migration to Supabase (`TRD.md` §9) should change the *implementation* of this module's functions, not the call sites that use them — pages should never call `window.localStorage` directly.

## 5. Folder Responsibilities

| Folder | Responsibility | Must NOT contain |
|---|---|---|
| `pages/` | Route-level components; own page-specific state and compose smaller components | Reusable, cross-page presentational primitives (extract those to `components/` once truly shared) |
| `components/` | Shared, reusable UI building blocks (`Navbar`, and eventually promoted primitives) | Page-specific business logic or state that only one page needs |
| `components/reading/` (inferred location) | The four reading-experience components and nothing else | Anything unrelated to the envelope/reveal system — this directory should stay small and single-purpose |
| `lib/` | Pure(ish) utility functions and the storage/config abstraction layer | React components or JSX of any kind |

## 6. Data Flow

Data flow in Lunareth is intentionally simple and unidirectional:

```
letterStorage.js (persistence)
        │  getSavedLetters()
        ▼
Page component state (e.g., MyLetters' `letters`)
        │  props
        ▼
Presentational subcomponents (Badge, SealBadge, letter cards)
```

Mutations flow the opposite direction through explicit function calls, never through direct manipulation of another component's state:

```
User interaction (e.g., click "Delete")
        │
        ▼
Page-level handler (requestDelete → confirmDelete → deleteSelectedLetter)
        │
        ▼
letterStorage.js (deleteLetter(id))
        │
        ▼
Page state updated via setLetters(...)  →  re-render
```

## 7. Rendering Flow

Standard React CSR flow: Vite serves the bundle, `App.jsx` mounts, the router resolves the current path to a page component, the page component renders based on its local state (typically initialized by reading from `letterStorage.js` via `useState(() => getSavedLetters())` — a lazy initializer, which matters: it means storage is read once on mount, not on every render).

The reading experience (`/letter/:id`) has an additional rendering phase beyond the initial mount: `ReadingExperience` drives a continuous animation loop (via Framer Motion) that updates `extractionProgress` over time/interaction, which in turn re-renders `Envelope`, `PaperReveal`, and `LetterRenderer` on every progress tick. This is the one part of the app where render frequency is a first-class performance concern (see `TRD.md` §10).

## 8. Component Ownership

- A component "owns" a piece of state if it's the one calling the `useState`/equivalent hook for it, and other components only ever receive that value as a prop or a callback to change it.
- `MyLetters` owns all of its delete-flow state. Sub-elements (the delete modal's contents) are not separate components with independent state — they are inline JSX within `MyLetters`, deliberately, since that state has no reason to exist outside this one page's lifecycle.
- `ReadingExperience` owns `extractionProgress` and must remain the *only* owner of it. See `ANIMATION_SYSTEM.md` for the detailed rationale — this single-ownership rule is the load-bearing architectural decision of the entire reading experience.

## 9. State Ownership Rules (General)

1. Default to the smallest possible scope. State lives in the page that needs it until at least two unrelated pages need the same state.
2. Derived data (e.g., "which letter is the featured/newest one") should be computed at render time from the canonical `letters` array, not stored as separate, parallel state that could drift out of sync.
3. Never duplicate a piece of state across two components when one could simply own it and pass it down. This has already bitten the reading experience once conceptually (see `ANIMATION_SYSTEM.md`'s discussion of prior animation regressions) — it is the single most common source of animation and UI bugs in this codebase's history and should be treated as a standing warning, not a one-time lesson.

## 10. Where Logic Belongs

- **Persistence logic** → `lib/letterStorage.js`, exclusively.
- **Formatting/presentation-adjacent pure functions** (date formatting, theme token lookups) → `lib/letterConfig.js` and siblings, exclusively.
- **Page-specific interaction logic** (delete confirmation flow, form validation for letter creation) → the page component itself.
- **Cross-cutting animation state** → `ReadingExperience`, exclusively, for anything under the reading experience.

## 11. Where Logic Must Never Belong

- **Never** put LocalStorage/persistence calls directly inside a page or presentational component — always go through `lib/letterStorage.js`, so the future Supabase migration (`TRD.md` §9) touches one file's internals, not every call site across the app.
- **Never** give `PaperReveal` or `LetterRenderer` their own opinion about "how open" the letter is. They are consumers of `extractionProgress` (directly or via derived props from `Envelope`/`ReadingExperience`), never independent deciders.
- **Never** hardcode a theme's font/color/texture values inline in a page component. All four themes' tokens belong in the shared config, consumed identically by `CreateLetter`, `LetterPreview`, and `ViewLetter` — divergence here is how theme inconsistency bugs happen.
- **Never** reintroduce `Navbar` into `ViewLetter` — this is architecture-as-design-decision, not an accidental omission (see Section 2).
