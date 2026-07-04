# Lunareth — Technical Requirements Document (TRD)

**Status:** Living document
**Owner:** Engineering
**Companion documents:** `ARCHITECTURE.md`, `ANIMATION_SYSTEM.md`, `COMPONENT_GUIDE.md`, `ROUTES.md`

---

> **A note on accuracy before anything else:** This document is written from the actual code observed (`MyLetters.jsx`) plus prior project context. Where those two sources disagree, this document says so explicitly rather than guessing. The most important disagreement: prior project notes describe **TanStack Router** as the routing solution, but the production `MyLetters.jsx` file imports `Link` from **`react-router-dom`**. This TRD documents `react-router-dom` as the confirmed, currently-in-use router, and flags TanStack Router as either a planned migration or a stale note — **this needs to be resolved by whoever maintains the repo and this line deleted once confirmed.**

---

## 1. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Build tool | Vite | Fast dev server, ESM-native build |
| UI library | React | Function components + hooks throughout |
| Routing | `react-router-dom` (confirmed in code) | See note above re: TanStack Router |
| Styling | Tailwind CSS (v4 per prior project notes) | Utility-first; arbitrary values used liberally for brand colors (e.g. `#b8a2ff`) |
| Animation | Framer Motion | Used for the reading experience and any choreographed transitions |
| Persistence | LocalStorage (`letterStorage.js`) | No backend at present; see Section 9 for future Supabase plan |
| Icons | Inline SVG | No icon package dependency confirmed; keep it this way unless a real need for an icon set emerges |

## 2. Folder Structure

The following reflects confirmed import paths from `MyLetters.jsx` plus reasonable inference. Treat anything marked "(inferred)" as needing verification against the actual repo tree.

```
src/
├── components/
│   └── Navbar.jsx                  # confirmed — global nav, rendered on non-reading pages
├── lib/
│   ├── letterConfig.js             # confirmed — exports formatLetterDate(), likely theme/style config
│   └── letterStorage.js            # confirmed — exports getSavedLetters(), deleteLetter()
├── pages/ (inferred)
│   ├── MyLetters.jsx                # confirmed
│   ├── CreateLetter.jsx             # referenced in prior notes, not yet inspected
│   ├── ViewLetter.jsx               # referenced in prior notes, not yet inspected
│   └── LetterPreview.jsx            # referenced in prior notes, not yet inspected
├── components/reading/ (inferred)
│   ├── ReadingExperience.jsx        # owns extractionProgress state — see ANIMATION_SYSTEM.md
│   ├── Envelope.jsx                 # converts extractionProgress → translateY
│   ├── PaperReveal.jsx              # always-mounted, "dumb" presentational component
│   └── LetterRenderer.jsx           # renders full letter content from frame one
└── App.jsx (inferred)               # route table lives here per prior notes; no routes/ folder exists
```

