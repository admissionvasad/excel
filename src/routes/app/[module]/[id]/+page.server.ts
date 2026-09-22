import { error, redirect } from '@sveltejs/kit';
import { requireAuth, repoContext } from '$lib/server/guards';
import { MODULES } from '$lib/config/modules';
import * as repo from '$lib/server/repository';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const auth = requireAuth(event);
	const ctx = repoContext(event);
	const config = MODULES[event.params.module];
	if (!config) throw error(404, 'Module not found.');

	const row = await repo.getById(ctx, config.table, event.params.id);
	if (!row) throw error(404, 'Record not found.');

	return { auth, config, row };
};

export const actions: Actions = {
	update: async (event) => {
		const auth = requireAuth(event);
		const ctx = repoContext(event);
		const config = MODULES[event.params.module];
		if (!config) throw error(404, 'Module not found.');

		const raw = Object.fromEntries(await event.request.formData());
		const row = await repo.update(ctx, config.table, event.params.id, raw);
		redirect(303, `/app/${config.key}/${row.id}`);
	},
	delete: async (event) => {
		const auth = requireAuth(event);
		const ctx = repoContext(event);
		const config = MODULES[event.params.module];
		if (!config) throw error(404, 'Module not found.');

		await repo.remove(ctx, config.table, event.params.id);
		redirect(303, `/app/${config.key}`);
	}
};
