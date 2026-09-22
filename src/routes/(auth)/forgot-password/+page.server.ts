import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { requestPasswordReset } from '$lib/server/session';
import type { Actions } from './$types';

const forgotSchema = z.object({ email: z.string().email('Enter a valid email.') });

export const actions: Actions = {
	default: async (event) => {
		const raw = Object.fromEntries(await event.request.formData());
		const parsed = forgotSchema.safeParse(raw);
		if (!parsed.success) {
			return fail(400, { error: parsed.error.errors[0]?.message ?? 'Invalid email.', email: '' });
		}
		const { error: resetError, sent } = await requestPasswordReset(event, parsed.data.email);
		if (resetError) return fail(400, { error: resetError, email: parsed.data.email });
		return { sent: true, email: parsed.data.email };
	}
};
