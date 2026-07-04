# Lunareth — Application Flow Documentation

**Status:** Living document
**Owner:** Product + Engineering
**Purpose:** This document is the definitive map of every user-facing flow in Lunareth: what triggers it, what state it depends on, what can go wrong, and where it hands off to another flow.

---

## 1. Primary Flow — Write, Share, Read

```
Landing
   │
   ▼
Create Letter  ──────────────────────────────┐
   │  (title, recipient, theme, body,          │
   │   optional password)                       │
   ▼                                            │
Save Letter                                     │ (edit / back out)
   │                                             │
   ▼                                             │
Generate Link (/letter/:id)  ◄──────────────────┘
   │
   ▼
Share  (outside Lunareth: text, email, etc.)
   │
   ▼
Recipient Opens Link
   │
   ▼
Password Gate?  ── yes ──► Enter Password ── incorrect ──► Error, retry
   │  no                          │ correct
   ▼                              ▼
Envelope (reading experience begins)
   │
   ▼
Read Letter
   │
   ▼
(optional, future) Reply → Create Letter (recipient becomes writer)
```

### Sequence Diagram — Recipient Opening a Protected Letter

```
Recipient        Browser/Router       ViewLetter        letterStorage.js    ReadingExperience
    │                  │                   │                    │                   │
    │  clicks link     │                   │                    │                   │
    ├─────────────────►│                   │                    │                   │
    │                  │  resolve /letter/:id                   │                   │
    │                  ├──────────────────►│                    │                   │
    │                  │                   │  getLetterById(id) │                   │
    │                  │                   ├───────────────────►│                   │
    │                  │                   │◄───────────────────┤                   │
    │                  │                   │   letter object    │                   │
    │                  │                   │                    │                   │
    │                  │                   │ letter.password set? ── yes            │
    │                  │                   │                    │                   │
    │◄──────────────────────── render password prompt ──────────┤                   │
    │  submits password│                   │                    │                   │
    ├──────────────────────────────────────►                    │                   │
    │                  │                   │ compare password   │                   │
    │                  │                   │  (correct)         │                   │
    │                  │                   │                    │                   │
    │                  │                   │  mount             │                   │
    │                  │                   ├────────────────────────────────────────►│
    │◄─────────────────────────── envelope-opening experience begins ────────────────┤
```

### Entry conditions
- **Create Letter** is entered from the landing page or from `My Letters` via the "Write New/First Letter" CTA. No prior state required.
- **Recipient Opens Link** is entered from *outside* the app entirely — this is the only flow in Lunareth where the user has zero prior context, and the UX must account for that (see `PRD.md` §4.2).

### Exit conditions
- **Create Letter** exits successfully into the generated link/share state, or is abandoned (no persistence of an in-progress, unsaved draft is confirmed — treat unsaved work as lost on navigation away unless `CreateLetter.jsx` is found to implement autosave).
- **Read Letter** has no forced exit — the recipient can leave whenever they choose. There is currently no confirmed "mark as read" or receipt mechanism (see Future Authentication Flow / Roadmap for read receipts).

### Failure states
- Letter ID does not resolve to a saved letter → render a "this letter could not be found" state (see `TRD.md` §13). Do not silently redirect or blank the screen.
- Password entered incorrectly → inline error, no lockout currently specified, retry allowed.

---

## 2. Delete Flow

```
My Letters (list view)
   │
   ▼
User clicks "Delete" on a letter card
   │
   ▼
requestDelete(letter) → letterToDelete state set
   │
   ▼
Delete confirmation modal opens
   │
   ├── Letter has NO password
   │        │
   │        ▼
   │   "Confirm Delete" copy shown
   │        │
   │        ▼
   │   User clicks "Delete Letter" → confirmDelete() → deleteSelectedLetter()
   │        │
   │        ▼
   │   deleteLetter(id) called, letters state filtered, modal closes
   │
   └── Letter HAS a password
            │
            ▼
       "Password Required" copy shown, password input rendered
            │
            ▼
       User enters password → confirmDelete()
            │
            ├── password !== letter.password → deleteError set, modal stays open, input remains
            │
            └── password === letter.password → deleteSelectedLetter() proceeds as above
```

