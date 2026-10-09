// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import type { AuthContext } from '$lib/types';

declare global {
	namespace App {
		interface Error {
			message: string;
			code?: string;
		}
		interface Locals {
			supabase: SupabaseClient<Database> | null;
			supabaseAdmin: SupabaseClient<Database> | null;
			session: Session | null;
			user: User | null;
			auth: AuthContext | null;
			storageMode: 'supabase' | 'local';
		}
		interface PageData {
			auth?: AuthContext | null;
			storageMode?: 'supabase' | 'local';
		}
		interface PageState {
			[key: string]: unknown;
		}
		interface Platform {
			env?: Record<string, string | undefined>;
		}
	}
}

export {};
