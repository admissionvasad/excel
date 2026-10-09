-- ============================================================
-- 004_platform_schema.sql
-- Multi-College Education ERP — platform-wide schema.
--
-- Extends the core tables (colleges/profiles/departments/courses/
-- students/admissions/merit_scores) with the full module set:
-- organisation, academics, punching machine, attendance, leave,
-- lecture records, salary rules, payroll, fees, examination,
-- accounts, purchase, inventory, library, hostel, transport,
-- scholarships, placements, alumni, grievances, documents,
-- notifications, dynamic builders, roles/permissions, audit logs.
--
-- Conventions:
--   * uuid primary keys (gen_random_uuid()).
--   * college_id (text) references public.colleges(id) when tenant scoped.
--   * created_at / updated_at timestamptz, soft-delete via deleted_at.
--   * Row Level Security enforced per tenant (see DO block at the end).
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Organisation & campus master
-- ------------------------------------------------------------
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  registration_number text,
  email text,
  phone text,
  website text,
  address text,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.campuses (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  code text not null,
  name text not null,
  address text,
  city text,
  phone text,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (college_id, code)
);

-- ------------------------------------------------------------
-- Academic structure
-- ------------------------------------------------------------
create table if not exists public.academic_years (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  name text not null,
  start_date date,
  end_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (college_id, name)
);

create table if not exists public.programmes (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  code text not null,
  name text not null,
  level text not null default 'UG',
  duration_years integer not null default 4 check (duration_years between 1 and 8),
  total_semesters integer not null default 8 check (total_semesters between 1 and 16),
  university text,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (college_id, code)
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  programme_id uuid references public.programmes(id) on delete cascade,
  code text not null,
  name text not null,
  semester integer check (semester between 1 and 16),
  credits numeric(4,1),
  max_marks numeric(6,2) default 100,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (college_id, code)
);

