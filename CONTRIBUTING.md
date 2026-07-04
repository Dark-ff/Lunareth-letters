# Contributing to Lunareth

**Status:** Living document
**Audience:** Human contributors and AI coding assistants alike — both should read this before opening a PR or generating a diff.

---

## 1. Before You Start

Read, in this order:
1. `PRD.md` §2 (Product Philosophy) and §11 (Product Principles) — understand *why* Lunareth is restrained before changing anything.
2. `ARCHITECTURE.md` — understand where logic belongs and, just as importantly, where it must never go.
3. `ANIMATION_SYSTEM.md` in full, if your change touches anything under `ReadingExperience`. This is not optional. Changes to this system that violate its rules have caused real regressions before.

## 2. Git Workflow

- Work off a feature branch cut from the default branch; do not commit directly to the default branch.
- Keep branches scoped to a single logical change. A PR that touches both the animation system and an unrelated archive-page tweak is harder to review safely and should be split.
- Rebase (rather than merge commit) feature branches onto the default branch before opening a PR, to keep history readable.

## 3. Branch Naming

Use a `type/short-description` convention:

```
feat/reply-loop
fix/delete-modal-password-focus
docs/animation-system-update
chore/dependency-bump
refactor/letter-storage-abstraction
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`. Keep the description short, kebab-case, and specific enough that the branch name alone communicates intent in a branch list.

## 4. Commit Naming

Follow a Conventional-Commits-style format:

```
feat(create-letter): add scheduled delivery date field
fix(reading-experience): correct envelope exit direction on completion
docs(animation-system): document skip-flow extension pattern
refactor(letter-storage): extract localStorage access behind async-shaped API
```

- Subject line: imperative mood, no trailing period, under ~72 characters.
- Body (when needed): explain *why*, not just *what* — the diff already shows what changed.
- Reference the relevant doc section when a change is motivated by (or changes) documented architecture, e.g. `See ANIMATION_SYSTEM.md §4 (Direction continuity rule).`

## 5. Coding Style

Follow the conventions already observed and documented in `TRD.md` §16:
- Function components only, no class components.
- No semicolons — this is the existing house style; match it, don't reintroduce them piecemeal.
- Named, descriptive handler functions for anything with real logic (`requestDelete`, not an inline arrow function buried in JSX) — this keeps diffs readable and keeps logic testable/extractable later.
- Tailwind utility classes directly in JSX; no CSS Modules, no styled-components.
- Keep presentational subcomponents page-local until a second, unrelated page genuinely needs them (`ARCHITECTURE.md` §3.3) — resist the urge to prematurely generalize.

## 6. PR Checklist

Before requesting review, confirm:

- [ ] The change respects `ARCHITECTURE.md`'s "where logic belongs / must never belong" rules.
- [ ] If the change touches the reading experience: it does not introduce opacity-based or conditionally-rendered visibility, does not add a second progress-like state variable, and preserves the single-writer rule for `extractionProgress` (`ANIMATION_SYSTEM.md` §4).
- [ ] If the change touches theming: all four themes were verified, not just the one used during development, and the change was made in the shared theme registry, not hardcoded into a single consuming component (`ARCHITECTURE.md` §11).
- [ ] If the change touches storage: it goes through `lib/letterStorage.js`'s existing function signatures rather than calling `localStorage` directly from a page/component.
- [ ] Accessibility: focus states are visible, color is not the only signal, and any new animation respects (or has a documented reason for not yet respecting) `prefers-reduced-motion`.
- [ ] Mobile: manually checked at a small viewport, especially for anything touch-interaction-related (hover-revealed controls need a touch-friendly fallback per `DESIGN.md` §15).
- [ ] Relevant documentation updated in the same PR — see Section 8.

## 7. Testing

No specific test framework is confirmed as configured in this repository as of this writing. Until one is established:
- Manually verify the specific flow you changed against its corresponding `AppFlow.md` diagram, including at least one failure/edge case from that flow's documented edge cases.
- For any change to `ReadingExperience` or its children, manually verify: normal completion, a fast/rapid interaction (to surface potential desync), and (if implemented) the skip path — all three, every time, given this system's regression history (`ANIMATION_SYSTEM.md` §8).
- When a test framework is introduced, this section should be rewritten with concrete commands and coverage expectations, and this note removed.

## 8. Documentation

Documentation is not an afterthought at Lunareth — treat doc updates as part of the definition of done, not a follow-up task:
- A change to any confirmed behavior described in `TRD.md`, `ARCHITECTURE.md`, `ANIMATION_SYSTEM.md`, `COMPONENT_GUIDE.md`, or `ROUTES.md` must update that document in the same PR.
- A component or file previously marked **[inferred]** in `COMPONENT_GUIDE.md` or elsewhere, once you've actually opened and confirmed its contents, should be updated to **[confirmed]** with corrected detail — even if your PR wasn't primarily about that component. Leaving stale "inferred" markers around after you've personally verified the truth makes the docs less trustworthy for the next person.
- New features should get a corresponding entry in `ROADMAP.md` moved from "Future Ideas" into the appropriate version, or a new entry if it wasn't previously tracked.

## 9. Review Rules

- At least one reviewer should explicitly check the PR against `PRD.md` §11's decision filters if the change is user-facing — not just "does the code work," but "does this belong in Lunareth."
- Changes to `ANIMATION_SYSTEM.md`-governed components require a reviewer who has read that document in full, not just a general React reviewer — flag this explicitly when requesting review if the usual reviewer pool may not have context.
- Reviewers should push back on scope creep toward generic messaging-app features (see `PRD.md` §9 Non-Goals) even if the individual feature seems reasonable in isolation — the cumulative effect of small compromises is how a product loses its identity.

## 10. AI Workflow

This project is explicitly documented with AI coding assistants as a first-class audience (see the top of every document in this set). Guidance specific to AI-assisted contributions:

- An AI assistant should read `ARCHITECTURE.md` and, if relevant to the task, `ANIMATION_SYSTEM.md` **before** generating a diff — not after, as a post-hoc check. These documents exist precisely so an assistant with no memory of prior sessions can still avoid reintroducing known-bad patterns.
- When an AI assistant is uncertain whether a file's actual contents match what's documented as "inferred" here, it should say so explicitly rather than confidently asserting behavior it hasn't verified — matching the epistemic honesty this documentation set tries to model throughout (see, e.g., the routing-library discrepancy flagged in `TRD.md`).
- AI-generated PRs should still satisfy the full checklist in Section 6 — "an AI wrote this quickly" is not an exemption from review rigor; if anything, it's a reason for a closer look at whether documented architectural rules (single-writer state, geometry-not-opacity visibility, theme registry centralization) were actually respected rather than superficially pattern-matched.
- When asked to write new documentation or extend this set, match its register: specific, honest about confidence level, grounded in actual observed code where possible, and explicit about what's assumption versus fact.
