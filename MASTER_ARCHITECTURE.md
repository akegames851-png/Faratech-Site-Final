
## 1. Project Philosophy

### 1.1 What this project is, architecturally

This is a long-lived, content-and-data-driven platform for a regulated,
trust-sensitive industry (medical engineering). It is not a campaign site,
not a prototype, and not a single-sprint deliverable. Every architectural
decision is made under the assumption that:

- The project will outlive its current maintainers.
- The project will outlive its current framework choices.
- The project will be touched by people — and AIs — who have no memory of
  why a decision was made unless it is written down.
- Correctness, trust, and stability matter more than velocity.

### 1.2 The core philosophy

**Boring is a feature.** This project deliberately avoids architectural
novelty for its own sake. Patterns are chosen because they are well
understood, debuggable at 2 a.m. by someone unfamiliar with the codebase,
and because they degrade gracefully rather than catastrophically.

**Slowness in design buys speed in maintenance.** Time spent getting a
contract, a boundary, or a naming convention right is repaid every single
time someone touches that area afterward — for years. Time saved by skipping
that step is borrowed against all future work on that area, with interest.

**The system is a set of contracts, not a set of files.** Files,
frameworks, and even databases are implementation details that are expected
to change. Contracts — schemas, interfaces, layer boundaries — are the part
of the system that must survive those changes. Architecture work is contract
work.

**Trust is structural, not cosmetic.** Because this platform exists in a
medical/clinical-adjacent domain, the architecture must make it structurally
difficult to ship false, fabricated, or misleading information (fake
specifications, placeholder certifications, invented content). This is not
a content-policy footnote — it is a load-bearing architectural principle
that shapes how data flows and how rendering is gated.

---

## 2. Design Principles

These principles are listed in priority order. When two principles conflict,
the higher one wins.

1. **Correctness over completeness.** A feature that is half-built and
   clearly marked as such is acceptable. A feature that silently does the
   wrong thing is not.
2. **Explicitness over magic.** Implicit behavior (auto-wired DI gymnastics,
   convention-over-configuration "magic," hidden global state) is avoided.
   A future reader should be able to trace data by reading code, not by
   knowing folklore.
3. **Boundaries over cleverness.** A clean seam between two layers is worth
   more than an elegant shortcut that crosses it.
4. **Additive change over destructive change.** Prefer extending a contract
   to rewriting it. Prefer deprecation to deletion. Prefer a new field to a
   repurposed one.
5. **Reversibility over optimization.** Prefer architectural choices that
   can be undone or swapped (an interface behind which an implementation
   changes) over choices that lock the system into one vendor, one
   framework, or one schema shape forever.
6. **Real data over fabricated data.** No layer of the system may invent,
   guess, or placeholder data that looks real. Missing data renders as
   absent UI, never as fake content.

---

## 3. Clean Architecture Rules

### 3.1 The dependency rule

Dependencies flow in one direction only: **outer layers depend on inner
layers; inner layers know nothing about outer layers.**

```
UI / Routes
   ↓ depends on
Server Functions / Controllers
   ↓ depends on
Services (business logic)
   ↓ depends on
Repositories (data access contracts)
   ↓ depends on
Database / External systems
```

A change to the database driver must never require a change to a Service. A
change to the UI framework must never require a change to business logic.
If it does, a dependency rule has been violated somewhere, and that
violation — not the symptom — is the bug to fix.

### 3.2 Why this rule exists

Frameworks, databases, and UI libraries are the parts of a system most
likely to be replaced over a multi-year lifespan. Business logic — what a
"published product" means, what a "valid lead" looks like — is the part
least likely to change. Architecture exists to put the volatile parts on the
outside and the stable parts on the inside, so that replacing a volatile
part never requires touching stable logic.

### 3.3 Layers never skip each other

A route must not call a repository directly. A UI component must never query
a database, construct SQL, or import a persistence client. Skipping a layer
"just this once" is how a codebase accumulates an invisible second
architecture that nobody designed and nobody can reason about.

### 3.4 Inner layers are framework-agnostic

Business logic (Services) must be expressible, in principle, without
knowledge of whether the outer layer is a web framework, a CLI, or a queue
worker. If a Service file imports something from a routing library or a UI
library, that is an architectural defect, not a style nitpick.

---

## 4. Layer Responsibilities

| Layer | Responsibility | Must NOT do |
|---|---|---|
| **UI / Components** | Render state. Capture user input. Delegate. | Contain business rules. Talk to a database. Decide what is "valid." |
| **Route Loaders** | Resolve what data a route needs and fetch it via the server/service boundary. | Contain business logic. Format business rules. |
| **Server Functions / Controllers** | Translate a transport request (HTTP, RPC) into a typed call into a Service. Handle transport-level concerns (auth context, request shape). | Contain business logic. Talk to the database directly. |
| **Services** | Own business rules: what is allowed, what is valid, what happens as a consequence of an action. Orchestrate one or more repositories. | Know about HTTP, routing, or rendering. Format a UI-facing payload. |
| **Repositories** | Provide a narrow, intention-revealing contract for reading/writing one kind of data. Hide the persistence technology entirely. | Contain business rules ("only published items are visible" is a Service decision unless it is a hard data-access invariant). |
| **Mappers / DTOs** | Convert between persistence shapes, transport shapes, and domain shapes. | Contain logic that decides outcomes — they reshape, they do not decide. |
| **Database** | Store data durably with the constraints the data model requires (uniqueness, referential integrity, basic invariants enforced as close to the data as possible). | Be the only place an invariant is enforced, if that invariant matters to correctness elsewhere. |

A useful test for "is this in the right layer": *if I deleted the entire
outer world (no HTTP, no UI, no router) and called this layer from a test
file, would it still make sense and still work?* Services, Repositories, and
Mappers must pass this test. UI and Route Loaders are not expected to.

---

## 5. Dependency Rules (Concrete)

