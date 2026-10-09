import { describe, expect, it } from 'vitest';
import { calculateByRule, calculateSalary, calculateVisitingPay } from './salary-engine';

describe('calculateSalary', () => {
	it('computes regular faculty salary from components', () => {
		const result = calculateSalary(
			[
				{ name: 'Basic', component_type: 'Earning', calculation: 'Fixed', amount: 30000 },
				{ name: 'HRA', component_type: 'Earning', calculation: 'Percentage of Basic', amount: 20 },
				{ name: 'PF', component_type: 'Deduction', calculation: 'Percentage of Basic', amount: 12 }
			],
			{ basic: 30000 }
		);
		expect(result.gross).toBe(36000);
		expect(result.totalDeductions).toBe(3600);
		expect(result.net).toBe(32400);
	});

	it('pays visiting faculty per approved lecture', () => {
		const result = calculateSalary(
			[
				{
					name: 'Lecture Payment',
					component_type: 'Earning',
					calculation: 'Per Lecture',
					amount: 500
				}
			],
			{ approvedLectures: 24 }
		);
		expect(result.gross).toBe(12000);
		expect(result.net).toBe(12000);
	});

	it('never produces negative net pay', () => {
		const result = calculateSalary(
			[
				{ name: 'Basic', component_type: 'Earning', calculation: 'Fixed', amount: 1000 },
				{ name: 'Penalty', component_type: 'Deduction', calculation: 'Fixed', amount: 5000 }
			],
			{}
		);
		expect(result.net).toBe(0);
	});
});

describe('calculateVisitingPay', () => {
	it('multiplies approved lectures by the configured rate', () => {
		expect(calculateVisitingPay(18, 750)).toBe(13500);
	});

	it('returns zero when rate is missing', () => {
		expect(calculateVisitingPay(18, null)).toBe(0);
	});
});

describe('calculateByRule', () => {
	it('supports per-lecture and hourly rules', () => {
		expect(calculateByRule('Per Lecture', { approvedLectures: 10, rate: 400 })).toBe(4000);
		expect(calculateByRule('Hourly', { approvedHours: 12, rate: 250 })).toBe(3000);
	});
});
