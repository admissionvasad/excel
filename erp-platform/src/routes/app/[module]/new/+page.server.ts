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

	const optionMap: Record<string, { value: string; label: string }[]> = {};
	for (const field of config.fields) {
		if (!field.optionSource) continue;
		const source = MODULES[field.optionSource];
		if (!source) continue;
		optionMap[field.key] = await repo.options(ctx, source.table, source.titleField);
	}

	return { auth, config, optionMap };
};

export const actions: Actions = {
	default: async (event) => {
		const auth = requireAuth(event);
		const ctx = repoContext(event);
		const config = MODULES[event.params.module];
		if (!config) throw error(404, 'Module not found.');

		const raw = Object.fromEntries(await event.request.formData());
		const row = await repo.create(ctx, config.table, {
			...raw,
			college_id: ctx.scope.collegeId ?? null
		});
		redirect(303, `/app/${config.key}/${row.id}`);
	}
};
