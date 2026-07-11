# Lunareth — Routes Documentation

**Status:** Living document
**Owner:** Engineering
**Router:** `react-router-dom` (confirmed via `MyLetters.jsx` import) — see `TRD.md` header note regarding a possible discrepancy with prior TanStack Router references, unresolved as of this writing.
**Route table location:** Directly in `App.jsx` (or root equivalent) — **there is no `routes/` folder** in this project, confirmed from prior project context.

---

## Route Table

| Route | Page component | Confirmed? | Navbar? |
|---|---|---|---|
| `/` | Landing (name TBD) | Not inspected | Presumed yes |
| `/create` | `CreateLetter` | Path confirmed via `<Link to="/create">` in `MyLetters.jsx` | Presumed yes |
| `/my-letters` (path inferred) | `MyLetters` | Component confirmed; exact path string inferred | Yes |
| `/letter/:id` | `ViewLetter` | Path confirmed via `<Link to={`/letter/${letter.id}`}>` in `MyLetters.jsx` | **No — intentional** |

---

## `/` — Landing

**Purpose:** First-touch entry point for new writers; establishes Lunareth's tone before any letter has been written.

**Entry conditions:** Direct visit, no prior state required.

**Exit conditions:** Navigates to `/create` (start writing) or `/my-letters` (returning user).

**Data requirements:** None confirmed.

**Not yet inspected** — this section should be filled in with confirmed detail once the landing page component is available for review.

---

## `/create` — Create Letter

**Purpose:** Compose a new letter: title, recipient, theme, body, optional password.

**Entry conditions:** From landing's primary CTA, or from `MyLetters`' "Write New/First Letter" links (confirmed call sites in `MyLetters.jsx`).

**Exit conditions:** Successful save → presumably navigates to the new letter's `/letter/:id` (to show the writer their own letter and/or provide the shareable link) or to `/my-letters`. **Not yet confirmed — verify against `CreateLetter.jsx` directly.**

**Data requirements:** Writes a new letter object to storage via `lib/letterStorage.js` (a save function beyond the confirmed `getSavedLetters`/`deleteLetter` pair is implied but not yet confirmed to exist under a specific name).

**Future authentication:** Once accounts exist (`TRD.md` §9), this route's save action should write to the authenticated user's account rather than (or in addition to, during a migration window) LocalStorage.

---

## `/my-letters` — My Letters (Archive)

**Purpose:** Personal archive of saved letters; supports reopening and deleting.

**Entry conditions:** From `Navbar`, or as a natural return destination after creating/managing letters. No specific data must be present — an empty archive renders its own empty state.

**Exit conditions:** Navigates to `/letter/:id` (open a letter) or `/create` (write a new one). Deletion is handled in-place via a modal and does not navigate away.

**Data requirements:** Reads the full letters array via `getSavedLetters()` on mount.

**Future authentication:** Once accounts exist, this route should read from the user's server-stored letters, with a one-time LocalStorage import prompt for existing local-only archives (`TRD.md` §9, `AppFlow.md` §5).

---

## `/letter/:id` — View Letter

**Purpose:** The recipient-facing (or writer-revisiting) reading experience — the product's core moment.

**Entry conditions:** A valid `:id` matching a stored letter. Critically, this route must function correctly for a visitor with **zero prior app context** (see `PRD.md` §4.2) — no assumption of a prior session, referrer, or account should ever gate basic access to a shared, unprotected letter.

**Exit conditions:** No forced exit. The visitor may leave whenever they choose; no confirmed "mark as read"/receipt mechanism exists yet (see `ROADMAP.md` for planned read receipts).

**Data requirements:**
- Look up the letter by `:id` via storage.
- If not found: render a clear "this letter could not be found" state (see `TRD.md` §13) — never a blank screen.
- If `letter.password` is set: render a password gate before any letter content, metadata, or the reading experience itself is exposed (see `AppFlow.md` §3).

**Future authentication:** This route must remain accessible **without requiring the recipient to have an account**, even after writer-side accounts ship — this is a hard constraint (`AppFlow.md` §5), not a temporary MVP simplification. Password-protected letters should eventually verify server-side (`TRD.md` §8–9) rather than client-side, but the "no account required to read" property must not change.

---

## General Routing Notes

- All internal navigation uses `<Link>` from `react-router-dom`, not raw `<a>` tags — this preserves client-side transitions and must be maintained in any new code.
- Because this is a client-rendered SPA with no confirmed SSR (`TRD.md` §3), the hosting platform must be configured with SPA fallback routing (all unmatched paths serve `index.html`) so that a direct visit to `/letter/:id` from a shared link doesn't 404 at the server/CDN level before React Router ever gets a chance to resolve it. **This is a deployment configuration requirement, not just a code concern** — flag it explicitly in any deployment/infra documentation or onboarding checklist.
