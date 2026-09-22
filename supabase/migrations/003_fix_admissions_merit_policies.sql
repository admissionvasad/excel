-- Make the admissions and merit policies safely replaceable after migration 002.

drop policy if exists admissions_tenant on public.admissions;
drop policy if exists merit_scores_tenant on public.merit_scores;

create policy admissions_tenant on public.admissions
  for all
  using (public.can_access_college(college_id))
  with check (public.can_access_college(college_id));

create policy merit_scores_tenant on public.merit_scores
  for all
  using (public.can_access_college(college_id))
  with check (public.can_access_college(college_id));
