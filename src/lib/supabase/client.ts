import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import type { Database } from '$lib/types/database';

let browserClient: SupabaseClient<Database> | null = null;

export function getPublicConfig() {
	return {
		url: (env.PUBLIC_SUPABASE_URL ?? '').trim(),
		anonKey: (env.PUBLIC_SUPABASE_ANON_KEY ?? '').trim(),
		appName: (env.PUBLIC_APP_NAME ?? 'College ERP').trim()
	};
}

export function isSupabaseConfigured(): boolean {
	const { url, anonKey } = getPublicConfig();
	return Boolean(url && anonKey);
}

/** Lazily create a singleton browser Supabase client. */
export function createBrowserSupabaseClient(): SupabaseClient<Database> {
	const { url, anonKey } = getPublicConfig();
	if (!url || !anonKey) {
		throw new Error('Supabase is not configured. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.');
	}
	if (!browserClient) {
		browserClient = createBrowserClient<Database>(url, anonKey);
	}
	return browserClient;
}
