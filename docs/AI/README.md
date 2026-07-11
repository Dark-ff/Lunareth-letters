# Lunareth — AI Assistant Onboarding

**Read this in full before writing or modifying any code in this repository.** This document exists specifically to stop an AI assistant with no memory of prior sessions from reintroducing bugs and design regressions that have already happened once and were fixed deliberately. Skipping this document is the single most common way an otherwise-reasonable change causes real damage here.

---

## 1. Project Philosophy (Read This First)

Lunareth is a premium digital letter platform built on a simple, load-bearing idea: **the opening moment is the product** (`PRD.md` §2). Everything else — themes, storage, the archive page — exists in service of making a recipient feel like someone took real, specific time for them.

Consequences that should shape every suggestion you make:
- Friction is sometimes correct. Do not "simplify away" a password gate, a deliberate animation, or a confirmation step without checking whether that friction is intentional (`PRD.md` §2).
- Restraint is a feature. Lunareth intentionally avoids messaging-app engagement mechanics — no streaks, no unread badges, no growth hacks (`PRD.md` §9 Non-Goals). Do not propose these even when they're common in "similar" apps.
- One accent color, one signature moment, considered typography. Resist the pull toward generic "premium SaaS dashboard" tropes (bento grids, glassmorphism-everywhere, gradient-everything) unless they serve specific Lunareth content (`DESIGN.md` §16).

## 2. Architecture Summary

- Client-rendered Vite + React SPA, `react-router-dom` for routing (see `adrs/001-react-router.md` for why, and a flagged discrepancy with older project notes about TanStack Router — verify before assuming).
- No global state library. State lives at the page level (`ARCHITECTURE.md` §5, §9).
- Persistence is currently LocalStorage only, accessed exclusively through `lib/letterStorage.js` (`adrs/003-localstorage.md`) — never call `localStorage` directly from a page or component.
- The reading experience (`ReadingExperience`, `Envelope`, `PaperReveal`, `LetterRenderer`) is governed by a strict single-state-value architecture — see Section 5 below, this is the part of the codebase most likely to break from a well-intentioned but architecture-violating change.
- A Supabase-backed backend is **proposed, not implemented** (`adrs/004-supabase-migration.md`, `BACKEND_SPEC.md`, `FUTURE_ARCHITECTURE.md`). Do not write code that assumes Supabase exists in the current repository unless you have directly confirmed it's been set up.

## 3. Required Reading Order

Before touching code, read in this order:

1. `PRD.md` §2 (Product Philosophy) and §11 (Product Principles)
2. `ARCHITECTURE.md` (where logic belongs / must never belong)
3. `ANIMATION_SYSTEM.md` **in full**, if your task touches anything under `ReadingExperience` — not optional, not skimmable
4. `DESIGN.md`, if your task touches visual/UI work
5. `COMPONENT_GUIDE.md` and `UI_INVENTORY.md`, for the specific component(s) you're modifying — check whether they're marked **Confirmed** or **Planned/Needs Verification** before trusting the description
6. `TRD.md`, if your task touches storage, security, or build/deploy concerns
7. `CONTRIBUTING.md`, before opening or describing a PR

If your task is narrow (e.g., a copy change in `MyLetters.jsx`), you don't need all of the above — but you should still confirm you're not touching anything governed by `ANIMATION_SYSTEM.md`'s rules before assuming a change is "just a small tweak."

## 4. Coding Rules

- Function components only, no class components.
- No semicolons — match the existing house style exactly (`TRD.md` §16).
- Named, descriptive handler functions for real logic (`requestDelete`, not an anonymous inline arrow function with a body).
- Tailwind utility classes directly in JSX. No CSS Modules, no styled-components, no new CSS-in-JS library.
- Persistence goes through `lib/letterStorage.js`'s existing function signatures — never `window.localStorage` directly from a component, even "just this once."
- Keep new presentational components page-local until a second, unrelated page genuinely needs them (`ARCHITECTURE.md` §3.3).
- Do not add a new animation library alongside Framer Motion (`adrs/002-framer-motion.md`) — use what's already established.

