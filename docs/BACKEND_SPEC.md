# Lunareth — Backend Specification (Supabase)

**Status:** Proposed / not yet implemented — this is a detailed design document supporting ADR 004, not a record of shipped infrastructure.
**Owner:** Engineering
**Companion documents:** `TRD.md` §9, `adrs/004-supabase-migration.md`

---

## 1. Purpose & Scope

This document specifies the concrete database schema, relationships, indexes, and access-control policies for Lunareth's planned Supabase backend. It exists so that when V2 backend work (`ROADMAP.md`) begins, there's a real design to build against rather than the high-level sketch in `TRD.md` §9. This document should be updated to reflect the *actual* shipped schema once implementation begins, at which point its Status should change to "Implemented" and any deltas from this proposal noted.

## 2. Entity-Relationship Diagram

```
┌────────────────────┐
│       users         │   (managed by Supabase Auth — auth.users)
│──────────────────────│
│ id (uuid, pk)        │
│ email                │
│ created_at           │
└──────────┬───────────┘
           │ 1
           │
           │ owns
           │ N
┌──────────▼───────────────────────┐
│             letters                │
│─────────────────────────────────────│
│ id (uuid, pk)                      │
│ owner_id (fk → users.id)           │
│ title                              │
│ recipient                          │
│ theme          (fk → themes.slug)  │
│ style                              │
│ body            (encrypted if      │
│                  password_hash set)│
│ password_hash   (nullable)         │
│ created_at                         │
│ updated_at                         │
│ scheduled_open_at (nullable, future)│
└──────────┬───────────┬─────────────┘
           │ 1          │ 1
           │            │
           │ has many   │ has many
           │ N          │ N
┌──────────▼─────────┐ ┌▼──────────────────┐
│   letter_opens       │ │   attachments       │
│  (future — read      │ │  (future — images/  │
│   receipts)          │ │   media in a letter) │
│───────────────────────│ │──────────────────────│
│ id (uuid, pk)         │ │ id (uuid, pk)        │
│ letter_id (fk)        │ │ letter_id (fk)       │
│ opened_at             │ │ storage_path         │
│ metadata (jsonb)      │ │ mime_type            │
└───────────────────────┘ │ created_at           │
                           └──────────────────────┘

┌────────────────────┐
│       themes         │  (seed/reference data, not user-generated)
│──────────────────────│
│ slug (pk)             │  e.g. "moonlit", "old-paper", "dark-aesthetic", "minimal"
│ display_name          │
│ font_family           │
│ token_json (jsonb)    │  color/spacing/texture tokens — see DESIGN_TOKENS.md
└───────────────────────┘
```

## 3. Table Definitions

### 3.1 `letters`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Used directly in the `/letter/:id` route |
| `owner_id` | `uuid` | FK → `auth.users.id`, NOT NULL | Enforces single ownership |
| `title` | `text` | nullable | "Untitled Letter" is a display-layer fallback, not a stored default (matches current `MyLetters.jsx` behavior: `letter.title || "Untitled Letter"`) |
| `recipient` | `text` | nullable | |
| `theme` | `text` | FK → `themes.slug`, NOT NULL, default `'moonlit'` | |
| `style` | `text` | nullable | Distinct from `theme` per existing `MyLetters.jsx` usage (`Badge>Style: {letter.style}`) — clarify the theme/style distinction against `CreateLetter.jsx` once inspected; this spec assumes they are genuinely separate fields rather than duplicates |
| `body` | `text` (or `bytea` if encrypted) | NOT NULL | Encrypted at rest when `password_hash` is set — see Section 5 |
| `password_hash` | `text` | nullable | bcrypt/argon2 hash; NULL means unprotected |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Drives `formatLetterDate()` and the "featured/newest letter" derivation in `MyLetters` |
| `updated_at` | `timestamptz` | NOT NULL, default `now()`, updated via trigger | |
| `scheduled_open_at` | `timestamptz` | nullable | Future: scheduled delivery (`ROADMAP.md` Future Ideas) |

**Indexes:**
- `idx_letters_owner_id` on `owner_id` — supports the `My Letters` list query (all letters for the current user).
- Primary key index on `id` is sufficient for `/letter/:id` lookups; no additional index needed.

### 3.2 `letter_opens` (future)

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK |
| `letter_id` | `uuid` | FK → `letters.id`, NOT NULL |
| `opened_at` | `timestamptz` | NOT NULL, default `now()` |
| `metadata` | `jsonb` | nullable — keep minimal and privacy-respecting; see note below |

