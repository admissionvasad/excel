/**
 * Admission merit calculation rules (pure, unit-testable).
 */

export interface MeritScores {
	/** Percentage aggregate across PCM (Physics, Chemistry, Mathematics). */
	pcm_percentage: number | null;
	/** Percentage aggregate across PCB (Physics, Chemistry, Biology). */
	pcb_percentage: number | null;
	/** Normalised GUJCET percentage (out of 100). */
	gujcet_percentage: number | null;
	/** Final merit index used for allotment/ranking. */
	merit_index: number;
}

export interface MeritInput {
	pcm?: Record<'physics' | 'chemistry' | 'mathematics', number | null> | null;
	pcb?: Record<'physics' | 'chemistry' | 'biology', number | null> | null;
	gujcet?: number | null;
	/** Out-of marks for PCM/PCB aggregates (default 300). */
	outOf?: number;
}

export const GUJCET_MAX_SCORE = 200;

function avg(values: Array<number | null | undefined>): number | null {
	const present = values.filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
	if (present.length === 0) return null;
	return present.reduce((a, b) => a + b, 0) / present.length;
}

function pct(value: number | null | undefined, outOf: number): number | null {
	if (value == null || outOf <= 0) return null;
	return Math.max(0, Math.min(100, Number(((value / outOf) * 100).toFixed(2))));
}

/**
 * Compute the merit index:
 * - If GUJCET is present: 60% GUJCET + 40% best of PCM/PCB aggregate.
 * - Otherwise: best of PCM/PCB aggregate percentage.
 */
export function computeMerit(input: MeritInput): MeritScores {
	const outOf = input.outOf ?? 300;
	const pcmValues = input.pcm ? Object.values(input.pcm) : null;
	const pcbValues = input.pcb ? Object.values(input.pcb) : null;
	const pcmAverage = avg(pcmValues ?? []);
	const pcbAverage = avg(pcbValues ?? []);
	const pcm = pcmAverage == null ? null : pct(pcmAverage, 100);
	const pcb = pcbAverage == null ? null : pct(pcbAverage, 100);
	const gujcet = input.gujcet == null ? null : Number(((input.gujcet / GUJCET_MAX_SCORE) * 100).toFixed(2));

	const bestAggregate = Math.max(pcm ?? 0, pcb ?? 0);
	let meritIndex = bestAggregate;
	if (gujcet != null) {
		meritIndex = Number(((gujcet * 0.6) + (bestAggregate * 0.4)).toFixed(2));
	}

	return {
		pcm_percentage: pcm,
		pcb_percentage: pcb,
		gujcet_percentage: gujcet,
		merit_index: meritIndex
	};
}
