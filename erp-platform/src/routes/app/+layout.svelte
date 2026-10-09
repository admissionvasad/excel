<script lang="ts">
	import { page } from '$app/state';
	import Sidebar from '$lib/components/shell/Sidebar.svelte';
	import Topbar from '$lib/components/shell/Topbar.svelte';
	import { sidebarState } from '$lib/stores/ui.svelte';
	import type { AuthContext } from '$lib/types';

	let {
		children,
		data
	}: {
		children: import('svelte').Snippet;
		data: { auth: AuthContext };
	} = $props();

	const auth = $derived(data.auth);
	const current = $derived(page.url.pathname.match(/^\/app\/([^/]+)?/)?.[1] ?? '');
</script>

<div class="app-shell" class:sidebar-open={sidebarState.sidebarOpen}>
	<Sidebar {auth} />

	<div class="app-main">
		<Topbar {auth} {current} />
		<main class="app-content">
			{@render children()}
		</main>
	</div>
</div>

<button
	class="sidebar-backdrop"
	class:open={sidebarState.sidebarOpen}
	aria-label="Close sidebar"
	onclick={() => sidebarState.close()}
></button>