## 5. Animation Rules (Non-Negotiable)

Full detail in `ANIMATION_SYSTEM.md` and `adrs/005-envelope-animation-architecture.md`. The short version, because this is the rule most likely to be violated by an assistant that hasn't read the full document:

- `extractionProgress` (0→1) is owned **only** by `ReadingExperience`. No other component may set it or maintain a parallel version of it.
- `Envelope`, `PaperReveal`, and `LetterRenderer` are pure functions of `extractionProgress`. No independent state. No opacity-based reveal. No conditional rendering of letter content based on progress.
- `LetterRenderer` always renders the full letter from frame one. Visibility is achieved through geometry (position/clipping), never through hiding/showing the content itself.
- The envelope sinks on completion, continuing its established motion direction — it does not fade, and it does not reverse direction.
- If a proposed feature seems to require breaking any of the above, the fix is to change how something is *derived from* `extractionProgress`, not to add a new independent state variable. This has caused real, shipped regressions before (`ANIMATION_SYSTEM.md` §8) — treat any temptation to work around this architecture as a signal to stop and reconsider, not a sign the architecture is wrong.

## 6. Design Rules

- One primary accent color (`#b8a2ff` moonlight lavender) does the work across most UI; the wax-seal crimson is reserved exclusively for password-protection indicators, never generic destructive actions (`DESIGN.md` §4, `DESIGN_TOKENS.md` §1).
- Skeuomorphism (paper texture, wax-seal styling) is intentional only on the featured/paper letter surface — everywhere else, restraint (`DESIGN.md` §1, §9).
- Every screen must remain legible and appropriate to someone with zero prior context — the recipient persona has no account, no onboarding, and may be in any emotional state (`PRD.md` §4.2). Design and copy choices should be tested against this persona specifically, not just the writer's.
- Accessibility is not optional polish: visible focus states, non-color signaling, keyboard operability, and eventual `prefers-reduced-motion` handling are requirements, not nice-to-haves (`DESIGN.md` §14, `TRD.md` §11).

## 7. Things to Never Change

- Do not reintroduce `Navbar` into `ViewLetter`. This is a deliberate design decision, not an oversight (`ARCHITECTURE.md` §2, `PRD.md` §13).
- Do not make reading a shared letter link require an account or session, now or in any future authenticated-backend design (`AppFlow.md` §5, `PRD.md` §4.2, `FUTURE_ARCHITECTURE.md` §3). This is a hard product constraint, not an MVP simplification.
- Do not change `lib/letterStorage.js`'s external function signatures without a coordinated update to every call site — and prefer not to at all until the Supabase migration actually happens, at which point the signatures are specifically designed to stay stable (`adrs/003-localstorage.md`, `adrs/004-supabase-migration.md`).
- Do not rename the product or any of its core pages ("My Letters" stays "My Letters," per the original redesign brief) without an explicit, direct instruction to do so.

## 8. Common Mistakes (Seen Before, Do Not Repeat)

- Reaching for `opacity` "just for this one small case" in the reading experience — the single most common way `ANIMATION_SYSTEM.md`'s architecture regresses.
- Treating a "Planned" or "Needs Verification" component description in `COMPONENT_GUIDE.md`/`UI_INVENTORY.md` as confirmed fact and writing code against assumed props/behavior that hasn't actually been checked against source.
- Introducing a new global state library or Context provider for something that only one page needs (`ARCHITECTURE.md` §9.1).
- Hardcoding a theme's font/color values inline in a single component instead of extending the shared theme registry (`ARCHITECTURE.md` §11).
- Building infrastructure (realtime, notifications, attachments storage) ahead of an actual scheduled feature need — see the repeated "do not build ahead of need" notes throughout `FUTURE_ARCHITECTURE.md` and `BACKEND_SPEC.md`.

## 9. Expected Coding Style