1. UI components may depend on: hooks, types, route loader data. Never on
   repositories, database clients, or raw fetch logic to a backend.
2. Route loaders may depend on: server functions or service-layer calls.
   Never on a repository or database client directly.
3. Server functions may depend on: services, DTOs, validation. Never on a
   raw database client.
4. Services may depend on: repository interfaces, domain types, validators.
   Never on transport types (HTTP request/response objects) or UI types.
5. Repositories may depend on: a database client or external API client.
   Never on services, UI, or transport types.
6. Nothing outside a Repository implementation may import a query
   builder, an ORM client, or raw SQL.
7. A `Repository` is always defined first as an **interface/contract**.
   Implementations (in-memory, HTTP-backed, database-backed) are
   interchangeable behind that contract, and calling code never knows or
   cares which one is wired in.

These rules exist so that any individual layer can be rewritten, replaced,
or swapped to a different technology without requiring a rewrite of any
other layer — a property the project will need repeatedly over its
lifetime, not just once.

---

## 6. Repository & Service Standards

### 6.1 Repository standards

- A repository contract is named after the **domain concept** it serves
  (`ProductRepository`, `LeadRepository`), never after the storage
  technology (`PostgresProductStore`, `SqlClient`).
- Every method on a repository contract returns or accepts **domain
  types**, never raw database rows, raw query results, or
  ORM-model instances.
- Repository methods are verbs that describe intent (`getBySlug`, `list`,
  `archive`, `publish`) rather than generic CRUD verbs whenever a more
  meaningful name exists. Generic `create`/`update` are acceptable when no
  more specific verb adds clarity.
- A repository never contains conditional business logic that decides
  outcomes (e.g., "if status is draft, also notify someone"). That belongs
  in a Service.
- A repository implementation is swappable. At minimum, the project should
  always be able to support an in-memory implementation (for tests and
  early-stage features) and a persistent implementation behind the exact
  same contract, with zero changes required in any calling code.

### 6.2 Service standards

- A Service represents one cohesive business capability (e.g.,
  "product catalog management," "lead intake"), not a grab-bag of
  unrelated operations.
- A Service may depend on multiple repositories. A repository must never
  depend on a Service. This direction is non-negotiable.
- A Service is the single place where "is this allowed" and "what happens
  next" are decided. If two different entry points (a route and a
  scheduled job, for example) need the same business rule, that rule must
  live in exactly one Service method, called from both places — never
  duplicated.
- A Service must be testable without a network, a browser, or a running
  database, given a fake repository implementation.

### 6.3 Why these standards exist

Repository and Service boundaries are the project's primary defense against
the single most common failure mode in long-lived codebases: business logic
slowly leaking into every layer until no single place can be trusted to
contain "the rule." Once that happens, every change requires re-deriving
the rule by reading five files instead of one, and inconsistencies become
inevitable. A strict Repository/Service boundary keeps "the rule" in exactly
one place, permanently.

### 6.4 Standard Development Workflow

Every significant change to the product shall follow the standardized
governance workflow defined below.

Implementation is never the first step.

Architectural thinking always precedes coding.

The mandatory workflow is:

```text
Business Need
        ↓
Feature Proposal
        ↓
Architecture Review
        ↓
RFC (if required)
        ↓
Architecture Decision
(ADR if accepted)
        ↓
Implementation
        ↓
Validation
        ↓
Documentation Update
        ↓
Release
```

Every stage has a distinct purpose.

#### Business Need

Identify the user, business, or operational problem.

No implementation discussion occurs at this stage.

---

#### Feature Proposal

Describe the proposed solution from a product perspective.

Focus on business value, objectives, and expected outcomes.

Technical implementation remains intentionally unspecified.

---

#### Architecture Review

Determine whether the proposal affects architectural boundaries,
contracts, infrastructure, or long-term maintainability.

If the proposal is purely local implementation work, development may
continue without an RFC.

---

#### RFC

An RFC is required whenever multiple architectural approaches are
possible or when significant trade-offs must be evaluated.

The RFC exists to compare alternatives before committing to a
permanent direction.

---

#### ADR

Once an architectural decision has been accepted, it must be recorded
as an ADR.

An accepted ADR becomes part of the project's permanent architectural
knowledge.

---

#### Implementation

Implementation follows the accepted architecture.

Implementation must not redefine architecture.

If implementation reveals that the accepted architecture is
insufficient, development pauses until the architecture is updated
through the documented governance process.

---

#### Validation

Implementation is incomplete until validation succeeds.

Validation may include:

- Type checking
- Automated validators
- Unit tests
- Integration tests
- Security review
- Performance review
- Manual QA

---

#### Documentation Update

Documentation is considered part of implementation.

Relevant documentation must be updated before the work is considered
complete.

Possible updates include:

- ADR
- RFC
- Release Notes
- Session Documentation
- Roadmap
- AI Context
- Operational Checklists

---

#### Release

Only validated, documented work may become part of an official
release.

Every release should remain fully reproducible from the project's
documentation.

#### Exceptions

Small implementation tasks that do not modify architectural
boundaries, contracts, infrastructure, or governance may omit the
Feature Proposal, RFC, and ADR stages.

Such work must still follow:

Implementation
→ Validation
→ Documentation
→ Release

#### Final Principle

Code is the final outcome of the process—not the beginning.

The architecture defines the shape of the implementation.

Documentation preserves the reasoning behind it.

Governance ensures that the reasoning remains trustworthy over the
entire lifetime of the project.


---

## 7. DTO Standards

1. A DTO (Data Transfer Object) describes the shape of data **as it crosses
   a boundary** — between transport and service, or between service and
   persistence. A DTO is not a domain model and is not a database row.
2. DTOs are explicit and versionable. When a contract needs a new optional
   field, it is added to the DTO as optional; existing consumers of the
   DTO must continue to compile and function unchanged.
3. DTOs never carry persistence-specific fields (internal database IDs
   exposed as the public identity, ORM metadata, query cursors) unless that
   field is a deliberate, documented part of the public contract.
