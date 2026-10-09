import { describe, expect, it } from 'vitest';
import { calculateAttendance, DEFAULT_ATTENDANCE_RULE } from './attendance-engine';

describe('calculateAttendance', () => {
	it('marks a full day as present', () => {
		const result = calculateAttendance(
			[{ time: '09:30' }, { time: '17:30' }],
			DEFAULT_ATTENDANCE_RULE
		);
		expect(result.status).toBe('Present');
		expect(result.workingHours).toBe(8);
		expect(result.overtimeHours).toBe(0);
	});

	it('flags late arrivals beyond the grace period', () => {
		const result = calculateAttendance(
			[{ time: '10:15' }, { time: '18:45' }],
			DEFAULT_ATTENDANCE_RULE
		);
		expect(result.lateMinutes).toBe(35);
		expect(result.status).toBe('Late');
	});

	it('treats insufficient hours as a half day', () => {
		const result = calculateAttendance(
			[{ time: '09:40' }, { time: '12:40' }],
			DEFAULT_ATTENDANCE_RULE
		);
		expect(result.status).toBe('Half Day');
	});

	it('detects a missing punch', () => {
		const result = calculateAttendance([{ time: '09:40' }], DEFAULT_ATTENDANCE_RULE);
		expect(result.isMissingPunch).toBe(true);
		expect(result.status).toBe('Missing Punch');
	});

	it('respects holidays and leave', () => {
		expect(calculateAttendance([], DEFAULT_ATTENDANCE_RULE, { isHoliday: true }).status).toBe(
			'Holiday'
		);
		expect(calculateAttendance([], DEFAULT_ATTENDANCE_RULE, { onLeave: true }).status).toBe(
			'Leave'
		);
		expect(calculateAttendance([], DEFAULT_ATTENDANCE_RULE).status).toBe('Absent');
	});

	it('calculates overtime when working beyond the threshold', () => {
		const result = calculateAttendance(
			[{ time: '09:00' }, { time: '20:00' }],
			DEFAULT_ATTENDANCE_RULE
		);
		expect(result.overtimeHours).toBe(2);
	});
});
