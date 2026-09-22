<script lang="ts">
	import { page } from '$app/state';
	import { MODULES } from '$lib/config/modules';
	import type { AuthContext } from '$lib/types';
	import { hasPermission } from '$lib/config/permissions';
	import { sidebarState } from '$lib/stores/ui.svelte';

	let { auth }: { auth: AuthContext | null } = $props();

	const groups = $derived.by(() => {
		const map = new Map<string, { key: string; label: string; icon: string }[]>();
		for (const mod of Object.values(MODULES)) {
			if (mod.system) continue;
			if (auth && !auth.isSuperAdmin && !hasPermission(auth, `${mod.key}:view`)) continue;
			const key = mod.group ?? 'General';
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push({ key: mod.key, label: mod.label, icon: mod.icon ?? '📁' });
		}
		return [...map.entries()];
	});

	const current = $derived(page.url.pathname.match(/^\/app\/([^/]+)/)?.[1] ?? '');
	const collegeName = $derived(auth?.fullName ? 'Multi-College ERP' : 'College ERP');
</script>

<aside class="sidebar" class:open={sidebarState.sidebarOpen} data-testid="app-sidebar">
	<div class="sidebar-brand">
		<span class="brandmark">🎓</span>
		<div>
			<div class="brand-name">College ERP</div>
			<div class="brand-sub">{collegeName}</div>
		</div>
	</div>

	<nav class="sidebar-nav" aria-label="Main navigation">
		{#each groups as [group, items]}
			<div class="nav-group" data-testid={`nav-group-${group}`}>
				<div class="nav-group-label">{group}</div>
				{#each items as item}
					<a
						href={`/app/${item.key}`}
						class="nav-item"
						class:active={current === item.key}
						aria-current={current === item.key ? 'page' : undefined}
						data-testid={`nav-${item.key}`}
					>
						<span class="nav-icon">{item.icon}</span>
						<span class="nav-label">{item.label}</span>
					</a>
				{/each}
			</div>
		{/each}
	</nav>

	<div class="sidebar-footer">
		<a href="/app" class="nav-item" class:active={!current}>
			<span class="nav-icon">🏠</span>
			<span class="nav-label">Dashboard</span>
		</a>
	</div>
</aside>

{#if sidebarState.sidebarOpen}
	<button
		class="sidebar-backdrop"
		aria-label="Close menu"
		onclick={() => sidebarState.close()}
	></button>
{/if}
