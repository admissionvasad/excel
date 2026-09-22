-- The core migration seeds COL001-COL005.
-- Add development users through Supabase Auth, then create matching rows in public.profiles.
-- Never place passwords or service-role keys in this file.

insert into public.admissions (
	id,
	college_id,
	application_number,
	applicant_name,
	gender,
	mobile,
	email,
	previous_qualification,
	status
)
values
	('ADM-COL001-001', 'COL001', 'NBI-ADM-2026-001', 'Aarav Shah', 'Male', '+91 9876500001', 'aarav.shah@example.edu', 'Higher Secondary', 'Pending'),
	('ADM-COL002-001', 'COL002', 'RSC-ADM-2026-001', 'Diya Patel', 'Female', '+91 9876500002', 'diya.patel@example.edu', 'Higher Secondary', 'Pending'),
	('ADM-COL003-001', 'COL003', 'AST-ADM-2026-001', 'Kabir Mehta', 'Male', '+91 9876500003', 'kabir.mehta@example.edu', 'Higher Secondary', 'Pending')
on conflict (id) do nothing;

insert into public.merit_scores (
	id,
	college_id,
	applicant_name,
	application_number,
	admission_type,
	track,
	physics,
	chemistry,
	mathematics,
	gujcet_marks,
	gujcet_percentile,
	board_percentage,
	merit_index,
	eligibility_status,
	status
)
values
	('MERIT-COL001-001', 'COL001', 'Aarav Shah', 'NBI-ADM-2026-001', 'ACPC', 'PCM', 91, 88, 94, 164, 82, 91, 85.6, 'Eligible', 'Draft'),
	('MERIT-COL002-001', 'COL002', 'Diya Patel', 'RSC-ADM-2026-001', 'ACPC', 'PCM', 86, 90, 89, 151, 75.5, 88.33, 80.63, 'Eligible', 'Draft'),
	('MERIT-COL003-001', 'COL003', 'Kabir Mehta', 'AST-ADM-2026-001', 'Management Quota', 'PCM', 72, 78, 75, 128, 64, 75, 69.6, 'Eligible', 'Draft')
on conflict (id) do nothing;
