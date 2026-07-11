# Changelog

All notable changes to Lunareth are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project intends to adhere to [Semantic Versioning](https://semver.org/) once it reaches a stable public API/release cadence.

**A note on historical accuracy:** entries under "Pre-Release History" below are **reconstructed from project context and conversation history**, not from git log or commit metadata. They are marked as reconstructed rather than presented as verified fact. Once real git history is available, this section should be corrected and re-derived from actual commits/tags, and this note removed.

---

## [Unreleased]

### Proposed
- Supabase-backed accounts, cross-device sync, and server-side password verification (`adrs/004-supabase-migration.md`, `BACKEND_SPEC.md`).
- Skip-animation flow for repeat letter opens (`AppFlow.md` §4).
- Reduced-motion support for the reading experience (`ROADMAP.md` v1.1).
- Reply-from-reading-experience loop (`ROADMAP.md` Future Ideas).

### Needs Verification
- Full contents and behavior of `CreateLetter.jsx`, `ViewLetter.jsx`, `LetterPreview.jsx`, `ReadingExperience.jsx`, `Envelope.jsx`, `PaperReveal.jsx`, and `LetterRenderer.jsx` — referenced throughout the documentation set as "Planned"/inferred pending direct inspection (see `COMPONENT_GUIDE.md`, `UI_INVENTORY.md`).

---

## Current Release Candidate

### Added
- Redesigned `MyLetters.jsx`: featured (newest) letter surfaced as a distinct parchment-styled card; wax-seal-inspired `SealBadge` replacing the plain lock emoji indicator; redesigned empty state; hover-revealed delete affordance on archive cards; inline SVG icon set replacing the prior emoji-only iconography. All existing routing, state management, delete flow, and password flow logic preserved unchanged during this redesign (per the explicit constraint given for that work).
- Full initial documentation suite: `PRD.md`, `TRD.md`, `AppFlow.md`, `DESIGN.md`, `ARCHITECTURE.md`, `ANIMATION_SYSTEM.md`, `COMPONENT_GUIDE.md`, `ROUTES.md`, `ROADMAP.md`, `CONTRIBUTING.md`.
- Extended documentation: five ADRs (`adrs/001`–`005`), `BACKEND_SPEC.md`, `UI_INVENTORY.md`, `DESIGN_TOKENS.md`, `FUTURE_ARCHITECTURE.md`, `AI/README.md`, `GLOSSARY.md`, this changelog.

### Known Issues / Open Items
- Routing library discrepancy between confirmed code (`react-router-dom`) and prior project notes (TanStack Router) — unresolved, tracked in `ROADMAP.md` Technical Debt and `adrs/001-react-router.md`.
- No confirmed autosave/draft persistence in letter creation.
- No confirmed cross-tab storage synchronization in `My Letters`.
- Client-side-only password protection — acceptable for current LocalStorage-only threat model, not acceptable once a backend exists (`adrs/003-localstorage.md`, `TRD.md` §8).

---

## Pre-Release History

*Reconstructed from project context; not derived from verified commit history. Version numbers below are illustrative groupings of known milestones, not confirmed tags.*

### [0.4] — Archive & Protection (reconstructed)
#### Added
- `My Letters` archive page: list of saved letters with theme, style, date, and recipient metadata.
- Delete flow, including a password-protected variant requiring correct password entry before deletion.
- Password protection on individual letters, enforced at both read and delete time.

### [0.3] — Reading Experience (reconstructed)
#### Added
- The envelope-opening reading experience: `ReadingExperience`, `Envelope`, `PaperReveal`, `LetterRenderer`, built around the single-`extractionProgress`-value architecture now documented in `ANIMATION_SYSTEM.md`.
#### Fixed
- Multiple animation regressions (flicker, premature/delayed content reveal, visual desync under fast interaction) caused by an earlier architecture that distributed reveal-state logic across more than one component. Resolved by centralizing all reveal state into `extractionProgress` and making downstream components pure functions of it — this fix is the direct origin of the architectural rules documented in `ANIMATION_SYSTEM.md` and `adrs/005-envelope-animation-architecture.md`. *(Reconstructed: the fact that this class of regression occurred and was fixed this way is carried over from prior project context; specific dates, PR numbers, or exact symptom descriptions beyond what's already reflected in `ANIMATION_SYSTEM.md` §8 are not available and should not be assumed.)*

### [0.2] — Theming (reconstructed)
#### Added
- The four-theme system: Moonlit (Georgia), Old Paper (Palatino), Dark Aesthetic (Courier New), Minimal (Inter), applied across letter creation and reading surfaces.

### [0.1] — Foundation (reconstructed)
#### Added
- Initial project scaffold: Vite + React, Tailwind CSS, `react-router-dom` routing, LocalStorage-based persistence via `lib/letterStorage.js`.
- Initial letter creation and reading flow (pre-dating the dedicated envelope animation system).

---

## Future Releases (Planned Sequencing)

See `ROADMAP.md` for full detail; summarized here for changelog continuity once these actually ship:

- **v1.1** — Reduced-motion support, skip-animation flow, graceful storage-failure/letter-not-found states, screen-reader handling for the always-rendered `LetterRenderer` content, touch-friendly action affordances.
- **v2.0** — Supabase-backed accounts and cross-device sync, server-side password verification, LocalStorage-to-account migration flow.
- **Unscheduled** — Reply loop, scheduled/delayed delivery, additional themes, collections/albums, gentle opt-in read receipts, light (non-generative) writing assistance.

---

## Maintenance Note

This changelog should be updated as part of the same PR that introduces a change, not retroactively — per `CONTRIBUTING.md` §8's broader principle that documentation is part of the definition of done. When a version is actually tagged/released, move its entries from `[Unreleased]`/`Current Release Candidate` into a dated, numbered section following Keep a Changelog conventions, and replace any remaining "(reconstructed)" labels in this file with verified history as it becomes available.
