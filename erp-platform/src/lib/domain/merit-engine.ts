/**
 * Dynamic merit engine.
 *
 * Business rules are NOT hard-coded: administrators select which subjects count
 * towards the aggregate and (optionally) supply a formula that combines the
 * selected-subject total with entrance/examination scores.
 */

export interface SubjectMark {
	/** Subject key or name, matched case-insensitively. */
	subject: string;
	/** Marks obtained. Null/undefined is treated as absent. */
	marks: number | null;
	/** Maximum marks for this subject (default 100). */
	maxMarks?: number | null;
}

export interface MeritContext {
	subjects: SubjectMark[];
	/** Subjects that participate in the aggregate. Empty = all subjects. */
	selectedSubjects: string[];
	/** Entrance / GUJCET marks. */
	entranceMarks?: number | null;
	entranceMax?: number | null;
	/** Weight of the chosen aggregate in the final index (0..1). Default 0.6. */
	entranceWeight?: number;
	/**
	 * Optional formula. Supported variables:
	 * `total` (selected subject total), `maxTotal`, `percentage`,
	 * `entrance` (normalised 0..100), `entranceRaw`.
	 * Example: `percentage * 0.6 + entrance * 0.4`
	 */
	formula?: string | null;
}

export interface MeritResult {
	selectedTotal: number;
	selectedMaxTotal: number;
	/** Aggregate percentage (0..100) across the selected subjects. */
	percentage: number;
	/** Entrance percentage normalised to 0..100. */
	entrancePercentage: number | null;
	/** Final merit index used for ranking. */
	meritIndex: number;
	/** Subject-level breakdown for auditing. */
	breakdown: Array<{ subject: string; marks: number; maxMarks: number; percentage: number }>;
}

function isPresent(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}

function round(value: number, digits = 2): number {
	const factor = 10 ** digits;
	return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Evaluate a restricted arithmetic expression. Only numbers, the supplied
 * variables, parentheses and the operators + - * / ( ) are permitted. This
 * keeps administrator-authored formulas safe to execute.
 */
export function evaluateFormula(formula: string, variables: Record<string, number>): number {
	const tokens = formula.match(/[A-Za-z_][A-Za-z0-9_]*|\d+(?:\.\d+)?|[+\-*/()]/g);
	if (!tokens) throw new Error('Empty or invalid formula.');

	let index = 0;
	const peek = () => tokens[index];
	const next = () => tokens[index++];

	function parseExpression(): number {
		let value = parseTerm();
		while (peek() === '+' || peek() === '-') {
			const op = next();
			const rhs = parseTerm();
			value = op === '+' ? value + rhs : value - rhs;
		}
		return value;
	}

	function parseTerm(): number {
		let value = parseFactor();
		while (peek() === '*' || peek() === '/') {
			const op = next();
			const rhs = parseFactor();
			if (op === '/') {
				if (rhs === 0) throw new Error('Division by zero in formula.');
				value = value / rhs;
			} else {
				value = value * rhs;
			}
		}
		return value;
	}

	function parseFactor(): number {
		const token = next();
		if (token === '(') {
			const value = parseExpression();
			if (next() !== ')') throw new Error('Mismatched parentheses in formula.');
			return value;
		}
		if (token === '-') return -parseFactor();
		if (token === '+') return parseFactor();
		if (/^\d/.test(token)) return Number(token);
		if (Object.prototype.hasOwnProperty.call(variables, token)) return variables[token];
		throw new Error(`Unknown variable in formula: ${token}`);
	}

	const result = parseExpression();
	if (index !== tokens.length) throw new Error('Unexpected token in formula.');
	if (!Number.isFinite(result)) throw new Error('Formula did not produce a finite number.');
	return result;
}

/** Sum the selected subjects, ignoring absent marks. */
export function computeSelectedSubjectTotal(
	subjects: SubjectMark[],
	selectedSubjects: string[]
): { total: number; maxTotal: number; percentage: number; breakdown: MeritResult['breakdown'] } {
	const wanted = new Set(selectedSubjects.map((s) => s.trim().toLowerCase()).filter(Boolean));
	const chosen = subjects.filter(
		(subject) => wanted.size === 0 || wanted.has(subject.subject.trim().toLowerCase())
	);

	let total = 0;
	let maxTotal = 0;
	const breakdown: MeritResult['breakdown'] = [];
	for (const subject of chosen) {
		const maxMarks = isPresent(subject.maxMarks) && subject.maxMarks > 0 ? subject.maxMarks : 100;
		const marks = isPresent(subject.marks) ? subject.marks : 0;
		total += marks;
		maxTotal += maxMarks;
		breakdown.push({
			subject: subject.subject,
			marks,
			maxMarks,
			percentage: round(maxMarks > 0 ? (marks / maxMarks) * 100 : 0)
		});
	}

	return {
		total: round(total),
		maxTotal,
		percentage: round(maxTotal > 0 ? (total / maxTotal) * 100 : 0),
		breakdown
	};
}

/** Compute the final dynamic merit result. */
export function computeDynamicMerit(context: MeritContext): MeritResult {
	const aggregate = computeSelectedSubjectTotal(context.subjects, context.selectedSubjects);
	const entranceMax =
		isPresent(context.entranceMax) && context.entranceMax > 0 ? context.entranceMax : 100;
	const entrancePercentage =
		isPresent(context.entranceMarks) && context.entranceMarks > 0
			? round(Math.min(100, (context.entranceMarks / entranceMax) * 100))
			: null;

	const variables: Record<string, number> = {
		total: aggregate.total,
		maxTotal: aggregate.maxTotal,
		percentage: aggregate.percentage,
		entrance: entrancePercentage ?? 0,
		entranceRaw: isPresent(context.entranceMarks) ? context.entranceMarks : 0
	};

	let meritIndex: number;
	if (context.formula && context.formula.trim()) {
		meritIndex = round(evaluateFormula(context.formula, variables));
	} else {
		const weight = context.entranceWeight ?? 0.6;
		meritIndex =
			entrancePercentage == null
				? aggregate.percentage
				: round(entrancePercentage * weight + aggregate.percentage * (1 - weight));
	}

	return {
		selectedTotal: aggregate.total,
		selectedMaxTotal: aggregate.maxTotal,
		percentage: aggregate.percentage,
		entrancePercentage,
		meritIndex,
		breakdown: aggregate.breakdown
	};
}

export interface MeritListRow extends MeritResult {
	applicationNumber: string;
	applicantName: string;
	category?: string | null;
	admissionType?: string | null;
	eligibility?: boolean;
}

/** Rank applicants: eligible first, then by descending merit index. */
export function rankMeritList(rows: MeritListRow[]): Array<MeritListRow & { rank: number }> {
	return [...rows]
		.sort((a, b) => {
			if (a.eligibility === false && b.eligibility !== false) return 1;
			if (b.eligibility === false && a.eligibility !== false) return -1;
			return b.meritIndex - a.meritIndex;
		})
		.map((row, index) => ({ ...row, rank: index + 1 }));
}
