# Lunareth — Product Requirements Document (PRD)

**Status:** Living document
**Owner:** Product
**Last updated:** This document should be re-validated at every major release; timestamp it manually when you edit it.

---

## 1. Vision

> "Some words deserve more than a text message."

Lunareth exists because the fastest way to send a message has become the default way to send every message, and something has been lost in that collapse. A birthday text, a breakup, a eulogy, and a grocery reminder all arrive in the same gray bubble, in the same font, with the same notification sound.

Lunareth is a place to write the messages that deserve to be slow: letters that are composed with intention, wrapped in a chosen atmosphere, sealed if they need to be private, and opened as an event rather than glanced at. The product's job is not to help people communicate more. It's to help a small number of important communications feel like they matter as much as they actually do.

Lunareth is not a messaging app, a journal app, or a greeting-card app, though it borrows something from each. It is closer to the feeling of handing someone a sealed envelope than to the feeling of sending a Slack message.

## 2. Product Philosophy

These principles are meant to be argued from, not just referenced:

1. **The opening moment is the product.** Everything else — the editor, the storage, the themes — exists in service of the moment a recipient opens a link and the letter reveals itself. If a feature doesn't make that moment better, it's not free; it's a distraction from the one thing that differentiates Lunareth from a text message.
2. **Friction is sometimes the feature.** A password on a letter, a deliberate envelope-opening animation, a theme that can't be skipped — these introduce friction on purpose. Removing friction is not automatically an improvement here.
3. **Emotional impact over feature quantity.** A smaller set of things done with real craft beats a longer feature list. When a feature reaches diminishing returns on the emotional experience, stop polishing it and move to the next thing that matters more.
4. **Nostalgia is a design material, not a theme.** Paper, ink, wax seals, moonlight, handwriting — these aren't decoration bolted onto a generic app. They're the vocabulary the whole product is written in.
5. **Calm by default.** No streaks, no unread badges competing for attention, no growth-hacking mechanics. Lunareth should feel like the opposite of the apps it's implicitly critiquing.

## 3. User Personas

### 3.1 The Letter Writer ("Aiden")
- Wants to say something that matters to a specific person: an apology, a thank-you, a long-distance love letter, a message to be read after they're gone.
- Not necessarily a "writer" — may not journal or blog. The bar is emotional significance, not literary skill.
- Cares that the *presentation* matches the *weight* of the words. A plain text box feels wrong for what they're trying to say.
- Risk: if the editor or theme system gets in the way of writing, they'll abandon the letter unfinished.

### 3.2 The Recipient ("Priya")
- Receives a link, likely via text or email, with no separate app to install.
- Has no context for what Lunareth is going in — the first few seconds of the experience have to establish tone before she's read a single word of the letter.
- May be on mobile, in a distracted environment (this affects how "ceremonial" the animation can afford to be before it becomes an obstacle).
- Emotional state on arrival varies wildly (curious, grieving, in love, anxious) — the experience should feel appropriate across all of these, not comedic or twee.

### 3.3 The Archivist ("Yuki")
- Someone who writes multiple letters over time — to their kids, to their future self, to friends across years — and treats Lunareth as a personal archive as much as a delivery mechanism.
- Cares about being able to find, revisit, and organize past letters.
- Represents the long-term retention case; without this persona, Lunareth is a one-shot utility rather than a habit.

## 4. User Journeys

