# Lunareth — UI Inventory

**Status:** Living document
**Owner:** Engineering + Design
**Purpose:** A single, scannable inventory of every visual component in Lunareth — confirmed and planned. This document intentionally does not re-explain *why* the animation components are architected the way they are (see `ANIMATION_SYSTEM.md`) or *why* certain design decisions were made (see `DESIGN.md`) — it exists to answer "what components exist, where do they live, and what's their contract," fast, for someone who already knows the reasoning and needs the facts.

**Confidence key:** Every row is tagged **Confirmed** (verified directly from source) or **Planned** (referenced in prior project context or implied by architecture, not yet inspected/built). Do not treat a "Planned" row as an accurate description of shipped code.

---

## 1. Global / Layout

| | |
|---|---|
| **Component** | `Navbar` |
| **Status** | Planned — referenced/imported in `MyLetters.jsx`, contents not yet inspected |
| **Purpose** | Global site navigation shown on every page except the reading experience |
| **Owner** | Layout / Engineering |
| **Location** | `src/components/Navbar.jsx` (inferred path) |
| **Parent** | Every page component except `ViewLetter` |
| **Children** | Unknown — likely logo/branding, nav links, possibly a primary CTA |
| **Props** | None observed at call site (`<Navbar />`, no props passed) |
| **States** | Unknown — possibly active-route highlighting |
| **Responsive behavior** | Not yet confirmed; should collapse to a mobile-appropriate pattern (hamburger or simplified bar) per `DESIGN.md` §15 |
| **Accessibility notes** | Must remain keyboard-navigable; landmark role (`<nav>`) expected |
| **Dependencies** | Likely `react-router-dom` `Link` |
| **Design notes** | Must **never** be rendered inside `ViewLetter` — this is a deliberate architectural decision, not an oversight (`ARCHITECTURE.md` §2) |
| **Future improvements** | Needs Verification — inspect source directly and convert this row to fully Confirmed |

---

## 2. `MyLetters` Page and Subcomponents

| | |
|---|---|
| **Component** | `MyLetters` |
| **Status** | Confirmed |
| **Purpose** | Personal archive: lists saved letters, hosts delete flow, features the newest letter |
| **Owner** | Engineering (page-level) |
| **Location** | `src/pages/MyLetters.jsx` (inferred folder; file itself confirmed) |
| **Parent** | Router, at the `/my-letters` route (path inferred) |
| **Children** | `Navbar`, `Badge`, `SealBadge`, inline delete-confirmation modal, `Link` elements |
| **Props** | None — route-level page |
| **States** | `letters`, `letterToDelete`, `deletePassword`, `deleteError` (all `useState`, all confirmed) |
| **Responsive behavior** | Archive grid collapses to a single column below `md`; featured card remains full-width at all sizes with adjusted padding |
| **Accessibility notes** | Delete icon buttons carry `aria-label`/`title`; password input marks `aria-invalid` on error; focus rings preserved on all interactive elements |
| **Dependencies** | `react-router-dom` (`Link`), `lib/letterConfig.js` (`formatLetterDate`), `lib/letterStorage.js` (`getSavedLetters`, `deleteLetter`) |
| **Design notes** | Featured letter is derived at render time from `letters` (newest by `createdAt`), never stored as separate state (`ARCHITECTURE.md` §9.2) |
| **Future improvements** | Storage-change listener across tabs (not currently implemented — `ROADMAP.md` tech debt) |

| | |
|---|---|
| **Component** | `Badge` |
| **Status** | Confirmed |
| **Purpose** | Small pill label for theme/style metadata |
| **Owner** | Engineering (page-local to `MyLetters`) |
| **Location** | Defined at the top of `MyLetters.jsx` |
| **Parent** | `MyLetters` (used in both featured card and archive grid cards) |
| **Children** | Text via `children` prop |
| **Props** | `children` (required), `tone` (`"dark" \| "paper"`, default `"dark"`) |
| **States** | Stateless |
| **Responsive behavior** | N/A — inline pill, wraps naturally in a flex-wrap container |
| **Accessibility notes** | Plain text content; no special ARIA needed |
| **Dependencies** | None beyond Tailwind |
| **Design notes** | `tone="paper"` variant exists specifically for the parchment-toned featured card (`DESIGN.md` §9) |
| **Future improvements** | Promote to shared `components/` only if a second, unrelated page needs it (`ARCHITECTURE.md` §3.3, §10) |

