# ADR 001: Routing Library

**Status:** Accepted (with an open verification item — see Note)
**Date:** Backfilled — written after the fact from observed code, not at the time of the original decision.

## Context

Lunareth needs client-side routing for a small, fixed set of pages (`/`, `/create`, `/my-letters`, `/letter/:id`) plus a dynamic segment for individual letters. The project is a Vite + React SPA with no confirmed server-side rendering layer.

## Decision

Use **`react-router-dom`**, with declarative `<Link>` components for internal navigation and a route table defined directly in `App.jsx` (or equivalent root component) rather than a file-based routing convention.

## Why

- `react-router-dom` is the most established routing solution for React SPAs, with the largest ecosystem and lowest onboarding cost for new contributors.
- Lunareth's route set is small and stable; the more opinionated file-based/type-safe routing conventions offered by newer routers (e.g., TanStack Router) provide the most value on large, rapidly-growing route trees — not a strong fit for a project this size today.
- Confirmed directly in shipped code: `MyLetters.jsx` imports `Link` from `react-router-dom` and uses it for all internal navigation (`/create`, `/letter/:id`).

## Why Not TanStack Router

Prior project notes referenced TanStack Router as (or as a planned migration to) the routing layer, and explicitly noted that no `routes/` folder exists — which is itself more consistent with `react-router-dom`'s typical setup (route table in code) than with TanStack Router's file-based convention. This ADR treats the TanStack Router references as either a stale note from an earlier exploration that didn't ship, or an unstarted migration plan — **not** as the current state of the codebase.

## Consequences

- New routes are added by editing the central route table, not by adding a file to a `routes/` folder — this should not be "fixed" by introducing a `routes/` folder without also completing a real migration to a file-based router.
- If TanStack Router migration is genuinely desired (e.g., for its built-in type-safe params, search-param validation, and loader/data-fetching integration — all of which become more valuable once Lunareth has a real backend, per ADR 004), it should be proposed as a new, explicit ADR that supersedes this one, not silently mixed in.

## Open Verification Item

Whoever next touches routing should confirm definitively which router is installed and in use (check `package.json` and `App.jsx` directly), update this ADR's Status to reflect ground truth, and remove the hedging language from `TRD.md` and `ROUTES.md` once resolved.
