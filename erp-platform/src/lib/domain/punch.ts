/**
 * Biometric punch normalisation.
 *
 * Vendors expose wildly different payloads. Every connector is expected to
 * translate its raw record into a normalised punch shape before it reaches the
 * attendance engine. This function accepts common aliases so new vendors can be
 * onboarded without changing downstream code.
 */

export interface NormalizedPunch {
	biometricEmployeeId: string;
	punchDate: string;
	punchTime: string;
	punchType: 'IN' | 'OUT';
	machineId: string | null;
	rawData: string | null;
}

type RawPunch = Record<string, unknown>;

function firstString(source: RawPunch, keys: string[]): string | null {
	for (const key of keys) {
		const value = source[key];
		if (typeof value === 'string' && value.trim()) return value.trim();
		if (typeof value === 'number') return String(value);
	}
	return null;
}

function extractDate(value: string | null): string | null {
	if (!value) return null;
	const match = /(\d{4})-(\d{2})-(\d{2})/.exec(value);
	if (match) return `${match[1]}-${match[2]}-${match[3]}`;
	const dmy = /(\d{1,2})[/-](\d{1,2})[/-](\d{4})/.exec(value);
	if (dmy) {
		const day = dmy[1].padStart(2, '0');
		const month = dmy[2].padStart(2, '0');
		return `${dmy[3]}-${month}-${day}`;
	}
	return null;
}

function extractTime(value: string | null): string | null {
	if (!value) return null;
	const match = /(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(value);
	if (!match) return null;
	const hours = match[1].padStart(2, '0');
	const minutes = match[2];
	const seconds = match[3] ?? '00';
	return `${hours}:${minutes}:${seconds}`;
}

/**
 * Normalise an arbitrary vendor punch payload.
 * Throws when the employee id or timestamp cannot be determined.
 */
export function normalizePunch(raw: RawPunch): NormalizedPunch {
	const biometricEmployeeId = firstString(raw, [
		'biometricEmployeeId',
		'biometric_id',
		'employee_id',
		'employeeId',
		'user_id',
		'userId',
		'pin',
		'enroll_id'
	]);

	const timestamp =
		firstString(raw, ['punch_datetime', 'timestamp', 'datetime', 'punch_time', 'time', 'date']) ??
		'';
	const punchDate =
		extractDate(timestamp) ?? extractDate(firstString(raw, ['punchDate', 'date']) ?? '');
	const punchTime =
		extractTime(timestamp) ?? extractTime(firstString(raw, ['punchTime', 'time']) ?? '');

	if (!biometricEmployeeId) throw new Error('Punch is missing an employee identifier.');
	if (!punchDate || !punchTime) throw new Error('Punch is missing a valid date/time.');

	const typeRaw = firstString(raw, ['punchType', 'punch_type', 'type', 'status', 'direction']);
	const normalizedType = (typeRaw ?? '').toUpperCase();
	const punchType: 'IN' | 'OUT' =
		normalizedType.includes('OUT') || normalizedType === '1' ? 'OUT' : 'IN';

	return {
		biometricEmployeeId,
		punchDate,
		punchTime,
		punchType,
		machineId: firstString(raw, ['machineId', 'machine_id', 'device_id', 'machine']),
		rawData: typeof raw === 'string' ? raw : JSON.stringify(raw)
	};
}

/** Normalise a batch, collecting invalid records instead of aborting. */
export function normalizePunchBatch(rows: RawPunch[]): {
	punches: NormalizedPunch[];
	errors: Array<{ index: number; message: string }>;
} {
	const punches: NormalizedPunch[] = [];
	const errors: Array<{ index: number; message: string }> = [];
	rows.forEach((row, index) => {
		try {
			punches.push(normalizePunch(row));
		} catch (error) {
			errors.push({ index, message: error instanceof Error ? error.message : 'Invalid punch.' });
		}
	});
	return { punches, errors };
}
