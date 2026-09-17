import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { Paginated, QueryOptions } from '$lib/types';
import { MODULES as MODULE_MAP, type ModuleConfig } from '$lib/config/modules';
import * as local from './local-store';

export type StorageMode = 'supabase' | 'local';

export interface RepoScope {
	collegeId: string | null;
	isSuperAdmin: boolean;
}

export interface RepoContext {
	mode: StorageMode;
	supabase: SupabaseClient<Database> | null;
	scope: RepoScope;
}

export class RepositoryError extends Error {
	code: 'NOT_FOUND' | 'CONFLICT' | 'FORBIDDEN' | 'VALIDATION' | 'DATABASE';
	details?: unknown;

	constructor(code: RepositoryError['code'], message: string, details?: unknown) {
		super(message);
		this.name = 'RepositoryError';
		this.code = code;
		this.details = details;
	}
}

function friendlyDbError(error: { code?: string; message?: string }): RepositoryError {
	const message = error?.message ?? 'Database error';
	if (error?.code === '23505' || /duplicate key|unique/i.test(message)) {
		return new RepositoryError('CONFLICT', 'A record with these details already exists.');
	}
	if (error?.code === '23503' || /foreign key/i.test(message)) {
		return new RepositoryError('VALIDATION', 'A linked record is missing or invalid.');
	}
	if (error?.code === '42501' || /row-level security|permission denied/i.test(message)) {
		return new RepositoryError('FORBIDDEN', 'You are not allowed to perform this action.');
	}
	return new RepositoryError('DATABASE', 'The request could not be completed.');
}

function tableSupportsSoftDelete(table: string): boolean {
	const config = Object.values(MODULE_MAP).find((module) => module.table === table);
	return Boolean(config?.softDelete);
}

const TENANT_TABLES = new Set([
	...Object.values(MODULE_MAP).map((module) => module.table),
	'academic_years',
	'departments',
	'programmes',
	'courses',
	'subjects',
	'divisions',
	'batches',
	'timetable_entries',
	'students',
	'student_parents',
	'student_documents',
	'student_academic_records',
	'admissions',
	'admission_documents',
	'student_attendance',
	'employee_attendance',
	'employees',
	'employee_documents',
	'employee_qualifications',
	'employee_experience',
	'employee_leave',
	'exams',
	'exam_subjects',
	'student_exam_registrations',
	'student_marks',
	'results',
	'fee_structures',
	'student_fees',
	'fee_receipts',
	'fee_payments',
	'refunds',
	'scholarships',
	'chart_of_accounts',
	'ledger_entries',
	'journal_entries',
	'income',
	'expenses',
	'salary_structures',
	'payroll',
	'payslips',
	'library_books',
	'library_copies',
	'library_members',
	'library_transactions',
	'library_fines',
	'vendors',
	'purchase_requests',
	'purchase_request_items',
	'quotations',
	'purchase_orders',
	'purchase_order_items',
	'goods_receipts',
	'inventory_items',
	'inventory_stock',
	'inventory_transactions',
	'maintenance_requests',
	'maintenance_assignments',
	'hostels',
	'hostel_buildings',
	'hostel_rooms',
	'hostel_beds',
	'hostel_allocations',
	'vehicles',
	'drivers',
	'transport_routes',
	'transport_stops',
	'transport_allocations',
	'companies',
	'job_openings',
	'placement_applications',
	'placements',
	'internships',
	'certificates',
	'certificate_templates',
	'notices',
	'notifications',
	'files',
	'audit_logs',
	'settings',
	'form_definitions',
	'form_sections',
	'form_fields',
	'form_field_options',
	'form_field_dependencies',
	'form_validations',
	'form_submissions',
	'form_submission_values',
	'table_definitions',
	'table_columns',
	'table_filters',
	'table_actions',
	'custom_modules',
	'custom_module_permissions',
	'approval_workflows',
	'approval_steps',
	'approval_requests',
	'approval_actions',
	'master_data'
]);

function scopedFilters(ctx: RepoContext, table: string, options: QueryOptions) {
	const filters: Record<string, unknown> = { ...(options.filters ?? {}) };
	if (!options.includeDeleted) {
		filters.deleted_at = undefined;
	}
	if (!ctx.scope.isSuperAdmin && ctx.scope.collegeId) {
		filters.college_id = ctx.scope.collegeId;
	}
	return filters;
}

export async function list(
	ctx: RepoContext,
	table: string,
	options: QueryOptions = {}
): Promise<Paginated> {
	const page = Math.max(1, options.page ?? 1);
	const pageSize = Math.min(500, Math.max(1, options.pageSize ?? 25));

	if (ctx.mode === 'local') {
		const filters: Record<string, unknown> = { ...(options.filters ?? {}) };
		if (!ctx.scope.isSuperAdmin && ctx.scope.collegeId) {
			filters.college_id = ctx.scope.collegeId;
		}
		const result = local.queryCollection(table, {
			filters,
			search: options.search,
			searchFields: options.searchFields,
			sort: options.sort,
			page,
			pageSize
		});
		let rows = result.rows;
		if (!options.includeDeleted && tableSupportsSoftDelete(table)) {
			rows = rows.filter((row) => !row.deleted_at);
		}
		return {
			rows,
			total: result.total,
			page: result.page,
			pageSize: result.pageSize,
			pageCount: Math.max(1, Math.ceil(result.total / result.pageSize))
		};
	}

	const supabase = ctx.supabase;
	if (!supabase) throw new RepositoryError('DATABASE', 'Database is not available.');
	const filters = scopedFilters(ctx, table, options);
	let query = supabase.from(table).select('*', { count: 'exact' });

	for (const [key, value] of Object.entries(filters)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) query = query.in(key, value);
		else query = query.eq(key, value);
	}
	if (options.search && options.searchFields?.length) {
		const term = options.search.replace(/[%,()]/g, '');
		query = query.or(options.searchFields.map((field) => `${field}.ilike.%${term}%`).join(','));
	}
	const sort = options.sort ?? { column: 'created_at', ascending: false };
	query = query.order(sort.column, { ascending: sort.ascending, nullsFirst: false });
	const start = (page - 1) * pageSize;
	query = query.range(start, start + pageSize - 1);

	const { data, error, count } = await query;
	if (error) throw friendlyDbError(error);
	const total = count ?? data?.length ?? 0;
	return {
		rows: (data ?? []) as Record<string, unknown>[],
		total,
		page,
		pageSize,
		pageCount: Math.max(1, Math.ceil(total / pageSize))
	};
}

