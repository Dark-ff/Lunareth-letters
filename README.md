# Lunareth

> "Some words deserve more than a text message."

Lunareth is a premium digital letter platform for writing, protecting, and sharing meaningful digital letters — built around the idea that opening a letter should feel like an event, not a page load. See [`docs/PRD.md`](docs/PRD.md) for the full product vision.

This README is the entry point to the project's documentation. It does not duplicate content that lives elsewhere — every section below points to the document that actually owns that information.

---

## Start Here

If you're new to this repository, read in this order:

1. [`docs/PRD.md`](docs/PRD.md) — what Lunareth is and why, product philosophy, personas, principles
2. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — where things live, where logic belongs (and must never belong)
3. [`docs/ANIMATION_SYSTEM.md`](docs/ANIMATION_SYSTEM.md) — required reading before touching the reading experience specifically; this is the most fragile and most important part of the codebase
4. [`CONTRIBUTING.md`](CONTRIBUTING.md) — workflow, coding style, PR checklist, before opening a PR

**If you are an AI coding assistant**, read [`docs/AI/README.md`](docs/AI/README.md) in full before generating or modifying any code. It exists specifically to prevent regressions that have already happened once.

## Documentation Index

### Product & Planning
| Document | Purpose |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Vision, personas, user journeys, MVP scope, non-goals, success metrics |
| [`docs/AppFlow.md`](docs/AppFlow.md) | Every application flow, with diagrams (write/share/read, delete, password, skip-animation, future auth) |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Versioned roadmap, technical debt, design improvements, backend and mobile milestones |
| [`CHANGELOG.md`](CHANGELOG.md) | Notable changes, in Keep a Changelog format |

### Engineering
| Document | Purpose |
|---|---|
| [`docs/TRD.md`](docs/TRD.md) | Technology stack, folder structure, state management, storage, security, build/deploy |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Pages, components, data flow, state and logic ownership rules |
| [`docs/ANIMATION_SYSTEM.md`](docs/ANIMATION_SYSTEM.md) | The `extractionProgress`-driven reading experience — ownership, rules, known pitfalls |
| [`docs/COMPONENT_GUIDE.md`](docs/COMPONENT_GUIDE.md) | Per-component purpose, props, lifecycle, extension guidelines, common mistakes |
| [`docs/UI_INVENTORY.md`](docs/UI_INVENTORY.md) | Full component inventory tables — status, props, states, accessibility, dependencies |
| [`docs/ROUTES.md`](docs/ROUTES.md) | Every route: purpose, entry/exit conditions, data requirements |
| [`docs/BACKEND_SPEC.md`](docs/BACKEND_SPEC.md) | **Proposed** Supabase schema, ER diagram, RLS policies, encryption, migration path |
| [`docs/FUTURE_ARCHITECTURE.md`](docs/FUTURE_ARCHITECTURE.md) | **Proposed** target system architecture post-Supabase (auth, storage, realtime, deployment) |
| [`docs/adrs/`](docs/adrs/) | Architecture Decision Records — the *why* behind key technical choices |

### Design
| Document | Purpose |
|---|---|
| [`docs/DESIGN.md`](docs/DESIGN.md) | Design philosophy, brand personality, typography, color, motion, accessibility |
| [`docs/DESIGN_TOKENS.md`](docs/DESIGN_TOKENS.md) | The full token system — color, type, radius, shadow, motion, spacing, breakpoints |

### Reference
| Document | Purpose |
|---|---|
| [`docs/GLOSSARY.md`](docs/GLOSSARY.md) | Alphabetical definitions of every Lunareth-specific term |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Git workflow, commit conventions, PR checklist, review rules, AI workflow |

### Architecture Decision Records
| ADR | Decision |
|---|---|
| [`001-react-router.md`](docs/adrs/001-react-router.md) | Routing library |
| [`002-framer-motion.md`](docs/adrs/002-framer-motion.md) | Animation library |
| [`003-localstorage.md`](docs/adrs/003-localstorage.md) | Current (V1) persistence layer |
| [`004-supabase-migration.md`](docs/adrs/004-supabase-migration.md) | Proposed backend migration |
| [`005-envelope-animation-architecture.md`](docs/adrs/005-envelope-animation-architecture.md) | Single-progress-value animation architecture |

## Repository Structure

```
.
├── README.md              ← you are here
├── CONTRIBUTING.md
├── CHANGELOG.md
└── docs/
    ├── PRD.md
    ├── TRD.md
    ├── AppFlow.md
    ├── DESIGN.md
    ├── DESIGN_TOKENS.md
    ├── ARCHITECTURE.md
    ├── FUTURE_ARCHITECTURE.md
    ├── ANIMATION_SYSTEM.md
    ├── COMPONENT_GUIDE.md
    ├── UI_INVENTORY.md
    ├── ROUTES.md
    ├── ROADMAP.md
    ├── BACKEND_SPEC.md
    ├── GLOSSARY.md
    ├── AI/
    │   └── README.md
    └── adrs/
        ├── 001-react-router.md
        ├── 002-framer-motion.md
        ├── 003-localstorage.md
        ├── 004-supabase-migration.md
        └── 005-envelope-animation-architecture.md
```

## A Note on Confidence Levels

This documentation set is written to be honest about what's verified versus assumed. Throughout `docs/`, content is marked:

- **Confirmed** — directly verified against source code
- **Planned** — described in prior project context, not yet inspected in source
- **Proposed** — a design or architecture recommendation, not yet implemented
- **Future / Needs Definition** — a known gap, intentionally not guessed at

Do not treat a "Planned" or "Proposed" section as an accurate description of shipped behavior. When you verify something previously marked uncertain, update it in place — see [`CONTRIBUTING.md`](CONTRIBUTING.md) §8.

## License

Not yet specified — add a `LICENSE` file at the repository root once a license is chosen.
