import type { RequestEvent } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { AuthContext, Role } from '$lib/types';
import { rolePermissionCodes } from '$lib/config/permissions';
import {
	SESSION_COOKIE,
	SUPABASE_ANON_KEY,
	SUPABASE_SERVICE_ROLE_KEY,
	SUPABASE_URL,
	storageMode
} from './config';
import * as local from './local-store';

export function createServerSupabaseClient(event: RequestEvent): SupabaseClient<Database> {
	return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				for (const { name, value, options } of cookiesToSet) {
					event.cookies.set(name, value, { ...options, path: '/' });
				}
			}
		}
	});
}

export function createAdminSupabaseClient(): SupabaseClient<Database> | null {
	if (!SUPABASE_SERVICE_ROLE_KEY) return null;
	return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		auth: { autoRefreshToken: false, persistSession: false }
	});
}

async function localAuthContext(event: RequestEvent): Promise<AuthContext | null> {
	const token = event.cookies.get(SESSION_COOKIE);
	const user = local.getSessionUser(token);
	if (!user) return null;
	const collegeIds =
		user.role === 'SUPER_ADMIN'
			? local.collection('colleges').map((college) => String(college.id))
			: user.college_id
				? [user.college_id]
				: [];
	return {
		userId: user.id,
		email: user.email,
		fullName: user.full_name,
		role: user.role,
		collegeId: user.college_id,
		collegeIds,
		isSuperAdmin: user.role === 'SUPER_ADMIN',
		permissions: rolePermissionCodes(user.role)
	};
}

async function supabaseAuthContext(
	supabase: SupabaseClient<Database>
): Promise<AuthContext | null> {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return null;

	const { data: profile } = await supabase
		.from('profiles')
		.select('full_name, role, college_id')
		.eq('id', user.id)
		.maybeSingle();

	const role = (profile?.role as Role) ?? 'COLLEGE_ADMIN';
	const collegeId = (profile?.college_id as string | null) ?? null;

	let permissions: string[] = [];
	try {
		const { data } = await supabase.rpc('get_user_permissions');
		permissions = Array.isArray(data) ? (data as string[]) : [];
	} catch {
		permissions = rolePermissionCodes(role);
	}

	let collegeIds: string[] = [];
	try {
		const { data } = await supabase.from('colleges').select('id');
		collegeIds = (data ?? []).map((row) => String(row.id));
	} catch {
		collegeIds = collegeId ? [collegeId] : [];
	}
	if (role !== 'SUPER_ADMIN') {
		collegeIds = collegeId ? [collegeId] : [];
	}

	return {
		userId: user.id,
		email: user.email,
		fullName: (profile?.full_name as string) ?? user.email ?? 'User',
		role,
		collegeId,
		collegeIds,
		isSuperAdmin: role === 'SUPER_ADMIN',
		permissions
	};
}

export async function loadAuthContext(
	event: RequestEvent,
	supabase?: SupabaseClient<Database> | null
): Promise<AuthContext | null> {
	if (storageMode === 'local' || !supabase) {
		return localAuthContext(event);
	}
	try {
		return await supabaseAuthContext(supabase);
	} catch {
		return null;
	}
}

/** Sign in and set a session; returns the auth context on success. */
export async function signIn(
	event: RequestEvent,
	email: string,
	password: string
): Promise<{ auth: AuthContext | null; error: string | null }> {
	if (storageMode === 'local' || !SUPABASE_URL) {
		const user = local.authenticate(email, password);
		if (!user) return { auth: null, error: 'Invalid email or password.' };
		const token = local.createSession(user.id);
		event.cookies.set(SESSION_COOKIE, token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.COOKIE_SECURE === 'true'
		});
		return { auth: await localAuthContext(event), error: null };
	}
	const supabase = createServerSupabaseClient(event);
	const { error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) {
		if (error.status === 400 || /invalid login credentials/i.test(error.message)) {
			return { auth: null, error: 'Invalid email or password.' };
		}
		return { auth: null, error: error.message };
	}
	return { auth: await supabaseAuthContext(supabase), error: null };
}

export async function signOut(event: RequestEvent) {
	if (storageMode === 'local') {
		local.deleteSession(event.cookies.get(SESSION_COOKIE));
		event.cookies.delete(SESSION_COOKIE, { path: '/' });
		return;
	}
	const supabase = createServerSupabaseClient(event);
	await supabase.auth.signOut();
}

/** Request a password reset email (Supabase) or reset via security question-less flow. */
export async function requestPasswordReset(event: RequestEvent, email: string) {
	const supabase = createServerSupabaseClient(event);
	if (storageMode === 'local') {
		const user = local.findUserByEmail(email);
		return { error: user ? null : 'No account found for this email.', sent: Boolean(user) };
	}
	const { error } = await supabase.auth.resetPasswordForEmail(email);
	return { error: null, sent: !error };
}

/** Determine whether a first SUPER_ADMIN can still be created (no super admin exists). */
export async function superAdminExists(event: RequestEvent): Promise<boolean> {
	if (storageMode === 'local') {
		return local.collection('users').some((user) => user.role === 'SUPER_ADMIN');
	}
	const admin = createAdminSupabaseClient();
	if (!admin) return true;
	const { data, error } = await admin
		.from('profiles')
		.select('id')
		.eq('role', 'SUPER_ADMIN')
		.limit(1)
		.maybeSingle();
	return !error && Boolean(data);
}

export async function createFirstSuperAdmin(event: RequestEvent, input: {
	email: string;
	password: string;
	full_name: string;
}): Promise<{ error: string | null }> {
	if (await superAdminExists(event)) {
		return { error: 'A super admin already exists.' };
	}
	if (storageMode === 'local') {
		local.createUser({
			email: input.email,
			full_name: input.full_name,
			role: 'SUPER_ADMIN',
			college_id: null,
			password: input.password
		});
		return { error: null };
	}
	const admin = createAdminSupabaseClient();
	if (!admin) return { error: 'Supabase is not configured.' };
	const { data: authData, error: signUpError } = await admin.auth.admin.createUser({
		email: input.email,
		password: input.password,
		email_confirm: true,
		user_metadata: { full_name: input.full_name }
	});
	if (signUpError) return { error: signUpError.message };
	const userId = authData?.user?.id;
	if (!userId) return { error: 'Could not create user.' };
	const { error: profileError } = await admin
		.from('profiles')
		.insert({ id: userId, full_name: input.full_name, role: 'SUPER_ADMIN', college_id: null });
	if (profileError) return { error: profileError.message };
	return { error: null };
}