| | |
|---|---|
| **Component** | `SealBadge` |
| **Status** | Confirmed |
| **Purpose** | Wax-seal-styled password-protection indicator, replacing a plain lock emoji |
| **Owner** | Engineering (page-local to `MyLetters`) |
| **Location** | Defined at the top of `MyLetters.jsx`, alongside inline `IconSeal` |
| **Parent** | `MyLetters` (rendered conditionally when `letter.password` is truthy) |
| **Children** | None (self-contained icon) |
| **Props** | `compact` (boolean, default `false`) |
| **States** | Stateless |
| **Responsive behavior** | Compact variant used in dense grid cards; full size on the featured card |
| **Accessibility notes** | `role="img"`, `aria-label="Password protected"`, `title` attribute — must not rely on icon shape alone |
| **Dependencies** | Inline `IconSeal` SVG |
| **Design notes** | Crimson "seal" color is reserved for protection indicators only, never reused for generic destructive/warning UI (`DESIGN.md` §4) |
| **Future improvements** | Promote to shared `components/` if reused inside `ViewLetter`'s password gate or a future `LetterPreview` |

---

## 3. Reading Experience Components

Full architectural detail lives in `ANIMATION_SYSTEM.md`; this table is the quick-reference summary only.

| Component | Status | Purpose | Owner | Location | Parent | Children | Key prop(s) | Dependencies |
|---|---|---|---|---|---|---|---|---|
| `ReadingExperience` | Planned (architecture confirmed via prior context; file not yet inspected) | Orchestrates the entire envelope/reveal sequence; sole owner of `extractionProgress` | Engineering + Design jointly | `src/components/reading/ReadingExperience.jsx` (inferred) | `ViewLetter` | `Envelope`, `PaperReveal`, `LetterRenderer` | Owns `extractionProgress` (0→1) | Framer Motion (ADR 002) |
| `Envelope` | Planned | Converts `extractionProgress` into `translateY`; renders idle breathing animation, sink-not-fade motion | Engineering | `src/components/reading/Envelope.jsx` (inferred) | `ReadingExperience` | None expected | `extractionProgress` (received) | Framer Motion |
| `PaperReveal` | Planned | Always-mounted, geometry-only reveal surface; paper blur-to-sharp; becomes the continuous reading surface | Engineering | `src/components/reading/PaperReveal.jsx` (inferred) | `ReadingExperience` | None expected (may wrap `LetterRenderer`) | Progress-derived geometry props | Framer Motion |
| `LetterRenderer` | Planned | Renders the complete letter from frame one; visibility via geometry only, never opacity | Engineering | `src/components/reading/LetterRenderer.jsx` (inferred) | `ReadingExperience` (possibly via `PaperReveal`) | None expected | Letter content, progress-derived geometry props | Theme registry (`lib/letterConfig.js`) for per-theme rendering |

**Hard constraint applying to all four rows above:** no independent state, no opacity-based visibility. See `ANIMATION_SYSTEM.md` §4 and ADR 005 before modifying any of these.

---

## 4. Creation & Preview Components

| | |
|---|---|
| **Component** | `CreateLetter` |
| **Status** | Planned — referenced in prior project context, not yet inspected |
| **Purpose** | Letter-writing surface: title, recipient, theme selection, body, optional password, save |
| **Owner** | Engineering |
| **Location** | `src/pages/CreateLetter.jsx` (inferred) |
| **Parent** | Router, at `/create` (path confirmed via `<Link>` in `MyLetters.jsx`) |
| **Children** | `Navbar` (expected), theme selector, body editor, likely embedded `LetterPreview` |
| **Props** | None — route-level page |
| **States** | Needs Verification — expected: draft letter fields, selected theme, password toggle |
| **Responsive behavior** | Needs Verification |
| **Accessibility notes** | Needs Verification — form labels, error messaging, keyboard flow through theme selector all need direct inspection |
| **Dependencies** | `lib/letterConfig.js` (theme registry), `lib/letterStorage.js` (save function — existence/name unconfirmed beyond `getSavedLetters`/`deleteLetter`) |
| **Design notes** | Any new letter field must be threaded consistently through `CreateLetter`, storage, and `ViewLetter`/`LetterPreview` (`ARCHITECTURE.md` §11) |
| **Future improvements** | No confirmed autosave/draft persistence — flagged as tech debt in `ROADMAP.md` |

