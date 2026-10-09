import { requireAuth, repoContext } from '$lib/server/guards';
import { MODULES } from '$lib/config/modules';
import * as repo from '$lib/server/repository';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const auth = requireAuth(event);
	const ctx = repoContext(event);

	const dashboard = [
		{ key: 'students', table: 'students', label: 'Students', icon: '🎓' },
		{ key: 'admissions', table: 'admissions', label: 'Applications', icon: '📋' },
		{ key: 'employees', table: 'employees', label: 'Employees', icon: '👥' },
		{ key: 'fee_payments', table: 'fee_payments', label: 'Fee Payments', icon: '💰' }
	];

	const positive: Record<string, unknown> = { deleted_at: undefined };
	const cards = [];
	for (const item of dashboard) {
		const total = await repo.count(ctx, item.table, positive);
		cards.push({
			...item,
			total,
			href: `/app/${item.key}`
		});
	}

	const quick = Object.values(MODULES)
		.filter((m) => !m.system)
		.slice(0, 8)
		.map((m) => ({
			key: m.key,
			label: m.label,
			icon: m.icon ?? '📁',
			href: `/app/${m.key}`
		}));

	return { auth, cards, quick };
};
