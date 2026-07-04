# Lunareth — Component Guide

**Status:** Living document
**Owner:** Engineering
**Note on confidence:** Components confirmed directly from inspected code (`MyLetters.jsx`) are marked **[confirmed]**. Components referenced only in prior project notes, not yet directly inspected, are marked **[inferred]** — their props/APIs below are best-effort reconstructions and should be corrected against the real source the first time someone opens those files.

---

## `Navbar` **[inferred — referenced/imported, not inspected]**

**Purpose:** Global site navigation, shown on every page except the reading experience.

**Responsibilities:** Branding/logo, primary navigation links, likely a "Write New Letter" or account entry point.

**Props:** Unknown — likely none or minimal (no props passed at its call site in `MyLetters.jsx`: `<Navbar />`).

**Children:** None expected.

**Parent:** Rendered at the top of every page component except `ViewLetter`.

**Dependencies:** Likely `react-router-dom`'s `Link` for internal navigation, consistent with the rest of the codebase.

**Lifecycle:** Mounted for the lifetime of any page that renders it; unmounts/remounts on navigation to/from `ViewLetter` since that page excludes it.

**Extension guidelines:** If `ViewLetter` ever needs a navigation affordance, build it as a purpose-specific control inside the reading experience — do not make `Navbar` conditionally render differently based on route; keep it a simple, context-free global component.

**Common mistakes:** Reintroducing `Navbar` into `ViewLetter` "for consistency" — this has been explicitly decided against (see `ARCHITECTURE.md` §2, `PRD.md` §13). Don't.

---

## `MyLetters` **[confirmed]**

**Purpose:** The personal archive page — lists all letters saved on the current device/account, and hosts the delete flow.

**Responsibilities:**
- Load letters from storage on mount (`useState(() => getSavedLetters())`).
- Render an empty state when there are no letters.
- Render a featured (newest) letter and the remaining archive grid when letters exist.
- Own and drive the entire delete confirmation flow, including the password-protected variant.

**Props:** None — this is a route-level page component.

**Children:** `Navbar`, local `Badge` and `SealBadge` subcomponents, `Link` (to `/create` and `/letter/:id`).

**Parent:** Rendered by the router at `/my-letters` (path inferred).

**Dependencies:** `react-router-dom` (`Link`), `../components/Navbar`, `../lib/letterConfig` (`formatLetterDate`), `../lib/letterStorage` (`deleteLetter`, `getSavedLetters`).

**Lifecycle:** Reads storage once on mount via lazy `useState` initializer (not re-read on every render — worth knowing if a future feature needs the list to reflect changes made in another tab/window, which it currently will not do without an explicit refresh/storage-event listener).

**State ownership:** `letters`, `letterToDelete`, `deletePassword`, `deleteError` — all owned here, all local to this page.

**Extension guidelines:** New per-letter actions (e.g., a future "duplicate" or "share again" action) should be added as new handler functions following the existing `requestX`/`confirmX`/`closeX` naming pattern, and new UI should reuse the existing card/modal visual language rather than introducing a new pattern.

**Common mistakes:**
- Re-deriving the "featured" letter as stored state instead of computing it at render time from `letters` (see `ARCHITECTURE.md` §9.2 — derived data should not be duplicated into parallel state).
- Forgetting that `closeDeleteDialog()` must reset all three delete-related state values (`letterToDelete`, `deletePassword`, `deleteError`) together — a future edit that adds a new delete-related state field must add it to this reset function too, or stale state will leak into the next delete attempt.

---

## `Badge` **[confirmed, page-local to `MyLetters.jsx`]**

**Purpose:** Small pill-shaped metadata label (e.g., "Theme: Solace", "Style: Moonlit").

**Responsibilities:** Purely presentational; renders its `children` inside a styled pill.

**Props:**
- `children` (required) — the label content.
- `tone` (optional, `"dark" | "paper"`, defaults to `"dark"`) — selects styling appropriate for a dark card background vs. the parchment-toned featured card.

**Children:** Text content passed via `children`.

**Parent:** `MyLetters` (used in both the featured card and the archive grid cards).

**Dependencies:** None beyond Tailwind classes.

**Lifecycle:** Stateless, no lifecycle concerns.

**Extension guidelines:** If a third visual context emerges (e.g., a badge needed inside the reading experience itself), add a new `tone` value rather than forking the component — keep a single `Badge` implementation with tone variants, not multiple near-duplicate badge components scattered across the codebase.

**Common mistakes:** Promoting this to a shared `components/` file before a second, unrelated page actually needs it (see `ARCHITECTURE.md` §3.3 — premature extraction adds indirection without benefit).

---

## `SealBadge` **[confirmed, page-local to `MyLetters.jsx`, introduced in the visual redesign]**

**Purpose:** Wax-seal-styled indicator that a letter is password-protected — replaces a plain lock emoji with an intentional, on-brand visual.

**Responsibilities:** Purely presentational; communicates "protected" via color (crimson gradient), icon (lock), and accessible label.

**Props:**
- `compact` (optional boolean, default `false`) — renders a smaller version for dense grid cards vs. the larger featured-card version.

**Children:** None (self-contained icon + styling).

**Parent:** `MyLetters` (rendered conditionally when `letter.password` is truthy).