4. Input DTOs (what a caller sends) and Output DTOs (what a caller
   receives) are allowed to differ in shape even for "the same" entity —
   creation input does not need to accept fields that are server-assigned
   (timestamps, generated identifiers, computed status).
5. Partial-update DTOs use explicit partial/patch semantics (only supplied
   fields are changed) rather than requiring a full object round-trip,
   which prevents accidental data loss when a caller only intended to
   change one field.

DTOs exist because the shape of data that is convenient for storage, the
shape that is convenient for business logic, and the shape that is
convenient for a UI to consume are frequently different — and conflating
them is one of the fastest ways to make a future migration (of database,
of framework, of API style) far more painful than it needs to be.

---

## 8. Mapping Rules

1. Mapping (converting between persistence shape, domain shape, and
   transport shape) is **pure** — given the same input, a mapper always
   produces the same output, with no side effects, no I/O, and no
   conditional business decisions.
2. Mapping logic lives in one identifiable place per boundary. It is never
   duplicated inline at each call site.
3. A mapper never silently drops data. If a field cannot be represented in
   the target shape, that is a contract problem to be resolved explicitly
   (extend the contract, or explicitly and visibly omit with a comment
   explaining why), not something to paper over silently.
4. A mapper never fabricates data to fill a gap. Missing source data
   becomes a missing/optional field in the output — never a guessed,
   default, or placeholder value that could be mistaken for real content.
5. Localized or multi-shape fields (e.g., multi-language text) follow a
   single, centrally defined resolution rule (e.g., a documented fallback
   chain). That rule is implemented in exactly one place and reused
   everywhere it is needed — never reimplemented locally "for
   convenience."

---

## 9. Folder Structure Conventions

The project organizes by **feature/domain first, technical layer second.**
A new contributor (human or AI) should be able to find everything related
to "products" in one place, rather than hunting across a dozen
technically-organized folders.

```
src/
  modules/              # one folder per business domain/feature
    <feature>/
      <feature>.types.ts
      <feature>.repository.ts        # contract (+ implementations)
      <feature>.service.ts
      <feature>.mapper.ts
      <feature>.validation.ts
      <feature>.functions.ts         # server functions / controllers
  shared/                # cross-cutting code with no single feature owner
    services/
    ui/
    hooks/
    types/
  routes/                # route definitions; thin, loader-only
```

Rules:

- A feature module owns its own types, contract, service, mapper, and
  validation. Cross-feature reuse happens through `shared/`, never by one
  feature importing another feature's internals directly.
- `shared/` is for code that is genuinely generic (date formatting,
  localization helpers, generic UI primitives) — not a dumping ground for
  "things two features happen to need right now." If only two features use
  something and it is domain-specific to both, it likely belongs as a
  small shared *contract*, not shared logic.
- Routes stay thin. A route's job is to know *which* loader/server function
  to call and *which* component to render — never to contain business
  logic itself.
- No file should grow so large that a human can no longer hold its purpose
  in their head. When a file's responsibilities multiply, split it along
  the same lines as the layer boundaries above — not arbitrarily.

This structure exists so that deleting or replacing an entire feature is a
localized operation, not an archaeological dig across the whole codebase.

---

## 10. Naming Conventions

- **Domain entities** are named after the real-world concept, in plain
  business language (`Product`, `Lead`, `Category`) — not after their
  storage mechanism.
- **Repository contracts** are named `<Entity>Repository`. Implementations
  are named for their backing technology
  (`InMemory<Entity>Repository`, `Http<Entity>Repository`,
  `<Entity>RepositoryImpl` if only one persistent implementation exists).
- **Services** are named for the capability, not the entity alone when the
  capability is more specific than basic CRUD
  (`ProductCatalogService` rather than just `ProductService`, when
  appropriate — but `ProductService` is acceptable when the service truly
  is just product lifecycle management).
- **DTOs** are named for direction and purpose:
  `Create<Entity>Input`, `Update<Entity>Input`, `<Entity>ListQuery`,
  `<Entity>ListResult`.
- **Validation functions** are named `validate<Concept>` and return a
  consistent result shape across the entire codebase — never throw for
  expected validation failures, only for truly exceptional conditions.
- **Stable identifiers** (slugs, route segments, public keys) are named
  and treated distinctly from **internal/business identifiers** (database
  IDs, SKUs). The two must never be conflated, and code should make clear
  at every boundary which kind of identifier is in play.
- Names describe **intent**, not **mechanism**. `archiveProduct()`, not
  `setStatusField()`.

Consistent naming is not cosmetic — it is what allows a developer (or an
AI) to correctly predict the shape and location of code they have never
seen, which is essential once the codebase is too large for any one person
to hold in memory.

---

## 11. Feature Lifecycle

Every new feature, from conception to retirement, passes through the same
stages. Skipping a stage is the most common cause of architectural decay.

1. **Proposal.** The feature is described in terms of the business
   capability it adds and the layer(s) it touches. No code is written yet.
2. **Contract design.** Any new or changed contract (types, repository
   interface, DTO shape) is designed and reviewed *before* implementation.
   The contract is expected to be stable; the implementation behind it is
   not.
3. **Implementation behind the contract.** The simplest correct
   implementation is built first (an in-memory or minimal-dependency
   version is acceptable and often preferable) to validate the contract
   before investing in a production-grade backing implementation.
4. **Hardening.** Validation, error handling, edge cases, and the
   production-grade implementation are added once the contract has proven
   itself.
5. **Documentation.** The feature's existence, contract, and any
   architectural decisions are recorded per the Documentation Lifecycle
   (Section 12) before the feature is considered complete.
6. **Deprecation (when applicable).** A feature is never deleted abruptly.
   It is marked deprecated, kept functional, given a removal target, and
   only removed once nothing depends on it and that has been verified.
