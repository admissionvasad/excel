# Multi-College Education ERP Platform

A reusable, dynamic **Multi-College Education ERP** built with **SvelteKit + TypeScript + Supabase
PostgreSQL + Tailwind-ready styling**, designed for use by an organisation (trust) running many
colleges and campuses. A new college can be configured from the Admin Panel — normal master data
and business rules do **not** require source-code changes.

This project is the implementation of the platform specification in
`../README(1) (1).md`.

---

## Highlights

- **Multi-tenant**: organization → college → campus → department → programme → semester → division.
- **Dynamic CRUD**: every module is generated from a single registry (`src/lib/config/modules.ts` +
  `modules.extra.ts`), so list / create / edit / delete / search / filter / pagination come for free.
- **Configurable business rules**:
  - Dynamic merit engine (selected subjects + safe formula evaluation).
  - Salary rule engine (earning/deduction components, per-lecture, per-hour, formula).
  - Attendance engine (punches → hours, late, half-day, overtime, status).
  - College-wise receipt numbering (`ENG/2026/00001`).
  - Biometric punch normalisation with vendor-agnostic aliases.
- **Runs with or without Supabase**: with credentials it uses Supabase (Auth + Postgres + RLS); with
  no credentials it falls back to a local JSON store with seeded demo colleges, users and data so
  `npm run dev` works instantly.
- **English + Gujarati** i18n scaffolding.
- **Audit logging**, **role/permission matrix**, **row-level security** migrations.

---

## Tech Stack

| Layer      | Technology                                   |
| ---------- | -------------------------------------------- |
| Framework  | SvelteKit (Svelte 5, runes mode)             |
| Language   | TypeScript                                   |
| Database   | Supabase PostgreSQL                          |
| Auth       | Supabase Auth (local fallback for demo)      |
| Storage    | Supabase Storage                             |
| Styling    | Component CSS design system (Tailwind-ready) |
| Excel/CSV  | `xlsx`                                       |
| PDF        | `pdf-lib`                                    |
| Validation | `zod`                                        |
| Tests      | Vitest                                       |

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
```

Validation commands:

```bash
npm run check      # svelte-check (types)
npm run lint       # eslint
npm run format     # prettier
npm run test       # vitest
npm run build      # production build
npm run preview    # preview the build
```

### Demo login (local mode, no Supabase configured)

| Email                     | Password   | Role        |
| ------------------------- | ---------- | ----------- |
| `admin@college-erp.local` | `admin123` | Super Admin |

College admins are seeded as `admin1..5@college-erp.local` with password `college123`.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase project values. Leave them blank to run on
the local JSON store.

```env
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

> The service-role key is only ever read on the server and must never be exposed to the browser.

---

## Database

SQL migrations live in `supabase/migrations/`:

| File                                    | Purpose                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `001_erp_core.sql`                      | Core colleges / profiles / departments / courses / students + RLS helper.                                                                                                                                                                                                                                                                                                                                 |
| `002_admissions_merit.sql`              | Admissions and merit scores.                                                                                                                                                                                                                                                                                                                                                                              |
| `003_fix_admissions_merit_policies.sql` | RLS policy corrections.                                                                                                                                                                                                                                                                                                                                                                                   |
| `004_platform_schema.sql`               | Full platform schema (organisation, campuses, academics, punching machine, attendance, leave, lecture records, salary rules, payroll, fees, receipt series, exams, accounts, purchase, inventory, library, hostel, transport, scholarships, placements, alumni, grievances, documents, notifications, dynamic builders, roles/permissions, settings, audit logs) + automatic RLS + `updated_at` triggers. |

Seed data (roles, permissions, demo colleges, time slots, fee heads) is in `supabase/seed/seed.sql`.

The dynamic SQL blocks in `004_platform_schema.sql`:

- enable RLS and create a tenant policy on every table exposing a `college_id`;
- restrict global tables (`roles`, `permissions`, `role_permissions`, `organizations`) to
  authenticated reads with super-admin writes.

All tenant access flows through the `can_access_college(college_id)` helper defined in `001`.

---

## Project Structure

```text
erp-platform/
├── src/
│   ├── app.css / app.html / app.d.ts / hooks.server.ts
│   ├── lib/
│   │   ├── components/   # shell (Sidebar/Topbar) + form controls
│   │   ├── config/       # modules registry, permissions, roles
│   │   ├── domain/       # merit, salary, attendance, punch, receipt engines (+ tests)
│   │   ├── i18n/         # English + Gujarati
│   │   ├── server/       # supabase session, repository, guards, audit, local store
│   │   ├── stores/       # ui / theme / toast
│   │   ├── supabase/     # browser client
│   │   ├── types/        # shared TypeScript types
│   │   └── utils/        # formatting + CSV export
│   └── routes/
│       ├── (auth)/       # login, setup, forgot-password
│       └── app/          # dashboard, [module] generic CRUD, merit workspace
├── supabase/
│   ├── migrations/       # 001–004 SQL
│   └── seed/seed.sql
├── static/
├── tests -> src/**/*.test.ts (Vitest)
├── vite.config.ts / vitest.config.ts
├── eslint.config.js / .prettierrc
├── tsconfig.json / svelte.config.js
└── .env.example
```

---

## Modules

The registry covers the specification's 35 modules, including: Organization, Colleges, Campuses,
Users, Admissions, Admission Forms/Fields, Merit, Merit Rules, Students, Academics (academic years,
departments, programmes, courses, subjects, divisions, time slots, timetable), Punching Machines &
Punch Records, Attendance Rules, Attendance, Leave, Lecture Records, Examination, Fee Heads, Fee
Structures, Fee Payments, Receipt Numbering, Accounts, Payroll (salary rules, components, runs,
items), HR, Purchase, Inventory, Library, Hostel, Transport, Scholarship, Training & Placement,
Alumni, Grievance, Documents, Notifications, Reports, Settings and Audit Logs.

Every module gets list + create + edit + delete screens with search, filters, pagination, export and
print-ready output.

---

## Domain Engines

Pure, unit-tested functions live in `src/lib/domain/`:

- `merit-engine.ts` — `computeSelectedSubjectTotal`, `computeDynamicMerit`,
  `evaluateFormula` (safe expression evaluator), `rankMeritList`.
- `salary-engine.ts` — `calculateSalary`, `calculateVisitingPay`, `calculateByRule`.
- `attendance-engine.ts` — `calculateAttendance`, `normalizePunches`.
- `punch.ts` — `normalizePunch`, `normalizePunchBatch`.
- `receipt.ts` — `formatReceiptNumber`, `nextReceiptSequence`.

Run `npm run test` to execute the 33 business-rule tests.

---

## Security

- Supabase Auth + server-side session handling.
- RLS enforced at the database level for every tenant table.
- Role matrix (`src/lib/config/permissions.ts`) and per-module permission checks.
- Audit logging (`src/lib/server/audit.ts`) for create/update/delete/approve/export/import.
- Financial and payroll records are soft-deleted and never physically removed.

---

## Deployment

The project uses `@sveltejs/adapter-auto`. For Vercel, install `@sveltejs/adapter-vercel` and swap
the adapter in `svelte.config.js`, or rely on adapter-auto's platform detection. Add the Supabase
environment variables as deployment secrets.
