# Multi-College Education ERP

Complete multi-college, multi-campus Education ERP built with Node.js,
SvelteKit, TypeScript, Supabase and PostgreSQL.

## Objectives

-   Multi-organization, multi-college and multi-campus
-   College logo, address and settings
-   Student and employee/faculty management
-   Admission: ACPC, ACPDC, GCAS, MQ, VQ, NRI
-   Dynamic admission forms, merit rules and reports
-   PCM/PCB + GUJCET marks/percentile
-   Official ACPC/ACPDC/GCAS rule-document storage
-   College-wise fees and receipt numbering
-   Academic, department, course, subject and timetable management
-   Biometric/punching integration and faculty attendance
-   Regular, visiting, guest, contract and part-time faculty
-   Dynamic salary/payroll rules including lecture/hour based visiting
    faculty salary
-   Leave, holiday, overtime and payroll
-   Examination, marks and results
-   Accounts, purchase and inventory
-   Library, hostel and transport
-   Scholarship, training & placement and alumni
-   Grievance and document management
-   Notifications, email, WhatsApp integration
-   Dynamic Form/Table/Report builders
-   Gujarati + English
-   RBAC, Supabase RLS and audit log
-   PDF, Excel and CSV
-   Backup, security and deployment

## Stack

-   Node.js
-   SvelteKit + TypeScript
-   Supabase Auth
-   Supabase PostgreSQL
-   Supabase Storage
-   Supabase RLS
-   Tailwind CSS
-   Zod
-   Vitest + Playwright
-   GitHub

## Architecture

``` text
Users
  -> SvelteKit
  -> Supabase Auth
  -> PostgreSQL + RLS
  -> Storage / Functions
  -> ERP modules

Organization
  -> Colleges
     -> Campuses
        -> Departments
           -> Programs/Courses
              -> Semesters/Divisions
                 -> Subjects
```

Every tenant/business record must use `organization_id`, `college_id`
and, where applicable, `campus_id`. Frontend filtering is not security;
PostgreSQL RLS is mandatory.

## Recommended Project Structure

``` text
college-erp/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   ├── config/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── auth/
│   │   ├── permissions/
│   │   ├── audit/
│   │   ├── i18n/
│   │   ├── supabase/
│   │   ├── engines/
│   │   │   ├── form-engine/
│   │   │   ├── table-engine/
│   │   │   ├── report-engine/
│   │   │   ├── rule-engine/
│   │   │   ├── workflow-engine/
│   │   │   ├── merit-engine/
│   │   │   ├── payroll-engine/
│   │   │   ├── attendance-engine/
│   │   │   └── receipt-engine/
│   │   └── services/
│   └── routes/
│       ├── login/ dashboard/ colleges/ campuses/
│       ├── academics/ students/ employees/ admissions/ merit/
│       ├── fees/ timetable/ attendance/ payroll/ leave/
│       ├── examination/ accounts/ purchase/ inventory/
│       ├── library/ hostel/ transport/ scholarship/
│       ├── placement/ alumni/ grievance/ documents/
│       ├── notifications/ dynamic-forms/ dynamic-tables/
│       ├── reports/ settings/
│       └── ...
├── supabase/
│   ├── migrations/
│   ├── functions/
│   ├── seed.sql
│   └── config.toml
├── tests/
├── scripts/
├── static/
├── .env.example
├── package.json
└── README.md
```

# Database Modules

## Core / Multi-College

`organizations`, `colleges`, `campuses`, `college_settings`,
`academic_years`, `financial_years`

## Security / Users

`profiles`, `roles`, `permissions`, `role_permissions`, `user_roles`,
`user_college_access`, `user_department_access`, `audit_logs`,
`audit_log_changes`

## Academic

`departments`, `programs`, `courses`, `course_types`, `semesters`,
`divisions`, `subjects`, `course_subjects`, `rooms`,
`faculty_subject_assignments`

## Students

`students`, `student_parents`, `student_addresses`,
`student_academic_history`, `student_documents`, `student_contacts`,
`student_status_history`, `student_promotions`, `student_enrollments`

## Employees / Faculty

`employees`, `employee_documents`, `employee_addresses`,
`employee_bank_accounts`, `employee_qualifications`,
`employee_experience`, `employee_departments`, `employee_designations`,
`employment_types`, `faculty_profiles`