7. **Retirement.** Code is removed. The historical decision (why it
   existed, why it was retired) remains in the documentation record even
   after the code is gone — history is not deleted, only the code is.

A feature that skips contract design and goes straight to implementation is
the single most common source of long-term architectural debt in this kind
of project — it tends to produce a contract shaped accidentally by
whatever was easiest to implement first, rather than a contract shaped
deliberately by what the business concept actually requires.

---

## 12. Documentation Lifecycle

1. **Documentation is part of the deliverable, not an afterthought.** A
   feature is not "done" until its architectural footprint is documented.
2. **Two tiers of documentation exist:**
   - **This document (MASTER_ARCHITECTURE.md):** timeless principles.
     Changes rarely, and only through deliberate amendment (see Section
     34).
   - **Operational/session documentation:** phase summaries, handoff
     notes, decision logs. Changes frequently, describes current state,
     and is expected to be superseded over time.
3. **Operational documentation must never contradict this document.** If a
   phase summary describes something that violates a principle here, that
   is a defect to be corrected — in the code, or through a deliberate
   amendment to this document — not something to be quietly tolerated.
4. **Every architectural decision of consequence is recorded at the time
   it is made**, including the alternatives considered and why they were
   rejected. A decision without a recorded reason is, for all practical
   purposes, indistinguishable from an accident, and will eventually be
   "fixed" by someone who doesn't know it was deliberate.
5. **Stale documentation is actively harmful** and is treated as a bug.
   When code changes in a way that invalidates existing documentation,
   updating that documentation is part of the same unit of work — not a
   follow-up task that may or may not happen later.

---

## 13. Architecture Decision Records (ADR)

### 13.1 Purpose

Architecture is not self-explanatory from code alone. A future maintainer
reading a Repository contract can see *what* it does, but not *why* it was
shaped that way, what alternatives were rejected, or what constraints made
the decision correct at the time. Without a durable record, that reasoning
exists only in the memory of whoever made the decision — and memory, unlike
documentation, does not survive personnel changes, AI session boundaries,
or the passage of years.

Architecture Decision Records exist to convert architectural reasoning
into permanent project knowledge. Every decision significant enough to
shape the system's structure must be captured at the moment it is made, so
that it can be understood, trusted, and correctly revisited by anyone who
encounters it later — without requiring them to reconstruct the reasoning
from scratch or guess at the intent behind it.

An ADR is not a status update and not a substitute for the operational
documentation described elsewhere in this document. It is a permanent,
individually addressable record of one specific architectural decision,
preserved exactly as it was reasoned through at the time.

### 13.2 Location

ADRs live in a single canonical location, separate from operational and
session documentation:

```
docs/
└── adr/
    ├── ADR-0001.md
    ├── ADR-0002.md
    └── ...
```

This location is mandatory for every future architectural decision,
regardless of which subsystem, module, or layer the decision concerns. No
architectural decision is recorded anywhere else as a substitute.

### 13.3 File Naming

Each ADR is a single file named according to a strict, sequential
convention:

```
ADR-0001-short-title.md
ADR-0002-short-title.md
```

Rules:

- Numbering is sequential and global across the entire project — not
  restarted per module, per feature, or per year.
- Numbers are zero-padded and never reused, regardless of whether a later
  ADR supersedes an earlier one.
- The short title is a brief, kebab-case description of the decision's
  subject, not its outcome (e.g. `ADR-0007-persistence-strategy`, not
  `ADR-0007-use-postgres`).
- Once assigned, a number and filename are permanent. They are never
  renumbered, renamed, or reassigned, even if the project is later
  reorganized.

### 13.4 Required Template

Every ADR, regardless of subject, follows the same fixed structure. The
template itself is defined here; actual decision content is never written
into this document.

```markdown
# ADR-XXXX: <Short Title>

## Status
<Proposed | Accepted | Rejected | Superseded by ADR-YYYY | Deprecated>

## Date
<YYYY-MM-DD>

## Context
<The situation that made a decision necessary. What forces, constraints,
or prior state led to this point.>

## Problem
<The specific question being decided. Stated precisely enough that a
future reader could evaluate whether the decision still applies.>

## Decision
<The decision that was made, stated plainly and unambiguously.>

## Alternatives Considered
<Each alternative that was seriously evaluated, and why it was not
chosen.>

## Consequences
<What becomes easier, harder, possible, or impossible as a direct result
of this decision.>

## Trade-offs
<What was deliberately given up in choosing this decision over its
alternatives.>

## Related ADRs
<Links to ADRs this decision depends on, supersedes, or is superseded by.>

## Related RFCs
<Links to any RFC or proposal document this ADR formalizes, if applicable.>
```

Every field is mandatory. A field with no applicable content is marked as
such explicitly (e.g. "None at this time") rather than omitted, so that a
future reader can distinguish "not applicable" from "forgotten."

### 13.5 Lifecycle

An ADR is required whenever a decision meets the threshold of
*architectural* significance, as defined throughout this document. This
includes, without limitation:

- Introducing a new subsystem or module category.
- Replacing an existing architectural pattern with a different one.
- Introducing a breaking change, per the process defined in this
  document.
- Changing the persistence strategy (database technology, storage model,
  schema philosophy).
- Changing the deployment strategy or runtime topology.
- Introducing a new cross-cutting concern (a concern that, by nature,
  touches multiple layers or modules at once).
- Reversing a previously rejected pattern or previously accepted ADR.

Ordinary implementation decisions — choices that operate entirely within
an existing contract, an existing module, and an existing pattern — do not
require an ADR. The test is the same one used elsewhere in this document
to distinguish architecture work from implementation work: if the decision
changes a contract, a boundary, or a permanent rule, it requires an ADR; if
it only fills in behavior inside an already-decided shape, it does not.

### 13.6 Governance

ADRs are created by whoever holds the architecture role for the decision
in question — human or AI — at the time the decision is made, following
the Decision-Making Process defined elsewhere in this document.

