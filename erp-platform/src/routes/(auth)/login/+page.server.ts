import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { signIn } from '$lib/server/session';
import type { Actions, PageServerLoad } from './$types';

const loginSchema = z.object({
	email: z.string().email('Enter a valid email.'),
	password: z.string().min(1, 'Password is required.')
});

export const load: PageServerLoad = async (event) => {
	const auth = event.locals.auth;
	if (auth) redirect(303, '/app');
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const raw = Object.fromEntries(await event.request.formData());
		const parsed = loginSchema.safeParse(raw);
		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.errors[0]?.message ?? 'Invalid input.',
				email: String(raw.email ?? '')
			});
		}
		const { auth, error } = await signIn(event, parsed.data.email, parsed.data.password);
		if (error || !auth) {
			return fail(401, { error: error ?? 'Invalid email or password.', email: parsed.data.email });
		}
		redirect(303, '/app');
	}
};
