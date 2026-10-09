<script lang="ts">
	import { page } from '$app/state';
	let {
		data
	}: {
		data: {
			auth: { fullName: string; role: string };
			cards: { label: string; icon: string; total: number; href: string }[];
			quick: { key: string; label: string; icon: string; href: string }[];
		};
	} = $props();
</script>

<div class="app-content-inner">
	<header class="page-header">
		<div>
			<p class="eyebrow">Dashboard</p>
			<h1>Welcome back, {data.auth.fullName}</h1>
			<p class="page-subtitle">Your multi-college ERP at a glance.</p>
		</div>
	</header>

	<section class="grid cols-4">
		{#each data.cards as card}
			<a href={card.href} class="stat card">
				<div class="stat-icon">{card.icon}</div>
				<div class="stat-value">{card.total}</div>
				<div class="stat-label">{card.label}</div>
			</a>
		{/each}
	</section>

	<section class="dashboard-section">
		<h2>Quick launch</h2>
		<div class="grid cols-4">
			{#each data.quick as q}
				<a href={q.href} class="action-card card">
					<span class="action-icon">{q.icon}</span>
					<span class="action-label">{q.label}</span>
				</a>
			{/each}
		</div>
	</section>
</div>
