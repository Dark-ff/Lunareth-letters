# Lunareth — Future Architecture (Post-Supabase)

**Status:** Proposed — this entire document describes a target state, not shipped infrastructure. Nothing here should be read as "how Lunareth currently works." Current-state architecture lives in `TRD.md` and `ARCHITECTURE.md`.
**Owner:** Engineering
**Companion documents:** `TRD.md` §9, `BACKEND_SPEC.md`, `adrs/004-supabase-migration.md`

---

## 1. Purpose

This document describes the target system architecture once Lunareth moves from LocalStorage-only persistence (`adrs/003-localstorage.md`) to a Supabase-backed backend (`adrs/004-supabase-migration.md`, `BACKEND_SPEC.md`). It exists to give engineers a single picture of the whole system — client through storage and CDN — so that individual pieces (auth, edge functions, caching) are built with the full target shape in mind, rather than each in isolation.

**Nothing in this document is implemented today.** Every diagram and section describes intent.

## 2. High-Level Request Flow

```
                 ┌─────────────┐
                 │   Browser    │
                 └──────┬───────┘
                        │
                        ▼
                 ┌─────────────┐
                 │    React     │  (Vite-built SPA, client-rendered)
                 └──────┬───────┘
                        │
                        ▼
                 ┌─────────────┐
                 │React Router  │  (or its eventual successor — see ADR 001)
                 │  (client-side│
                 │   route      │
                 │   resolution)│
                 └──────┬───────┘
                        │
          ┌─────────────┼──────────────────┐
          ▼                                ▼
  ┌───────────────┐               ┌──────────────────┐
  │ Supabase Auth   │               │  Direct anonymous  │
  │ (writer/owner    │               │  read path          │
  │  sessions)       │               │  (recipient reading  │
  └────────┬────────┘               │  a shared letter)    │
           │                        └──────────┬───────────┘
           ▼                                   │
  ┌───────────────────┐                        │
  │  Edge Functions      │◄──────────────────────┘
  │  (password verify,   │   both paths converge here for
  │   encrypted body      │   any letter-content access
  │   decrypt on success) │
  └──────────┬────────────┘
             │
             ▼
     ┌───────────────┐
     │   Postgres      │  (Supabase-managed, with RLS — see BACKEND_SPEC.md)
     └───────┬───────┘
             │
             ▼
     ┌───────────────┐
     │   Storage       │  (Supabase Storage — future attachments/media)
     └───────┬───────┘
             │
             ▼
     ┌───────────────┐
     │      CDN        │  (static asset + attachment delivery)
     └───────────────┘
```

**The one detail worth calling out explicitly:** unlike a typical authenticated-app diagram, Lunareth's request flow has two legitimate entry paths into the data layer — an authenticated writer/owner path (via Supabase Auth) and an anonymous recipient-reading-a-shared-link path — and **both must converge through the same edge function layer** for actual letter content access, rather than the anonymous path bypassing access control entirely or the authenticated path assuming every reader has a session. This directly reflects the RLS limitation discussed in `adrs/004-supabase-migration.md` and detailed in `BACKEND_SPEC.md` §4.

## 3. Authentication

**Proposed:** Supabase Auth handles writer/owner account creation and session management (email/password and/or OAuth providers — specific provider choice not yet decided, Needs Definition).

**Hard constraint carried over from current architecture and product requirements:** recipients reading a shared letter must **never** be required to authenticate (`AppFlow.md` §5, `PRD.md` §4.2). Auth in this target architecture exists for writers managing their archive, not as a gate on reading. Any future design that makes reading a shared link require a Supabase session would violate this constraint and should be rejected in review.

## 4. Database

Full schema, ER diagram, and RLS policy design live in `BACKEND_SPEC.md` — this document does not duplicate that detail. Summary for architectural context only: Postgres via Supabase, with a `letters` table as the core entity, owner-scoped RLS for writes, and an edge-function-mediated path for anonymous/password-gated reads (Section 2 above).

## 5. Storage

**Proposed / Future:** Supabase Storage is the target location for letter attachments (images, media embedded in a letter — see `BACKEND_SPEC.md` §3.3, itself marked speculative). This is not required for the core V2 accounts/sync milestone (`ROADMAP.md`) and should not be built ahead of an actual attachments feature being scheduled.