create table if not exists public.divisions (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  programme_id uuid references public.programmes(id) on delete cascade,
  name text not null,
  semester integer,
  capacity integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.time_slots (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  label text not null,
  start_time time not null,
  end_time time not null,
  slot_type text not null default 'Lecture',
  display_order integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.timetables (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  programme_id uuid references public.programmes(id) on delete cascade,
  semester integer,
  division text,
  day text not null,
  time_slot_id uuid references public.time_slots(id) on delete set null,
  subject_id uuid references public.subjects(id) on delete set null,
  employee_id uuid,
  room text,
  lecture_type text default 'Theory',
  batch text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Employees / faculty
-- ------------------------------------------------------------
create table if not exists public.faculty_types (
  id uuid primary key default gen_random_uuid(),
  college_id text references public.colleges(id) on delete cascade,
  name text not null,
  code text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  campus_id uuid references public.campuses(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  employee_code text not null,
  biometric_id text,
  first_name text not null,
  last_name text not null,
  gender text,
  date_of_birth date,
  mobile text,
  email text,
  address text,
  designation text,
  employee_type text not null default 'Teaching',
  faculty_type_id uuid references public.faculty_types(id) on delete set null,
  joining_date date,
  employment_status text not null default 'Active',
  bank_account_number text,
  bank_name text,
  ifsc_code text,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (college_id, employee_code)
);

-- ------------------------------------------------------------
-- Punching machine & attendance
-- ------------------------------------------------------------
create table if not exists public.machines (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  campus_id uuid references public.campuses(id) on delete set null,
  name text not null,
  machine_id text,
  serial_number text,
  vendor text,
  protocol text not null default 'CSV',
  ip_address text,
  port integer check (port between 1 and 65535),
  location text,
  sync_interval_minutes integer default 15,
  last_sync_at timestamptz,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.machine_punches (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  biometric_employee_id text not null,
  employee_id uuid references public.employees(id) on delete set null,
  machine_id uuid references public.machines(id) on delete set null,
  punch_date date not null,
  punch_time time not null,
  punch_type text check (punch_type in ('IN', 'OUT')),
  raw_data text,
  sync_status text not null default 'Imported',
  created_at timestamptz not null default now()
);
create index if not exists machine_punches_lookup_idx on public.machine_punches(college_id, biometric_employee_id, punch_date);

create table if not exists public.attendance_rules (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  name text not null,
  employee_type text not null default 'All',
  office_start_time time default '09:30',
  grace_minutes integer default 10,
  office_end_time time default '16:30',
  minimum_hours numeric(5,2) default 8,
  half_day_hours numeric(5,2) default 4,
  late_threshold_minutes integer default 15,
  early_leave_threshold integer default 15,
  overtime_start_hours numeric(5,2) default 9,
  weekly_off text default 'Sunday',
  effective_from date,
  effective_to date,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  employee_id uuid references public.employees(id) on delete cascade,
  student_id uuid,
  attendance_date date not null,
  first_punch time,
  last_punch time,
  working_hours numeric(5,2) default 0,
  late_minutes integer default 0,
  early_leave_minutes integer default 0,
  overtime_hours numeric(5,2) default 0,
  is_missing_punch boolean default false,
  status text not null default 'Present',
  remarks text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists attendance_date_idx on public.attendance(college_id, attendance_date);

create table if not exists public.leave_types (
  id uuid primary key default gen_random_uuid(),
  college_id text references public.colleges(id) on delete cascade,
  name text not null,
  code text,
  annual_quota numeric(5,2),
  carry_forward boolean default false,
  paid boolean default true,
  status text not null default 'Active',
  created_at timestamptz not null default now()
);

create table if not exists public.leave_applications (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  employee_id uuid references public.employees(id) on delete cascade,
  leave_type_id uuid references public.leave_types(id) on delete set null,
  start_date date not null,
  end_date date not null,
  days numeric(5,2) not null,
  reason text,
  status text not null default 'Pending',
  approved_by uuid references public.employees(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lecture_records (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  employee_id uuid references public.employees(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  programme_id uuid references public.programmes(id) on delete set null,
  semester integer,
  division text,
  time_slot_id uuid references public.time_slots(id) on delete set null,
  lecture_date date not null,
  lecture_type text default 'Theory',
  lecture_hours numeric(5,2) default 1,
  status text not null default 'Scheduled',
  approved_by uuid references public.employees(id) on delete set null,
  remarks text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists lecture_records_lookup_idx on public.lecture_records(college_id, employee_id, lecture_date);

-- ------------------------------------------------------------
-- Dynamic admission forms
-- ------------------------------------------------------------
create table if not exists public.admission_forms (
  id uuid primary key default gen_random_uuid(),
  college_id text references public.colleges(id) on delete cascade,
  name text not null,
  code text,
  admission_type text not null default 'Other',
  version integer not null default 1,
  description text,
  is_published boolean not null default false,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.admission_fields (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.admission_forms(id) on delete cascade,
  label text not null,
  field_name text not null,
  field_type text not null default 'text',
  is_required boolean not null default false,
  default_value text,
  validation_rule text,
  min_value numeric,
  max_value numeric,
  options text,
  visibility_rule text,
  is_readonly boolean not null default false,
  help_text text,
  display_order integer not null default 1,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Merit rules
-- ------------------------------------------------------------
create table if not exists public.merit_rules (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  name text not null,
  programme_id uuid references public.programmes(id) on delete set null,
  admission_type text not null default 'Other',
  academic_year_id uuid references public.academic_years(id) on delete set null,
  selected_subjects text,
  calculation_formula text,
  minimum_eligibility text,
  effective_from date,
  effective_to date,
  reference_document_url text,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.merit_rule_subjects (
  id uuid primary key default gen_random_uuid(),
  merit_rule_id uuid not null references public.merit_rules(id) on delete cascade,
  subject_name text not null,
  weight numeric(6,3) default 1,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Fees
-- ------------------------------------------------------------
create table if not exists public.fee_heads (
  id uuid primary key default gen_random_uuid(),
  college_id text references public.colleges(id) on delete cascade,
  code text not null,
  name text not null,
  category text not null default 'Other',
  is_refundable boolean default false,
  is_recurring boolean default true,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (college_id, code)
);

create table if not exists public.fee_structures (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  name text not null,
  programme_id uuid references public.programmes(id) on delete set null,
  semester integer,
  academic_year_id uuid references public.academic_years(id) on delete set null,
  category text,
  admission_type text,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fee_transactions (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  receipt_number text not null,
  student_id uuid,
  fee_head_id uuid references public.fee_heads(id) on delete set null,
  amount numeric(14,2) not null default 0,
  discount numeric(14,2) not null default 0,
  scholarship numeric(14,2) not null default 0,
  late_fee numeric(14,2) not null default 0,
  payment_mode text default 'Cash',
  transaction_reference text,
  transaction_date date not null default current_date,
  status text not null default 'Paid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (college_id, receipt_number)
);
create index if not exists fee_transactions_receipt_idx on public.fee_transactions(college_id, receipt_number);

create table if not exists public.receipt_series (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  name text not null,
  department_id uuid references public.departments(id) on delete set null,
  fee_type text,
  academic_year text,
  prefix text not null,
  suffix text,
  pad_length integer not null default 5,
  next_number integer not null default 1,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Salary rule engine & payroll
-- ------------------------------------------------------------
create table if not exists public.salary_rules (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  name text not null,
  faculty_type text not null default 'Regular',
  department_id uuid references public.departments(id) on delete set null,
  calculation_type text not null default 'Monthly',
  formula text,
  approval_required boolean not null default true,
  effective_from date not null default current_date,
  effective_to date,
  version integer not null default 1,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.salary_rule_components (
  id uuid primary key default gen_random_uuid(),
  salary_rule_id uuid not null references public.salary_rules(id) on delete cascade,
  name text not null,
  component_type text not null default 'Earning',
  calculation text not null default 'Fixed',
  amount numeric(14,2) default 0,
  formula text,
  display_order integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.payroll_runs (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  period text not null,
  faculty_type text,
  total_gross numeric(14,2) default 0,
  total_deductions numeric(14,2) default 0,
  total_net numeric(14,2) default 0,
  status text not null default 'Draft',
  finalized_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payroll_items (
  id uuid primary key default gen_random_uuid(),
  payroll_run_id uuid not null references public.payroll_runs(id) on delete cascade,
  college_id text not null references public.colleges(id) on delete cascade,
  employee_id uuid references public.employees(id) on delete cascade,
  faculty_type text,
  approved_lectures numeric(8,2) default 0,
  approved_hours numeric(8,2) default 0,
  rate numeric(14,2) default 0,
  gross numeric(14,2) default 0,
  deductions numeric(14,2) default 0,
  net_payable numeric(14,2) default 0,
  calculation_breakdown text,
  status text not null default 'Draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Examination
-- ------------------------------------------------------------
create table if not exists public.exam_types (
  id uuid primary key default gen_random_uuid(),
  college_id text references public.colleges(id) on delete cascade,
  name text not null,
  code text,
  weightage numeric(5,2),
  default_max_marks numeric(6,2),
  default_passing_marks numeric(6,2),
  status text not null default 'Active',
  created_at timestamptz not null default now()
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  name text not null,
  exam_type_id uuid references public.exam_types(id) on delete set null,
  programme_id uuid references public.programmes(id) on delete set null,
  semester integer,
  start_date date,
  end_date date,
  status text not null default 'Scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exam_subjects (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  max_marks numeric(6,2) default 100,
  passing_marks numeric(6,2) default 35,
  exam_date date,
  room text,
  created_at timestamptz not null default now()
);

create table if not exists public.marks (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  exam_id uuid references public.exams(id) on delete cascade,
  student_id uuid,
  subject_id uuid references public.subjects(id) on delete set null,
  internal_marks numeric(6,2),
  external_marks numeric(6,2),
  practical_marks numeric(6,2),
  total_marks numeric(6,2),
  grade text,
  is_pass boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Accounts / purchase / inventory
-- ------------------------------------------------------------
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  college_id text references public.colleges(id) on delete cascade,
  code text not null,
  name text not null,
  account_type text not null default 'Asset',
  parent_id uuid references public.accounts(id) on delete set null,
  opening_balance numeric(14,2) default 0,
  status text not null default 'Active',
  created_at timestamptz not null default now()
);

create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  entry_date date not null default current_date,
  narration text,
  reference_number text,
  debit numeric(14,2) not null default 0,
  credit numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.purchase_requests (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  request_number text not null,
  title text not null,
  department_id uuid references public.departments(id) on delete set null,
  request_date date not null default current_date,
  estimated_amount numeric(14,2) default 0,
  justification text,
  status text not null default 'Draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (college_id, request_number)
);

create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  order_number text not null,
  vendor_name text,
  request_id uuid references public.purchase_requests(id) on delete set null,
  order_date date not null default current_date,
  expected_delivery date,
  total_amount numeric(14,2) default 0,
  status text not null default 'Draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (college_id, order_number)
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  code text not null,
  name text not null,
  category text,
  unit text default 'Nos',
  opening_stock numeric(12,2) default 0,
  current_stock numeric(12,2) default 0,
  reorder_level numeric(12,2) default 0,
  unit_price numeric(14,2) default 0,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (college_id, code)
);

create table if not exists public.stock_transactions (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  item_id uuid references public.inventory_items(id) on delete cascade,
  transaction_type text not null default 'Stock In',
  quantity numeric(12,2) not null default 0,
  transaction_date date not null default current_date,
  reference_number text,
  remarks text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Library / hostel / transport
-- ------------------------------------------------------------
create table if not exists public.library_books (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  title text not null,
  author text,
  publisher text,
  isbn text,
  category text,
  edition text,
  price numeric(14,2),
  total_copies integer default 1,
  available_copies integer default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.library_transactions (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  book_id uuid references public.library_books(id) on delete cascade,
  member_type text default 'Student',
  student_id uuid,
  employee_id uuid references public.employees(id) on delete set null,
  issue_date date not null default current_date,
  due_date date,
  return_date date,
  fine_amount numeric(10,2) default 0,
  status text not null default 'Issued',
  created_at timestamptz not null default now()
);

create table if not exists public.hostels (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  code text not null,
  name text not null,
  type text not null default 'Boys',
  warden_name text,
  warden_mobile text,
  total_rooms integer default 0,
  address text,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (college_id, code)
);

create table if not exists public.hostel_rooms (
  id uuid primary key default gen_random_uuid(),
  hostel_id uuid not null references public.hostels(id) on delete cascade,
  room_number text not null,
  capacity integer default 0,
  occupied integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.transport_vehicles (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  vehicle_number text not null,
  vehicle_type text not null default 'Bus',
  model text,
  capacity integer,
  insurance_expiry date,
  fitness_expiry date,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (college_id, vehicle_number)
);

-- ------------------------------------------------------------
-- Scholarships / placements / alumni / grievances
-- ------------------------------------------------------------
create table if not exists public.scholarships (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  student_id uuid,
  name text not null,
  provider text,
  amount numeric(14,2) not null default 0,
  received_amount numeric(14,2) default 0,
  status text not null default 'Applied',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.placements (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  student_id uuid,
  company_name text,
  job_role text,
  package_amount numeric(14,2),
  offer_date date,
  joining_date date,
  status text not null default 'Offered',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.alumni (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  student_id uuid,
  student_name text not null,
  passing_year integer,
  programme text,
  company text,
  designation text,
  email text,
  mobile text,
  higher_studies text,
  achievements text,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.grievances (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  ticket_number text not null,
  subject text not null,
  category text not null default 'Other',
  raised_by_type text not null default 'Student',
  student_id uuid,
  employee_id uuid references public.employees(id) on delete set null,
  description text,
  assigned_department_id uuid references public.departments(id) on delete set null,
  resolution text,
  status text not null default 'Open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (college_id, ticket_number)
);

-- ------------------------------------------------------------
-- Documents / notifications / approvals
-- ------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  college_id text not null references public.colleges(id) on delete cascade,
  title text not null,
  document_type text not null default 'Other',
  student_id uuid,
  employee_id uuid references public.employees(id) on delete set null,
  file_url text,
  mime_type text,
  visibility text not null default 'Private',
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  college_id text references public.colleges(id) on delete cascade,
  title text not null,
  event text not null default 'Circular',
  channel text not null default 'In-App',
  recipient text,
  body text,
  status text not null default 'Queued',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.approval_workflows (
  id uuid primary key default gen_random_uuid(),
  college_id text references public.colleges(id) on delete cascade,
  module text not null,
  name text not null,
  steps jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.approval_requests (
  id uuid primary key default gen_random_uuid(),
  college_id text references public.colleges(id) on delete cascade,
  workflow_id uuid references public.approval_workflows(id) on delete set null,
  module text,
  record_id text,
  title text,
  current_step integer not null default 1,
  status text not null default 'Pending',
  requested_by uuid,
  remarks text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Dynamic builders & reporting
-- ------------------------------------------------------------
create table if not exists public.custom_forms (
  id uuid primary key default gen_random_uuid(),
  college_id text references public.colleges(id) on delete cascade,
  name text not null,
  code text not null,
  module text,
  description text,
  is_published boolean not null default false,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (college_id, code)
);

create table if not exists public.custom_form_fields (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.custom_forms(id) on delete cascade,
  label text not null,
  field_name text not null,
  field_type text not null default 'text',
  is_required boolean not null default false,
  default_value text,
  validation_rule text,
  display_order integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.custom_tables (
  id uuid primary key default gen_random_uuid(),
  college_id text references public.colleges(id) on delete cascade,
  name text not null,
  code text not null,
  description text,
  scope text not null default 'College',
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (college_id, code)
);

create table if not exists public.custom_table_columns (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references public.custom_tables(id) on delete cascade,
  label text not null,
  field_name text not null,
  data_type text not null default 'text',
  is_required boolean not null default false,
  is_unique boolean not null default false,
  default_value text,
  validation_rule text,
  display_order integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.report_templates (
  id uuid primary key default gen_random_uuid(),
  college_id text references public.colleges(id) on delete cascade,
  name text not null,
  module text not null,
  fields text,
  filters text,
  grouping text,
  sorting text,
  output_format text not null default 'Screen',
  is_shared boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Roles, permissions and settings
-- ------------------------------------------------------------
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  is_system boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  module text not null,
  action text not null,
  label text,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  permission_code text not null,
  created_at timestamptz not null default now(),
  unique (role, permission_code)
);

create table if not exists public.user_college_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  college_id text not null references public.colleges(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, college_id)
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  college_id text references public.colleges(id) on delete cascade,
  category text not null,
  key text not null,
  value text,
  data_type text not null default 'string',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (college_id, category, key)
);

-- ------------------------------------------------------------
-- Audit logs
-- ------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  college_id text references public.colleges(id) on delete set null,
  user_id uuid,
  actor_email text,
  module text,
  action text not null,
  record_id text,
  old_data text,
  new_data text,
  metadata jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);

-- ------------------------------------------------------------
-- updated_at trigger
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare r record;
begin
  for r in
    select c.relname as tbl
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    join information_schema.columns col
      on col.table_schema = 'public'
     and col.table_name = c.relname
     and col.column_name = 'updated_at'
    where n.nspname = 'public' and c.relkind = 'r'
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', r.tbl);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', r.tbl);
  end loop;
end $$;

-- ------------------------------------------------------------
-- Row Level Security for every tenant-scoped table
-- (any table exposing a college_id column).
-- ------------------------------------------------------------
do $$
declare r record;
begin
  for r in
    select c.relname as tbl
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    join information_schema.columns col
      on col.table_schema = 'public'
     and col.table_name = c.relname
     and col.column_name = 'college_id'
    where n.nspname = 'public' and c.relkind = 'r'
  loop
    execute format('alter table public.%I enable row level security', r.tbl);
    execute format('drop policy if exists %I on public.%I', r.tbl || '_tenant', r.tbl);
    execute format(
      'create policy %I on public.%I for all using (public.can_access_college(college_id)) with check (public.can_access_college(college_id))',
      r.tbl || '_tenant',
      r.tbl
    );
  end loop;
end $$;

-- Global (non-tenant) tables: readable by any authenticated user,
-- writable by super admins only.
do $$
declare
  tbl text;
  global_tables text[] := array['roles', 'permissions', 'role_permissions', 'organizations'];
begin
  foreach tbl in array global_tables loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('drop policy if exists %I on public.%I', tbl || '_read', tbl);
    execute format('create policy %I on public.%I for select using (auth.uid() is not null)', tbl || '_read', tbl);
    execute format('drop policy if exists %I on public.%I', tbl || '_write', tbl);
    execute format(
      'create policy %I on public.%I for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = %L)) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = %L))',
      tbl || '_write',
      tbl,
      'SUPER_ADMIN',
      'SUPER_ADMIN'
    );
  end loop;
end $$;
