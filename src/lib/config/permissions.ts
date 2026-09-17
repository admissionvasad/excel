import { PERMISSION_ACTIONS, ROLES, type AuthContext, type Role } from '$lib/types';
import { MODULES } from '$lib/config/modules';

export const ALL_PERMISSION_CODES = Object.keys(MODULES).flatMap((module) =>
	PERMISSION_ACTIONS.map((action) => `${module}:${action}`)
);

const CODES = new Set(ALL_PERMISSION_CODES);

function codesFor(modules: string[], actions: string[]): string[] {
	return ALL_PERMISSION_CODES.filter((code) => {
		const [mod, action] = code.split(':');
		return modules.includes(mod) && actions.includes(action);
	});
}

const ACADEMICS = ['academic_years', 'departments', 'programmes', 'courses', 'subjects', 'divisions', 'timetable_entries'];
const ATTENDANCE = ['student_attendance', 'employee_attendance'];
const EXAMINATION = ['exams', 'student_marks', 'results'];
const FEES = ['student_fees', 'fee_structures', 'fee_payments', 'scholarships', 'chart_of_accounts', 'ledger_entries', 'expenses'];
const HR = ['employees', 'employee_leave', 'salary_structures', 'payroll'];
const LIBRARY = ['library_books', 'library_transactions'];
const PURCHASE = ['vendors', 'purchase_requests', 'purchase_orders'];
const FACILITIES = ['maintenance_requests', 'hostels', 'hostel_allocations', 'vehicles', 'transport_routes', 'transport_allocations'];
const PLACEMENT = ['companies', 'placements', 'internships', 'certificates'];

const READ_WRITE = ['view', 'create', 'edit', 'delete'];
const READ = ['view'];
const READ_EXPORT = ['view', 'export', 'print', 'download'];

/** Static permission matrix. Mirrors the seeded role_permissions table and is
 *  used by the local fallback and for quick client-side checks. */
const ROLE_MATRIX: Record<Role, string[]> = {
	SUPER_ADMIN: [...CODES],
	COLLEGE_ADMIN: [...CODES],
	PRINCIPAL: [...CODES],
	VICE_PRINCIPAL: [...CODES],
	REGISTRAR: [...CODES],
	HOD: [
		...codesFor(['students', ...ACADEMICS, ...ATTENDANCE, ...EXAMINATION, ...LIBRARY, 'employee_leave', 'approval_requests', 'notices'], ['view', 'create', 'edit', 'approve', 'reject', 'export', 'print', 'download'])
	],
	ACADEMIC_ADMIN: codesFor([...ACADEMICS, 'students', 'exams', 'results'], ['view', 'create', 'edit', 'delete', 'export', 'print', 'import', 'approve', 'reject']),
	ADMISSION_ADMIN: codesFor(['admissions', 'students', 'programmes', 'departments', 'fee_payments', 'student_fees'], ['view', 'create', 'edit', 'delete', 'export', 'print', 'import', 'approve', 'reject', 'upload']),
	FACULTY: codesFor(['students', 'student_attendance', 'student_marks', 'timetable_entries', 'subjects', ...LIBRARY, 'employee_leave', 'notices'], ['view', 'create', 'edit', 'export', 'print', 'download']),
	ACCOUNTANT: codesFor([...FEES, 'payroll'], ['view', 'create', 'edit', 'export', 'print', 'approve', 'reject', 'download']),
	HR_ADMIN: codesFor([...HR, ...ATTENDANCE, 'approval_requests'], ['view', 'create', 'edit', 'delete', 'export', 'print', 'import', 'approve', 'reject', 'upload', 'download']),
	LIBRARIAN: codesFor([...LIBRARY], ['view', 'create', 'edit', 'delete', 'export', 'print', 'import', 'download']),
	STORE_KEEPER: codesFor(['inventory_items', 'inventory_transactions'], ['view', 'create', 'edit', 'delete', 'export', 'print', 'import']),
	PURCHASE_ADMIN: codesFor([...PURCHASE, 'inventory_items'], ['view', 'create', 'edit', 'delete', 'export', 'print', 'approve', 'reject']),
	MAINTENANCE_ADMIN: codesFor(['maintenance_requests', 'maintenance_assignments'], ['view', 'create', 'edit', 'delete', 'export', 'print', 'approve', 'reject']),
	TRANSPORT_ADMIN: codesFor(['vehicles', 'transport_routes', 'transport_allocations'], ['view', 'create', 'edit', 'delete', 'export', 'print']),
	HOSTEL_ADMIN: codesFor(['hostels', 'hostel_allocations'], ['view', 'create', 'edit', 'delete', 'export', 'print']),
	PLACEMENT_ADMIN: codesFor([...PLACEMENT], ['view', 'create', 'edit', 'delete', 'export', 'print']),
	STUDENT: codesFor(['students', 'student_attendance', 'results', 'student_fees', 'fee_payments', 'timetable_entries', ...LIBRARY, 'notices', 'certificates'], ['view', 'download', 'print']),
	PARENT: codesFor(['students', 'student_attendance', 'results', 'student_fees', 'timetable_entries', 'notices'], ['view', 'download', 'print'])
};

export function rolePermissionCodes(role: Role): string[] {
	return [...new Set(ROLE_MATRIX[role] ?? [])];
}

export function everyPermissionCode(): string[] {
	return [...CODES];
}

/** Enforce wild-card super-admin access and check the permission array. */
export function hasPermission(auth: AuthContext | null | undefined, code: string): boolean {
	if (!auth) return false;
	if (auth.isSuperAdmin) return true;
	return auth.permissions.includes(code);
}

export function anyPermission(auth: AuthContext | null | undefined, codes: string[]): boolean {
	return codes.some((code) => hasPermission(auth, code));
}

export { ROLES };