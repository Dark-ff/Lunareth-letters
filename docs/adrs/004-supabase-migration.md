# ADR 004: Supabase for Backend Migration

**Status:** Proposed — not yet implemented
**Date:** Backfilled — written after the fact from observed project context.

## Context

LocalStorage-only persistence (ADR 003) creates a hard ceiling on Lunareth's product ambitions: no accounts, no cross-device sync, no real security for password-protected letters, and total, unrecoverable data loss on cleared browser storage (`PRD.md` §16). Version 2 of the roadmap (`ROADMAP.md`) requires a real backend.

## Decision

Adopt **Supabase** (Postgres + Auth + Row-Level Security + Storage) as Lunareth's backend, replacing LocalStorage as the source of truth for letters while preserving `lib/letterStorage.js`'s existing external function signatures.

## Why

- Supabase bundles the three primitives Lunareth actually needs — a relational database, authentication, and row-level access control — without requiring the team to stand up and operate separate services for each.
- Postgres is a strong fit for Lunareth's data model, which is relatively simple and relational (users, letters, and eventually shares/opens) rather than needing a document or graph store.
- Row-Level Security maps naturally onto "a letter is writable/deletable only by its owner" — one of Lunareth's two core access rules.

## The One Real Wrinkle: Share-by-Link Reads

Lunareth's second core access rule — "a letter is readable by anyone with the link, account or not" (`AppFlow.md` §5, non-negotiable per `PRD.md` §4.2's zero-context recipient journey) — does **not** map cleanly onto RLS alone, since RLS is fundamentally about *authenticated* row ownership, not anonymous link-based access. The decision is to handle unauthenticated reads (and password verification for protected letters) through a **Postgres function or edge function** that performs the password check server-side and returns the letter body only on success, rather than trying to express "readable by anyone who knows the ID and, if applicable, the password" as an RLS policy directly. See `BACKEND_SPEC.md` for the concrete function/policy design.

## Alternatives Considered

- **Firebase:** a reasonable alternative with a similar all-in-one philosophy; Postgres was preferred over Firestore for Lunareth's relatively relational data shape and because SQL gives more straightforward reasoning about the anonymous-read-with-password-check pattern above.
- **Custom Node/Express + Postgres:** more control, but meaningfully more operational overhead (auth, hosting, migrations) for a small team, without a clear benefit over Supabase at Lunareth's current and near-term scale.
- **Staying on LocalStorage indefinitely:** rejected — this directly caps the product's addressable use cases (Archivist persona, cross-device use, real password security) and leaves the single highest-severity product risk unaddressed indefinitely.

## Consequences

- `lib/letterStorage.js`'s exported function signatures (`getSavedLetters()`, `deleteLetter(id)`, etc.) must remain stable through this migration — only their internals change, from LocalStorage calls to Supabase client calls. See ADR 003's consequences re: these becoming async-shaped ahead of time to smooth this transition.
- A LocalStorage → account migration/import flow is required (`AppFlow.md` §5) so existing users don't lose their pre-migration archive.
- Password-protected letters move from client-side plaintext comparison to server-side hashed verification (bcrypt/argon2), with the letter body encrypted at rest and only decrypted after successful server-side password verification (`TRD.md` §8).
- See `BACKEND_SPEC.md` for the full schema, RLS policies, and function designs this ADR implies.

## Status Note

This ADR documents *intent*, matching `TRD.md` §9's framing. It should be updated to "Accepted" (or revised/rejected) once real implementation work begins, and `BACKEND_SPEC.md` should be treated as the living detailed design that this ADR summarizes at a decision level.
