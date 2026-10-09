import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { createFirstSuperAdmin, superAdminExists } from '$lib/server/session';
import type { Actions, PageServerLoad } from './$types';

const setupSchema = z.object({
	full_name: z.string().min(2, 'Enter your full name.'),
	email: z.string().email('Enter a valid email.'),
	password: z.string().min(8, 'Password must be at least 8 characters.')
});

export const load: PageServerLoad = async (event) => {
	if (await superAdminExists(event)) {
		return { available: false };
	}
	return { available: true };
};

export const actions: Actions = {
	default: async (event) => {
		const raw = Object.fromEntries(await event.request.formData());
		const parsed = setupSchema.safeParse(raw);
		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.errors[0]?.message ?? 'Invalid input.',
				email: String(raw.email ?? '')
			});
		}
		const { error } = await createFirstSuperAdmin(event, {
			full_name: parsed.data.full_name,
			email: parsed.data.email,
			password: parsed.data.password
		});
		if (error) return fail(400, { error, email: parsed.data.email });
		redirect(303, '/login');
	}
};
