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

	it('uses the configured out-of-score for board aggregates', () => {
		const result = computeMerit({
			pcm: { physics: 180, chemistry: 180, mathematics: 180 },
			outOf: 300
		});

		expect(result.pcm_percentage).toBe(60);
		expect(result.merit_index).toBe(60);
	});

	it('clamps GUJCET percentage to 100 when marks exceed the maximum', () => {
		const result = computeMerit({
			pcm: { physics: 100, chemistry: 100, mathematics: 100 },
			gujcet: 240,
			outOf: 100
		});

		expect(result.gujcet_percentage).toBe(100);
		expect(result.merit_index).toBe(100);
	});
});
