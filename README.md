# Multi-College Education ERP — Complete Specification & Implementation Guide

> **Atlas College ERP** — One application runs **5+ colleges** as a single multi-tenant ERP.
> Admissions (ACPC / ACPDC / GCAS / MQ / VQ / NRI), Academics, Attendance (biometric punching), Fees,
> Payroll (dynamic salary rules), Examination, Accounts, Purchase, Inventory, Library, Hostel, Transport,
> Scholarship, Placement, Alumni, Grievance, Documents, Notifications/WhatsApp — in **English + ગુજરાતી**.

**Stack:** Node.js · SvelteKit · TypeScript · Supabase (Auth + PostgreSQL + RLS + Storage) · PDF/Excel/CSV

**Ready for:** GitHub AI / Copilot / Cursor assisted development. This document, plus the runnable
project in the repo, is the single source of truth.

---

## Table of Contents

1. [Product Summary](#1-product-summary)
2. [Tech Stack](#2-tech-stack)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Repository Structure](#4-repository-structure)
5. [Multi-Tenant Data Model](#5-multi-tenant-data-model)
6. [Roles & Permissions](#6-roles--permissions)
7. [Module Map (47 Modules)](#7-module-map-47-modules)
8. [Database Schema (140+ Tables)](#8-database-schema-140-tables)
9. [Database Relationships](#9-database-relationships)
10. [Row Level Security (RLS)](#10-row-level-security-rls)
11. [Storage & File Handling](#11-storage--file-handling)
12. [The 5 Reusable Engines](#12-the-5-reusable-engines)
13. [API / Server Service Layer](#13-api--server-service-layer)
14. [Environment Variables](#14-environment-variables)
15. [npm Scripts](#15-npm-scripts)
16. [Development Order — 47 Phases](#16-development-order--47-phases)
17. [Gujarati + English i18n](#17-gujarati--english-i18n)
18. [Security Requirements](#18-security-requirements)
19. [Backup Strategy](#19-backup-strategy)
20. [Testing Strategy](#20-testing-strategy)
21. [Deployment](#21-deployment)
22. [Seed Data](#22-seed-data)
23. [Current Implementation Status](#23-current-implementation-status)

---

## 1. Product Summary

A comprehensive College ERP for a group of colleges. One login, one URL, but every record is isolated
by `college_id` / `campus_id` (multi-tenant, not multi-install). Every module is metadata-driven where
possible, so new requirements become configuration, not code.

Guiding rules:

- The **Dynamic Form, Table, Report, Rule and Workflow engines** are built first and reused everywhere.
- No module hard-codes college, campus, or rule values.
- Business tables carry tenant keys + `created_by`/`updated_by` + `created_at`/`updated_at`.
- Every restrictive query is enforced again at the database layer with **RLS** — the app is never the only guard.
- Gujarati and English labels live in JSON dictionaries / `*_gu` columns; any UI string can switch language.

## 2. Tech Stack

| Layer     | Choice                                           | Notes                                   |
| --------- | ------------------------------------------------ | --------------------------------------- |
| Language  | TypeScript (strict)                              |                                         |
| Framework | SvelteKit (Svelte 5 / runes)                     | SSR + client islands                    |
| Backend   | Node.js (`+server.ts` routes, form actions)      | zod validation                          |
| Database  | PostgreSQL (Supabase)                            | pg + pgcrypto + RLS                     |
| Auth      | Supabase Auth (+ optional OAuth / 2FA)           | email/password, magic link              |
| Storage   | Supabase Storage                                 | public + private buckets + policies     |
| Exports   | `xlsx`, `pdf-lib`, native CSV                    | unified export engine                   |
| i18n      | JSON dictionaries (`en.json`, `gu.json`)         | `t()` helper                            |
| Styling   | Hand-written CSS design system (`src/app.css`)   | light + dark themes                     |
| Tests     | Vitest (unit/integration), optional Playwright   | `npm test`, CI in GitHub Actions        |

## 3. High-Level Architecture

```
                 ┌───────────────────────────────┐
                 │        SvelteKit Web App      │
                 │  Dashboard · Modules · Admin  │
                 └──────────────┬────────────────┘
                                │  @supabase/ssr (+ service-role only in +server routes)
                 ┌──────────────▼────────────────┐
                 │           Supabase            │
                 │  Auth · PostgreSQL · RLS      │
                 │  Storage · Edge Functions     │
                 └──────────────┬────────────────┘
            ┌───────────────────┼────────────────────┐
            │                   │                    │
     ERP Modules           Integrations       Reporting/Export
      Students/Admission   Biometric          PDF · Excel · CSV
      Academic/Timetable   WhatsApp/SMS/Email  Dashboard Charts
      Fees/Accounts        Notifications      Audit Reports
      HR/Payroll/Attendance                   Dynamic Reports
      Exam/Result
      Library/Hostel/Transport
      Purchase/Inventory/Scholarship
```

**Tenant enforcement chain:** UI scope → server route `RepoContext` → Postgres RLS policy. All three agree.

## 4. Repository Structure

```
college-erp/
├── .github/workflows/            # ci.yml → lint · check · test · build
├── src/
│   ├── app.html
│   ├── app.css                  # design system (light/dark)
│   ├── hooks.server.ts          # global hooks (session, CSP, onError)
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte         # super-admin overview dashboard
│   │   ├── login/               # +page.svelte, +layout.svelte
│   │   ├── colleges/            # college/campus master + settings
│   │   ├── dashboard/           # college dashboard
│   │   ├── students/            # list, new, [id]
│   │   ├── employees/
│   │   ├── admissions/          # quotas, rounds, forms, applications
│   │   ├── merit/               # rules, scores, rank, ACPC docs
│   │   ├── academics/           # departments, courses, subjects, semesters
│   │   ├── timetable/
│   │   ├── attendance/          # punching + biometric devices
│   │   ├── leave/
│   │   ├── payroll/             # salary rules + pay run
│   │   ├── fees/                # structure, receipts, concessions
│   │   ├── examination/         # exams, marks, results
│   │   ├── accounts/
│   │   ├── purchase/
│   │   ├── inventory/
│   │   ├── library/
│   │   ├── hostel/
│   │   ├── transport/
│   │   ├── scholarship/
│   │   ├── placement/
│   │   ├── alumni/
│   │   ├── grievance/
│   │   ├── documents/
│   │   ├── notifications/
│   │   ├── reports/             # dynamic report builder
│   │   ├── form-builder/        # dynamic form engine
│   │   ├── workflow/            # approval engine
│   │   └── settings/            # roles, permissions, global/college settings
│   ├── lib/
│   │   ├── components/          # ui/ (Button, Input, Select, DatePicker,
│   │   │                        #   Checkbox, Textarea, Modal, Toast, Table, Tabs)
│   │   ├── forms/               # metadata-driven field renderer
│   │   ├── tables/              # dynamic table renderer
│   │   ├── reports/             # report builder UI
│   │   ├── export/              # pdf.ts · excel.ts · csv.ts (shared)
│   │   ├── permissions/         # permission map + guards
│   │   ├── i18n/                # en.json · gu.json · t() helper
│   │   ├── engines/             # rule engine · workflow engine
│   │   ├── server/              # repository.ts · session.ts · audit.ts ·
│   │   │                        #   guards.ts · config.ts · local-store.ts
│   │   ├── supabase/            # client.ts (browser), server client
│   │   ├── types/               # database.ts (generated), index.ts
│   │   ├── utils/               # format.ts · csv.ts …
│   │   └── index.ts
│   └── app.d.ts
├── supabase/
│   ├── migrations/              # 0001_…0010_ ordered SQL
│   ├── seed.sql                 # 5 colleges + admin + demo data
│   └── functions/               # edge functions (biometric ingest, WhatsApp)
├── static/
├── tests/                       # unit (vitest) + e2e (playwright)
├── data/erp-data.json           # local fallback store (dev without Supabase)
├── scripts/                     # backup.sh, export.sql
├── .env.example
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
└── README.md                    # this document
```

## 5. Multi-Tenant Data Model

```
Organization
   └── College (logo, address, GST/PAN, affiliation, receipt prefix)
        └── Campus (address, contact)
             └── Department
                  └── Course
                       └── Semester → Division
                                        └── Subject (with Faculty allocation)
```

- **Super Admin** sees every college; **College Admin** only its own college; **HOD** only its department;
  **Faculty** only assigned records.
- A user can hold multiple roles via `user_roles`.

### Tenancy columns (all business tables)

| Column        | Type | Purpose                           |
| ------------- | ---- | --------------------------------- |
| `college_id`  | text | required tenant key (FK colleges) |
| `campus_id`   | text | optional finer scope (FK campuses)|
| `created_by`  | uuid | FK profiles.id                     |
| `updated_by`  | uuid | FK profiles.id                     |
| `created_at`  | ts   | default `now()`                    |
| `updated_at`  | ts   | default `now()`                    |

`repository.ts` automatically injects `college_id` from the session and appends tenant filters to every query.

## 6. Roles & Permissions

### Roles

`SUPER_ADMIN`, `COLLEGE_ADMIN`, `PRINCIPAL`, `DIRECTOR`, `HOD`, `ADMISSION_ADMIN`, `ACCOUNTS_ADMIN`,
`HR_ADMIN`, `FACULTY`, `CLERK`, `LIBRARIAN`, `EXAM_ADMIN`, `STORE_ADMIN`, `HOSTEL_ADMIN`,
`TRANSPORT_ADMIN`, `STUDENT`, `PARENT`.

### Permission model

```
Role → role_permissions → Permission
Permission = Module (Fees) + Feature (Receipt) + Action {view, create, edit, delete, approve, export, print}
```

Tables: `roles`, `permissions`, `role_permissions`, `user_roles`.
`src/lib/permissions/` exposes `can(user, 'fees', 'receipt', 'approve')`; RLS re-checks server-side.

## 7. Module Map (47 Modules)

| #  | Module                 | #  | Module                     |
| -- | ---------------------- | -- | -------------------------- |
| 1  | Multi-College/Campus   | 25 | Examination + Result       |
| 2  | College Settings       | 26 | Accounts                   |
| 3  | Student Management     | 27 | Purchase                   |
| 4  | Employee / Faculty     | 28 | Inventory                  |
| 5  | Admission + Forms      | 29 | Library                    |
| 6  | ACPC/ACPDC/GCAS/MQ/VQ/NRI | 30 | Hostel                  |
| 7  | Dynamic Merit Rules    | 31 | Transport                  |
| 8  | PCM/PCB + GUJCET marks | 32 | Scholarship                |
| 9  | ACPC PDF/rule docs     | 33 | Training & Placement       |
| 10 | Fees + receipt numbering | 34 | Alumni                   |
| 11 | Academic/Dept/Course/Subject | 35 | Grievance              |
| 12 | Dynamic Timetable      | 36 | Documents                  |
| 13 | Biometric/Punching     | 37 | Notifications / WhatsApp   |
| 14 | Faculty Attendance     | 38 | Dynamic Form Builder       |
| 15 | Faculty types          | 39 | Dynamic Table Builder      |
| 16 | Salary Rule Engine     | 40 | Dynamic Report Builder     |
| 17 | Visiting lecture pay   | 41 | Gujarati + English         |
| 18 | Regular payroll        | 42 | Role & Permission          |
| 19 | Leave + Holiday + OT   | 43 | Supabase RLS               |
| 20 | Accounts               | 44 | Audit Log                  |
| 21 | Purchase + Inventory   | 45 | PDF / Excel / CSV          |
| 22 | Library                | 46 | Dashboard                  |
| 23 | Hostel + Transport     | 47 | Backup + Deployment        |
| 24 | Scholarship + Placement|    |                            |

---

## 8. Database Schema (140+ Tables)

Convention: `PK` primary key · `FK` foreign key · `Tenant` = `college_id` (+ optional `campus_id`).
IDs are `text` with `gen_random_uuid()` unless noted. All business tables also carry
`created_by uuid NULL`, `updated_by uuid NULL`, `created_at ts default now()`,
`updated_at ts default now()` (implied below).

### 8.1 Tenant & Common (11)

```
organizations             id PK · name · code · address · city · state · pin · phone · email ·
                          gstin · pan · created_at
colleges                  id PK · org_id FK · code UNIQUE · name · short_name · logo_url · address ·
                          city · district · state · pin · phone · email · website · principal_name ·
                          university · affiliation · gstin · pan · receipt_prefix · color · is_active ·
                          created_at · updated_at
campuses                  id PK · college_id FK Tenant · code · name · address · city · pin · phone ·
                          is_active
departments               id PK · college_id FK Tenant · code · name · hod_id FK employees · is_active
programs                  id PK · college_id FK · campus_id FK · code · name · type
                          (degree/diploma) · is_active
courses                   id PK · college_id FK · department_id FK · code · name · intake ·
                          acpc_code UNIQUE(college_id,acpc_code) · duration_semesters · is_active
academic_years            id PK · college_id FK · name (2025-26) · start_date · end_date · is_current
semesters                 id PK · college_id FK · course_id FK · academic_year_id FK · number ·
                          start_date · end_date · is_active
divisions                 id PK · college_id FK · semester_id FK · code (A/B) · capacity
subjects                  id PK · college_id FK · division_id FK · code · name · credits ·
                          theory_hours · practical_hours · tutorial_hours · is_active
classrooms                id PK · college_id FK · campus_id FK · code · capacity · room_type
receipt_sequences         id PK · college_id FK · year_prefix · kind (FEE/DONATION) · last_number
                          bigint · UNIQUE(college_id, year_prefix, kind)
```

### 8.2 Auth, Roles, Profiles (7)

```
profiles                  id uuid PK FK auth.users · full_name · avatar_url ·
                          default_college_id FK · language · theme · is_active
roles                     id PK · code UNIQUE · name · description
permissions               id PK · module · feature · action · UNIQUE(module, feature, action)
role_permissions          id PK · role_id FK · permission_id FK · UNIQUE(role_id, permission_id)
user_roles                id PK · profile_id FK · role_id FK · college_id FK · campus_id FK ·
                          UNIQUE(profile_id, role_id, college_id)
sessions_meta             id PK · profile_id FK · token_hash · ip · user_agent · expires_at
user_device_tokens        id PK · profile_id FK · platform · token
```

### 8.3 Settings (4)

```
college_settings          id PK · college_id FK Tenant · payment_terms · late_fee_days ·
                          late_fee_amount · automatic_receipt_prefix · defaults jsonb ·
                          UNIQUE(college_id)
global_settings           id PK · key UNIQUE · value jsonb · updated_by
academic_settings         id PK · college_id FK · grading jsonb · attendance_threshold_pct ·
                          exam_pass_marks
notification_settings     id PK · college_id FK · provider jsonb (email/sms/whatsapp)
```

### 8.4 Dynamic Engines (11)

```
form_definitions          id PK · college_id FK · code UNIQUE(college_id,code) · name · module ·
                          version · is_active · payload jsonb
form_sections             id PK · form_id FK · sort_order · title · is_repeatable
form_fields               id PK · section_id FK · key · label · label_gu · type (text,number,
                          email,mobile,date,dropdown,multiselect,radio,checkbox,file,image,
                          signature,aadhaar,marks,percent,formula) · options jsonb ·
                          validations jsonb · formula · required · readonly · sort_order
form_submissions          id PK · form_id FK · college_id FK · record_id · data jsonb · status ·
                          submitted_by FK · submitted_at
table_definitions         id PK · college_id FK · code UNIQUE(college_id,code) · name · schema jsonb
table_rows                id PK · table_id FK · college_id FK · data jsonb · created_by
report_definitions        id PK · college_id FK · code · name · source_table · columns jsonb ·
                          filters jsonb · group_by jsonb · sort jsonb · formula jsonb ·
                          output (pdf/excel/csv)
report_assignments        id PK · report_id FK · role_id FK · enabled
workflow_definitions      id PK · college_id FK · code · name · entity (admission/purchase/leave/…) ·
                          steps jsonb
workflow_instances        id PK · workflow_id FK · entity_id · current_step · state ·
                          submitted_by FK · created_at
approval_requests         id PK · instance_id FK · step_no · approver_id FK · decision · comment ·
                          decided_at
```

### 8.5 Audit (1)

```
audit_logs                id uuid PK · college_id FK · profile_id FK · action · module · table_name ·
                          record_id · old_value jsonb · new_value jsonb · ip inet · user_agent ·
                          created_at
```

### 8.6 Student / Parent (7)

```
students                  id PK · college_id FK Tenant · campus_id FK · student_code
                          UNIQUE(college,code) · enrollment_number UNIQUE(college,enrollment) ·
                          admission_id FK · first_name · middle_name · last_name · gender · dob date ·
                          category · blood_group · mother_tongue · religion · aadhaar · photo_url ·
                          mobile · email · address · city · pin · status (Enquiry/Applicant/Active/
                          Passed/Alumni/Dropped) · updated_at
parents                   id PK · student_id FK · relation · name · occupation · income · mobile ·
                          email · aadhaar
student_contacts          id PK · student_id FK · type (self/father/mother) · mobile · email ·
                          is_primary
student_academics         id PK · student_id FK · academic_year_id FK · course_id FK · semester_id FK ·
                          division_id FK · roll_no · is_current
student_documents         id PK · student_id FK · document_type_id FK · title · file_url ·
                          verified_by FK · verified_at · uploaded_by
student_attendance        id PK · student_id FK · division_id FK · date · status (P/A/L/H) · marked_by FK
```

### 8.7 Admission (10)

```
admission_quotas          id PK · college_id FK · quota (ACPC/ACPDC/GCAS/MQ/VQ/NRI/MANAGEMENT/OTHER) ·
                          course_id FK · seats · academic_year_id FK
admission_categories      id PK · college_id FK · code · name · quota_id FK
admissions                id PK · college_id FK · application_no UNIQUE(college,app) · student_id FK ·
                          academic_year_id FK · course_id FK · quota · aac_form_no ·
                          status (Draft/Submitted/Verified/Allotted/Admitted/Cancelled) ·
                          admission_date · applied_at
admission_rounds          id PK · college_id FK · academic_year_id FK · name · from_date · to_date · status
admission_allocations     id PK · admission_id FK · round_id FK · seat_type · status · allotted_at
application_responses     id PK · admission_id FK · form_id FK · data jsonb · submitted_at
merit_rules               id PK · college_id FK · academic_year_id FK · course_id FK · admission_type ·
                          name · subjects jsonb (PCM/PCB) · formula (board_50+gujcet_50) ·
                          weightage jsonb · min_marks jsonb · eligibility jsonb · is_active ·
                          UNIQUE(college,year,course,admission_type)
merit_scores              id PK · admission_id FK · rule_id FK · marks_physics · marks_chem ·
                          marks_math · marks_bio · gujcet_marks · gujcet_percentile · pcm_total ·
                          pcb_total · percentage · merit_score numeric · rank int · computed_at
acpc_documents            id PK · college_id FK · admission_type · academic_year_id FK · title ·
                          file_url · version · published_at · is_current
allocation_waitlists      id PK · college_id FK · round_id FK · admission_id FK · score · waitlist_rank
```

### 8.8 Fees (9)

```
fee_heads                 id PK · college_id FK · code · name · name_gu · kind (TUITION/EXAM/LIBRARY/
                          HOSTEL/TRANSPORT/OTHER) · ledger_account_id FK · is_mandatory
fee_structures            id PK · college_id FK · course_id FK · category FK · academic_year_id FK ·
                          semester · head_id FK · amount numeric · due_date · is_active
fee_installments          id PK · college_id FK · structure_row_id FK · installment_no · amount ·
                          due_date · late_fee
fee_receipts              id PK · college_id FK · receipt_no (college prefix + year + seq) ·
                          student_id FK · academic_year_id FK · gross · concession · net · paid_via ·
                          cheque_no · bank · counter_id · issued_by FK · issued_at · is_cancelled ·
                          UNIQUE(college_id, receipt_no)
fee_receipt_items         id PK · receipt_id FK · head_id FK · amount · installment_id FK
concessions               id PK · college_id FK · student_id FK · scheme · pct · amount · reason ·
                          approved_by FK · approved_at · applies_to (head/all)
fee_registers             id PK · college_id FK · student_id FK · academic_year_id FK · head_id FK ·
                          installment_id FK · total_due · paid · balance · status
fee_refunds               id PK · college_id FK · receipt_id FK · amount · reason · approved_by FK ·
                          approved_at · status
```

### 8.9 Employee / Faculty / HR (14)

```
employees                 id PK · college_id FK Tenant · campus_id FK · emp_code
                          UNIQUE(college,code) · first_name · middle_name · last_name · gender · dob ·
                          married · spouse_name · aadhaar · pan · photo_url · email ·
                          personal_mobile · official_mobile · address · city · pin ·
                          department_id FK · designation · employment_type (REGULAR/VISITING/GUEST/
                          CONTRACT/PART-TIME/ADHOC) · join_date · resign_date ·
                          status (Active/On Leave/Resigned) · bank_id FK · is_active
employee_types            id PK · college_id FK · code · name · attendance_rule jsonb ·
                          salary_rule jsonb
employee_documents        id PK · employee_id FK · document_type_id FK · title · file_url ·
                          verified_by FK · verified_at
qualifications            id PK · employee_id FK · degree · institution · university · year ·
                          percentage · certificate_url
bank_details              id PK · employee_id FK · bank_name · branch · account_no · ifsc ·
                          aadhaar_linked
biometric_devices         id PK · college_id FK · name · serial_no · ip · port · model · location ·
                          punch_webhook · is_active
punch_records             id PK · college_id FK · employee_id FK · device_id FK · direction (IN/OUT) ·
                          punched_at ts · raw_text · is_processed
employee_attendance       id PK · college_id FK · employee_id FK · punch_in · punch_out ·
                          late_minutes · early_minutes · work_hours numeric · punch_count ·
                          status (P/A/HD/L/HOLIDAY/OFF) · timetable_status · date · marked_by FK
leave_types               id PK · college_id FK · code · name · is_paid · carry_forward · max_days ·
                          applies_to jsonb (employment types)
leave_balances            id PK · college_id FK · employee_id FK · leave_type_id FK ·
                          academic_year_id FK · credited · used · balance ·
                          UNIQUE(emp,type,year)
leave_applications        id PK · college_id FK · employee_id FK · leave_type_id FK · from_date ·
                          to_date · days · half_day · reason · document_url ·
                          status (Pending/Approved/Rejected) · approved_by FK · approved_at
holidays                  id PK · college_id FK · title · date · type (National/College/Exam) · is_active
weekly_offs               id PK · college_id FK · day_of_week · label
overtime                  id PK · college_id FK · employee_id FK · date · hours · rate · status ·
                          approved_by FK · compensated_in
```

### 8.10 Payroll / Salary Engine (9)

```
salary_components         id PK · college_id FK · code · name · type (EARNING/DEDUCTION) ·
                          calculation (FIXED/PERCENT/PER_LECTURE/PER_HOUR/FORMULA) · value jsonb ·
                          tax_treatment · is_active
salary_templates          id PK · college_id FK · employee_type · scope jsonb · components jsonb ·
                          UNIQUE(college, employee_type)
salary_masters            id PK · college_id FK · employee_id FK · effective_from · components jsonb ·
                          is_current
salary_rules              id PK · college_id FK · rule_type (REGULAR/PER_LECTURE/PER_HOUR/CONTRACT) ·
                          name · rate numeric · parameter · conditions jsonb · is_active
per_lecture_claims        id PK · college_id FK · employee_id FK · subject_code · month ·
                          lectures_count jsonb by day · rate · amount · status · approved_by FK
teaching_allocations      id PK · college_id FK · employee_id FK · subject_id FK · division_id FK ·
                          lectures_per_week · hourly_rate · is_active
payslip_cycles            id PK · college_id FK · academic_year_id FK · month · year ·
                          status (Draft/Computed/Approved/Paid)
payslips                  id PK · college_id FK · employee_id FK · cycle_id FK · gross · earnings
                          jsonb · deductions jsonb · net · tax_payable · amount_paid · paid_at ·
                          status · UNIQUE(employee, cycle)
pf_esi_responses          id PK · payslip_id FK · pf_amt · esi_amt · pt_amt · submitted_on
```

### 8.11 Timetable (5)

```
timetable_slots           id PK · college_id FK · campus_id FK · code · label (P1..P6) · start_time ·
                          end_time · is_break · is_optional · UNIQUE(college,code)
timetable_templates       id PK · college_id FK · name · workdays jsonb · UNIQUE(college,name)
timetable_entries         id PK · college_id FK · template_id FK · division_id FK · subject_id FK ·
                          employee_id FK · classroom_id FK · day_of_week int · slot_id FK · is_merged
weekly_schedule_override  id PK · college_id FK · division_id FK · date · slot_id FK · note ·
                          replaces_entry_id FK
timetable_conflicts       id PK · college_id FK · entry_a_id FK · entry_b_id FK · reason · locked
```

### 8.12 Examination (9)

```
exams                     id PK · college_id FK · code · name · exam_type (MID/SEM/THEORY/PRACTICAL/
                          VIVA) · academic_year_id FK · semester_id FK · start_date · end_date · status
exam_schedules            id PK · exam_id FK · subject_id FK · date · time · room · invigilator_id FK ·
                          students_present
exam_codes                id PK · college_id FK · code · name (theory/practical/internal) · weight_pct
exam_marks                id PK · college_id FK · exam_id FK · student_id FK · subject_id FK ·
                          marks_secured · marks_max · exam_code_id FK · entered_by FK · approved_by
                          FK · is_best_of
grade_definitions         id PK · college_id FK · name · range jsonb · grade_points
internal_assessments      id PK · college_id FK · student_id FK · subject_id FK · semester_id FK ·
                          component jsonb · marks · max_marks
results                   id PK · college_id FK · student_id FK · semester_id FK · sgpa numeric ·
                          cgpa numeric · credits_earned · remark (Pass/Fail/ATKT) · result_date ·
                          published_by FK
result_prints             id PK · result_id FK · format · template_url · printed_by FK · printed_at
```

### 8.13 Accounts (15)

```
chart_of_accounts         id PK · college_id FK · code · name · group · type (Asset/Liability/Income/
                          Expense) · parent_id FK · is_active · UNIQUE(college,code)
ledgers                   id PK · college_id FK · coa_id FK · entity_type · entity_id ·
                          opening_balance numeric · is_active
journal_entries           id PK · college_id FK · entry_no UNIQUE(college,no) · type (Journal/Receipt/
                          Payment/Contra) · date · narration · voucher_no · status · created_by
journal_lines             id PK · entry_id FK · ledger_id FK · debit numeric · credit numeric · note
vouchers                  id PK · college_id FK · kind (Payment/Receipt/Contra/Adjustment) · no ·
                          date · amount · payee · ref · status
banks                     id PK · college_id FK · name · account_no · ifsc · branch · opening_balance
bank_transactions         id PK · bank_id FK · date · type · amount · ref_voucher · reconciled
cash_books                id PK · college_id FK · date · voucher_no · particulars · debit · credit
budgets                   id PK · college_id FK · academic_year_id FK · coa_id FK · amount · allocated_to
budget_lines              id PK · budget_id FK · month · amount
receipts_acc              id PK · college_id FK · receipt_no · student_id FK · coa_id FK · amount ·
                          date · mode · reconciled
payments                  id PK · college_id FK · payee · coa_id FK · amount · date · mode ·
                          status (Draft/Approved/Paid)
contra_entries            id PK · college_id FK · from_bank · to_bank · amount · date · approval
trial_balances_snapshot   id PK · college_id FK · period · data jsonb · generated_at
income_expense_snapshot   id PK · college_id FK · academic_year_id FK · data jsonb · generated_at
```

### 8.14 Purchase & Inventory (12)

```
vendors                   id PK · college_id FK · name · gstin · phone · email · address · bank_id FK ·
                          is_active
purchase_requests         id PK · college_id FK · req_no · requested_by FK · department_id FK · date ·
                          items jsonb · cost_estimate · status → workflow
quotations                id PK · college_id FK · req_id FK · vendor_id FK · amount · date ·
                          valid_till · status
purchase_orders           id PK · college_id FK · po_no UNIQUE(college,no) · vendor_id FK · req_id FK ·
                          order_date · expected_date · items jsonb · total · status → workflow
grns                      id PK · college_id FK · grn_no UNIQUE(college,no) · po_id FK · received_date ·
                          items jsonb · status
purchase_invoices         id PK · college_id FK · invoice_no · vendor_id FK · grn_id FK · date ·
                          taxable · gst · total · paid · due · payment_status
inventory_categories      id PK · college_id FK · name · parent_id FK
inventory_items           id PK · college_id FK · item_code UNIQUE(college,code) · name ·
                          category_id FK · unit (PCS/KG/LTR) · reorder_level · current_stock · rate ·
                          gst_pct
stores                    id PK · college_id FK · campus_id FK · code · name · location · incharge_id FK
stock_entries             id PK · college_id FK · item_id FK · store_id FK · type (IN/OUT/TRANSFER_IN/
                          TRANSFER_OUT/ADJUST) · qty · rate · ref_id · date · by_user FK
stock_adjustments         id PK · college_id FK · item_id FK · reason (damage/pilferage/return) · qty ·
                          approved_by FK · date
```

### 8.15 Library (7)

```
books                     id PK · college_id FK · isbn · title · authors jsonb · publisher ·
                          category_id FK · edition · pages · rack · year · price · no_of_copies ·
                          is_active
book_authors              id PK · book_id FK · name · bio
library_categories        id PK · college_id FK · name · code
book_copies               id PK · book_id FK · copy_no UNIQUE(college,copy) · status (Available/Issued/
                          Lost) · purchase_date
library_members           id PK · college_id FK · member_type (STUDENT/FACULTY) · member_id · card_no ·
                          issue_limit · fine_pending
book_issues               id PK · college_id FK · copy_id FK · member_id FK · issue_date · due_date ·
                          return_date · fine_amount · status (Issued/Returned/Overdue)
lost_books                id PK · college_id FK · copy_id FK · member_id FK · cost · recovered · date
```

### 8.16 Hostel (9)

```
hostels                   id PK · college_id FK · campus_id FK · name · warden_id FK · capacity · is_active
hostel_buildings          id PK · hostel_id FK · name · floors · gender
hostel_rooms              id PK · building_id FK · room_no UNIQUE(college,room) · capacity ·
                          current_occupancy · rent
hostel_beds               id PK · room_id FK · bed_no · status (Free/Occupied/Blocked)
hostel_allocations        id PK · college_id FK · bed_id FK · student_id FK · from_date · to_date ·
                          status · rent_payable
hostel_fee_plans          id PK · college_id FK · hostel_id FK · room_type · fees · mess_fees ·
                          academic_year_id FK
mess_records              id PK · college_id FK · day · meal (Breakfast/Lunch/Dinner) · menu · cost
hostel_complaints         id PK · college_id FK · student_id FK · category · description · status ·
                          resolved_by FK
hostel_attendances        id PK · college_id FK · student_id FK · date · status P/A · in_time · out_time
```

### 8.17 Transport (8)

```
vehicles                  id PK · college_id FK · reg_no UNIQUE(college,reg) · type (Bus/Van) ·
                          capacity · fuel_type · owner · rc_url · status · insurance_till
routes                    id PK · college_id FK · name · start · end · distance · fare · vehicle_id FK ·
                          driver_id FK · conductor_id FK · incharge_id FK
stops                     id PK · route_id FK · name · order · latitude · longitude · distance_from_start
transport_allocations     id PK · college_id FK · route_id FK · stop_id FK · student_id FK ·
                          academic_year_id FK · reverse_trip · fee · status
transport_fee_plans       id PK · college_id FK · route_id FK · amount · concession · academic_year_id FK
attendance_transport      id PK · college_id FK · allocation_id FK · date · boarded bool · marked_by FK
vehicle_maintenance       id PK · vehicle_id FK · date · service_type · km_run · cost · vendor · next_due
fuel_logs                 id PK · vehicle_id FK · date · qty · rate · odometer · filled_by FK
```

### 8.18 Scholarship (6)

```
scholarships              id PK · college_id FK · code · name · provider (GOVT/PRIVATE) · scheme_type ·
                          eligibility jsonb · amount · deadline · is_active
scholarship_applications  id PK · college_id FK · student_id FK · scholarship_id FK ·
                          academic_year_id FK · status (Draft/Submitted/Verified/Approved/Rejected/
                          Disbursed) · applied_by FK
scholarship_documents     id PK · application_id FK · doc_type · file_url · verified_by FK
scholarship_verifications id PK · application_id FK · verifier_id FK · step · remark · decided_at
scholarship_disbursements id PK · college_id FK · application_id FK · amount · mode · date ·
                          narration · utr
```

### 8.19 Training & Placement (8)

```
companies                 id PK · college_id FK · name · domain · website · contact_person · phone ·
                          email · address
job_posts                 id PK · company_id FK · title · description · eligibility jsonb · ctc ·
                          open_from · open_till · status
placement_drives          id PK · college_id FK · company_id FK · job_post_id FK · drive_date · venue ·
                          mode · rounds jsonb · status
drive_registrations       id PK · drive_id FK · student_id FK · status (Registered/Shortlisted/Rejected/
                          Selected) · aptitude_score
drive_rounds              id PK · drive_id FK · round_no · type (Aptitude/Technical/HR/Interview) · date ·
                          result
placements                id PK · college_id FK · student_id FK · drive_id FK · company_id FK ·
                          offer_date · joining_date · package_ctc · offer_url · status
internships               id PK · college_id FK · student_id FK · company_id FK · start · end · stipend ·
                          status
alumni_training_certs     id PK · college_id FK · student_id FK · course · institution · year · cert_url
```

### 8.20 Alumni (5)

```
alumni                    id PK · college_id FK · student_id FK · batch FK academic_years · course_id FK ·
                          current_company · designation · location · contactable · updated_at
alumni_achievements       id PK · alumni_id FK · title · description · year · proof_url
alumni_events             id PK · college_id FK · title · date · venue · description ·
                          registered jsonb (alumni ids)
alumni_donations          id PK · alumni_id FK · amount · purpose · date · receipt_no
alumni_groups             id PK · college_id FK · batch · city · occupation · name
```

### 8.21 Grievance (5)

```
grievances                id PK · college_id FK · raised_by_id FK · category (Academic/Admin/Attendance/
                          Fee/Hostel/Transport/Other) · priority (Low/Medium/High/Urgent) · subject ·
                          description · attachments jsonb · status (Open/Acknowledged/Under Review/
                          Actioned/Resolved/Closed) · assigned_to FK · assigned_at
grievance_actions         id PK · grievance_id FK · by_id FK · action · comment · attachment · created_at
grievance_escalations     id PK · grievance_id FK · from_role · to_role · reason · escalated_at
grievance_satisfaction    id PK · grievance_id FK · rating · comment · submitted_at
grievance_categories      id PK · college_id FK · name · default_assignee_id FK
```

### 8.22 Documents & Certificates (5)

```
document_types            id PK · college_id FK · name · category (STUDENT/EMPLOYEE/ADMISSION/FEE/EXAM/
                          HR/COLLEGE) · lifecycle jsonb
documents                 id PK · college_id FK · doc_type_id FK · entity_type · entity_id · title ·
                          file_url · mime · size · checksum · version · is_latest · uploaded_by FK ·
                          expires_at
document_versions         id PK · document_id FK · file_url · checksum · uploaded_by FK · created_at
document_shares           id PK · document_id FK · profile_id FK · role_id FK · shared_by FK · shared_at
certificates              id PK · college_id FK · student_id FK · kind (BONAFIDE/TC/MIGRATION/DUPLICATE) ·
                          template_url · generated_url · issued_by FK · issued_at · fee_receipt_id FK
```

### 8.23 Notifications & WhatsApp (5)

```
notification_templates    id PK · college_id FK · code UNIQUE · title · title_gu · body · body_gu ·
                          channel (APP/EMAIL/SMS/WHATSAPP) · vars jsonb · is_active
notifications             id PK · college_id FK · profile_id FK · template_id FK · subject · body ·
                          channel · status (Queued/Sent/Failed/Read) · ref_id · sent_at · failure_reason
notification_batches      id PK · college_id FK · purpose (FEE_DUE/ATTENDANCE/EXAM/LEAVE) · filters jsonb ·
                          recipients_count · sent_count · created_by FK · created_at
whatsapp_logs             id PK · college_id FK · to_phone · template_text · status · message_id ·
                          error · sent_at
```

### 8.24 Misc / System (3)

```
import_batches            id PK · college_id FK · module · file_name · status · success_count ·
                          error_count · errors jsonb · imported_by FK · created_at
jobs                      id PK · college_id FK · type (PAYROLL/REPORT/SMS/RECURRING) ·
                          status (queued/running/done/failed) · payload jsonb · result jsonb ·
                          started_at · finished_at
api_keys                  id PK · college_id FK · name · key_hash · scopes jsonb · is_active · last_used_at
```

**Total: 140 tables across 24 groups.** Every table RLS-enabled (see §10).

---

## 9. Database Relationships

```
organizations 1─∞ colleges 1─∞ campuses
colleges 1─∞ departments 1─∞ courses 1─∞ semesters 1─∞ divisions 1─∞ subjects
divisions 1─∞ students 1─∞ parents
students 1─∞ student_documents · student_contacts · student_academics · student_attendance
colleges 1─∞ admissions 1─∞ merit_scores (merit_rules → scores)
colleges 1─∞ fee_structures → fee_heads; students 1─∞ fee_receipts 1─∞ fee_receipt_items
colleges 1─∞ employees → employee_types, punch_records, employee_attendance, leave_applications
employees 1─∞ salary_masters → salary_components; employees 1─∞ payslips → payslip_cycles
divisions 1─∞ timetable_entries (subject × faculty × slot × room)
colleges 1─∞ exams → exam_schedules → exam_marks → results
colleges 1─∞ chart_of_accounts 1─∞ ledgers ↔ journal_entries → journal_lines
colleges 1─∞ vendors ↔ purchase_requests → purchase_orders → grns → stock_entries
colleges 1─∞ books → book_copies ↔ book_issues → library_members
colleges 1─∞ hostels → buildings → rooms → beds → hostel_allocations
colleges 1─∞ vehicles ↔ routes ↔ stops ↔ transport_allocations
colleges 1─∞ scholarship_applications → scholarship_disbursements
workflow_definitions → workflow_instances → approval_requests (generic approval chain)
```

`ON DELETE`: tenant parent (`college`, `campus`) `CASCADE`; financial/history records (fees, payroll,
accounts, results) `RESTRICT`/`SET NULL`.

---

## 10. Row Level Security (RLS)

Every table runs `ALTER TABLE … ENABLE ROW LEVEL SECURITY;`.

Helper (already shipped in `supabase/migrations/001_erp_core.sql`):

```sql
create or replace function public.can_access_college(target_college_id text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (p.role = 'SUPER_ADMIN' or p.college_id = target_college_id)
  );
$$;
```

Standard policy set applied per business table `T(college_id)`:

```sql
-- read: rows in accessible colleges + rows the user created
create policy t_read  on public.t for select using (
  public.can_access_college(college_id)
  or auth.uid() in (created_by, updated_by)
);
-- write: same scope
create policy t_write on public.t for all using (
  public.can_access_college(college_id)
) with check (public.can_access_college(college_id));
-- sensitive tables (payslips, bank_details, qualifications): role-restricted
create policy t_role  on public.t for select using (
  public.has_role('SUPER_ADMIN') or public.has_role('HR_ADMIN') or created_by = auth.uid()
);
```

Admin/tenant tables (`colleges`, `campuses`, `roles`): only `SUPER_ADMIN` writes; all authenticated
users read.

**Data scope matrix**

| Principal   | Scope                                    |
| ----------- | ---------------------------------------- |
| Super Admin | all colleges                             |
| College Admin | own college                           |
| HOD         | own department                           |
| Faculty     | assigned divisions / subjects            |
| Student/Parent | own records + own college public info |

---

## 11. Storage & File Handling

Buckets (created in the deployment step):

- `erp-private` — admission, exam, payslip, bank, HR, grievance attachments. Storage policy verifies,
  from the JWT profile, that the object's `{college_id}` segment matches the user's scope.
- `erp-public` — logos, cover photos, published circulars, result PDFs.

Rules:

- Uploads ≤ `MAX_UPLOAD_MB`; server validates MIME + size.
- Object keys: `{college_id}/{entity}/{entity_id}/{uuid}.ext`.
- A `documents` row records `checksum` + `is_latest`; older versions move to `document_versions`.
- Sensitive scans (Aadhaar etc.) stay private and are audited.

---

## 12. The 5 Reusable Engines

Build these first; every later module reuses them.

1. **Dynamic Form Engine** — `form_definitions / form_sections / form_fields / form_submissions`.
   Renders validation, conditional visibility and formula fields from JSON. Used by admissions,
   grievance, scholarship, enrolment, event registration.
2. **Dynamic Table Engine** — `table_definitions / table_rows`. Admins add custom fields/tables
   (e.g. "Student Extra") without migrations.
3. **Dynamic Report Engine** — `report_definitions`. Non-developers compose columns, filters, grouping,
   formulas; output to PDF/Excel/CSV/print via the shared export engine.
4. **Dynamic Rule/Formula Engine** — safe expression evaluator (whitelisted operators) used by merit
   rules (`board_50 + gujcet_50`), salary rules, fee formulas. Rules are rows, never code.
5. **Workflow / Approval Engine** — `workflow_definitions → workflow_instances → approval_requests`.
   Reused by admissions, purchase, leave, scholarship, grievance, fees refund, documents, salary
   approval. Supports N approval levels.

---

## 13. API / Server Service Layer

All data flows through the server; the browser never holds the service-role key.

| Service              | Responsibility                                      |
| -------------------- | --------------------------------------------------- |
| `repository.ts`      | Generic typed CRUD over tenant tables; injects scope/filters |
| `session.ts`         | Auth + profile → `RepoContext {user, roles, collegeId}` |
| `guards.ts`          | Role/permission middleware for `+server.ts`         |
| `audit.ts`           | Central `audit_logs` writer (action, table, old/new jsonb) |
| `config.ts`          | Env + runtime settings                               |
| `local-store.ts`     | Local JSON fallback when Supabase is unconfigured (dev) |
| `export/`            | pdf.ts (pdf-lib), excel.ts (xlsx), csv.ts — shared  |
| `engines/rule.ts`    | Safe expression evaluator                            |
| `engines/workflow.ts`| Approval chain state machine                         |

Route pattern per module (e.g. `fees`):

```
src/routes/fees/
  +page.svelte            list
  +layout.svelte          module layout + tabs
  +page.server.ts         load() scoped list
  new/+page.svelte        create form
  [id]/+page.svelte       detail + actions
  [id]/+page.server.ts    load() single + form actions
  api/receipt/new.server.ts
  api/receipt/export.server.ts
```

Every write action: `authorize → validate(zod) → write → audit → return`. Errors are user-friendly
(Supabase constraint codes mapped in `repository.ts`).

---

## 14. Environment Variables

See `.env.example`.

| Var                              | Scope  | Notes                               |
| -------------------------------- | ------ | ----------------------------------- |
| `PUBLIC_SUPABASE_URL`            | public | Supabase project URL                |
| `PUBLIC_SUPABASE_ANON_KEY`       | public | anon key                            |
| `SUPABASE_SERVICE_ROLE_KEY`      | server | NEVER in browser code / commits     |
| `PUBLIC_APP_NAME`                | public | display brand                       |
| `ORIGIN`                         | server | canonical URL (SSR cookies/links)   |
| `COOKIE_SECURE`                  | server | true in production                  |
| `NOTIFICATION_EMAIL_*`           | server | email channel (optional)            |
| `NOTIFICATION_SMS_*`             | server | SMS channel (optional)              |
| `NOTIFICATION_WHATSAPP_*`        | server | WhatsApp API key (optional)         |
| `STORAGE_PRIVATE_BUCKET`         | server | default `erp-private`               |
| `STORAGE_PUBLIC_BUCKET`          | server | default `erp-public`                |
| `MAX_UPLOAD_MB`                  | server | default 10                          |

---

## 15. npm Scripts

```bash
npm install          # install dependencies
npm run dev          # start dev server (vite)
npm run build        # production build (SvelteKit adapter)
npm run preview      # preview the production build
npm run check        # svelte-check typecheck
npm run check:watch  # typecheck on change
npm run lint         # eslint .
npm run format       # prettier --write .
npm test             # vitest run (unit + integration)
npm run test:e2e     # playwright (optional)
```

---

## 16. Development Order — 47 Phases

Build strictly in this order (dependencies first). Each phase ends runnable + audited.

1. **Project Setup** — scaffold, lint/format/precommit, CI
2. **Supabase Setup** — project, storage, auth config
3. **Database Architecture** — migration chain, base tables (§8.1–8.3)
4. **Authentication** — login, session, logout, layout guard
5. **Multi-College Core** — college/campus master + switcher
6. **College/Campus Settings** — logo, address, branding, receipt prefix
7. **Role & Permission** — roles, permissions, assignment UI
8. **RLS** — policies on all tenant tables (§10)
9. **Audit Log** — writer + viewer
10. **Dynamic Form Builder** (engine #1)
11. **Dynamic Table Builder** (engine #2)
12. **Dynamic Report Builder** (engine #3)
13. **Student Master** — lifecycle Enquiry → Applicant → Active → Passed → Alumni
14. **Employee Master** — regular/visiting/guest/contract/part-time
15. **Academic Master** — departments, programs, courses, semesters, divisions, subjects
16. **Admission Module** — quotas (ACPC/ACPDC/GCAS/MQ/VQ/NRI), rounds, applications, forms
17. **Merit Engine** (engine #4) — PCM/PCB + GUJCET marks/percentile, rules, rank
18. **ACPC PDF/rule Documents** — versioned upload per admission type
19. **Fees** — structure, heads, installments, concessions, college-wise receipt numbering
20. **Dynamic Timetable** — slots, templates, entries, conflict check, room/faculty allocation
21. **Biometric / Punching Integration** — device webhook → `punch_records`
22. **Attendance Engine** — punch → present/late/absent, timetable alignment, faculty-wise
23. **Leave + Holiday + Overtime** — balances, applications, approval workflow, weekly off
24. **Salary Rule Engine** (engine #4) — regular components + per-lecture/per-hour
25. **Payroll** — payslip cycle, per-lecture claims → payslips, PF/TDS registers
26. **Examination** — schedules, marks entry, grade definitions, results (SGPA/CGPA)
27. **Accounts** — COA, ledgers, vouchers, receipts/payments, trial balance
28. **Purchase** — requests → quotations → PO → GRN → invoice
29. **Inventory** — items, stores, stock in/out/transfer/adjust, reorder alert
30. **Library** — books, copies, issue/return/renew/fine/lost
31. **Hostel** — buildings → rooms → beds, allocation, fees, mess, complaints
32. **Transport** — vehicles, routes, stops, allocation, fuel, maintenance
33. **Scholarship** — schemes, applications, verification, disbursement
34. **Training & Placement** — companies, drives, registrations, interviews, offers
35. **Alumni** — profiles, batches, achievements, events, donations
36. **Grievance** — categories, priority, assignment, workflow, closure
37. **Documents** — central registry, versions, share, certificates
38. **Notifications** — templates, in-app + email, batches
39. **WhatsApp Integration** — channel, delivery logs
40. **PDF / Excel / CSV Export** — shared engine wired into every module
41. **Dashboard** — super-admin + college dashboards, alerts, charts
42. **Workflow Engine** (engine #5) — generic approval (reused in 6/16/23/25/33/36)
43. **Backup** — database + storage automation + recovery doc
44. **Security Audit** — RLS review, secret handling, rate limiting, input validation
45. **Testing** — unit, integration, e2e on critical flows
46. **Performance & Production Readiness** — indexes, caching, SSR, CDN
47. **Deployment + Documentation** — production release

---

## 17. Gujarati + English i18n

- `src/lib/i18n/en.json` and `gu.json`, keyed by module: `.students.title`, `.fees.title`, …
- Helper `t(key, params)`; language from `profiles.language` or `?lang=`.
- DB codes stay English; display strings can use `*_gu` columns (e.g. `fee_heads.name_gu`).
- Examples: `students.title` Students/વિદ્યાર્થી · `fees.title` Fees/ફી · `employees.title` Faculty/કર્મચારી.

---

## 18. Security Requirements

Non-negotiable checklist:

- [x] Supabase Auth + session refresh; role from `profiles`/JWT
- [x] RLS enabled on every table; policies per §10
- [x] Role/permission checks server-side (`guards.ts`) — never trust the browser
- [ ] MFA (optional) for admin roles
- [ ] Input validation (zod) on every server action
- [ ] Storage policies + MIME/size validation; private files never public
- [ ] `audit_logs` on create/update/delete/approve/export
- [ ] Rate limiting on login, OTP/WhatsApp, bulk-export
- [ ] Secrets only in `.env`; service-role key server-only
- [ ] CSRF protection on state-changing requests
- [ ] Session hardening: HTTP-only cookies, `COOKIE_SECURE`, short expiry, revoke on logout

---

## 19. Backup Strategy

`scripts/backup.sh` (cron or scheduled CI):

1. `pg_dump` full DB → `backups/db/YYYY-MM-DD.dump` + `schema.sql`
2. Supabase Storage backup (uploads) via CLI/API
3. Config + audit export → JSON
4. Retention: daily ×7, weekly ×4, monthly ×12
5. Restore runbook (`docs/backup.md`): `psql -f schema.sql` → `pg_restore db.dump` → verify counts
6. Test restore in a staging project quarterly

---

## 20. Testing Strategy

- **Unit (Vitest):** rule engine, receipt numbering, merit score computation, salary calc, CSV/Excel
  export, RBAC guard, date utilities
- **Integration:** repository CRUD with tenant isolation, audit writer, export engine
- **E2E (Playwright):** login, college switch, admission form → merit → fee receipt happy path,
  leave approval, payslip run
- **CI** (`.github/workflows/ci.yml`): `npm run lint` + `npm run check` + `npm test` + `npm run build`

---

## 21. Deployment

1. **Supabase** — prod project; run `supabase/migrations/` in order; apply `seed.sql`; configure auth
   redirect URLs, storage buckets + policies.
2. **App host options:** Vercel/Netlify (adapter-vercel/netlify) or Node (`adapter-node`):
   `npm run build`, serve `build/index.js` behind Nginx/Caddy; optional Dockerfile.
3. Set full `.env` (URLs, service key, `ORIGIN`, `COOKIE_SECURE=true`).
4. Nginx: proxy `/` to the Node port, serve `/static` with gzip + asset caching.
5. Smoke test: login → dashboard → one module write → audit row → export PDF.
6. Migrations before deploy; restart with zero-downtime (drain → start new).

---

## 22. Seed Data

`supabase/seed.sql` (idempotent, `on conflict do nothing`):

- 1 organization + **5 colleges**:
  - `COL001` Atlas College · Ahmedabad
  - `COL002` Riverstone College · Vadodara
  - `COL003` Greenfield Institute · Surat
  - `COL004` Summit Academy · Rajkot
  - `COL005` Horizon Campus · Gandhinagar
- Roles + default permission set (§6)
- Default `SUPER_ADMIN` (credentials from env, changed on first login)
- 3 departments + 4 courses per college, 2 semesters, sample divisions
- Sample students (PCM + GUJCET), merit rule `board_50_gujcet_50`, a dynamic admission form,
  fee heads + structure, 2 faculty (regular + visiting), receipt sequences, an ACPC doc row
- Demo rows are tagged so they can be purged before production go-live

---

## 23. Current Implementation Status

Already in this repo:

| Area                            | Status                                              |
| ------------------------------- | --------------------------------------------------- |
| SvelteKit 5 + TS project        | ✅ npm scripts, lint, check, vitest                  |
| Design system                   | ✅ `src/app.css` (tokens, light/dark, ui components) |
| Overview dashboard              | ✅ 5 colleges, stats, alerts, quick actions (`+page.svelte`) |
| Tenant core schema              | ✅ `supabase/migrations/001_erp_core.sql` (colleges, profiles, departments, courses, students) |
| RLS + helper                    | ✅ `can_access_college()`, policies, seeded colleges |
| Local fallback store            | ✅ `data/erp-data.json` + `src/lib/server/local-store.ts` |
| Server repository layer         | ✅ `repository.ts` (list/get/create/update/remove/count, tenant scoping) |
| Session + auth hooks            | ✅ `session.ts`, `hooks.server.ts`, cookie handling  |
| Audit log writer                | ✅ `audit.ts`                                        |
| Remaining 47-phase build-out    | ⏳ follow §16 order using §8 schema                  |