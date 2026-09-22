import { MODULES, modulesByGroup } from '$lib/config/modules';
import { requireAuth, repoContext } from '$lib/server/guards';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const auth = requireAuth(event);
	const ctx = repoContext(event);

	const groups = modulesByGroup()
		.map((g) => ({
			group: g.group,
			modules: g.modules
				.filter((m) => !m.system)
				.map((m) => ({ key: m.key, label: m.label, icon: m.icon, group: m.group }))
		}))
		.filter((g) => g.modules.length > 0);

	return { auth, groups, storageMode: ctx.mode };
};
