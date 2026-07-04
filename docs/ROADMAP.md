# Lunareth — Roadmap

**Status:** Living document
**Owner:** Product + Engineering
**Note:** This roadmap reflects intent and sequencing logic, not committed dates. Re-prioritize freely as real usage data comes in — see `PRD.md` §10 for the metrics that should drive re-prioritization.

---

## Version 1 (Current / MVP)

Scope matches `PRD.md` §6–7 exactly:
- Letter creation with title, recipient, theme, body, optional password.
- Four-theme system (Moonlit, Old Paper, Dark Aesthetic, Minimal), consistently applied across create/preview/read.
- Shareable letter links (`/letter/:id`).
- Password protection, enforced on both read and delete.
- The envelope-opening reading experience (`ReadingExperience` + `Envelope` + `PaperReveal` + `LetterRenderer`).
- `My Letters` archive with reopen and delete.
- LocalStorage persistence.

**Definition of done for V1:** a person with no prior context can receive a link, be genuinely moved by the opening moment, and read a letter clearly, on both desktop and mobile — and the writer can manage what they've written afterward.

## Version 1.1 (Near-term polish)

- **Reduced-motion support** for the reading experience (`TRD.md` §11, `ANIMATION_SYSTEM.md` §7) — currently an open accessibility gap, not yet confirmed as implemented.
- **Skip/instant-complete control** for repeat opens of the same letter (`AppFlow.md` §4) — implemented by jumping `extractionProgress` to `1`, never via a separate code path.
- **"Letter not found" and storage-failure graceful states** (`TRD.md` §13) — verify these are actually implemented, not just specified.
- **Screen-reader handling for `LetterRenderer`'s always-rendered content** (`ANIMATION_SYSTEM.md` §7) — tie `aria-hidden`/focus management to `extractionProgress` crossing completion.
- **Touch-friendly delete/action affordances** in `My Letters` — hover-revealed controls (introduced in the recent visual redesign) need a non-hover-dependent fallback on touch devices (`DESIGN.md` §15).

## Version 2 (Platform foundation)

- **Accounts & Supabase-backed storage** (`TRD.md` §9) — the single biggest unlock for retention and the direct fix for the highest-severity current risk (LocalStorage-only data loss, `PRD.md` §16).
- **Cross-device sync** — a natural consequence of the above, but called out separately since it's the actual user-facing value, not the backend plumbing.
- **Server-side password verification** for protected letters (`TRD.md` §8), replacing the current client-side comparison, with the letter body encrypted at rest.
- **LocalStorage → account migration flow** (`AppFlow.md` §5) — non-blocking, dismissible, both storage paths readable until the user confirms migration.

## Future Ideas (Unscheduled, Worth Tracking)

- **Reply loop** — a recipient can write a letter back directly from the reading experience, closing the primary growth loop (`PRD.md` §8).
- **Scheduled/delayed delivery** — "open on our anniversary," "open after I'm gone."
- **Additional themes** — the four-theme system is a foundation, not a ceiling (`PRD.md` §8); any new theme must be added through the shared theme registry (`ARCHITECTURE.md` §11), never as a one-off.
- **Collections/albums** — grouping related letters into a bound "book" (e.g., a year of letters to a child).
- **Gentle, opt-in read receipts** — letting a writer know a letter was opened, designed carefully to avoid becoming a surveillance feature (`PRD.md` §8).
- **Light writing assistance** — explicitly *not* AI-generated letters (this would undermine the product's core value of authentic, personal words — see `PRD.md` §9 Non-Goals), but possibly gentle prompts/structure suggestions for someone staring at a blank page.

## Technical Debt

- **Routing library discrepancy** — resolve whether the project is standardized on `react-router-dom` (confirmed in current code) or migrating to TanStack Router (referenced in prior project notes); update `TRD.md` and `ROUTES.md` once resolved and delete the hedging language in both.
- **Unverified `CreateLetter.jsx` / `ViewLetter.jsx` / `LetterPreview.jsx` internals** — much of `COMPONENT_GUIDE.md`, `ARCHITECTURE.md`, and `ANIMATION_SYSTEM.md` currently documents these as "inferred" from prior context rather than confirmed from source. High priority: inspect these files directly and convert every inferred section to confirmed, correcting any inaccuracies found in the process.
- **No confirmed autosave/draft persistence** in `CreateLetter` — unsaved letters are currently at risk of being lost on accidental navigation; worth a small, high-value fix even ahead of the full V2 accounts work.
- **No storage-change listener across tabs** — `MyLetters` reads storage once via a lazy `useState` initializer and won't reflect changes made in another tab/window without a manual refresh.
- **Client-side-only password protection** — acceptable for the current LocalStorage-only threat model, but must not ship into a Supabase-backed world (V2) without the corresponding server-side hardening in `TRD.md` §8.

## Design Improvements

- Extend the featured-letter "paper" treatment introduced in the `My Letters` redesign to other surfaces where a single letter deserves emphasis (e.g., a "letter of the day" or similar future concept), while resisting the temptation to overuse the parchment/skeuomorphic treatment broadly (`DESIGN.md` §1, §9).
- Audit all hover-only interaction patterns for touch-device parity (`DESIGN.md` §15) — this should become a standing item in design review, not a one-time fix.
- Revisit theme registry (`lib/letterConfig.js`) to ensure it is genuinely the single source of truth consumed identically by `CreateLetter`, `LetterPreview`, and `ViewLetter` (`ARCHITECTURE.md` §11) — verify, don't assume.

## Backend Milestones (tracks Version 2)

1. Stand up Supabase project; define `letters` table schema per `TRD.md` §9 proposal (subject to revision into a proper ADR before implementation).
2. Implement Supabase Auth for account creation/sign-in.
3. Implement row-level security for write/delete; implement server-side (edge function or Postgres function) password verification for reads, since RLS alone cannot correctly gate share-by-link access (`TRD.md` §9).
4. Build the LocalStorage → account migration/import flow.
5. Cut over `lib/letterStorage.js`'s internals to call Supabase instead of `window.localStorage`, preserving its existing external function signatures (`getSavedLetters()`, `deleteLetter(id)`, etc.) so calling code across the app does not need to change (`ARCHITECTURE.md` §11).

## Mobile Roadmap

Lunareth is currently a responsive web app, not a native app. Given that recipients frequently open shared letters on mobile with zero prior context (`PRD.md` §4.2), **mobile web quality is a V1 concern, not a future one** — this roadmap section is specifically about a potential *native* mobile presence, which is a later-stage consideration:

1. **Near-term:** ensure the responsive web experience (especially the reading experience and its performance on mid-range devices, `TRD.md` §10) is fully solid before any native investment.
2. **Mid-term (post-V2 accounts):** evaluate whether a native app adds real value beyond what a well-built responsive web app + "Add to Home Screen" PWA treatment can offer — for a product this centered on a single, short, high-craft interaction, a heavy native investment may not be justified until account-based, repeat-usage patterns (the Archivist persona) are proven out.
3. **If pursued:** native investment should prioritize the writer's creation/archive experience over the reading experience, since the reading experience's zero-install, link-based nature is core to the product's frictionless recipient journey (`PRD.md` §4.2) and should not be gated behind an app install.