## 6. Realtime

**Not currently planned as a near-term feature**, but worth noting as a target-architecture consideration: Supabase's realtime capabilities could eventually support a live "letter opened" notification to the writer (tied to the future `letter_opens` table in `BACKEND_SPEC.md` §3.2 and the gentle, opt-in read-receipts idea in `PRD.md` §8). This should remain unscheduled/speculative until read receipts are actually prioritized — do not build realtime infrastructure ahead of a concrete feature need.

## 7. Caching

**Proposed:** Given Lunareth is a client-rendered SPA (no confirmed SSR, `TRD.md` §3), caching considerations for this target architecture are primarily:
- **CDN-level caching** of the built static assets (JS/CSS bundles) — standard for any SPA deployment, handled by whichever static host is used (`TRD.md` §15).
- **Edge-function response caching:** deliberately **not** applied to the password-verification/letter-read edge function described in Section 2 — caching a response that depends on a submitted password would be a serious security defect. Any caching layer introduced here must exclude this function's responses explicitly.
- **Client-side query caching** (e.g., via a data-fetching library, if one is adopted alongside the Supabase migration) for the authenticated `My Letters` list view, where staleness tolerance is much higher than for the security-sensitive read path.

## 8. Deployment

**Confirmed (current):** Vite-built static SPA, deployable to any static host with SPA fallback routing (`TRD.md` §15, `ROUTES.md`).

**Proposed (target):** The same static-hosting deployment model continues post-Supabase-migration — Supabase is a separate managed backend, not something that changes how the frontend itself is built or deployed. Edge functions deploy through Supabase's own function deployment tooling, separately from the frontend's static asset deployment.

## 9. Environment Variables

**Proposed (Needs Definition — exact variable names TBD at implementation time):**

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL, consumed via Vite's `import.meta.env` convention (`TRD.md` §14) |
| `VITE_SUPABASE_ANON_KEY` | Public anon key for client-side Supabase client initialization |
| (server/edge-function-only, not exposed to the client) | Any service-role or encryption-related secrets used inside edge functions — must **never** be prefixed with `VITE_` or otherwise bundled into client code, since anything with that prefix is publicly readable in the shipped JS bundle |

A `.env.example` (without real secrets) should be checked into the repository once this work begins, per `TRD.md` §14.

## 10. Future Mobile Architecture

Per `ROADMAP.md`'s Mobile Roadmap: no native mobile architecture is currently planned as near-term work. If pursued later, the most likely shape (Proposed, speculative) would be:

```
Native shell (React Native or platform-native)
        │
        ▼
Same Supabase backend (Auth, Postgres, Edge Functions, Storage)
        │
        ▼
Shared or parallel data layer to the web client
```

The key architectural principle carried forward from `ROADMAP.md`: any native investment should prioritize the writer's creation/archive experience, not the reading experience — the zero-install, link-based nature of reading a shared letter is core to the product's frictionless recipient journey and should not be gated behind a native app install, regardless of what other native capabilities exist.

## 11. Possible Notification System

**Speculative / Future, not scheduled:** if gentle, opt-in read receipts (`PRD.md` §8) or a future reply-loop feature (`ROADMAP.md`) are prioritized, a notification system (email via a transactional provider, or web push) could inform a writer that their letter was opened or replied to. Design constraints, if this is ever built:
- Must remain genuinely opt-in, not a default-on engagement mechanic (`PRD.md` §2 "Calm by default").
- Should not require the recipient to have done anything beyond opening the link — the notification is to the *writer*, not a nudge back to the *recipient*.
- Should be built on top of the `letter_opens` table design already sketched in `BACKEND_SPEC.md` §3.2, rather than introducing a separate, parallel event-tracking system.

## 12. What This Document Does Not Cover

- Exact schema/RLS detail — see `BACKEND_SPEC.md`.
- The rationale for choosing Supabase over alternatives — see `adrs/004-supabase-migration.md`.
- Any commitment to timeline or sequencing — see `ROADMAP.md` for that.

This document should be revisited and corrected against reality as soon as any part of this target architecture actually ships — at that point, split the "confirmed" portions out into `TRD.md`/`ARCHITECTURE.md` proper, and keep this document scoped to whatever remains genuinely future/proposed.
