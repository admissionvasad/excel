import { describe, expect, it } from 'vitest';
import { computeMerit } from './merit';

describe('computeMerit', () => {
	it('computes PCM and GUJCET based merit score', () => {
		const result = computeMerit({
			pcm: { physics: 90, chemistry: 85, mathematics: 92 },
			gujcet: 150,
			outOf: 200
		});

		expect(result.pcm_percentage).toBe(89);
		expect(result.gujcet_percentage).toBe(75);
		expect(result.merit_index).toBeGreaterThan(0);
	});
});
