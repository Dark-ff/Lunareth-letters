# ADR 003: LocalStorage as the Current Persistence Layer

**Status:** Accepted for V1; superseded by ADR 004 for V2 and beyond
**Date:** Backfilled — written after the fact from observed project context.

## Context

Lunareth needed a persistence mechanism for letters (title, recipient, theme, body, optional password) before any backend infrastructure existed. The MVP scope (`PRD.md` §7) deliberately excludes accounts and cross-device sync.

## Decision

Use the browser's **LocalStorage**, accessed exclusively through a single abstraction module, `lib/letterStorage.js` (confirmed exports: `getSavedLetters()`, `deleteLetter(id)`), rather than calling `window.localStorage` directly from pages or components.

## Why

- Zero infrastructure cost and zero setup friction for an MVP whose primary goal was validating the core reading/writing experience, not building durable, multi-device infrastructure.
- No account system existed yet, and none was in MVP scope — LocalStorage requires no auth model to have *some* form of persistence per browser.
- Centralizing access behind one module (rather than scattering `localStorage.getItem`/`setItem` calls across pages) was a deliberate choice specifically to make a future migration (ADR 004) a contained, single-file change rather than a codebase-wide refactor.

## Consequences

- **Data loss risk:** clearing browser data destroys a user's entire letter archive with no recovery path. This is documented as the highest-severity current product risk (`PRD.md` §16) and is the direct motivation for ADR 004.
- **No cross-device access:** a letter created on one device/browser is invisible on another. Acceptable for MVP; not acceptable long-term (see `PRD.md` §8 Future Scope).
- **Weak security model for passwords:** password comparison happens entirely client-side against plaintext stored in LocalStorage. This was an accepted tradeoff for MVP given the absence of a backend to verify against server-side, but must not be treated as genuine security — see `TRD.md` §8 for the explicit, intentionally hedged language around this limitation, and ADR 004 for the planned fix.
- **Synchronous reads:** `getSavedLetters()` is a synchronous call, which was simple to build against but will need to become an async-shaped API (even before the actual backend swap) to avoid a breaking change in calling code once ADR 004 ships — see `TRD.md` §17 Extension Guidelines and the corresponding `ROADMAP.md` tech-debt entry.

## Supersession

This decision is intentionally temporary. ADR 004 documents the planned migration to Supabase-backed storage; `lib/letterStorage.js`'s external function signatures are designed to remain stable across that migration so calling code does not need to change.