## Admission / Merit

`admission_cycles`, `admission_types`, `admission_applications`,
`admission_documents`, `admission_status_history`, `admission_rules`,
`admission_rule_versions`, `merit_rules`, `merit_rule_versions`,
`merit_rule_conditions`, `merit_rule_subjects`, `merit_rule_formulas`,
`merit_results`, `merit_rankings`

## Dynamic Engines

`dynamic_forms`, `dynamic_form_versions`, `dynamic_form_sections`,
`dynamic_form_fields`, `dynamic_form_options`,
`dynamic_form_submissions`, `dynamic_form_submission_values`

`dynamic_tables`, `dynamic_table_columns`, `dynamic_table_records`,
`dynamic_table_record_values`

`reports`, `report_columns`, `report_filters`, `report_sorting`,
`report_grouping`, `report_formulas`, `report_permissions`

## Fees

`fee_structures`, `fee_heads`, `fee_categories`,
`student_fee_assignments`, `fee_invoices`, `fee_invoice_items`,
`fee_receipts`, `fee_receipt_items`, `fee_refunds`, `fee_concessions`,
`fee_installments`, `receipt_sequences`

Receipt format example: `SVIT/2026-27/000001`. Sequence must be
transaction-safe and independent per college/financial year.

## Timetable / Attendance / Biometric

`timetable`, `timetable_slots`, `timetable_entries`, `timetable_rooms`,
`timetable_rules`, `biometric_devices`, `biometric_device_users`,
`biometric_raw_logs`, `biometric_sync_logs`, `employee_punches`,
`attendance_daily`, `attendance_sessions`, `attendance_lecture_records`,
`attendance_adjustments`

Default timings are configurable, for example: 09:30 punch-in;
09:45-10:45, 10:45-11:45, 11:45-12:45 classes; 12:45-13:30 recess;
13:30-14:30, 14:30-15:30, 15:30-16:25 classes; 16:30 punch-out.

## Leave / Payroll

`leave_types`, `leave_policies`, `leave_balances`, `leave_applications`,
`leave_approvals`, `holiday_calendars`, `holidays`, `overtime_rules`,
`overtime_records`, `salary_structures`, `salary_components`,
`salary_rules`, `salary_rule_conditions`, `salary_rule_formulas`,
`employee_salary_assignments`, `payroll_periods`, `payroll_runs`,
`payroll_items`, `payroll_deductions`, `payroll_earnings`,
`salary_slips`

Visiting faculty example: `approved_lectures × approved_rate`.
Regular/contract/part-time rules must be configurable through the salary
engine.

## Examination

`exams`, `exam_schedules`, `exam_subjects`, `exam_rooms`,
`exam_invigilation`, `marks`, `mark_components`, `grades`,
`grade_rules`, `results`, `result_details`, `sgpa_records`,
`cgpa_records`

## Accounts / Purchase / Inventory

Accounts: `chart_of_accounts`, `account_groups`, `ledgers`,
`ledger_entries`, `vouchers`, `voucher_items`, `cash_accounts`,
`bank_accounts`, `bank_transactions`, `journal_entries`

Purchase: `suppliers`, `purchase_requests`, `purchase_request_items`,
`quotations`, `quotation_items`, `purchase_orders`,
`purchase_order_items`, `goods_receipts`, `goods_receipt_items`,
`purchase_invoices`, `purchase_invoice_items`, `supplier_payments`

Inventory: `inventory_items`, `inventory_categories`, `units`, `stores`,
`stock_transactions`, `stock_transfers`, `stock_adjustments`,
`stock_opening`, `inventory_batches`, `inventory_serial_numbers`

## Library / Hostel / Transport

Library: `library_books`, `library_authors`, `library_publishers`,
`library_categories`, `library_racks`, `library_copies`,
`library_members`, `library_issues`, `library_returns`,
`library_renewals`, `library_fines`

Hostel: `hostels`, `hostel_buildings`, `hostel_floors`, `hostel_rooms`,
`hostel_beds`, `hostel_allocations`, `hostel_fees`, `hostel_attendance`,
`hostel_complaints`

