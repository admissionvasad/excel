import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';

export const SUPABASE_URL = (publicEnv.PUBLIC_SUPABASE_URL ?? '').trim();
export const SUPABASE_ANON_KEY = (publicEnv.PUBLIC_SUPABASE_ANON_KEY ?? '').trim();
export const SUPABASE_SERVICE_ROLE_KEY = (privateEnv.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();

/** When Supabase credentials are absent the app runs on a local JSON store. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const storageMode: 'supabase' | 'local' = isSupabaseConfigured ? 'supabase' : 'local';

export const APP_NAME = (publicEnv.PUBLIC_APP_NAME ?? 'College ERP').trim();
export const ORIGIN = (privateEnv.ORIGIN ?? 'http://localhost:5173').trim();
export const COOKIE_SECURE = (privateEnv.COOKIE_SECURE ?? 'false') === 'true';

/** Development-only local admin credentials used when Supabase is not configured. */
export const LOCAL_ADMIN_EMAIL = (privateEnv.LOCAL_ADMIN_EMAIL ?? 'admin@college-erp.local').trim();
export const LOCAL_ADMIN_PASSWORD = privateEnv.LOCAL_ADMIN_PASSWORD ?? 'admin123';

export const STORAGE_PRIVATE_BUCKET = privateEnv.STORAGE_PRIVATE_BUCKET ?? 'erp-private';
export const STORAGE_PUBLIC_BUCKET = privateEnv.STORAGE_PUBLIC_BUCKET ?? 'erp-public';
export const MAX_UPLOAD_MB = Number(privateEnv.MAX_UPLOAD_MB ?? 10);

export const NOTIFICATION_PROVIDERS = {
	email: {
		provider: privateEnv.NOTIFICATION_EMAIL_PROVIDER ?? '',
		apiKey: privateEnv.NOTIFICATION_EMAIL_API_KEY ?? '',
		from: privateEnv.NOTIFICATION_EMAIL_FROM ?? ''
	},
	sms: {
		provider: privateEnv.NOTIFICATION_SMS_PROVIDER ?? '',
		apiKey: privateEnv.NOTIFICATION_SMS_API_KEY ?? '',
		sender: privateEnv.NOTIFICATION_SMS_SENDER ?? ''
	},
	whatsapp: {
		provider: privateEnv.NOTIFICATION_WHATSAPP_PROVIDER ?? '',
		apiKey: privateEnv.NOTIFICATION_WHATSAPP_API_KEY ?? ''
	}
};

export const SESSION_COOKIE = 'erp_session';
export const DEFAULT_TIMEZONE = 'Asia/Kolkata';
export const DEFAULT_CURRENCY = 'INR';