Match the house style observed in `MyLetters.jsx` exactly — see `TRD.md` §16 and Section 4 above. When in doubt, mirror the nearest existing example in the same file rather than introducing a stylistically different pattern, even if you personally consider your alternative cleaner. Consistency with the existing codebase outranks a marginal stylistic preference.

## 10. How to Approach Bug Fixes

1. Identify which document governs the area you're fixing (`ARCHITECTURE.md` for "where does this belong," `ANIMATION_SYSTEM.md` for anything reading-experience-related).
2. Check whether the bug is actually a violation of a documented rule (e.g., an opacity-based reveal that shouldn't exist) rather than a genuinely new class of problem — many "bugs" in the reading experience trace back to an architecture violation, not a logic error.
3. Fix at the root — if the bug is caused by a second, unauthorized source of state, remove the second source rather than patching its symptom.
4. Update the relevant documentation if the bug fix reveals that a "Planned/inferred" description was wrong, or if it changes documented behavior (`CONTRIBUTING.md` §8).

## 11. How to Approach UI Improvements

1. Read `DESIGN.md` and `DESIGN_TOKENS.md` first — confirm which tokens are Confirmed vs. Proposed before using them as if they're already in the live app.
2. Preserve all existing functionality unless explicitly asked to change it — a visual redesign is not license to alter routing, state, storage, or business logic (this was an explicit constraint in the actual `MyLetters.jsx` redesign brief, and should be treated as the default assumption for any UI-focused task unless told otherwise).
3. Check `UI_INVENTORY.md` for the component's current props/states before changing its interface — extend thoughtfully rather than guessing.
4. Test mobile/touch behavior explicitly, especially for any hover-revealed interaction pattern (`DESIGN.md` §15) — hover-only controls need a touch-friendly fallback.

## 12. How to Approach Backend Work

1. Nothing described in `BACKEND_SPEC.md` or `FUTURE_ARCHITECTURE.md` is implemented. Confirm the actual state of the repository (does a Supabase client exist? are there migration files?) before writing code that assumes any of it exists.
2. If implementing part of the proposed backend, follow `BACKEND_SPEC.md`'s schema and RLS design as the starting point, and update its Status from "Proposed" to "Implemented" (with any corrections) once real work lands — don't leave the spec silently stale.
3. Preserve `lib/letterStorage.js`'s external function signatures during any migration (`adrs/003`, `adrs/004`).
4. Remember the anonymous-read constraint: a recipient with a link and no account must still be able to read (and, if applicable, password-unlock) a letter. Do not implement access control that assumes every reader is authenticated (`BACKEND_SPEC.md` §4, `FUTURE_ARCHITECTURE.md` §3).

## 13. How to Write Documentation

- Match the register of the existing documentation set: specific, cross-referenced rather than duplicated, and explicit about confidence level (`Confirmed` / `Planned` / `Proposed` / `Future` / `Needs Verification`).
- Never present a proposed or inferred design as if it's already implemented — this whole documentation set depends on that discipline to remain trustworthy.
- Cross-reference other documents (`See ANIMATION_SYSTEM.md §4`) instead of re-explaining shared context inline.
- When you personally verify something previously marked inferred/planned, update it in place rather than leaving stale uncertainty markers around (`CONTRIBUTING.md` §8).

## 14. Checklist Before Producing Code

- [ ] I have read the documents relevant to this task (Section 3).
- [ ] If this touches the reading experience: I am not introducing opacity-based visibility, a second progress-like state variable, or breaking the single-writer rule for `extractionProgress`.
- [ ] If this touches theming: I am extending the shared theme registry, not hardcoding values into one component.
- [ ] If this touches storage: I am going through `lib/letterStorage.js`'s existing signatures.
- [ ] If this touches the backend: I have confirmed what's actually implemented vs. proposed before assuming infrastructure exists.
- [ ] I have not reintroduced `Navbar` into `ViewLetter`, and I have not made reading a shared link require authentication.
- [ ] I have matched the existing code style exactly (no semicolons, named handlers, Tailwind-in-JSX).
- [ ] I have updated any documentation whose confirmed/planned status changed as a result of this work.
