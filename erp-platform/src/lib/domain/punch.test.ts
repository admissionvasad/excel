import { describe, expect, it } from 'vitest';
import { normalizePunch, normalizePunchBatch } from './punch';

describe('normalizePunch', () => {
	it('normalises a generic vendor payload', () => {
		const punch = normalizePunch({
			biometric_id: 'BIO-101',
			punch_datetime: '2026-09-14 09:32:10',
			direction: 'IN',
			machine_id: 'M-1'
		});
		expect(punch).toMatchObject({
			biometricEmployeeId: 'BIO-101',
			punchDate: '2026-09-14',
			punchTime: '09:32:10',
			punchType: 'IN',
			machineId: 'M-1'
		});
	});

	it('accepts positional/legacy aliases and parses DMY dates', () => {
		const punch = normalizePunch({ pin: 42, date: '14/09/2026', time: '18:05' });
		expect(punch.biometricEmployeeId).toBe('42');
		expect(punch.punchDate).toBe('2026-09-14');
		expect(punch.punchTime).toBe('18:05:00');
	});

	it('throws when the employee id is missing', () => {
		expect(() => normalizePunch({ time: '09:00' })).toThrow(/employee identifier/);
	});
});

describe('normalizePunchBatch', () => {
	it('collects valid punches and reports invalid rows', () => {
		const { punches, errors } = normalizePunchBatch([
			{ biometric_id: 'A', timestamp: '2026-09-14 09:00:00' },
			{ timestamp: '2026-09-14 09:00:00' }
		]);
		expect(punches).toHaveLength(1);
		expect(errors).toHaveLength(1);
		expect(errors[0].index).toBe(1);
	});
});