Every accepted ADR becomes part of the project's permanent architecture.
It carries the same authority as any other rule in this document for as
long as its status remains "Accepted."

ADR files are never deleted, and their content is never rewritten after
acceptance. History is not edited. If a decision later proves wrong, or
circumstances change, the correct action is to author a **new** ADR that
explicitly supersedes the old one — updating the superseded ADR's status
field to point to its successor — rather than altering the original
record. The superseded ADR remains in place permanently, as evidence of
what was decided, when, and why, even after it no longer governs current
behavior.

An accepted ADR is immutable. Once its status is "Accepted," the only
field that may ever change is the Status field itself, and only to record
that it has been superseded by a later ADR. The historical reasoning it
contains — its context, problem, decision, alternatives, consequences, and
trade-offs — is never rewritten, edited, or reinterpreted after the fact,
regardless of how much better the reasoning could later be phrased or how
wrong it later turns out to have been. A record of what was actually
decided, and why, at the time it was decided, is more valuable to a future
reader than a tidied-up version that quietly erases the project's real
history.

RFCs and ADRs are related but distinct, and the relationship between them
is itself part of the permanent governance model. An RFC is a temporary
proposal document — it exists to gather discussion, surface alternatives,
and reach a decision, and it is expected to be superseded by that decision
rather than to persist as the record of it. An ADR is the permanent
architectural record that results from that process. Every accepted
architectural RFC must eventually resolve into exactly one of two
outcomes: an Accepted ADR that formalizes the decision the RFC proposed, or
an explicit Rejected ADR that records the decision not to proceed. An RFC
is never treated as a self-sufficient substitute for an ADR — discussion is
not history, and a proposal is not a decision.

### 13.7 AI Rule

Every AI assistant working on this project must read all existing ADRs
before proposing any architectural change, in addition to the onboarding
sequence defined elsewhere in this document. ADRs are not optional reading
reserved for unusual cases — they are part of the permanent record any
architectural reasoning must be checked against.

No architectural proposal may contradict an accepted ADR. If a proposal
would require contradicting one, the correct path is to author a new ADR
that explicitly supersedes the existing one, following the governance
rules above — never to quietly act against an accepted ADR, and never to
treat an existing ADR as obsolete without a recorded decision saying so.

---

## 14. AI Collaboration Workflow

This project is built through a deliberate division of labor between human
oversight, an AI responsible for architecture/specification/review, and an
AI or human responsible for implementation. This division is a permanent
feature of the project's process, not a one-time arrangement.

### 14.1 Roles

- **Architecture & Specification role:** produces specifications, audits,
  reviews, and risk analysis. Does not implement. Is the guardian of this
  document and of contract stability.
- **Implementation role:** implements specifications exactly as written.
  Does not redesign architecture, does not introduce new contracts without
  the specification calling for them, and does not bypass approved
  decisions for convenience.
- **Review role:** verifies that implementation matches specification and
  that no architectural rule was silently violated in the process.

### 14.2 Standing rules for any AI operating on this project

1. **Read this document and current operational documentation before
   making any change.** Architecture and current project state are not
   to be re-derived from scratch by re-reading the entire codebase unless
   explicitly asked to.
2. **Do not re-audit the entire project unless explicitly instructed.**
   Trust prior documented decisions unless there is concrete evidence they
   are wrong.
3. **Do not introduce a new contract, dependency, layer, or architectural
   pattern without it being explicitly scoped as architecture work.**
   Implementation work stays inside existing contracts.
4. **Do not silently expand scope.** If a requested task appears to
   require an architectural change, that must be surfaced and decided
   explicitly — not absorbed quietly into an implementation task.
5. **Prefer the smallest correct change** that satisfies the
   specification, consistent with the principles in this document.
6. **When uncertain whether something is in scope, stop and ask** rather
   than guessing in either direction (doing too little or doing too much).

### 14.3 Why this division exists

Separating "deciding the shape of the system" from "filling in that shape"
is what allows the system to remain coherent even as the specific people or
AIs doing the work change repeatedly over its lifetime. Architecture
decisions accumulate institutional memory; implementation work should not
require institutional memory to execute correctly, only a correct
specification.

---

## 15. Versioning Strategy

1. **Contracts are versioned by addition, not mutation.** A breaking
   change to a public contract (an API shape, a repository interface, a
   DTO) is treated as a new version of that contract, with the old version
   kept functional until nothing depends on it.
2. **Internal versioning follows semantic intent**, even if no formal
   semver tooling is in place: changes that are purely additive and
   backward-compatible are minor; changes that alter or remove existing
   behavior are major and require explicit migration planning.
3. **Database schema versioning is migration-based and append-oriented**
   (see Section 17). A schema version is never "rewritten in place" once
   it has shipped to a real environment with real data.
4. **Documentation carries its own version markers** (last-updated dates,
   phase/version labels) so that any reader can immediately tell whether
   they are looking at current or historical guidance.

---

## 16. Release Strategy

1. **A release is a deliberate, reviewed event**, not an automatic
   byproduct of merging code. Every release has a clear scope: what
   changed, what didn't, and what was explicitly deferred.
2. **Releases are additive by default.** The default assumption for any
   release is that existing URLs, existing data shapes, and existing
   integrations continue to work unchanged. Any release that breaks this
   assumption must say so explicitly and prominently.
3. **No release ships content fabrication.** A release is rejected if it
   introduces placeholder, demo, or invented data anywhere that real users
   or real crawlers can reach it.
4. **Every release is preceded by a checklist gate** (Section 33) and
   followed by a documentation update (Section 12).
5. **Rollback is always considered before rollout.** A release is not
   approved unless there is a clear understanding of how to revert it if
   something goes wrong in production.

---

## 17. Migration Strategy

1. **Migrations are forward-only and additive wherever possible.** Adding
   a column, a table, or a contract field is preferred over altering or
   removing one.
