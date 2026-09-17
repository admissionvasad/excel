import type { RequestEvent } from '@sveltejs/kit';
import { storageMode } from './config';
import * as local from './local-store';

export type AuditAction =
	| 'CREATE'
	| 'UPDATE'
	| 'DELETE'
	| 'LOGIN'
	| 'LOGOUT'
	| 'APPROVE'
	| 'REJECT'
	| 'EXPORT'
	| 'PRINT'
	| 'IMPORT'
	| 'DOWNLOAD'
	| 'UPLOAD';

export interface AuditInput {
	action: AuditAction;
	module: string;
	record_id?: string | null;
	old_data?: unknown;
	new_data?: unknown;
	college_id?: string | null;
	metadata?: Record<string, unknown>;
}

/** Record an audit trail entry for an important action. */
export async function recordAudit(
	event: RequestEvent,
	input: AuditInput
): Promise<void> {
	const auth = event.locals.auth;
	const collegeId = input.college_id ?? auth?.collegeId ?? null;
	const row = {
		action: input.action,
		module: input.module,
		record_id: input.record_id ?? null,
		old_data: input.old_data ? JSON.stringify(input.old_data) : null,
		new_data: input.new_data ? JSON.stringify(input.new_data) : null,
		user_id: auth?.userId ?? null,
		actor_email: auth?.email ?? null,
		college_id: collegeId,
		metadata: input.metadata ?? null
	};
	try {
		if (storageMode === 'local') {
			local.insertIntoCollection('audit_logs', {
				...row,
				created_at: new Date().toISOString()
			});
		} else if (event.locals.supabase) {
			await event.locals.supabase.from('audit_logs').insert(row);
		}
	} catch (error) {
		console.error('Failed to write audit log', error);
	}
}