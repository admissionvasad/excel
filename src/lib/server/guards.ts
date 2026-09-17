import { error, type RequestEvent } from '@sveltejs/kit';
import type { AuthContext } from '$lib/types';
import { hasPermission } from '$lib/config/permissions';
import { storageMode } from './config';
import type { RepoContext } from './repository';

export function requireAuth(event: RequestEvent): AuthContext {
	const auth = event.locals.auth;
	if (!auth || !auth.userId) {
		throw error(401, 'Please sign in to continue.');
	}
	return auth;
}

export function requirePermission(event: RequestEvent, code: string): AuthContext {
	const auth = requireAuth(event);
	if (!hasPermission(auth, code)) {
		throw error(403, 'You do not have permission to perform this action.');
	}
	return auth;
}

export function requireCollege(event: RequestEvent): string {
	const auth = requireAuth(event);
	if (auth.isSuperAdmin) {
		const selected = event.url.searchParams.get('college_id') ?? event.cookies.get('erp_college');
		if (selected) return selected;
		throw error(400, 'Please select a college.');
	}
	if (!auth.collegeId) throw error(400, 'No college is associated with your account.');
	return auth.collegeId;
}

export function repoContext(event: RequestEvent): RepoContext {
	const auth = event.locals.auth;
	return {
		mode: storageMode,
		supabase: event.locals.supabase,
		scope: {
			collegeId: auth?.collegeId ?? auth?.collegeIds?.[0] ?? null,
			isSuperAdmin: auth?.isSuperAdmin ?? false
		}
	};
}