**Privacy note:** per `PRD.md` §8, read receipts must stay "gentle" and opt-in, not a surveillance feature. `metadata` should avoid fine-grained tracking (precise geolocation, device fingerprinting) — a coarse timestamp and perhaps a country-level region, if even that, is the right level of detail.

### 3.3 `attachments` (future)

Speculative; only needed if/when letters support embedded media. Not required for V2's core account/sync milestone — noted here for completeness of the ER diagram, not as a near-term commitment.

### 3.4 `themes`

Reference/seed data, not user-generated. `token_json` should mirror the structure defined in `DESIGN_TOKENS.md` so there's exactly one canonical representation of each theme's tokens, consumed both by the frontend's `lib/letterConfig.js` (build-time or fetched) and stored server-side for consistency once themes might ever be extended without a full frontend redeploy.

## 4. Row-Level Security (RLS) Policies

RLS is enabled on `letters` (and `letter_opens`, `attachments` once implemented). Policies, in plain language and approximate SQL shape:

**Write/Update/Delete — owner only:**
```sql
create policy "Letters are writable only by their owner"
on letters for update using (auth.uid() = owner_id);

create policy "Letters are deletable only by their owner"
on letters for delete using (auth.uid() = owner_id);

create policy "Letters are insertable by their creator"
on letters for insert with check (auth.uid() = owner_id);
```

**Read — deliberately NOT handled by a simple RLS `select` policy.** Because Lunareth must support anonymous, link-based reads (`AppFlow.md` §5; `PRD.md` §4.2), a policy like `using (auth.uid() = owner_id)` would incorrectly block the exact access pattern the product depends on — a recipient with no account and no session reading a letter they were sent a link to.

Instead:
- The `letters` table's `select` policy should allow read access to any row **only via a restricted view or a Postgres/edge function**, never via a direct anonymous `select *` against the full table (which would leak `password_hash` and every other letter's data to anyone probing IDs).
- A `get_letter_for_reading(letter_id uuid, password text default null)` Postgres function (marked `SECURITY DEFINER`) should:
  1. Look up the letter by `id`.
  2. If `password_hash` is NULL, return the letter's public-safe fields (never `password_hash` itself) directly.
  3. If `password_hash` is set, compare the provided `password` against the hash server-side; return the same public-safe fields only on success, or an explicit "incorrect password" result otherwise — never a partial/degraded version of the content.
- The base table itself should have **no** public `select` policy at all — all reads go through the function, which is the only sanctioned path to letter content for non-owners.

**Owner's own read access** (for `My Letters`, which needs full metadata including which letters have a password set, but never needs to see `password_hash` itself either):
```sql
create policy "Owners can list their own letters (metadata only)"
on letters for select using (auth.uid() = owner_id);
```
Combined with a view or explicit column selection that excludes `password_hash` from whatever the frontend actually queries — RLS controls *row* access, not *column* access, so column-level exclusion of `password_hash` must be enforced by only ever selecting a defined column list (or a dedicated view) from client code, never `select *`.

## 5. Encryption

- Letters with `password_hash` set should have their `body` encrypted at rest (e.g., via `pgsodium`/`pgcrypto` or application-layer encryption before insert), with decryption happening only inside the same `SECURITY DEFINER` function described above, after successful password verification — never decrypted and then filtered client-side.
- Letters without a password can store `body` as plain `text`, since there is no confidentiality guarantee being made for unprotected letters beyond "you need the link."

## 6. Migration Path from LocalStorage

On a signed-in user's first session post-migration:
1. Client checks LocalStorage for existing letters via the existing `getSavedLetters()` (unchanged signature, per ADR 004).
2. If any exist and haven't been imported yet (tracked via a local flag), prompt the user, non-blockingly, to import them.
3. On confirmation, each local letter is inserted via an authenticated `insert` against `letters` with `owner_id` set to the current user — plaintext `password` fields must be re-hashed server-side during this import, never carried over as plaintext.
4. LocalStorage data is retained (not deleted) after import unless the user explicitly clears it, per the non-destructive migration principle in `AppFlow.md` §5.

## 7. Open Questions for Implementation Time

- Confirm whether `theme` and `style` are genuinely independent fields (this spec assumes yes, based on `MyLetters.jsx` rendering both separately) once `CreateLetter.jsx` is inspected directly.
- Decide whether `letter_opens` ships in the same milestone as core accounts/sync, or is deferred entirely until the read-receipts feature is prioritized (`ROADMAP.md` Future Ideas) — no need to build the table ahead of the feature being scheduled.
- Decide on the specific encryption approach (`pgsodium` vs. application-layer) based on the team's operational comfort with each once implementation begins.