### 4.1 Writer journey (happy path)
1. Arrives at Lunareth (direct visit or referral).
2. Starts a new letter.
3. Chooses a theme (Moonlit / Old Paper / Dark Aesthetic / Minimal) that matches the emotional tone.
4. Writes the letter body, optionally adds a recipient name.
5. Optionally sets a password.
6. Saves the letter.
7. Shares the generated link through whatever channel makes sense (text, email, etc. — outside Lunareth's control).
8. Later, revisits **My Letters** to review, reopen, or delete what they've written.

### 4.2 Recipient journey (happy path)
1. Receives a link from someone else, with no prior Lunareth account or context.
2. Opens the link.
3. If password-protected, is prompted before anything else is revealed.
4. Watches the envelope-opening sequence — this is the emotional hinge of the entire product.
5. Reads the letter in the sender's chosen theme.
6. (Optionally) may choose to write their own letter back — this is the primary acquisition loop.

### 4.3 Archivist journey
1. Returns to **My Letters**.
2. Scans saved letters by title, theme, and date.
3. Reopens a letter to re-read it, or deletes one that no longer needs to exist (with password confirmation if it was protected).

## 5. Pain Points Lunareth Addresses

| Pain point | How Lunareth addresses it |
|---|---|
| Important messages get lost in chat threads | A letter has a permanent, dedicated, shareable surface |
| Text messages carry no sense of occasion | Themes and the opening animation manufacture occasion deliberately |
| Sensitive letters (a will, a confession, a goodbye) have no safe, semi-private channel | Password protection on individual letters |
| Digital communication feels disposable | The "archive" framing treats letters as things worth keeping, not scrolling past |
| Generic templates feel impersonal | Per-theme visual identity (font, texture, color) lets the writer choose an atmosphere that matches intent |

## 6. Core Features (Current, V1)

- **Letter creation** — a writing surface with title, recipient, body, theme selection, and optional password.
- **Theme system** — four distinct visual identities (Moonlit, Old Paper, Dark Aesthetic, Minimal), each with its own font, texture, and color language, applied consistently across creation, preview, and reading.
- **Shareable letter links** — each saved letter is reachable via a unique link (`/letter/:id`).
- **Password protection** — optional per-letter password gate, enforced before both reading and deleting.
- **Envelope-opening reading experience** — a choreographed animation (see `ANIMATION_SYSTEM.md`) that turns opening a letter into an event.
- **My Letters (archive)** — a personal list of saved letters with metadata (theme, style, date, recipient) and the ability to reopen or delete.
- **Local persistence** — letters currently persist via LocalStorage, scoped to the browser they were created in.

## 7. MVP Scope

The MVP is deliberately narrow: a single writer can create a themed letter, protect it if needed, and share a link that produces a genuinely different opening experience than a normal webpage. Everything in Section 6 constitutes MVP scope. Anything requiring server-side accounts, cross-device sync, or notifications is explicitly out of MVP.

## 8. Future Scope (Post-MVP)

- **Accounts & cross-device sync** (see future Supabase architecture in `TRD.md`) — letters currently live only in one browser's LocalStorage, which is the single biggest scaling limitation of the product.
- **Reply loop** — allowing a recipient to write a letter back from within the reading experience, closing the acquisition loop described in the Recipient Journey.
- **Scheduled delivery** — "open on our anniversary," "open after I'm gone" style delayed reveals.
- **Read receipts (opt-in, gentle)** — letting the writer know a letter was opened, without turning into a surveillance feature.
- **More themes** — the four-theme system is intentionally a foundation, not a ceiling.
- **Collections/albums** — grouping related letters (e.g., a year of letters to a child) into a bound "book."
- **Mobile app** — see `ROADMAP.md` for sequencing.

## 9. Non-Goals

Lunareth explicitly does **not** aim to be:

- A general-purpose messaging or chat app.
- A social network with feeds, likes, or public discovery.
- A blogging or publishing platform.
- A place optimized for daily active usage or engagement metrics. Depth of moments matters more than frequency of visits.
- A place where AI writes the letter for the user. Lunareth may eventually offer light writing assistance, but the emotional authenticity of the product depends on the words being the user's own.

## 10. Success Metrics

Because Lunareth's value is emotional rather than transactional, vanity metrics (DAU, session length) are poor fits and can actively mislead product decisions. Preferred metrics:

- **Letters opened vs. letters created** — a proxy for whether letters are actually reaching and landing with recipients.
- **Reply-loop conversion** (once shipped) — % of recipients who go on to write their own letter.
- **Return authorship rate** — % of writers who write a second letter within N months (the Archivist persona materializing).
- **Time-to-first-letter** — how long a new writer takes from landing to saving their first letter; a proxy for whether the creation flow is too heavy or too light.
- **Qualitative signal** — direct user feedback about the opening moment specifically. This is the product's core differentiator and deserves qualitative tracking even without a clean quantitative proxy.

Metrics explicitly de-prioritized: notifications sent, streaks, daily opens, time-on-app.

## 11. Product Principles (Decision Filters)

When a feature proposal comes up, run it through these filters, in order:

1. Does this make the opening moment better, or does it just add surface area elsewhere?
2. Does this respect that a "no" (declining to add friction, declining to notify, declining to gamify) can be the right product decision?
3. Would this feel at home in a product like Linear, Notion, Raycast, or Apple's own first-party apps — restrained, confident, unornamented except where ornament is the point?
4. Does this remain legible and appropriate for a recipient who has zero context about Lunareth?

## 12. Release Priorities

1. **P0 — Core reading & writing experience.** Nothing ships that isn't fully in service of write → protect → share → open → read.
2. **P1 — Archive & management.** My Letters, delete, reopen — the tools that make repeated use viable.
3. **P2 — Growth loop.** Reply-from-reading-experience, more themes.
4. **P3 — Platform.** Accounts, sync, scheduled delivery, mobile.

## 13. UX Philosophy

- **Geometry over opacity.** Visibility and reveal in the reading experience are achieved through motion and layout, never through fade/opacity tricks — see `ANIMATION_SYSTEM.md` for the architectural reasoning. This is as much a design principle as an engineering one: it keeps the experience feeling physical rather than "web-app-y."
- **No navigation chrome during reading.** `ViewLetter` intentionally has no navbar. The reading surface is meant to feel like a place you've stepped into, not a page you're browsing.
- **Themes are complete identities, not color swaps.** A theme changes typography, texture, and spacing rhythm together — never just a background color.
- **Restraint in chrome, boldness in the one moment that deserves it** (the letter opening). Most of the UI should be quiet enough that the letter itself is the loudest thing on screen.

## 14. Functional Requirements

- FR1: A user can create a letter with a title, body, optional recipient name, theme, and optional password.
- FR2: A saved letter is retrievable via a stable, unique link.
- FR3: A password-protected letter must not reveal its content (nor let itself be deleted) without the correct password.
- FR4: A user can view all letters they have saved on the current device, with theme, style, date, and recipient metadata visible.
- FR5: A user can delete a letter they own, with a confirmation step; deletion of a password-protected letter also requires the password.
- FR6: Opening a shared letter link triggers the envelope/reveal reading experience before the letter body is legible.
- FR7: Each of the four themes must render consistently (font, background, color tokens) across the create, preview, and read surfaces.

## 15. Non-Functional Requirements

- **NFR1 — Performance:** The envelope-opening animation must run smoothly (target 60fps) on mid-range mobile devices, since recipients frequently open letters on mobile without warning.
- **NFR2 — Resilience:** Because storage is currently LocalStorage-based, the app must fail gracefully (not crash) if storage is unavailable, full, or cleared.
- **NFR3 — Privacy:** Password-protected letter content must not be exposed in a way that's trivially bypassable client-side (e.g., visible in unprotected state in dev tools before password entry) beyond the inherent limits of a client-only storage model — see `TRD.md` Security section for the honest limitations here.
- **NFR4 — Accessibility:** Core flows (create, read, delete) must be usable via keyboard and screen reader, even though the reading experience is animation-heavy; see `DESIGN.md` for reduced-motion handling.
- **NFR5 — Portability:** The reading experience should degrade acceptably (not break) if JavaScript animation libraries fail to load, given how central the animation is to the product's value proposition.

## 16. Risks

- **Single-device data loss.** LocalStorage-only persistence means clearing browser data destroys a user's entire letter archive permanently. This is the highest-severity current risk and the primary argument for prioritizing the Supabase migration (see `TRD.md`).
- **Password security theater.** Client-side password gating on statically stored content can create a false sense of security if not paired with real access control once a backend exists.
- **Animation fatigue.** A ceremonial opening animation that can't be skipped risks annoying repeat recipients (e.g., someone who reopens the same letter ten times). A skip-animation flow exists for this reason — see `AppFlow.md`.
- **Scope creep into "generic app" territory.** Every feature request should be pressure-tested against Non-Goals; messaging-app feature creep is the most likely way Lunareth loses its identity.

## 17. Assumptions

- Most letters are one-to-one (one writer, one recipient), not broadcast.
- Recipients are willing to tolerate a short (a few seconds) animated delay before reading, in exchange for the ceremony it creates.
- The current user base is small enough that LocalStorage-only persistence, while a known limitation, has not yet been the primary blocker to growth.
- Users have modern browsers with reasonable support for backdrop-filter, CSS animation, and Framer Motion's requirements.

## 18. Competitive Positioning

Lunareth doesn't compete directly with messaging apps (iMessage, WhatsApp) — it's positioned for the messages people already feel are too important for that channel. Nor does it compete with journaling apps (Day One), which are private-by-default rather than share-by-default. Its closest philosophical cousins are physical-mail-inspired products and "slow web" experiences, but few of these pair that philosophy with genuinely crafted interaction design. Lunareth's wedge is: **the craft of the opening moment**, which most alternatives either skip entirely or handle as an afterthought.

## 19. Long-Term Vision

Lunareth's long-term shape is a personal, cross-device archive of the letters that mattered in someone's life — written to lovers, children, friends, and their own future selves — retrievable and re-readable for years, with the same ceremony on the hundredth reading as the first. Success looks like someone opening a five-year-old Lunareth letter and feeling the same thing they felt when they first wrote or received it.
