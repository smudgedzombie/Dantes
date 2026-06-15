# Dantès Finance

A premium personal finance management system — a private wealth command center for people who treat their capital with institutional rigor.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + Clerk Auth (`@clerk/express`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite + Tailwind v4 + Recharts + Clerk React

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/` — Drizzle table definitions (accounts, categories, transactions, budgets)
- `artifacts/api-server/src/routes/` — Express route handlers (accounts, categories, transactions, budgets, dashboard)
- `artifacts/dantes/src/` — React frontend (pages, components, Clerk auth)

## Architecture decisions

- All API contracts defined in OpenAPI first; types/hooks generated via Orval codegen
- Clerk Auth (Replit-managed) handles authentication; proxy middleware routes through `/api/__clerk`
- Numeric DB columns (balance, amount) stored as `numeric(15,2)` strings and parsed to `number` in route handlers
- Dashboard endpoints compute aggregates server-side (no client-side calculation)
- Dark navy + gold palette; Recharts for charts; framer-motion for animations

## Product

- Landing page with brand identity for unauthenticated visitors
- Dashboard with financial summary, monthly income/expense flow chart, spending by category, and recent transactions
- Full account management (checking, savings, investment, credit, cash)
- Transaction tracking with filtering by account/category/type
- Budget management with per-category spend tracking vs. budget
- Category management with color coding

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- Numeric columns from Drizzle come back as strings — always `parseFloat()` before sending to client
- Clerk dev keys warning in console is expected and harmless in development
- `tailwindcss({ optimize: false })` in vite.config.ts is required for Clerk themes to work in prod

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
