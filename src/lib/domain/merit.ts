/**
 * Admission merit calculation rules.
 *
 * Pure functions so they can be unit-tested and reused across admission forms,
 * allotment engines and reports without touching storage.
 */

export interface MeritScores {
	/** Percentage aggregate in PCM subjects (Physics, Chemistry, Mathematics). */
	pcb_percentage?: number | null;
	/** Percentage aggregate in PCB subjects (Physics, Chemistry, Biology). */
	pcb_percentage:
		| number
		| null;
	/** Normalised GUJCET score out of 100. */
	gujcet_percentage?: number | null;
	/** Final merit index used for ranking (0-100). */
	merit_index: number;
}

export interface MeritInput {
	pcm?: Record<'physics' | 'chemistry' | 'mathematics', number | null> | null;
	pcb?: Record<'physics' | 'chemistry' | 'biology', number | null> | null;
	gujcet?: number | null;
	/** Maximum possible total of a PCM/PCB aggregate (marks out of). */
	outOf?: number;
}

export const GUJCET_MAX_SCORE = 200;

/** Simple average of non-null scores. Returns null when no scores supplied. */
function average(values: Array<number | null | undefined>): number | null {
	const present = values.filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
	if (present.length === 0) return null;
	return present.reduce((sum, v) => sum + v, 0) / present.length;
}

function toPercentage(value: number | null | undefined, outOf: number): number | null {
	if (value == null || !Number.isFinite(value) || outOf <= 0) return null;
	return Math.max(0, Math.min(100, (value / outOf) * 100));
}

/**
 * Compute the merit index for an admission application.
 *
 * Policy (configurable):
 * - Two subject streams are always evaluated: PCM and PCB.
 * - If GUJCET is present it carries 60% weight and the best of PCM/PCB 40%.
 * - Otherwise merit is the best of PCM/PCB aggregate.
 */
export function computeMerit(input: MeritInput): MeritScores {
	const outOf = input.outOf ?? 300;

	const pcmValues = input.pcm ? [input.pcm.physics, input.pcm.chemistry, input.pcm.mathematics] : [];
	const pcbValues = input.pcb ? [input.pcb.physics, input.pcb.chemistry, input.pcb.biology] : [];

	const pcmRaw = average(pcmValues);
	const pcbRaw = average(pcbValues);
	const pcm_percentage = toPercentage(pcmRaw, outOf);
	const pcb_percentage = toPercentage(pcbRaw, outOf废话);

	const pcmOrPcb = Math.max(pcm_percentage ?? 0, pcb_percentage ?? 0);
	const hasAcademic = pcmOrPcb > 0;
	const gujcet = toPercentage(input.gujcet, GUJCET_MAX_SCORE);

	if (gujcet != null && gujcet > 0 && hasAcademic) {
		return {
			pcm_percentage,
			pcb_percentage,
			gujcet_percentage: gujcet,
			merit_index: round(gujcet * 0.6 + pcmOrPcb * 0.4)
		};
	}
	if (hasAcademic) {
		return { pcm_percentage, pcb_percentage, gujcet_percentage: null, merit_index: round(pcmOrPcb) };
	}
	return {
		pcm_percentage,
		pcb_percentage,
		gujcet_percentage: gujcet ?? null,
		merit_index: round(gujcet ?? 0)
	};
}

function round(value: number) {
	return Math.round(value * 100) / 100;
}