| | |
|---|---|
| **Component** | `LetterPreview` |
| **Status** | Planned — referenced in prior project context, not yet inspected |
| **Purpose** | Scaled-down, non-animated preview of a letter's theme rendering during creation |
| **Owner** | Engineering |
| **Location** | `src/pages/LetterPreview.jsx` or `src/components/LetterPreview.jsx` (inferred) |
| **Parent** | Likely `CreateLetter` |
| **Children** | Needs Verification |
| **Props** | Needs Verification — likely a draft letter object and a scale factor |
| **States** | Needs Verification — described in prior context as handling an empty state when no content has been entered |
| **Responsive behavior** | Needs Verification |
| **Accessibility notes** | Needs Verification |
| **Dependencies** | `lib/letterConfig.js` — must consume the same theme tokens as `ViewLetter` to remain an honest preview (`ARCHITECTURE.md` §11, `COMPONENT_GUIDE.md`) |
| **Design notes** | Any visual drift between `LetterPreview` and the final `ViewLetter` rendering undermines user trust in the editor |
| **Future improvements** | Needs Verification once source is available |

---

## 5. Reading Page Shell

| | |
|---|---|
| **Component** | `ViewLetter` |
| **Status** | Planned — referenced in prior project context, not yet inspected |
| **Purpose** | Recipient-facing page: resolves `:id`, gates content behind a password prompt if needed, renders `ReadingExperience` |
| **Owner** | Engineering |
| **Location** | `src/pages/ViewLetter.jsx` (inferred) |
| **Parent** | Router, at `/letter/:id` (path confirmed via `<Link>` in `MyLetters.jsx`) |
| **Children** | Password-gate UI (conditional), `ReadingExperience` |
| **Props** | None — reads `:id` from route params |
| **States** | Needs Verification — expected: fetched letter, unlock state |
| **Responsive behavior** | Must be tuned mobile-first (`DESIGN.md` §15, `PRD.md` §4.2) |
| **Accessibility notes** | No letter content should be present in the DOM/state before password verification succeeds (`AppFlow.md` §3) |
| **Dependencies** | `lib/letterStorage.js` (lookup), `ReadingExperience` |
| **Design notes** | **Must never render `Navbar`** — deliberate design decision (`ARCHITECTURE.md` §2, `PRD.md` §13) |
| **Future improvements** | "Letter not found" and storage-failure states not yet confirmed as implemented (`TRD.md` §13, `ROADMAP.md`) |

---

## 6. Summary Table (Quick Reference)

| Component | Status | Type |
|---|---|---|
| `Navbar` | Planned (unverified internals) | Layout |
| `MyLetters` | Confirmed | Page |
| `Badge` | Confirmed | Presentational |
| `SealBadge` | Confirmed | Presentational |
| `ReadingExperience` | Planned (architecture confirmed) | Orchestrator |
| `Envelope` | Planned (architecture confirmed) | Animation |
| `PaperReveal` | Planned (architecture confirmed) | Animation |
| `LetterRenderer` | Planned (architecture confirmed) | Animation / Content |
| `CreateLetter` | Planned | Page |
| `LetterPreview` | Planned | Presentational |
| `ViewLetter` | Planned | Page |

**Maintenance note:** as each "Planned" component is directly inspected, update its row(s) to Confirmed with real detail, and update `COMPONENT_GUIDE.md` and `ARCHITECTURE.md` in the same pass — per `CONTRIBUTING.md` §8, stale "unverified" markers left in place after someone has actually seen the code make the documentation less trustworthy, not more honest.