export async function getById(
	ctx: RepoContext,
	table: string,
	id: string
): Promise<Record<string, unknown> | null> {
	if (ctx.mode === 'local') {
		const row = local.findInCollection(table, id);
		if (!row) return null;
		if (!ctx.scope.isSuperAdmin && ctx.scope.collegeId && row.college_id !== ctx.scope.collegeId) {
			throw new RepositoryError('FORBIDDEN', 'You are not allowed to view this record.');
		}
		if (row.deleted_at && !ctx.scope.isSuperAdmin) return null;
		return row;
	}
	const supabase = ctx.supabase;
	if (!supabase) throw new RepositoryError('DATABASE', 'Database is not available.');
	const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle();
	if (error) throw friendlyDbError(error);
	return (data as Record<string, unknown>) ?? null;
}

export async function create(
	ctx: RepoContext,
	table: string,
	payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
	const data = { ...payload };
	if (ctx.mode === 'local') {
		if (ctx.scope.collegeId && data.college_id === undefined && isTenantTable(table)) {
			data.college_id = ctx.scope.collegeId;
		}
		const now = new Date().toISOString();
		data.created_at = data.created_at ?? now;
		data.updated_at = now;
		data.is_active = data.is_active ?? true;
		return local.insertIntoCollection(table, data);
	}
	const supabase = ctx.supabase;
	if (!supabase) throw new RepositoryError('DATABASE', 'Database is not available.');
	if (ctx.scope.collegeId && isTenantTable(table)) data.college_id = ctx.scope.collegeId;
	const { data: inserted, error } = await supabase.from(table).insert(data).select('*').single();
	if (error) throw friendlyDbError(error);
	return inserted as Record<string, unknown>;
}

export async function update(
	ctx: RepoContext,
	table: string,
	id: string,
	patch: Record<string, unknown>
): Promise<Record<string, unknown>> {
	if (ctx.mode === 'local') {
		const existing = local.findInCollection(table, id);
		if (!existing) throw new RepositoryError('NOT_FOUND', 'Record not found.');
		if (!ctx.scope.isSuperAdmin && ctx.scope.collegeId && existing.college_id !== ctx.scope.collegeId) {
			throw new RepositoryError('FORBIDDEN', 'You are not allowed to modify this record.');
		}
		const updated = local.updateInCollection(table, id, { ...patch, updated_at: new Date().toISOString() });
		if (!updated) throw new RepositoryError('NOT_FOUND', 'Record not found.');
		return updated;
	}
	const supabase = ctx.supabase;
	if (!supabase) throw new RepositoryError('DATABASE', 'Database is not available.');
	const { data, error } = await supabase.from(table).update(patch).eq('id', id).select('*').single();
	if (error) throw friendlyDbError(error);
	return data as Record<string, unknown>;
}

export async function remove(
	ctx: RepoContext,
	table: string,
	id: string
): Promise<void> {
	if (ctx.mode === 'local') {
		const existing = local.findInCollection(table, id);
		if (!existing) throw new RepositoryError('NOT_FOUND', 'Record not found.');
		if (!ctx.scope.isSuperAdmin && ctx.scope.collegeId && existing.college_id !== ctx.scope.collegeId) {
			throw new RepositoryError('FORBIDDEN', 'You are not allowed to delete this record.');
		}
		if (tableSupportsSoftDelete(table)) {
			local.updateInCollection(table, id, { deleted_at: new Date().toISOString(), is_active: false });
		} else {
			local.removeFromCollection(table, id);
		}
		return;
	}
	const supabase = ctx.supabase;
	if (!supabase) throw new RepositoryError('DATABASE', 'Database is not available.');
	if (tableSupportsSoftDelete(table)) {
		const { error } = await supabase
			.from(table)
			.update({ deleted_at: new Date().toISOString(), is_active: false })
			.eq('id', id);
		if (error) throw friendlyDbError(error);
		return;
	}
	const { error } = await supabase.from(table).delete().eq('id', id);
	if (error) throw friendlyDbError(error);
}

/** Fetch scoped key/value options for select fields. */
export async function options(
	ctx: RepoContext,
	table: string,
	labelField: string,
	valueField = 'id'
): Promise<{ value: string; label: string }[]> {
	const result = await list(ctx, table, {
		select: `${valueField},${labelField}`,
		pageSize: 500,
		sort: { column: labelField, ascending: true }
	});
	return result.rows
		.map((row) => {
			const label = labelField
				.split('+')
				.map((field) => row[field])
				.filter(Boolean)
				.join(' ');
			return {
				value: String(row[valueField] ?? ''),
				label: label || String(row[valueField] ?? '')
			};
		})
		.filter((option) => option.value);
}

/** Count rows matching a filter (used by dashboards). */
export async function count(
	ctx: RepoContext,
	table: string,
	filters: Record<string, unknown> = {}
): Promise<number> {
	const result = await list(ctx, table, { filters, pageSize: 1 });
	return result.total;
}
