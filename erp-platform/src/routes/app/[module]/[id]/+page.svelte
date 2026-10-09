<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ModuleConfig } from '$lib/types';
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let { data }: { data: { config: ModuleConfig; row: Record<string, unknown> } } = $props();
	const config = $derived(data.config);
	const row = $derived(data.row);
</script>

<svelte:head><title>{config.label} · College ERP</title></svelte:head>

<div class="page-header">
	<div>
		<h1>{config.label}</h1>
		<p class="page-subtitle">View and edit this record.</p>
	</div>
	<a href={`/app/${config.key}`} class="btn btn-ghost">← Back</a>
</div>

<form method="POST" action="?/update" use:enhance>
	{#each config.fields.filter((f) => !f.readonly) as field}
		{#if field.type === 'textarea'}
			<Textarea
				label={field.label}
				name={field.key}
				value={String(row[field.key] ?? '')}
				required={field.required}
			/>
		{:else if field.type === 'number' || field.type === 'decimal' || field.type === 'currency'}
			<Input
				label={field.label}
				name={field.key}
				type="number"
				step="0.01"
				value={String(row[field.key] ?? '')}
				required={field.required}
			/>
		{:else if field.type === 'date' || field.type === 'datetime' || field.type === 'time'}
			<Input
				label={field.label}
				name={field.key}
				type={field.type === 'datetime' ? 'datetime-local' : field.type}
				value={String(row[field.key] ?? '')}
				required={field.required}
			/>
		{:else}
			<Input
				label={field.label}
				name={field.key}
				type={field.type === 'email' ? 'email' : 'text'}
				value={String(row[field.key] ?? '')}
				required={field.required}
			/>
		{/if}
	{/each}

	<div class="form-actions">
		<Button type="submit" variant="primary">Save changes</Button>
		<a href={`/app/${config.key}`} class="btn btn-ghost">Cancel</a>
	</div>
</form>

<form method="POST" action="?/delete" use:enhance>
	<div class="form-actions">
		<button
			type="submit"
			class="btn btn-danger"
			formnovalidate
			onclick={() => confirm('Delete this record permanently?')}>Delete</button
		>
	</div>
</form>
