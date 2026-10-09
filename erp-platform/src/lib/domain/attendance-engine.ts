/**
 * Attendance calculation engine.
 *
 * Given punch records and a configurable attendance rule, derive the daily
 * attendance status, working hours, late minutes, overtime and exceptions.
 */

export type AttendanceStatus =
	| 'Present'
	| 'Absent'
	| 'Half Day'
	| 'Late'
	| 'Leave'
	| 'Holiday'
	| 'Weekly Off'
	| 'Missing Punch'
	| 'On Duty'
	| 'Work From Home';

export interface PunchRecord {
	/** HH:MM or HH:MM:SS */
	time: string;
	/** Optional explicit type; inferred from ordering when omitted. */
	type?: 'IN' | 'OUT';
}

export interface AttendanceRule {
	officeStartTime: string;
	officeEndTime: string;
	graceMinutes: number;
	minimumHours: number;
	halfDayHours: number;
	lateThresholdMinutes: number;
	earlyLeaveThresholdMinutes: number;
	overtimeStartHours: number;
}

export const DEFAULT_ATTENDANCE_RULE: AttendanceRule = {
	officeStartTime: '09:30',
	officeEndTime: '16:30',
	graceMinutes: 10,
	minimumHours: 8,
	halfDayHours: 4,
	lateThresholdMinutes: 15,
	earlyLeaveThresholdMinutes: 15,
	overtimeStartHours: 9
};

export interface AttendanceResult {
	firstPunch: string | null;
	lastPunch: string | null;
	/** Total hours between first IN and last OUT. */
	workingHours: number;
	lateMinutes: number;
	earlyLeaveMinutes: number;
	overtimeHours: number;
	isMissingPunch: boolean;
	status: AttendanceStatus;
}

/** Parse "HH:MM" / "HH:MM:SS" / ISO datetime into minutes since midnight. */
export function toMinutes(value: string | null | undefined): number | null {
	if (!value) return null;
	const match = /(\d{1,2}):(\d{2})/.exec(value);
	if (!match) return null;
	const hours = Number(match[1]);
	const minutes = Number(match[2]);
	if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
	return hours * 60 + minutes;
}

function toHours(minutes: number): number {
	return Math.round((minutes / 60) * 100) / 100;
}

function comparable(punch: PunchRecord) {
	return toMinutes(punch.time) ?? -1;
}

/**
 * Sort punches chronologically and mark the first as IN and the last as OUT.
 * Staff may punch multiple times; only the earliest and latest matter for the
 * daily summary.
 */
export function normalizePunches(punches: PunchRecord[]): PunchRecord[] {
	return [...punches].sort((a, b) => comparable(a) - comparable(b));
}

export function calculateAttendance(
	punches: PunchRecord[],
	rule: AttendanceRule = DEFAULT_ATTENDANCE_RULE,
	options: {
		isHoliday?: boolean;
		isWeeklyOff?: boolean;
		onLeave?: boolean;
		onDuty?: boolean;
		wfh?: boolean;
	} = {}
): AttendanceResult {
	if (options.isHoliday) {
		return emptyResult('Holiday');
	}
	if (options.isWeeklyOff) {
		return emptyResult('Weekly Off');
	}
	if (options.onLeave) {
		return emptyResult('Leave');
	}

	const ordered = normalizePunches(punches).filter((p) => toMinutes(p.time) != null);
	if (ordered.length === 0) {
		return emptyResult('Absent');
	}

	const first = ordered[0];
	const last = ordered.length > 1 ? ordered[ordered.length - 1] : null;
	const firstMinutes = toMinutes(first.time)!;
	const lastMinutes = last ? toMinutes(last.time)! : null;
	const startMinutes = toMinutes(rule.officeStartTime)!;
	const endMinutes = toMinutes(rule.officeEndTime)!;

	const isMissingPunch = ordered.length < 2;
	const workingMinutes = lastMinutes != null ? Math.max(0, lastMinutes - firstMinutes) : 0;
	const workingHours = toHours(workingMinutes);

	const lateMinutes = Math.max(0, firstMinutes - (startMinutes + rule.graceMinutes));
	const earlyLeaveMinutes =
		lastMinutes != null
			? Math.max(0, endMinutes - rule.earlyLeaveThresholdMinutes - lastMinutes)
			: 0;
	const overtimeMinutes = Math.max(0, workingMinutes - rule.overtimeStartHours * 60);
	const overtimeHours = toHours(overtimeMinutes);

	let status: AttendanceStatus;
	if (options.onDuty) status = 'On Duty';
	else if (options.wfh) status = 'Work From Home';
	else if (isMissingPunch) status = 'Missing Punch';
	else if (workingHours < rule.halfDayHours) status = 'Half Day';
	else if (workingHours < rule.minimumHours) status = 'Half Day';
	else if (
		lateMinutes >= rule.lateThresholdMinutes ||
		earlyLeaveMinutes >= rule.earlyLeaveThresholdMinutes
	)
		status = 'Late';
	else status = 'Present';

	return {
		firstPunch: first.time,
		lastPunch: last?.time ?? null,
		workingHours,
		lateMinutes,
		earlyLeaveMinutes,
		overtimeHours,
		isMissingPunch,
		status
	};
}

function emptyResult(status: AttendanceStatus): AttendanceResult {
	return {
		firstPunch: null,
		lastPunch: null,
		workingHours: 0,
		lateMinutes: 0,
		earlyLeaveMinutes: 0,
		overtimeHours: 0,
		isMissingPunch: false,
		status
	};
}
