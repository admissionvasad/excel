<script lang="ts">
	import { themeState } from '$lib/stores/theme.svelte';
	import { sidebarState } from '$lib/stores/ui.svelte';
	import type { AuthContext } from '$lib/types';

	let {
		auth,
		current,
		groups
	}: {
		auth: AuthContext | null;
		current?: string;
		groups?: { label: string; items: { key: string; label: string; icon: string }[] }[];
	} = $props();

	function toggleLang() {
		/* i18n toggle handled in layout */
	}
</script>

<header class="topbar" data-testid="topbar">
	<div class="topbar-left">
		<button
			class="btn btn-ghost icon-btn"
			onclick={() => sidebarState.toggle()}
			aria-label="Toggle sidebar"
		>
			<span class="hamburger">☰</span>
		</button>
		<a href="/app" class="topbar-brand"
			>{auth?.fullName ? `${auth.fullName.split(' ')[0]}'s Console` : 'Console'}</a
		>
	</div>
	<div class="topbar-right">
		<button
			class="btn btn-ghost"
			onclick={() => themeState.toggle()}
			aria-label="Toggle dark mode"
			title="Toggle theme"
		>
			{themeState.applied === 'dark' ? '🌙' : '☀️'}
		</button>
		<a href="/app/settings" class="btn btn-ghost icon-btn" aria-label="Settings" title="Settings"
			>⚙️</a
		>
		<a
			href="/logout"
			class="btn btn-ghost"
			aria-label="Sign out"
			title="Sign out"
			data-testid="logout-link">Sign out →</a
		>
	</div>
</header>
