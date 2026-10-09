<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ModuleConfig } from '$lib/types';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let {
		data
	}: {
		data: {
			config: ModuleConfig;
			optionMap: Record<string, { value: string; label: string }[]>;
		};
	} = $props();
	const config = $derived(data.config);
	const optionMap = $derived(data.optionMap);
</script>

<svelte:head><title>New {config.label} · College ERP</title></svelte:head>

<div class="page-header">
	<div>
		<h1>New {config.label}</h1>
		<p class="page-subtitle">{config.description}</p>
	</div>
</div>

<form method="POST" use:enhance>
	{#each config.fields as field}
		{#if field.type === 'textarea'}
			<Textarea
				label={field.label}
				name={field.key}
				required={field.required}
				placeholder={field.placeholder}
			/>
		{:else if field.type === 'select'}
			<Select
				label={field.label}
				name={field.key}
				required={field.required}
				options={field.optionSource ? (optionMap[field.optionSource] ?? []) : (field.options ?? [])}
				allowEmpty={!field.required}
			/>
		{:else if field.type === 'checkbox'}
			<Checkbox label={field.label} name={field.key} />
		{:else if field.type === 'date' || field.type === 'datetime' || field.type === 'time'}
			<Input
				label={field.label}
				name={field.key}
				type={field.type === 'datetime' ? 'datetime-local' : field.type}
				required={field.required}
			/>
		{:else if field.type === 'number' || field.type === 'decimal' || field.type === 'currency'}
			<Input
				label={field.label}
				name={field.key}
				type="number"
				step={field.type === 'decimal' || field.type === 'currency' ? '0.01' : '1'}
				min={field.min}
				max={field.max}
				required={field.required}
			/>
		{:else if field.type === 'email' || field.type === 'url' || field.type === 'mobile' || field.type === 'text'}
			<Input
				label={field.label}
				name={field.key}
				type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
				required={field.required}
				placeholder={field.placeholder}
			/>
		{:else if field.type === 'file' || field.type === 'hidden'}
			{#if field.type === 'file'}<Input label={field.label} name={field.key} type="file" />{/if}
		{/if}
	{/each}
	<div class="form-actions">
		<Button type="submit" variant="primary">Create {config.label}</Button>
		<a href={`/app/${config.key}`} class="btn btn-ghost">Cancel</a>
	</div>
</form>