Transport: `vehicles`, `vehicle_types`, `drivers`, `conductors`,
`transport_routes`, `transport_stops`, `student_transport_assignments`,
`employee_transport_assignments`, `transport_fees`,
`vehicle_maintenance`, `fuel_records`

## Student Services

Scholarship: `scholarship_schemes`, `scholarship_eligibility`,
`scholarship_applications`, `scholarship_documents`,
`scholarship_verification`, `scholarship_approvals`,
`scholarship_disbursements`

Placement: `placement_companies`, `placement_drives`, `placement_jobs`,
`placement_eligibility`, `student_placement_registrations`,
`placement_rounds`, `placement_results`, `placement_offers`,
`student_placements`

Alumni: `alumni_profiles`, `alumni_employment`, `alumni_education`,
`alumni_events`, `alumni_donations`

Grievance: `grievance_categories`, `grievances`,
`grievance_assignments`, `grievance_actions`, `grievance_attachments`,
`grievance_comments`, `grievance_status_history`

Documents: `document_categories`, `documents`, `document_versions`,
`document_access`, `document_verification`

Notifications: `notification_templates`, `notifications`,
`notification_recipients`, `notification_preferences`,
`notification_logs`

# Dynamic Engines

## Dynamic Form Builder

Support text, number, decimal, email, phone, date, time, datetime,
select, multi-select, radio, checkbox, file, image, signature, marks,
percentage and formula fields. Include
required/visible/readonly/default/validation/conditional/sort-order
properties.

## Dynamic Table Builder

Support custom columns, data types, filters, sorting, search,
pagination, import/export and permissions.

## Dynamic Report Builder

Support columns, filters, sorting, grouping, formulas, permissions and
PDF/Excel/CSV/print output.

## Rule Engine

Support `IF`, `AND`, `OR`, comparisons, `IN`, arithmetic, percentage,
`ROUND`, `MIN`, `MAX` and versioned effective dates. Use it for merit,
eligibility, attendance, salary and other configurable institutional
rules.

## Workflow Engine

Generic workflow should support request -\> approval levels -\>
approved/rejected and be reusable for admission, purchase, leave,
scholarship, grievance, refund, document verification and payroll
approval.

# Roles & Permissions

Default roles: Super Admin, College Admin, Principal, Director, HOD,
Admission Admin, Accounts Admin, HR Admin, Exam Admin, Store Admin,
Librarian, Hostel Admin, Transport Admin, Faculty, Clerk, Student,
Parent.

Permissions: `view`, `create`, `edit`, `delete`, `approve`, `reject`,
`export`, `print`, `manage`.

Authorization must check authentication + role + permission +
college/campus/department access.

# RLS Security

Enable RLS on every tenant/business table. Use database-side policies to
enforce college/campus/department access. Never expose the Supabase
service-role key to the browser.

# Audit Log

Log sensitive actions such as student edits, employee edits, admission
approvals, merit changes, fee receipts/cancellations/refunds, salary
approvals, marks/result changes, permission changes, document deletion,
exports and administrative security changes.

# Gujarati + English

Use translation keys and `src/lib/i18n/en.json` /
`src/lib/i18n/gu.json`. Store the user's language preference in the
profile. Do not hard-code UI strings in components.

# PDF / Excel / CSV

Common export services should be reusable across all modules. College
logo, address and settings must be loaded dynamically for generated
institutional documents.

# Security Rules

-   No secrets in GitHub.
-   No service-role key in frontend code.
-   Validate all input server-side.
-   Use PostgreSQL constraints and foreign keys.
-   Use RLS as the final tenant data boundary.
-   Use signed URLs/private storage for protected documents.
-   Validate uploaded file type and size.
-   Use audit logging for sensitive actions.
-   Use transactions for financial operations.
-   Use soft-delete/status where appropriate.
-   Keep biometric, WhatsApp and payment credentials in secure
    environment/secret storage.

# Environment Variables

``` env
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
WHATSAPP_API_URL=
WHATSAPP_API_TOKEN=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
```

Only explicitly public variables may be exposed to the browser.

# npm Scripts

``` json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "supabase:start": "supabase start",
    "supabase:stop": "supabase stop",
    "supabase:reset": "supabase db reset",
    "supabase:types": "supabase gen types typescript --local > src/lib/types/database.ts"
  }
}
```

