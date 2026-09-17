import type { Handle, HandleServerError } from '@sveltejs/kit';
import { storageMode } from '$lib/server/config';
import { createAdminSupabaseClient, createServerSupabaseClient, loadAuthContext } from '$lib/server/session';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.storageMode = storageMode;

	if (storageMode === 'supabase') {
		event.locals.supabase = createServerSupabaseClient(event);
		event.locals.supabaseAdmin = createAdminSupabaseClient();
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		event.locals.session = session;
		event.locals.user = session?.user ?? null;
	} else {
		event.locals.supabase = null;
		event.locals.supabaseAdmin = null;
		event.locals.session = null;
		event.locals.user = null;
	}

	event.locals.auth = await loadAuthContext(event, event.locals.supabase);

	const response = await resolve(event);
	return response;
};

export const handleError: HandleServerError = ({ error, event }) => {
	console.error('Unhandled error on', event.url.pathname, error);
	const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
	return { message };
};