2. **Destructive migrations (dropping a column, renaming a stable
   identifier, removing a table) require an explicit, separate
   architectural decision**, a documented reason, and a verified absence
   of remaining dependents — they are never bundled silently into a
   feature migration.
3. **Identity is permanent.** Any identifier that is used externally (in a
   URL, in an external integration, in a stored business record) is never
   reused for a different meaning and is never silently changed once
   published. If it must change, the old identifier is redirected or
   retired explicitly, never just dropped.
4. **Every migration step is reversible in principle**, or its
   irreversibility is called out explicitly and accepted deliberately
   before it runs against real data.
5. **Migrations are tested against a realistic copy of structure before
   running against real data**, whenever the migration is non-trivial.

---

## 18. Database Evolution Principles

1. **The database is the runtime source of truth once a domain has been
   migrated into it.** Static or file-based data is a legitimate, common
   *transitional* state — never a permanent parallel source of truth once
   a database-backed path exists for that data.
2. **Constraints belong as close to the data as is practical** (uniqueness,
   foreign keys, basic field-level validity) so that the database itself
   is a second line of defense against invalid states, not merely a
   passive store that trusts every caller.
3. **Schema changes are incremental.** A schema evolves through a sequence
   of small, reviewable migrations, not through periodic large rewrites.
4. **No schema change is "free."** Every schema change is evaluated for
   its effect on existing queries, existing application code, and existing
   stored data — not just for whether it satisfies the immediate feature
   request.
5. **Read and write paths may evolve independently.** It is acceptable,
   and sometimes correct, for the write path of a domain to be
   database-backed before the read path is, or vice versa — as long as the
   eventual destination (both paths converged on the same source of truth)
   is clear and tracked.

---

## 19. Performance Philosophy

1. **Performance is a product requirement, not an optimization
   afterthought.** Targets (load speed, responsiveness, layout stability)
   are treated with the same seriousness as functional correctness,
   because for this kind of trust-sensitive, SEO-dependent platform,
   performance *is* part of the user's perception of engineering quality.
2. **Measure before optimizing.** Architectural decisions are not made on
   the basis of assumed performance characteristics; they are validated
   against real measurement whenever performance is the stated concern.
3. **Correctness is never sacrificed for speed.** A fast system that
   returns wrong or fabricated data is a worse outcome than a
   slightly-slower system that is correct.
4. **Performance budgets are explicit and tracked over time**, not
   re-derived informally on each release. A regression against a
   previously-met budget is treated as a defect.
5. **The architecture should make the fast path the easy path.** Where
   possible, the default, idiomatic way of building a feature within the
   existing layers should also be the performant way — performance should
   not require contributors to know special tricks that bypass the normal
   architecture.

---

## 20. Security Philosophy

1. **Boundaries are the primary security control.** Strict layer
   separation (UI never touches the database; only repositories touch
   persistence) is itself a security property — it minimizes the surface
   area where an injected or malformed input can reach something
   dangerous.
2. **Validate at the boundary, trust within it.** Data is validated as it
   enters the system (at the server function / controller boundary); once
   validated, inner layers are not expected to re-litigate basic shape and
   type correctness, but they remain responsible for business-rule
   correctness.
3. **Least privilege is the default**, for database access, for any future
   authentication/authorization model, and for any service-to-service
   communication. Broad, ambient trust between components is treated as a
   defect to be narrowed, not a convenience to be preserved.
4. **Defense in depth, not defense in one place.** Authorization,
   validation, and storage-level constraints are expected to overlap
   rather than rely on any single layer never failing.
5. **Abuse mitigation (rate limiting, bot mitigation, input sanitization)
   on any public-facing write path is a permanent, non-optional
   requirement**, proportional to the sensitivity of what that path
   writes — not a one-time hardening pass that is considered "finished"
   forever once shipped.
6. **Security posture is revisited whenever trust boundaries change** —
   when authentication is introduced, when new external integrations are
   added, when new public write paths are added — never assumed to
   "still be fine" by default.

---

## 21. Internationalization Philosophy

1. **One language is canonical; others are progressive enhancements of
   that canonical content.** The architecture must support partial
   translation coverage gracefully — a missing translation is never an
   error state, it is an expected, handled state with a defined fallback.
2. **The fallback rule is defined in exactly one place** and is reused
   everywhere localized content is resolved. It is never reimplemented
   per-feature, because divergent fallback behavior across features is a
   subtle, hard-to-detect correctness bug.
3. **Localized content is structurally distinct from non-localized
   content** in the data model (a localized field is a small structured
   object across languages; a non-localized field — like a proper noun
   model name — is a plain string). This distinction is preserved
   deliberately and never collapsed for convenience.
4. **Direction (LTR/RTL) and locale-specific formatting (numbers, dates)
   are first-class architectural concerns**, resolved before content is
   rendered, not patched on afterward.
5. **Machine-assisted translation is an acceptable transitional content
   strategy, but is never treated as architecturally different from
   human-authored translation** — the data model and resolution rules are
   identical regardless of how the content was produced.

---

## 22. SEO Philosophy

1. **SEO is a structural property of correct architecture, not a
   separate bolt-on layer.** Canonical URLs, stable identifiers, and
   metadata are treated as core parts of the route/data contract, not as
   an afterthought layered on top once a feature is "done."
2. **Identity (slugs, canonical URLs) is permanent**, per the Migration
   Strategy (Section 17). SEO equity, once earned by a URL, is a real
   asset that the architecture is obligated to protect.
3. **Metadata is data-driven, never hardcoded per-page.** Titles,
   descriptions, and structured data are derived from the same underlying
   content model that drives the visible page — never maintained as a
   separate, parallel, manually-updated artifact that can silently drift
   out of sync.
4. **No SEO shortcut overrides correctness.** Keyword stuffing,
   AI-spam content, or any technique that trades genuine content quality
   for short-term ranking gain is permanently incompatible with this
   project's trust-first positioning, regardless of any future pressure
   to adopt it.
