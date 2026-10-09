/**
 * Dynamic salary rule engine.
 *
 * Salary structures are configuration, not code: components carry a
 * calculation type and amount/formula. Historical rules are versioned by the
 * caller (effective dates live on the rule record).
 */

import { evaluateFormula } from './merit-engine';

export type SalaryCalculationType =
	'Monthly' | 'Daily' | 'Hourly' | 'Per Lecture' | 'Fixed' | 'Percentage' | 'Custom Formula';

export type ComponentCalculation =
	'Fixed' | 'Percentage of Basic' | 'Per Lecture' | 'Per Hour' | 'Formula';

export interface SalaryComponent {
	name: string;
	component_type: 'Earning' | 'Deduction';
	calculation: ComponentCalculation;
	/** Amount or rate, depending on the calculation. */
	amount?: number | null;
	formula?: string | null;
	display_order?: number;
}

export interface SalaryContext {
	/** Base monthly salary / basic pay. */
	basic?: number;
	/** Days payable (daily wage rules). */
	payableDays?: number;
	/** Approved lectures (visiting faculty). */
	approvedLectures?: number;
	/** Approved teaching hours (visiting / part-time faculty). */
	approvedHours?: number;
	/** Number of approved overtime hours. */
	overtimeHours?: number;
	/** Explicit rate override. */
	rate?: number;
	/** Extra variables available to formulas. */
	variables?: Record<string, number>;
}

export interface SalaryComponentResult {
	name: string;
	type: 'Earning' | 'Deduction';
	amount: number;
}

export interface SalaryResult {
	earnings: SalaryComponentResult[];
	deductions: SalaryComponentResult[];
	gross: number;
	totalDeductions: number;
	net: number;
}

function round(value: number, digits = 2): number {
	const factor = 10 ** digits;
	return Math.round((value + Number.EPSILON) * factor) / factor;
}

function num(value: unknown): number {
	return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function componentAmount(
	component: SalaryComponent,
	context: SalaryContext,
	basic: number
): number {
	const amount = num(component.amount);
	switch (component.calculation) {
		case 'Fixed':
			return amount;
		case 'Percentage of Basic':
			return round((basic * amount) / 100);
		case 'Per Lecture':
			return round(num(component.amount ?? context.rate) * num(context.approvedLectures));
		case 'Per Hour':
			return round(num(component.amount ?? context.rate) * num(context.approvedHours));
		case 'Formula': {
			if (!component.formula) return 0;
			const variables: Record<string, number> = {
				basic,
				amount,
				lectures: num(context.approvedLectures),
				hours: num(context.approvedHours),
				payableDays: num(context.payableDays),
				overtimeHours: num(context.overtimeHours),
				rate: num(context.rate),
				...context.variables
			};
			return round(evaluateFormula(component.formula, variables));
		}
		default:
			return amount;
	}
}

/** Calculate a full salary breakdown from a list of configured components. */
export function calculateSalary(
	components: SalaryComponent[],
	context: SalaryContext
): SalaryResult {
	const basic = num(context.basic);
	const earnings: SalaryComponentResult[] = [];
	const deductions: SalaryComponentResult[] = [];

	const ordered = [...components].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

	for (const component of ordered) {
		const amount = Math.max(0, componentAmount(component, context, basic));
		if (component.component_type === 'Deduction') {
			deductions.push({ name: component.name, type: 'Deduction', amount });
		} else {
			earnings.push({ name: component.name, type: 'Earning', amount });
		}
	}

	const gross = round(earnings.reduce((sum, item) => sum + item.amount, 0));
	const totalDeductions = round(deductions.reduce((sum, item) => sum + item.amount, 0));
	const net = round(Math.max(0, gross - totalDeductions));

	return { earnings, deductions, gross, totalDeductions, net };
}

/**
 * Convenience for visiting faculty: payable = approved lectures × rate.
 * Returns zero when either value is missing so payroll never fabricates pay.
 */
export function calculateVisitingPay(
	approvedLectures: number | null | undefined,
	ratePerLecture: number | null | undefined
): number {
	const lectures = num(approvedLectures);
	const rate = num(ratePerLecture);
	return round(lectures * rate);
}

/**
 * Calculate payable using a configured formula for a given calculation type.
 * This is the single entry point used by payroll generation.
 */
export function calculateByRule(
	calculationType: SalaryCalculationType,
	context: SalaryContext
): number {
	const basic = num(context.basic);
	switch (calculationType) {
		case 'Monthly':
			return basic;
		case 'Daily':
			return round(basic * num(context.payableDays));
		case 'Hourly':
			return round(num(context.rate) * num(context.approvedHours));
		case 'Per Lecture':
			return calculateVisitingPay(context.approvedLectures, context.rate);
		case 'Fixed':
			return round(num(context.rate));
		case 'Percentage':
			return round((basic * num(context.rate)) / 100);
		case 'Custom Formula':
		default:
			return basic;
	}
}