# Development Order

## Phase 1 - Foundation

1.  SvelteKit/Node project
2.  Supabase project
3.  Environment configuration
4.  Authentication
5.  Organization/college/campus
6.  College settings/logo/address
7.  Profiles/roles/permissions
8.  RLS
9.  Audit log
10. Gujarati/English

## Phase 2 - Reusable Engines

11. Dynamic Form Builder
12. Dynamic Table Builder
13. Dynamic Report Builder
14. Rule Engine
15. Workflow Engine

## Phase 3 - Core ERP

16. Student Management
17. Employee/Faculty Management
18. Academic Master
19. Admission
20. ACPC/ACPDC/GCAS/MQ/VQ/NRI
21. Merit Engine
22. Fees + receipt numbering
23. Timetable
24. Biometric integration
25. Attendance
26. Leave/Holiday/Overtime
27. Salary Rule Engine
28. Payroll
29. Examination/Result
30. Accounts

## Phase 4 - Administration

31. Purchase
32. Inventory
33. Library
34. Hostel
35. Transport

## Phase 5 - Student Services

36. Scholarship
37. Training & Placement
38. Alumni
39. Grievance
40. Documents

## Phase 6 - Communication & Reporting

41. Notifications
42. Email
43. WhatsApp provider adapter
44. PDF/Excel/CSV
45. Dashboards

## Phase 7 - Production

46. Unit tests
47. Integration/E2E tests
48. Security audit
49. Performance optimization
50. Backup/restore test
51. Deployment
52. Monitoring
53. Documentation
54. Production release

# Biometric Architecture

``` text
Biometric Machine
      -> Device Adapter
      -> Raw Punch Logs
      -> Normalized Punch Events
      -> Attendance Engine
      -> Faculty/Employee Attendance
      -> Payroll
```

Keep the machine adapter separate so multiple biometric vendors can be
supported.

# Payroll Architecture

``` text
Punches + Timetable + Leave + Overtime + Lecture Count
                         |
                         v
                  Salary Rule Engine
                         |
                         v
                   Payroll Draft
                         |
                      Approval
                         |
                         v
                    Salary Slip
```

# Testing

Test at minimum: authentication, college isolation, RLS, permissions,
admission-to-student workflow, merit formulas, fee calculations,
duplicate receipt prevention, biometric attendance, visiting faculty
lecture salary, regular payroll, leave/overtime, marks/result,
SGPA/CGPA, exports and critical approval workflows.

Run before merge:

``` bash
npm run check
npm run lint
npm run test
npm run build
```

# Backup & Recovery

Maintain database, storage, configuration and migration backups. Perform
periodic restore tests. A backup is not considered reliable until
restoration has been tested.

# GitHub Branches

``` text
main
develop
feature/*
bugfix/*
hotfix/*
release/*
```

Use migrations for every database change. Never manually modify
production schema.

# Definition of Done

A module is complete only when database schema, foreign keys, indexes,
RLS, permissions, service layer, UI, validation, audit logging,
Gujarati/English translation, exports where required, error handling,
tests and build checks are complete.

# GitHub AI Development Rules

1.  Read this README before changing code.
2.  Never hard-code college names or college-specific rules.
3.  Never hard-code admission/merit formulas.
4.  Never hard-code salary formulas.
5.  Keep business logic in services/engines.
6.  Use TypeScript and reusable components.
7.  Add a Supabase migration for schema changes.
8.  Enforce RLS and server-side authorization.
9.  Never expose secrets.
10. Preserve Gujarati and English support.
11. Use transactions for financial operations.
12. Prevent duplicate receipt numbers.
13. Add tests for business rules.
14. Run `npm run check` and `npm run build` before completing a feature.

# First Milestone

Build and verify: authentication, multi-college/campus, college
settings, profiles, roles, permissions, RLS, audit logs, dashboard shell
and bilingual UI. Then build the five reusable engines before
implementing the major ERP modules.

# Final Goal

The final application must provide one secure, scalable,
configuration-driven ERP for multiple colleges and campuses, while
allowing authorized administrators to add colleges, departments,
courses, admission rules, salary rules, forms, tables and reports
without rewriting the core application.

## Status

Architecture: READY Development: START FROM PHASE 1 Production: NOT YET