**Important structural fact carried over from prior project context:** there is **no `routes/` directory**. Route definitions live directly in `App.jsx` (or equivalent root component), not in a file-based routing convention. Any documentation or tooling that assumes file-based routing (common with TanStack Router's conventions) is describing a target state, not the current one — reinforcing the routing-library discrepancy flagged above.

## 3. Rendering Architecture

Lunareth is a client-rendered single-page application (Vite + React, no confirmed SSR/SSG layer). All pages render fully on the client after the JS bundle loads. This has two direct consequences worth documenting:

- **No SEO-critical content should depend on Lunareth for discovery.** Shared letter links are consumed by people who already have the link (via text/email), not discovered via search, so CSR is an acceptable tradeoff today.
- **First paint matters most for the reading experience**, since a recipient's very first impression of the product is the envelope animation. Any future SSR/streaming work should prioritize the `/letter/:id` route first.

## 4. Component Hierarchy (high-level)

```
App
├── Navbar                     (rendered on all pages EXCEPT the reading experience)
├── Routes
│   ├── / (landing — not yet inspected)
│   ├── /create → CreateLetter
│   ├── /my-letters → MyLetters
│   │     └── Badge, SealBadge (local subcomponents)
│   └── /letter/:id → ViewLetter
│         └── ReadingExperience
│               ├── Envelope
│               ├── PaperReveal
│               └── LetterRenderer
```

`ViewLetter` intentionally omits `Navbar` — this is a deliberate design decision (see `PRD.md` §13 and `COMPONENT_GUIDE.md`), not an oversight, and must not be "fixed" by a future contributor unfamiliar with the reasoning.

## 5. State Management

Lunareth does not use a global state library (no Redux/Zustand/Context-heavy architecture confirmed). State is managed with local component state (`useState`) at the page level, following React's default data-down/callbacks-up model:

- `MyLetters` owns its own `letters`, `letterToDelete`, `deletePassword`, and `deleteError` state — all UI/interaction state scoped to that page.
- `ReadingExperience` owns `extractionProgress` (a single float, 0→1) as the sole source of truth for the entire reading animation — see `ANIMATION_SYSTEM.md` for why this centralization matters.

**Convention going forward:** prefer lifting state only as high as the components that actually need it, and avoid introducing a global store unless multiple, unrelated routes need to share live state (accounts/auth, once introduced, will likely be the first legitimate case).

## 6. Routing

Confirmed: `react-router-dom`, using `<Link to="...">` for navigation (no raw `<a>` tags for internal routes, which correctly preserves client-side routing).

Confirmed routes referenced in code:
- `/create` — create a new letter
- `/letter/:id` — read a specific letter (dynamic segment)
- `/my-letters` (inferred path, page is `MyLetters.jsx`)

See `ROUTES.md` for the full route table and entry/exit conditions.

## 7. Storage

Current persistence is entirely client-side via `letterStorage.js`, which wraps `window.localStorage`. Confirmed exports:
- `getSavedLetters()` — returns the array of saved letter objects.
- `deleteLetter(id)` — removes a letter by id.

Letter object shape (inferred from usage in `MyLetters.jsx`):

```ts
type Letter = {
  id: string
  title?: string
  createdAt?: string | number   // consumed by formatLetterDate()
  theme?: string
  style?: string
  recipient?: string
  password?: string             // plaintext, client-side only — see Security section
}
```

**This is almost certainly not the complete shape** — the letter body/content field is not referenced anywhere in `MyLetters.jsx` since that page only renders metadata. `CreateLetter.jsx` and `ViewLetter.jsx` should be inspected directly to confirm the full schema (likely includes a `body` or `content` field, and possibly per-theme rendering data) before this section is treated as authoritative.

### 7.1 Known limitations
- Single-browser, single-device. Clearing site data destroys the archive permanently (see `PRD.md` Risks).
- No sync across devices or browsers.
- No backup/export mechanism currently documented.

## 8. Security

Be precise and honest here, since this is the section most likely to be over-claimed:

- **Password protection is client-side only.** A `password` field is stored and compared in the browser. This deters casual access (e.g., someone else picking up the writer's phone) but is **not** cryptographically secure storage, and is not resistant to a technically sophisticated user inspecting LocalStorage directly.
- **No encryption at rest is confirmed.** Until server-side storage exists, this should not be marketed or assumed to be "secure" in any strong sense — the `PRD.md` NFR3 language ("must not be trivially bypassable... beyond the inherent limits of a client-only storage model") is intentionally hedged for this reason.
- **Recommendation for any future backend work:** password-protected letters should move to server-side hashed comparison (bcrypt/argon2) with the letter body encrypted at rest, decrypted only after successful password verification server-side.

## 9. Future Supabase Architecture

This section documents intent, not shipped infrastructure.

**Why Supabase:** it offers Postgres + auth + row-level security + storage in one product, which maps well onto Lunareth's near-term needs (accounts, cross-device sync, real access control on protected letters) without standing up bespoke infrastructure.

Proposed shape:

```
Tables
├── users                  (Supabase Auth-managed)
├── letters
│   ├── id (uuid, pk)
│   ├── owner_id (fk → users.id)
│   ├── title
│   ├── recipient
│   ├── theme
│   ├── style
│   ├── body (encrypted at rest if password_hash is set)
│   ├── password_hash (nullable)
│   ├── created_at
│   └── updated_at
└── letter_opens (optional, for future read-receipt feature)
    ├── letter_id (fk)
    ├── opened_at
    └── metadata (best-effort, privacy-respecting)
```

**Row-level security (RLS):** a letter should only be writable/deletable by its `owner_id`. Read access is more nuanced: a letter must be readable by anyone with the link (since Lunareth is share-by-link, not share-by-account), which means RLS alone can't gate reads — a Postgres function or edge function validating the password (server-side) before returning `body` is the safer pattern, rather than relying on RLS + client-side filtering.

**Migration path from LocalStorage:** on first authenticated session after the migration ships, detect existing LocalStorage letters and offer to import them into the user's new Supabase-backed account, rather than silently discarding local history.

This section should be rewritten as an ADR (Architecture Decision Record) once Supabase work actually begins, with the final schema replacing this proposal.

## 10. Performance

- The envelope-opening animation is the single most performance-sensitive surface in the app (see `PRD.md` NFR1). Framer Motion transforms (translateY, scale) should be preferred over animating layout-triggering properties.
- Avoid animating `opacity` as a substitute for the geometry-based reveal system described in `ANIMATION_SYSTEM.md` — this is both an architectural rule and, incidentally, a performance one, since geometry-based transforms are cheaper to composite than repeated opacity/paint changes on large text blocks.
- LocalStorage reads (`getSavedLetters()`) are synchronous; keep the stored payload small per letter, since a growing archive means a growing synchronous read on every `MyLetters` mount.

## 11. Accessibility

- Keyboard: all interactive elements (links, buttons, the password input in the delete modal) must be reachable and operable via keyboard; visible focus rings should not be removed for aesthetic reasons — use `focus-visible` styling instead of suppressing outlines outright.
- Screen readers: password-protection indicators (the wax-seal badge) must carry an accessible label (`aria-label="Password protected"`), not rely on the icon alone.
- Reduced motion: the envelope/reading experience should check `prefers-reduced-motion` and offer a substantially shortened or instant transition path for users who have that preference set at the OS level. This is not yet confirmed as implemented and should be treated as an open item — see `ROADMAP.md` technical debt.

## 12. Animation Architecture

Fully documented in `ANIMATION_SYSTEM.md`. Summary for TRD purposes: a single `extractionProgress` float (0→1), owned by `ReadingExperience`, drives all visual state in the reading experience. No component below `ReadingExperience` should introduce its own competing source of truth for "how open is the letter."

## 13. Error Handling

- Storage failures (LocalStorage unavailable, quota exceeded, or corrupted JSON) should degrade to an empty-state UI rather than throwing an unhandled exception that blanks the page. `getSavedLetters()` should be defensive internally (try/catch around `JSON.parse`), returning `[]` on failure.
- A `/letter/:id` route that resolves to no matching letter should render a clear "this letter could not be found" state, not a blank screen or a raw JS error — this matters disproportionately here because the recipient has no other context for what went wrong.
- Password mismatch errors (both for reading and deleting) should be inline, specific, and non-blocking — matching the pattern already used in `MyLetters.jsx`'s delete flow (`deleteError` state, inline message).

## 14. Build System

Vite is the confirmed build tool. Standard expectations:
- `npm run dev` for local development.
- `npm run build` for production bundles.
- Environment-specific config (e.g., future Supabase keys) should go through Vite's `import.meta.env` convention with a `.env.example` checked into the repo (without secrets) once a backend exists.

## 15. Deployment

Not yet confirmed in available materials. As a static-output Vite SPA, Lunareth is deployable to any static host (Vercel, Netlify, Cloudflare Pages) with SPA fallback routing configured (all paths → `index.html`) so that direct visits to `/letter/:id` don't 404 at the host level.

## 16. Coding Conventions

Observed conventions from `MyLetters.jsx`, to be treated as the house style until a linter config says otherwise:
- Function components, no class components.
- No semicolons omitted inconsistently — actually: **no semicolons at all**, consistently. Preserve this.
- Named, descriptive handler functions (`requestDelete`, `confirmDelete`, `closeDeleteDialog`) rather than inline arrow functions for anything with real logic.
- Tailwind utility classes directly in JSX; no CSS Modules or styled-components observed.
- Small, page-local presentational subcomponents (e.g., `Badge`) defined at the top of the page file rather than extracted prematurely into `components/` — extract to a shared location only once a second, unrelated page needs the same component.

## 17. Extension Guidelines

- New themes are additive: add the new font/texture/color tokens to `letterConfig.js` (or wherever the theme registry lives) and ensure `CreateLetter`, `LetterPreview`, and `ViewLetter` all consume the same registry — never hardcode a theme's visual rules in more than one place.
- New reading-experience features (e.g., a "reply" CTA) should be added as new components composed alongside `ReadingExperience`, not by adding new responsibilities into `Envelope`, `PaperReveal`, or `LetterRenderer` — see `ANIMATION_SYSTEM.md` for why these three must stay single-purpose.
- Any feature requiring persistent state beyond a single page should be evaluated against Section 9's future Supabase plan before reaching for a new client-side-only storage hack.
