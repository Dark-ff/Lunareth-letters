# Lunareth — Glossary

**Status:** Living document
**Owner:** Documentation / whole team
**Purpose:** A single alphabetical reference for Lunareth-specific terms. When a term's meaning is fully explained elsewhere, this entry stays short and points there rather than duplicating the explanation.

---

**Archive** — The colloquial and UI term for a user's collection of saved letters, surfaced on the `My Letters` page. Not a separate technical concept from "saved letters" — see `PRD.md` §4.3 (the Archivist persona) and `ARCHITECTURE.md` §2.

**Archivist** — One of Lunareth's three core user personas: someone who writes multiple letters over time and treats Lunareth as a personal archive rather than a one-off utility. See `PRD.md` §3.3.

**Badge** — The small pill-shaped metadata label component used to display a letter's theme and style. Confirmed component; see `COMPONENT_GUIDE.md` and `UI_INVENTORY.md` §2.

**Dark Aesthetic** — One of Lunareth's four reading themes, using Courier New and a typewriter-inspired, confessional visual register. See `DESIGN.md` §3.

**Edge Function** — In the proposed (not yet implemented) Supabase backend, a server-side function used to verify letter passwords and decrypt protected content without exposing that logic to the client. See `BACKEND_SPEC.md` §4 and `FUTURE_ARCHITECTURE.md` §2.

**Envelope** — The component responsible for converting `extractionProgress` into vertical position (`translateY`) during the reading experience, including its idle "breathing" animation and its sink-not-fade exit motion. See `ANIMATION_SYSTEM.md` §2.2.

**Extraction Progress** (`extractionProgress`) — The single float value (0→1) that drives the entire reading experience. Owned exclusively by `ReadingExperience`; every other reading-experience component is a pure function of it. The single most important technical concept in the codebase — see `ANIMATION_SYSTEM.md` §1 and `adrs/005-envelope-animation-architecture.md`.

**Featured Letter** — In `My Letters`, the newest letter (by `createdAt`), derived at render time and displayed prominently in a distinct, paper-styled card above the rest of the archive grid. Not a stored/separate field on the letter object — see `ARCHITECTURE.md` §9.2.

**LetterRenderer** — The component that renders a letter's full content from frame one during the reading experience. Visibility is achieved purely through geometry (position/clipping), never opacity or conditional rendering — see `ANIMATION_SYSTEM.md` §2.4.

**LetterPreview** — A scaled-down, non-animated preview of a letter's themed appearance, used during creation to show the writer what their letter will look like. Mirrors `ViewLetter`'s rendering logic at a smaller scale. Status: Planned/unverified — see `COMPONENT_GUIDE.md`.

**Minimal** — One of Lunareth's four reading themes, using Inter and a clean, contemporary register that "gets out of the way" of the letter's words. See `DESIGN.md` §3.

**Moonlit** — The default/primary reading theme, using Georgia and a gentle, literary serif register; also the source of the product's core lavender accent color and "moonlight" motif used throughout general UI. See `DESIGN.md` §3–4.

**MyLetters** — The confirmed page component implementing the personal archive (`/my-letters`). See `COMPONENT_GUIDE.md` and `ARCHITECTURE.md` §2.

**Navbar** — The global navigation component, rendered on every page except `ViewLetter`. Its absence on `ViewLetter` is a deliberate architectural decision, not an omission — see `ARCHITECTURE.md` §2, `PRD.md` §13.

**Old Paper** — One of Lunareth's four reading themes, using Palatino and a classical, archival, formal-correspondence register. See `DESIGN.md` §3.

**PaperReveal** — The always-mounted, deliberately "dumb" component responsible for the paper's geometric reveal (blur-to-sharp, becoming the continuous reading surface) during the reading experience. Holds no independent state — see `ANIMATION_SYSTEM.md` §2.3.

**Reading Experience** (`ReadingExperience`) — The orchestrating component that owns `extractionProgress` and composes `Envelope`, `PaperReveal`, and `LetterRenderer` into the full envelope-opening sequence. See `ANIMATION_SYSTEM.md` §2.1.

**Recipient** — The person who receives and opens a shared letter link. Has no prior context about Lunareth and must never be required to have an account. One of Lunareth's three core personas — see `PRD.md` §3.2, §4.2.

**SealBadge** — The wax-seal-styled component indicating a letter is password-protected, replacing a plain lock emoji. Confirmed component, introduced in the `MyLetters` visual redesign — see `UI_INVENTORY.md` §2.

**Skip Animation Flow** — The (not yet confirmed as implemented) flow allowing a repeat visitor to jump `extractionProgress` directly to `1` rather than replaying the full reading animation on every visit. See `AppFlow.md` §4.

**Style** — A letter metadata field displayed alongside `Theme` in the archive UI, referenced separately from `theme` in confirmed code. Its precise relationship to `theme` is not yet fully confirmed — see `BACKEND_SPEC.md` §7 Open Questions.

**Theme** — One of Lunareth's four complete visual identities (Moonlit, Old Paper, Dark Aesthetic, Minimal), each defining font, texture, and color together — never just a color swap. See `DESIGN.md` §3, `PRD.md` §1.

**Theme Registry** — The intended single source of truth (`lib/letterConfig.js`) for all per-theme tokens (font, color, texture), consumed identically by `CreateLetter`, `LetterPreview`, and `ViewLetter`. Divergence from this single-source pattern is the documented cause of theme-inconsistency bugs — see `ARCHITECTURE.md` §11.

**Void** — The proposed deep-background color token (`#07060c`) used in the redesigned `MyLetters` page as an ambient, atmospheric backdrop. See `DESIGN_TOKENS.md` §1.2.

**Wax Seal / Seal** — The design motif (and associated crimson color token) used exclusively to indicate password-protected letters, rendered via the `SealBadge` component. Never reused for generic destructive/warning UI — see `DESIGN.md` §4, `DESIGN_TOKENS.md` §1.2.

**Writer** — The person composing and saving a letter. One of Lunareth's three core personas — see `PRD.md` §3.1.