5. **SEO infrastructure (sitemaps, structured data, hreflang) is treated
   as a derived view of real content**, and must never reference
   draft, archived, or non-existent content as if it were live.

---

## 23. Media Philosophy

1. **The application layer never bundles or owns media content.** Images,
   videos, and documents are referenced by a string identifier (a URL or a
   storage key); the resolution of that identifier into an actual asset is
   the responsibility of a dedicated resolution layer, which can change
   (public path today, signed cloud-storage URL tomorrow) without any
   calling code changing.
2. **No placeholder media ever ships to production.** A missing image
   results in that visual element not rendering — never a stock photo,
   never a "coming soon" graphic standing in for real content, in a
   domain where visual claims (what a medical device actually looks like)
   carry real trust weight.
3. **Media metadata travels with the reference**, not separately — when it
   matters (alt text, dimensions, primary-image designation), it is part
   of the same structured reference, never reconstructed by guesswork at
   render time.
4. **Storage technology is replaceable by design.** The architecture must
   never assume a specific storage vendor at any layer above the
   resolution layer itself.

---

## 24. Testing Philosophy

1. **Business logic (Services) must be testable without infrastructure.**
   If testing a business rule requires a live database, a live network
   call, or a running UI, that is evidence of a layering defect, not a
   testing limitation to work around.
2. **Repository contracts are tested against their contract, not their
   implementation detail.** The same test suite, run against an in-memory
   implementation and a real implementation, should pass identically —
   if it doesn't, the implementations don't actually honor the same
   contract.
3. **Validation logic is tested exhaustively at its boundary** (what is
   accepted, what is rejected, and why) because validation is the
   project's primary defense against bad data ever reaching the database.
4. **Tests document intent.** A test failure should make it obvious which
   rule was violated, not just that "something" broke.
5. **Testing effort scales with consequence**, not with code volume. A
   small piece of logic that gates what a clinician-facing page can claim
   about a medical device deserves more test rigor than a large amount of
   purely cosmetic UI code.

---

## 25. Validation Philosophy

1. **Validation is a first-class architectural layer, not an inline
   afterthought scattered through handlers.** A validator for a given
   concept exists once, is composable, and is reused at every entry point
   that concept can be created or modified from.
2. **Validation produces structured, typed results — never throws for
   expected, anticipated failure cases.** Exceptions are reserved for
   truly exceptional, unanticipated conditions.
3. **Validation rules mirror the data contract directly.** There is no
   parallel, informally-maintained set of "real" rules that differs from
   what the schema documentation says — the validator *is* the executable
   form of the schema's constraints.
4. **The same validation contract is reusable regardless of transport.**
   A validation issue shape must be presentable by a web form UI, a CLI,
   or a future API consumer without translation, because the underlying
   rule is the same regardless of how it's being checked.

---

## 26. Future Extensibility Rules

1. **New capabilities are added as new modules behind new or extended
   contracts — never by reaching into and entangling an existing module's
   internals.**
2. **A new module must be able to be removed cleanly.** If removing a
   module requires surgery across unrelated parts of the system, it was
   not built as a proper module in the first place.
3. **Extension points are explicit.** Where the architecture anticipates
   future growth (e.g., a field reserved for future use, an interface
   designed to support a future implementation), that anticipation is
   documented at the point of design — not discovered as a happy accident
   later.
4. **Backward compatibility is the default expectation for any
   extension.** A new module or capability should not require existing,
   unrelated modules to change in order to function.
5. **The architecture favors composition over inheritance**, and
   favors small, focused contracts over large, all-purpose ones — a large
   module trying to anticipate every future need is itself a common
   anti-pattern (see Section 28).

---

## 27. Rules for Introducing New Modules

A new module may be introduced only when all of the following are true:

1. It represents a genuinely distinct business capability, not a
   restructuring of an existing one.
2. Its contract (types, repository interface if it owns persisted data,
   key operations) has been specified before implementation begins.
3. It does not require modifying the internals of an unrelated existing
   module to integrate. Integration happens through public contracts only.
4. It follows the same folder, naming, layering, and validation
   conventions as every other module in this document — no module gets a
   bespoke architecture "because it's special."
5. Its addition is documented (Section 12) at the time it is introduced,
   including what it does *not* do, to prevent silent scope creep later.
6. It has been explicitly approved as in-scope — modules are never
   introduced as an unannounced side effect of an unrelated task.

---

## 28. Rules for Introducing Breaking Changes

A breaking change (one that requires existing callers, existing data, or
existing URLs to change in order to continue working) requires, at minimum:

1. **An explicit proposal** stating exactly what breaks and for whom.
2. **A documented reason** the change cannot be made additively instead.
3. **A migration plan** for every known affected caller/consumer/dataset.
4. **A deprecation window** wherever feasible — the old behavior continues
   to function, clearly marked deprecated, for a defined period before
   removal.
5. **Explicit approval**, recorded in the documentation history, before
   the change ships. No breaking change is introduced as an
   undocumented side effect of an otherwise-additive piece of work.

Breaking changes are not forbidden — they are sometimes correct — but they
are never casual, and never silent.

---

## 29. Architectural Anti-Patterns (Recognize and Reject)

- **God services / god repositories.** A single class or module that
  knows about and touches everything. Symptom of missing boundaries.
- **Logic leaking into the UI layer.** Business rules expressed as
  conditional rendering logic instead of as a Service decision the UI
  merely reflects.
- **Shotgun surgery.** A single conceptual change requiring edits across
  many unrelated files because a contract boundary is missing where one
  should exist.
- **Anemic domain models with logic scattered everywhere else.** Types
  that are pure data bags while every rule about them lives ad hoc at
  each call site, with no single home.
- **Silent data fabrication.** Filling a gap in missing data with a
  guess, a default that looks like real content, or a "looks plausible"
  placeholder.
- **Parallel sources of truth.** Two places that both claim to be
  authoritative for the same fact, kept in sync manually (or not at all).
