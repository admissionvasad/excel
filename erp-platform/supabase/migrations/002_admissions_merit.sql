create table if not exists public.admissions (
  id text primary key default gen_random_uuid()::text,
  college_id text not null references public.colleges(id) on delete cascade,
  application_number text not null,
  applicant_name text not null,
  gender text,
  date_of_birth date,
  mobile text,
  email text,
  department_id text,
  programme_id text,
  academic_year_id text,
  previous_qualification text,
  merit_score numeric(8,2),
  status text not null default 'Draft',
  remarks text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (college_id, application_number)
);

create table if not exists public.merit_scores (
  id text primary key default gen_random_uuid()::text,
  college_id text not null references public.colleges(id) on delete cascade,
  applicant_name text not null,
  application_number text not null,
  admission_type text not null default 'Other',
  track text not null check (track in ('PCM', 'PCB')),
  physics numeric(6,2),
  chemistry numeric(6,2),
  mathematics numeric(6,2),
  biology numeric(6,2),
  gujcet_marks numeric(6,2),
  gujcet_percentile numeric(6,2),
  board_percentage numeric(6,2),
  merit_index numeric(8,2) not null,
  eligibility_status text not null,
  status text not null default 'Draft',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admissions_college_created_idx
  on public.admissions(college_id, created_at desc);
create index if not exists merit_scores_college_rank_idx
  on public.merit_scores(college_id, merit_index desc);
create index if not exists merit_scores_application_idx
  on public.merit_scores(college_id, application_number);

alter table public.admissions enable row level security;
alter table public.merit_scores enable row level security;

drop policy if exists admissions_tenant on public.admissions;
create policy admissions_tenant on public.admissions
  for all
  using (public.can_access_college(college_id))
  with check (public.can_access_college(college_id));

drop policy if exists merit_scores_tenant on public.merit_scores;
create policy merit_scores_tenant on public.merit_scores
  for all
  using (public.can_access_college(college_id))
  with check (public.can_access_college(college_id));