### State involved
`letterToDelete`, `deletePassword`, `deleteError` — all owned locally by `MyLetters`. `closeDeleteDialog()` resets all three, called both on explicit Cancel and after a successful delete.

### Edge cases
- User opens the delete modal for a password-protected letter, gets the password wrong repeatedly — no rate limiting or lockout is implemented; this is acceptable for a client-side-only threat model but **must be revisited** once server-side storage exists (see `TRD.md` §8, §9).
- User presses Enter in the password field → same as clicking "Delete Letter" (`onKeyDown` handler calls `confirmDelete()` directly) — this must be preserved in any redesign, it's a real usability detail.
- Deleting the currently-featured (newest) letter in a redesigned `MyLetters` UI should not throw — the "featured letter" is derived at render time from the live `letters` array, so a delete naturally re-derives the next-newest letter as featured on the next render.

---

## 3. Password Flow (Reading)

```
Recipient opens /letter/:id
   │
   ▼
Is letter.password set?
   │
   ├── No  → proceed directly to envelope/reading experience
   │
   └── Yes → render password entry UI (before envelope, before any letter content is exposed)
                │
                ▼
           User submits password
                │
                ├── Incorrect → inline error, remain on password screen, no letter content or metadata leaked
                │
                └── Correct → proceed to envelope/reading experience
```

**Critical UX + security note:** No part of the letter body should be present in the DOM/JS state before password verification succeeds — even if it's visually hidden via CSS. Given the current client-side-only storage model (see `TRD.md` §8), the *practical* protection this affords is limited, but the *architectural discipline* of not exposing unverified content still matters and should be maintained even more strictly once real server-side verification exists.

---

## 4. Skip Animation Flow

```
Envelope (reading experience begins)
   │
   ├── User waits → animation plays to completion → extractionProgress reaches 1 → letter fully readable
   │
   └── User invokes "skip" (if/when implemented) → extractionProgress jumps to 1 immediately
                │
                ▼
          Envelope removed from DOM (same end-state as natural completion — see ANIMATION_SYSTEM.md)
          Letter immediately fully readable
```

**Status: not confirmed as implemented.** This flow is documented here as a *specification* for how a skip control should behave if/when it's added, based on the existing `extractionProgress` architecture — it should **set the same state variable** the natural animation drives toward, rather than introducing a separate "skipped" code path. This keeps `PaperReveal` and `LetterRenderer` correctly dumb (see `ANIMATION_SYSTEM.md` §"Why only one PaperReveal exists").

Product rationale for eventually adding this: repeat visits to the same letter (someone re-reading a letter they've already opened once) should not be forced through the full ceremonial animation every time — see `PRD.md` §16 Risks ("Animation fatigue").

Recommended (not yet implemented) rule: **only show the full, non-skippable animation on first open of a given letter** (tracked via a lightweight "has this letter ID been opened on this device before" flag), and offer an instant/skip path on subsequent opens.

---

## 5. Future Authentication Flow

This flow does not exist yet. It's documented here so that when accounts ship (see `TRD.md` §9, `ROADMAP.md`), the rest of the app's flows can be updated consistently rather than bolted on ad hoc.

```
Landing
   │
   ▼
Sign In / Sign Up (Supabase Auth)
   │
   ▼
Session established
   │
   ├── My Letters now reflects server-stored letters for this account
   │        (with a one-time offer to import any existing LocalStorage letters — see TRD.md §9)
   │
   └── Create Letter now saves to the account, not just LocalStorage
```

### Design constraints for this future flow
- **Reading a shared letter must never require the recipient to have an account.** Share-by-link must remain account-optional for the recipient, even after writers move to authenticated accounts. This preserves the zero-context Recipient Journey (`PRD.md` §4.2) and should be treated as a hard constraint on any future auth design, not a nice-to-have.
- Password-protected letters, once server-backed, should verify the password server-side (see `TRD.md` §8–9) regardless of whether the recipient is signed in.
- The migration/import prompt (LocalStorage → account) should be dismissible and non-blocking; a user who declines should not lose access to their LocalStorage letters going forward — both storage paths should be readable until the user explicitly confirms migration.
