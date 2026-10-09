import { describe, expect, it } from 'vitest';
import { formatReceiptNumber, nextReceiptSequence } from './receipt';

describe('formatReceiptNumber', () => {
	it('builds college-wise receipts with a padded sequence', () => {
		expect(formatReceiptNumber({ prefix: 'ENG/', number: 1, padLength: 5 })).toBe('ENG/00001');
	});

	it('inserts the year when supplied', () => {
		expect(formatReceiptNumber({ prefix: 'ENG', year: 2026, number: 7, padLength: 5 })).toBe(
			'ENG/2026/00007'
		);
	});

	it('supports a {year} placeholder in the prefix', () => {
		expect(
			formatReceiptNumber({ prefix: 'DIP/{year}/', year: 2026, number: 12, padLength: 3 })
		).toBe('DIP/2026/012');
	});

	it('appends an optional suffix', () => {
		expect(formatReceiptNumber({ prefix: 'RCP/', number: 5, padLength: 4, suffix: '/A' })).toBe(
			'RCP/0005/A'
		);
	});
});

describe('nextReceiptSequence', () => {
	it('increments the last issued number', () => {
		expect(nextReceiptSequence(41)).toBe(42);
		expect(nextReceiptSequence(null)).toBe(1);
	});
});
