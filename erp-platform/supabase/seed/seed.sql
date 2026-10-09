-- ============================================================
-- seed.sql — development / demo seed data.
-- Safe to run repeatedly (idempotent upserts).
-- ============================================================

-- Default roles -------------------------------------------------
insert into public.roles (code, name)
values
  ('SUPER_ADMIN', 'Super Admin'),
  ('COLLEGE_ADMIN', 'College Admin'),
  ('PRINCIPAL', 'Principal'),
  ('HOD', 'Head of Department'),
  ('ADMISSION_ADMIN', 'Admission Admin'),
  ('ACADEMIC_ADMIN', 'Academic Admin'),
  ('EXAM_ADMIN', 'Exam Admin'),
  ('ACCOUNTS_ADMIN', 'Accounts Admin'),
  ('HR_ADMIN', 'HR Admin'),
  ('PAYROLL_ADMIN', 'Payroll Admin'),
  ('PURCHASE_ADMIN', 'Purchase Admin'),
  ('STORE_INCHARGE', 'Store Incharge'),
  ('LIBRARY_ADMIN', 'Library Admin'),
  ('FACULTY', 'Faculty'),
  ('STAFF', 'Staff'),
  ('STUDENT', 'Student')
on conflict (code) do nothing;

-- Permissions (module:action) -----------------------------------
insert into public.permissions (code, module, action, label)
select module || ':' || action, module, action, action || ' ' || module
from unnest(array[
  'students','departments','programmes','courses','subjects','admissions','merit',
  'fee_structures','fee_transactions','receipt_series','attendance','leave_applications',
  'machines','machine_punches','lecture_records','salary_rules','payroll_runs',
  'exams','marks','purchase_requests','purchase_orders','inventory_items','library_books',
  'hostels','transport_vehicles','scholarships','placements','alumni','grievances',
  'documents','notifications','reports','settings','audit_logs'
]) as module
cross join unnest(array[
  'view','create','edit','delete','approve','reject','print','export','import','process','finalize','lock','unlock'
]) as action
on conflict (code) do nothing;

-- Super admin gets every permission -----------------------------
insert into public.role_permissions (role, permission_code)
select 'SUPER_ADMIN', code from public.permissions
on conflict (role, permission_code) do nothing;

-- College admin gets everything except platform-finalize/lock ----
insert into public.role_permissions (role, permission_code)
select 'COLLEGE_ADMIN', code from public.permissions
where action not in ('finalize', 'lock')
on conflict (role, permission_code) do nothing;

-- Demo colleges ------------------------------------------------
insert into public.colleges (id, code, name, short_name, city)
values
  ('COL001', 'COL001', 'Northbridge Institute', 'NBI', 'Ahmedabad'),
  ('COL002', 'COL002', 'Riverstone College', 'RSC', 'Vadodara')
on conflict (id) do nothing;

-- Demo academic year -------------------------------------------
insert into public.academic_years (college_id, name, start_date, end_date, is_active)
values ('COL001', '2026-27', '2026-06-01', '2027-04-30', true)
on conflict (college_id, name) do nothing;

-- Demo receipt series ------------------------------------------
insert into public.receipt_series (college_id, name, prefix, pad_length, next_number)
values ('COL001', 'Engineering Fees', 'ENG/2026/', 5, 1)
on conflict do nothing;

-- Demo time slots (configurable, not hard-coded) ----------------
insert into public.time_slots (college_id, label, start_time, end_time, slot_type, display_order)
values
  ('COL001', 'Punch In', '09:30', '09:30', 'Punch', 1),
  ('COL001', 'Class 1', '09:45', '10:45', 'Lecture', 2),
  ('COL001', 'Class 2', '10:45', '11:45', 'Lecture', 3),
  ('COL001', 'Class 3', '11:45', '12:45', 'Lecture', 4),
  ('COL001', 'Recess', '12:45', '13:30', 'Break', 5),
  ('COL001', 'Class 4', '13:30', '14:30', 'Lecture', 6),
  ('COL001', 'Class 5', '14:30', '15:30', 'Lecture', 7),
  ('COL001', 'Class 6', '15:30', '16:25', 'Lecture', 8),
  ('COL001', 'Punch Out', '16:30', '16:30', 'Punch', 9)
on conflict do nothing;

-- Demo attendance rule -----------------------------------------
insert into public.attendance_rules (college_id, name, office_start_time, office_end_time)
values ('COL001', 'Default Teaching Staff', '09:30', '16:30')
on conflict do nothing;

-- Demo fee heads -----------------------------------------------
insert into public.fee_heads (college_id, code, name, category)
values
  ('COL001', 'FEE-TUI', 'Tuition Fee', 'Tuition'),
  ('COL001', 'FEE-DEV', 'Development Fee', 'Development'),
  ('COL001', 'FEE-EXM', 'Examination Fee', 'Examination'),
  ('COL001', 'FEE-LIB', 'Library Fee', 'Library'),
  ('COL001', 'FEE-LAB', 'Laboratory Fee', 'Laboratory')
on conflict (college_id, code) do nothing;
