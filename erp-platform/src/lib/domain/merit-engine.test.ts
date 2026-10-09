import { describe, expect, it } from 'vitest';
import {
	computeDynamicMerit,
	computeSelectedSubjectTotal,
	evaluateFormula,
	rankMeritList
} from './merit-engine';

describe('computeSelectedSubjectTotal', () => {
	const subjects = [
		{ subject: 'Physics', marks: 90 },
		{ subject: 'Chemistry', marks: 85 },
		{ subject: 'Mathematics', marks: 95 },
		{ subject: 'Biology', marks: 70 }
	];

	it('sums only the selected subjects', () => {
		const result = computeSelectedSubjectTotal(subjects, ['Physics', 'Chemistry', 'Mathematics']);
		expect(result.total).toBe(270);
		expect(result.maxTotal).toBe(300);
		expect(result.percentage).toBe(90);
	});

	it('matches subject names case-insensitively', () => {
		const result = computeSelectedSubjectTotal(subjects, ['physics', 'chemistry']);
		expect(result.total).toBe(175);
	});

	it('uses all subjects when none are selected', () => {
		const result = computeSelectedSubjectTotal(subjects, []);
		expect(result.total).toBe(340);
	});
});

describe('evaluateFormula', () => {
	it('respects operator precedence', () => {
		expect(
			evaluateFormula('percentage * 0.6 + entrance * 0.4', { percentage: 80, entrance: 90 })
		).toBeCloseTo(84);
	});

	it('supports parentheses', () => {
		expect(evaluateFormula('(total / maxTotal) * 100', { total: 270, maxTotal: 300 })).toBeCloseTo(
			90
		);
	});

	it('rejects unknown variables', () => {
		expect(() => evaluateFormula('bogus + 1', {})).toThrow(/Unknown variable/);
	});
});

describe('computeDynamicMerit', () => {
	it('combines aggregate and entrance with the default weights', () => {
		const result = computeDynamicMerit({
			subjects: [
				{ subject: 'Physics', marks: 90, maxMarks: 100 },
				{ subject: 'Chemistry', marks: 90, maxMarks: 100 },
				{ subject: 'Mathematics', marks: 90, maxMarks: 100 }
			],
			selectedSubjects: ['Physics', 'Chemistry', 'Mathematics'],
			entranceMarks: 150,
			entranceMax: 200
		});
		expect(result.percentage).toBe(90);
		expect(result.entrancePercentage).toBe(75);
		expect(result.meritIndex).toBeCloseTo(81);
	});

	it('honours an administrator supplied formula', () => {
		const result = computeDynamicMerit({
			subjects: [{ subject: 'Physics', marks: 80, maxMarks: 100 }],
			selectedSubjects: ['Physics'],
			entranceMarks: 100,
			entranceMax: 100,
			formula: 'percentage * 0.5 + entrance * 0.5'
		});
		expect(result.meritIndex).toBeCloseTo(90);
	});
});

describe('rankMeritList', () => {
	it('ranks eligible applicants by merit index and pushes ineligible last', () => {
		const ranked = rankMeritList([
			{
				applicationNumber: 'A1',
				applicantName: 'A',
				meritIndex: 70,
				selectedTotal: 0,
				selectedMaxTotal: 0,
				percentage: 0,
				entrancePercentage: null,
				breakdown: []
			},
			{
				applicationNumber: 'A2',
				applicantName: 'B',
				meritIndex: 95,
				selectedTotal: 0,
				selectedMaxTotal: 0,
				percentage: 0,
				entrancePercentage: null,
				breakdown: []
			},
			{
				applicationNumber: 'A3',
				applicantName: 'C',
				meritIndex: 99,
				eligibility: false,
				selectedTotal: 0,
				selectedMaxTotal: 0,
				percentage: 0,
				entrancePercentage: null,
				breakdown: []
			}
		]);
		expect(ranked.map((row) => row.applicationNumber)).toEqual(['A2', 'A1', 'A3']);
		expect(ranked[0].rank).toBe(1);
	});
});
