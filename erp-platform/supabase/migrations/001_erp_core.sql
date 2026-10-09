create extension if not exists pgcrypto;

create table if not exists public.colleges (
  id text primary key,
  code text not null unique,
  name text not null,
  short_name text not null,
  city text not null,
  color text not null default '#4e68a1',
  students integer not null default 0,
  employees integer not null default 0,
  attendance numeric(5,2) not null default 0,
  fees numeric(5,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'COLLEGE_ADMIN',
  college_id text references public.colleges(id),
  created_at timestamptz not null default now()
);

create table if not exists public.departments (
  id text primary key,
  college_id text not null references public.colleges(id) on delete cascade,
  code text not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (college_id, code)
);

create table if not exists public.courses (
  id text primary key,
  college_id text not null references public.colleges(id) on delete cascade,
  department_id text not null references public.departments(id) on delete restrict,
  code text not null,
  name text not null,
  intake integer not null check (intake > 0),
  acpc_code text not null,
  created_at timestamptz not null default now(),
  unique (college_id, code),
  unique (college_id, acpc_code)
);

create table if not exists public.students (
  id text primary key,
  college_id text not null references public.colleges(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  enrollment_number text not null,
  programme text not null,
  semester integer not null check (semester between 1 and 12),
  mobile text,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (college_id, enrollment_number)
);

create index if not exists departments_college_id_idx on public.departments(college_id);
create index if not exists courses_college_id_idx on public.courses(college_id);
create index if not exists students_college_id_idx on public.students(college_id);

alter table public.colleges enable row level security;
alter table public.profiles enable row level security;
alter table public.departments enable row level security;
alter table public.courses enable row level security;
alter table public.students enable row level security;

create or replace function public.can_access_college(target_college_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (p.role = 'SUPER_ADMIN' or p.college_id = target_college_id)
  );
$$;

create policy colleges_read on public.colleges for select using (public.can_access_college(id));
create policy colleges_write on public.colleges for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'SUPER_ADMIN')) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'SUPER_ADMIN'));
create policy departments_tenant on public.departments for all using (public.can_access_college(college_id)) with check (public.can_access_college(college_id));
create policy courses_tenant on public.courses for all using (public.can_access_college(college_id)) with check (public.can_access_college(college_id));
create policy students_tenant on public.students for all using (public.can_access_college(college_id)) with check (public.can_access_college(college_id));

insert into public.colleges (id, code, name, short_name, city, color)
values
  ('COL001', 'COL001', 'Northbridge Institute', 'NBI', 'Ahmedabad', '#d96c45'),
  ('COL002', 'COL002', 'Riverstone College', 'RSC', 'Vadodara', '#287d72'),
  ('COL003', 'COL003', 'Aravalli School of Technology', 'AST', 'Gandhinagar', '#4e68a1'),
  ('COL004', 'COL004', 'Westfield Arts & Commerce', 'WAC', 'Surat', '#b8893e'),
  ('COL005', 'COL005', 'Cedar Grove University', 'CGU', 'Rajkot', '#795b8f')
on conflict (id) do nothing;
