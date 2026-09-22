import { error } from '@sveltejs/kit';
import { requireAuth, repoContext } from '$lib/server/guards';
import { MODULES } from '$lib/config/modules';
import * as repo from '$lib/server/repository';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const auth = requireAuth(event);
	const ctx = repoContext(event);
	const moduleKey = event.params.module;
	const config = MODULES[moduleKey];
	if (!config) throw error(404, 'Module not found.');

	const url = event.url;
	const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
	const pageSize = Math.min(100, Math.max(10, Number(url.searchParams.get('pageSize') ?? 25)));
	const search = url.searchParams.get('q') ?? '';

	const filters: Record<string, unknown> = {};
	for (const field of config.fields) {
		if (!field.filterable) continue;
		const value = url.searchParams.get(field.key);
		if (value) filters[field.key] = value;
	}

	const result = await repo.list(ctx, config.table, {
		filters,
		search,
		searchFields: config.searchFields,
		sort: config.defaultSort ?? { column: 'created_at', ascending: false },
		page,
		pageSize
	});

	return { auth, config, result };
};