- **Implicit global state / hidden coupling.** Two unrelated modules that
  only work correctly because of an undocumented shared assumption.
- **Premature generalization.** Building elaborate extensibility for a
  future need that hasn't actually arrived, at the cost of clarity today.
- **Big-bang rewrites.** Replacing a working system wholesale instead of
  migrating it incrementally behind stable contracts.
- **Documentation theater.** Documentation that describes an idealized
  architecture rather than the one that actually exists, eroding trust in
  all documentation over time.

---

## 30. Things That Are Permanently Forbidden

These are not phase-specific constraints. They are permanent, unless this
document itself is deliberately amended (Section 34) with an explicit,
recorded justification.

1. **UI components must never access a database or persistence client
   directly.**
2. **Business logic must never live inside a UI component, a route file,
   or a mapper.**
3. **No layer may fabricate, guess, or placeholder real-looking content**
   to fill a gap where real data is missing.
4. **Stable public identifiers (slugs, canonical URLs) are never silently
   repurposed or reused for a different meaning.**
5. **No destructive schema or data change ships without an explicit,
   separately reviewed migration plan.**
6. **No architectural pattern is adopted merely because it is trending.**
   Adoption requires a documented reason tied to this project's actual
   needs.
7. **No public write path ships without abuse mitigation proportionate to
   its exposure.**
8. **No undocumented breaking change.**
9. **No re-introduction of complexity that was previously and
   deliberately rejected** (e.g., architectural patterns explicitly ruled
   out in prior decisions) without a fresh, explicit, documented decision
   to reverse that prior rejection.

---

## 31. Decision-Making Process

1. **Identify the decision as architectural** (affects contracts, layer
   boundaries, data model shape, or any rule in this document) versus
   purely implementational (affects only code inside an existing
   contract).
2. **State the problem and at least one alternative**, even informally.
   A decision with no stated alternative is usually a decision that wasn't
   actually examined.
3. **Evaluate against the principles in Section 2**, in priority order.
4. **Record the decision and its reasoning** before or alongside
   implementation — not as a retroactive afterthought.
5. **Default to the smallest change that resolves the problem
   correctly**, consistent with not violating any permanent rule in
   Section 30.
6. **When a decision conflicts with this document, the conflict is
   resolved by amending this document deliberately (Section 34) — never
   by quietly working around it.**

---

## 32. Checklist Before Accepting Any Pull Request

- [ ] Does this change respect the dependency rule (Section 3)? No layer
      reaches past the one immediately inside it.
- [ ] Is any new or changed contract (type, DTO, repository interface)
      reviewed on its own terms, separately from its implementation?
- [ ] Does business logic live in a Service, not in UI, routes, or
      mappers?
- [ ] Are existing stable identifiers (slugs, public URLs, external IDs)
      left unchanged, or is a change to them explicitly justified and
      planned per Section 17?
- [ ] Does the change avoid fabricating or placeholder-ing any
      user-facing content where real data is absent?
- [ ] Is validation centralized rather than duplicated inline?
- [ ] Does the change avoid introducing a new module, dependency, or
      pattern that wasn't explicitly scoped as architecture work?
- [ ] Is the change backward-compatible, or if not, does it follow the
      breaking-change process (Section 28) in full?
- [ ] Is documentation updated in the same unit of work, per Section 12?
- [ ] Does the change avoid any of the permanently forbidden items in
      Section 30?

## 33. Checklist Before Every Release

- [ ] All items in Section 32 have been satisfied for every change in the
      release.
- [ ] Performance budgets (Section 19) have been verified, not assumed.
- [ ] No placeholder, demo, or fabricated content reaches any
      production-reachable surface.
- [ ] Public write paths retain proportionate abuse mitigation.
- [ ] SEO-relevant surfaces (canonical URLs, metadata, structured data,
      sitemaps) reflect only real, live content.
- [ ] Internationalization fallback behavior has been verified across all
      supported locales, including the canonical one.
- [ ] A rollback path is understood and documented before rollout.
- [ ] Documentation (this document if amended, plus operational
      documentation) is updated to reflect the release's actual scope —
      no more, no less.

---

## 34. Documentation Update Policy

- This document is updated **only** through a deliberate amendment: a
  stated problem with the current principle, a stated alternative
  considered, and an explicit decision to change it — recorded with a
  date and reasoning, following the Decision-Making Process (Section 31).
- Operational documentation (phase summaries, handoff notes) is updated
  continuously, as part of the same unit of work as the change it
  describes, never as a deferred follow-up.
- When operational documentation and this document appear to disagree,
  this document wins, and the disagreement itself is treated as a defect
  to resolve explicitly — either by correcting the operational drift or
  by formally amending this document.
- Historical decisions are never deleted from the record, even after the
  code they describe has been retired. Future maintainers benefit from
  knowing not just the current state, but the path that led to it.

---

## 35. AI Onboarding Policy

Any AI assistant beginning work on this project — regardless of vendor,
model, or session — follows this onboarding sequence before making any
change:

1. **Read this document (MASTER_ARCHITECTURE.md) in full.** This is the
   permanent constitution and takes precedence over any older or
   conflicting instruction the AI may have been given elsewhere.
2. **Read the current operational documentation** (current project
   status, most recent session/handoff notes) to understand what phase of
   work the project is actually in right now.
3. **Scope the requested task** against the current operational state and
   this document's rules before writing or changing anything.
4. **Do not re-audit the entire project, redesign the architecture, or
   introduce new architectural patterns unless the task explicitly asks
   for architecture-level work.** Default to operating *within* the
   existing contracts.
5. **Treat any apparent conflict between a specific instruction and this
   document as a signal to pause and surface the conflict**, rather than
   silently resolving it in either direction.
6. **When the task is complete, leave the documentation record in a state
   that the next AI — with no memory of this session — could pick up from
   correctly**, per Section 12.

