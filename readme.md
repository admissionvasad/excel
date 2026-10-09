# College Admission & Dynamic ERP System

A modern multi-college admissions, merit, and fee management platform built with SvelteKit, TypeScript, and Supabase. The system is designed to manage student inquiries, registrations, application processing, document verification, merit ranking, fee collection, and role-based administration across multiple campuses.

## Overview

This project is a scalable academic management platform for colleges and institutions that need a single system to manage the student lifecycle from inquiry to final admission. It supports multi-college administration, dynamic form design and versioning, student registration and intake workflows, document verification and correction handling, board and marks management, merit calculation, fee structures, role-based permissions, and Excel-based reporting.

The goal is to reduce manual administrative work, centralize academic data, and keep the system configurable without requiring source-code changes for every new college, course, fee head, or custom form field.

## Key Features

### Admissions and Student Management
- student registration and profile management
- inquiry capture and tracking
- admission application forms
- application numbering and lifecycle status
- document upload and verification
- correction, approval, and rejection workflows

### Dynamic Form Builder
- create, edit, publish, archive, and duplicate forms
- drag-and-drop field ordering
- field validation and conditional logic
- reusable templates and version control
- flexible storage for custom institutional fields

### Academic and Merit Management
- academic year configuration
- college and course management
- board and subject setup
- marks entry and validation
- merit rule configuration and ranking
- merit list generation and export

### Fee Management
- fee heads and fee structures
- student fee accounts and balances
- payment collection and receipt generation
- partial payments and adjustments
- refund handling and audit tracking

### Reporting and Administration
- dashboard analytics
- search, filter, sort, and pagination
- Excel import/export support
- audit logs and configuration records
- role-based access by college and department scope

## Tech Stack

- Frontend: SvelteKit
- Language: TypeScript
- Styling: Svelte components and CSS
- Backend and database: Supabase PostgreSQL
- Authentication: Supabase Auth
- Storage: Supabase Storage
- Excel processing: xlsx
- PDF generation: pdf-lib
- Build tool: Vite
- Testing: Vitest

## Roles

The system is built around role-based access, including:

- Super Admin
- College Admin
- Data Entry Operator
- Authority / Verifier
- Student
- supporting access roles when needed

Permissions are scoped to colleges, courses, and operational tasks to prevent unauthorized cross-organization access.

## Typical Workflow

1. inquiry submission
2. student registration
3. admission application
4. document upload
5. academic record and marks validation
6. merit scoring and ranking
7. verification and approval
8. fee generation and payment
9. final admission confirmation and reporting

## Project Structure

```text
.
├── public/
├── src/
│   ├── app.css
│   ├── app.d.ts
│   ├── app.html
│   ├── hooks.server.ts
│   ├── lib/
│   │   ├── components/
│   │   ├── config/
│   │   ├── domain/
│   │   ├── i18n/
│   │   ├── server/
│   │   ├── stores/
│   │   ├── supabase/
│   │   ├── types/
│   │   └── utils/
│   └── routes/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── data/
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
├── readme.md
├── README.md
├── README.MD
├── server.js
└── static/
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- a Supabase project
- environment variables configured locally

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Run validation checks

```bash
npm run check
npm run lint
npm test
```

### Build for production

```bash
npm run build
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

> The service role key must never be exposed to browser code or frontend bundles.

## Database and Security

This project is designed around Supabase PostgreSQL and expects:

- UUID primary keys
- foreign key relationships
- indexed lookup fields for students, applications, courses, and merit data
- row-level security (RLS) on protected tables
- permission checks by role and college access
- audit trails for approvals, fee updates, document decisions, and role actions

## Design Principles

- dynamic configuration instead of hard-coded values
- server-side validation for critical business rules
- permission enforcement on protected actions
- no physical deletion of financial records
- soft-delete behavior for master data when appropriate
- backend-generated application numbers and calculations

## Roadmap

The implementation is organized in phases:

1. setup and authentication
2. college, course, academic year, and intake configuration
3. dynamic form builder and templates
4. inquiry and student admission flow
5. documents, marks, and Excel import/export
6. merit rule processing and merit list generation
7. fees, receipts, and payment tracking
8. approvals, audits, and reporting
9. security reinforcement and deployment preparation

## Quality Standards

The project follows practical ERP-quality standards:

- search, filter, pagination, and export on major tables
- modern dashboard layout
- responsive user interface
- audit-friendly operations
- scalable and secure architecture

## License

This project is intended for educational and institutional use. Add a license file if you intend to distribute it beyond internal use.

## Notes

This repository is a practical foundation for a college admission and academic ERP platform, combining the project specification with a realistic SvelteKit + Supabase structure suitable for extension into a production-ready software system.
