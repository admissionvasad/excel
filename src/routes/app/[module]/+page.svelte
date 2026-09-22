<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import type { ModuleConfig, ModuleField, Paginated } from '$lib/types';

	let { data }: {
		data: {
			config: ModuleConfig;
			result: Paginated<Record<string, unknown>>;
		};
	} = $props();

	const config = $derived(data.config);
	const result = $derived(data.result);
	let search = $state('');
	let appliedFilters = $state<Record<string, unknown>>({});

	function gotoPage(page: number) {
		void goto(`/app/${config.key}?page=${page}&pageSize=${result.pageSize}`);
	}

	function clearFilters() {
		appliedFilters = {};
		void goto(`/app/${config.key}`);
	}
</script>

<svelte:head><title>{config.label} · College ERP</title></svelte:head>

<div class="page-header">
	<div>
		<h1>{config.label}</h1>
		<p class="page-subtitle">{config.description}</p>
	</div>
	<a href={`/app/${config.key}/new`} class="btn btn-primary">+ New</a>
</div>

<form method="GET" action={`/app/${config.key}`} use:enhance>
	<div class="toolbar">
		<Input label="Search" name="q" value={search} placeholder="Search…" />
		{#each config.fields.filter((field: ModuleField) => field.filterable) as field}
			<Select label={field.label} name={field.key} options={field.options ?? []} allowEmpty />
		{/each}
		<Button type="submit" variant="primary">Filter</Button>
		<Button type="button" variant="ghost" onclick={clearFilters}>Clear</Button>
	</div>
</form>

<div class="table-wrap">
	<table>
		<thead>
			<tr>
				{#each config.fields.filter((field: ModuleField) => !['textarea', 'hidden'].includes(field.type)).slice(0, 8) as field}
					<th>{field.label}</th>
				{/each}
				<th class="table-actions">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each result.rows as row (row.id)}
				<tr>
					{#each config.fields.filter((field: ModuleField) => !['textarea', 'hidden'].includes(field.type)).slice(0, 8) as field}
						<td>{String(row[field.key] ?? '')}</td>
					{/each}
					<td class="table-actions">
						<a href={`/app/${config.key}/${row.id}`} class="btn btn-sm btn-ghost">View</a>
						<form method="POST" action={`/app/${config.key}/${row.id}`} use:enhance>
							<input type="hidden" name="intent" value="delete" />
							<input type="hidden" name="id" value={row.id} />
							<button type="submit" class="btn btn-sm btn-danger" onclick={() => confirm('Delete this record?')}>Delete</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#if result.total === 0}
	<div class="empty-state">No records found.</div>
{/if}

{#if result.pageCount > 1}
	<div class="pagination">
		<button class="btn btn-sm btn-ghost" disabled={result.page <= 1} onclick={() => gotoPage(result.page - 1)}>‹ Prev</button>
		<span>Page {result.page} of {result.pageCount}</span>
		<button class="btn btn-sm btn-ghost" disabled={result.page >= result.pageCount} onclick={() => gotoPage(result.page + 1)}>Next ›</button>
	</div>
{/if}
