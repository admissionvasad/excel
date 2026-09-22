import { fail } from '@sveltejs/kit';
import { computeMerit } from '$lib/domain/merit';
import { requireAuth, repoContext } from '$lib/server/guards';
import * as repo from '$lib/server/repository';
import type { Actions, PageServerLoad } from './$types';

const subjectKeys = ['physics', 'chemistry', 'mathematics', 'biology'] as const;

type SubjectKey = (typeof subjectKeys)[number];

function numberValue(value: FormDataEntryValue | null): number | null {
	if (typeof value !== 'string' || value.trim() === '') return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

export const load: PageServerLoad = async (event) => {
	const auth = requireAuth(event);
	const ctx = repoContext(event);
	const admissions = await repo.list(ctx, 'admissions', {
		page: 1,
		pageSize: 500,
		sort: { column: 'created_at', ascending: false },
		searchFields: ['applicant_name', 'application_number']
	});
	const scores = await repo.list(ctx, 'merit_scores', {
		page: 1,
		pageSize: 100,
		sort: { column: 'merit_index', ascending: false }
	});

	return { auth, admissions: admissions.rows, scores: scores.rows };
};

export const actions: Actions = {
	calculate: async (event) => {
		const auth = requireAuth(event);
		const ctx = repoContext(event);
		const form = await event.request.formData();
		const admissionId = String(form.get('admission_id') ?? '').trim();
		const admission = admissionId ? await repo.getById(ctx, 'admissions', admissionId) : null;
		const applicantName = String(admission?.applicant_name ?? '').trim();
		const applicationNumber = String(admission?.application_number ?? '').trim();
		const admissionType = String(form.get('admission_type') ?? 'Other').trim();
		const eligibilityMinimum = numberValue(form.get('eligibility_minimum')) ?? 0;
		const gujcetPercentile = numberValue(form.get('gujcet_percentile'));
		const gujcetMarks = numberValue(form.get('gujcet_marks')) ?? (gujcetPercentile == null ? null : gujcetPercentile * 2);

		if (!admission || !applicantName || !applicationNumber) {
			return fail(400, { message: 'Select an applicant before calculating merit.' });
		}

		const marks = Object.fromEntries(
			subjectKeys.map((subject) => [subject, numberValue(form.get(subject))])
		) as Record<SubjectKey, number | null>;
		const track = String(form.get('track') ?? 'pcm');
		const result = computeMerit({
			pcm: track === 'pcb' ? null : {
				physics: marks.physics,
				chemistry: marks.chemistry,
				mathematics: marks.mathematics
			},
			pcb: track === 'pcm' ? null : {
				physics: marks.physics,
				chemistry: marks.chemistry,
				biology: marks.biology
			},
			gujcet: gujcetMarks,
			outOf: 100
		});
		const boardPercentage = track === 'pcb' ? result.pcb_percentage : result.pcm_percentage;
		const eligibilityStatus = boardPercentage != null && boardPercentage >= eligibilityMinimum ? 'Eligible' : 'Not Eligible';
		const saved = await repo.create(ctx, 'merit_scores', {
			applicant_name: applicantName,
			application_number: applicationNumber,
			admission_type: admissionType,
			track: track.toUpperCase(),
			physics: marks.physics,
			chemistry: marks.chemistry,
			mathematics: marks.mathematics,
			biology: marks.biology,
			gujcet_marks: gujcetMarks,
			gujcet_percentile: result.gujcet_percentage,
			board_percentage: boardPercentage,
			merit_index: result.merit_index,
			eligibility_status: eligibilityStatus,
			status: 'Draft',
			created_by: auth.userId
		});

		return { success: true, saved };
	}
};