**Dependencies:** Inline `IconSeal` SVG component (also page-local).

**Lifecycle:** Stateless.

**Extension guidelines:** If password-protection indicators are needed elsewhere (e.g., inside `ViewLetter`'s pre-read password gate, or in a future `LetterPreview`), promote this component to shared `components/` at that point — that would be the second real usage justifying extraction.

**Common mistakes:** Reusing the `seal` crimson color for unrelated destructive/warning UI — per `DESIGN.md` §4, this color is reserved for "protected," not "dangerous," to keep those two concepts visually distinct. Also: omitting the `aria-label`/`role="img"` — the seal must remain accessible to screen reader users, not just visually distinct (see `TRD.md` §11).

---

## `CreateLetter` **[inferred — referenced in prior project notes, not yet inspected]**

**Purpose:** The letter-writing surface — title, recipient, theme selection, body, optional password, save action.

**Responsibilities (expected):** Form state management for a draft letter; theme preview/selection (likely delegating live preview to `LetterPreview`); persisting the finished letter via `letterStorage.js`; generating/navigating to the resulting `/letter/:id` link.

**Props:** None expected — route-level page.

**Children (expected):** `Navbar`, a theme selector, a rich or plain text editor for the letter body, and likely an embedded or linked `LetterPreview`.

**Parent:** Rendered by the router at `/create`.

**Dependencies (expected):** `lib/letterConfig.js` (theme registry), `lib/letterStorage.js` (save function — not yet confirmed to exist alongside `getSavedLetters`/`deleteLetter`; a `saveLetter()` or similar export is implied but unverified).

**Lifecycle (expected):** Local form state for the duration of composing; no confirmed autosave/draft-persistence behavior — treat unsaved work as at-risk until this is verified (see `AppFlow.md` §1 exit conditions).

**Extension guidelines:** Any new letter field (e.g., a scheduled-delivery date, per `ROADMAP.md`) should be added here and threaded through to the storage layer and to `ViewLetter`/`LetterPreview` consistently — never added to only one of the three surfaces.

**Common mistakes:** This section will need real correction once the file is inspected directly — do not treat the above as verified fact in a PR review; treat it as a placeholder pending verification, flagged here as inferred for exactly that reason.

---

## `ViewLetter` **[inferred — referenced in prior project notes, not yet inspected]**

**Purpose:** The recipient-facing reading page — hosts the password gate (if applicable) and the `ReadingExperience`.

**Responsibilities (expected):** Resolve `:id` from the route to a stored letter; gate content behind a password prompt if `letter.password` is set; render `ReadingExperience` once unlocked; handle the "letter not found" failure state (see `TRD.md` §13).

**Props:** None expected — route-level page, reads `:id` from route params.

**Children (expected):** `ReadingExperience` (and, conditionally, a password-entry UI shown *instead of* `ReadingExperience` until unlocked).

**Parent:** Rendered by the router at `/letter/:id`.

**Dependencies (expected):** `lib/letterStorage.js` for lookup, `ReadingExperience` for the animated reveal.

**Lifecycle (expected):** On mount, look up the letter by id; render password gate or reading experience depending on `letter.password` and unlock state.

**Extension guidelines:** Keep the password gate entirely outside/above `ReadingExperience` in the component tree — `ReadingExperience` and its children should never need to know whether a password was required; by the time they mount, access has already been granted.

**Common mistakes:** Adding `Navbar` here (explicitly against the design decision — see `ARCHITECTURE.md` §2). Also: leaking any letter content into the DOM/state before password verification succeeds (see `AppFlow.md` §3).

---

## `LetterPreview` **[inferred — referenced in prior project notes as mirroring `ViewLetter`]**

**Purpose:** A scaled-down, non-animated preview of how a letter will look in its selected theme — used during creation, and possibly for empty-state/placeholder scenarios.

**Responsibilities (expected):** Mirror `ViewLetter`'s visual output (theme rendering, typography, layout) at a smaller scale, without the envelope animation, plus handle an empty/placeholder state when no content has been entered yet.

**Props (expected):** Likely accepts a draft letter object (possibly incomplete/in-progress) and a scale factor, given the "mirrors ViewLetter with scale adjustments and empty-state handling" description from prior project context.

**Parent:** Likely rendered within `CreateLetter` as a live preview pane.

**Dependencies (expected):** The same theme registry (`lib/letterConfig.js`) that `ViewLetter` uses — critical that both consume identical theme tokens (see `ARCHITECTURE.md` §11) so the preview is an honest representation of the final letter.

**Common mistakes:** Letting `LetterPreview` and `ViewLetter` drift apart in how they render a given theme — any visual discrepancy between preview and final reading experience undermines user trust in the editor.

---

## `ReadingExperience` / `Envelope` / `PaperReveal` / `LetterRenderer` **[inferred — architecture confirmed via prior project notes, files not yet inspected]**

Fully documented in `ANIMATION_SYSTEM.md` — refer there for purpose, props/data flow (all derived from the single `extractionProgress` value owned by `ReadingExperience`), lifecycle, extension guidelines, and common mistakes. This guide intentionally does not duplicate that document; `ANIMATION_SYSTEM.md` is the authoritative source for these four components.
