# Backend Modules (Phase 3)

TanStack Start server-function modules mapped from the Phase 3 NestJS plan.
Each module mirrors the canonical NestJS layering — Controller / Service /
Repository / DTO / Mapper — implemented as plain TS:

| NestJS concept | File suffix          | Purpose                                  |
| -------------- | -------------------- | ---------------------------------------- |
| Controller     | `*.functions.ts`     | RPC surface (`createServerFn`)           |
| Service        | `*.service.ts`       | Business logic, orchestrates repository  |
| Repository     | `*.repository.ts`    | All data access (Supabase client)        |
| DTO            | `*.dto.ts`           | Wire-shape types returned to clients     |
| Mapper         | `*.mapper.ts`        | Pure DB-row → DTO translation            |

## In-scope modules

- `products/` — list + detail by slug for PUBLISHED products, with all
  dependent collections (images, videos, documents, specifications,
  certifications, FAQ, SEO, related products).
- `categories/` — derived from the `product_category_key` enum, exposed
  with localized labels and a published-product count.
- `company/` — single-row company profile (name, mission, vision, history,
  certificates, contact).

## Out of scope (per Phase 3 brief)

- Authentication / authorization
- Search, media upload, dashboards, analytics
- CQRS, event systems, microservices
- Write operations (DB writes happen via the migration/seed pipeline)

## Data access

Repositories use `getServerSupabase()` (publishable key, RLS enforced).
RLS policies in the initial migration restrict reads to `PUBLISHED`
products and their dependent rows — there is no application-level
status check needed in services.

## Adding a module

1. Create `src/lib/modules/<name>/<name>.dto.ts`
2. Add `<name>.mapper.ts` (pure functions)
3. Add `<name>.repository.ts` (extends or uses `getServerSupabase`)
4. Add `<name>.service.ts` (business logic, no DB calls)
5. Add `<name>.functions.ts` exporting `createServerFn` endpoints