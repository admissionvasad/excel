<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	type Admission = Record<string, unknown>;
	type Score = Record<string, unknown>;
	let {
		data,
		form
	}: {
		data: { admissions: Admission[]; scores: Score[] };
		form?: { message?: string; success?: boolean; saved?: Score };
	} = $props();
	const admissions = $derived(data.admissions);
	const scores = $derived(data.scores);
	let selectedAdmission = $state('');
	let selectedTrack = $state('pcm');
	let selectedApplicant = $derived(
		admissions.find((admission) => admission.application_number === selectedAdmission)
	);

	function selectAdmission(event: Event) {
		selectedAdmission = (event.currentTarget as HTMLSelectElement).value;
	}
</script>

<svelte:head><title>Merit Management · College ERP</title></svelte:head>

<div class="page-header">
	<div>
		<h1>Merit Management</h1>
		<p class="page-subtitle">
			Calculate, validate, and rank applicants using configurable subject and entrance-score inputs.
		</p>
	</div>
	<span class="badge info">{scores.length} calculated</span>
</div>

{#if form?.message}
	<div class="alert error">{form.message}</div>
{:else if form?.success}
	<div class="alert success">
		Merit score saved for {String(form.saved?.applicant_name ?? 'applicant')}.
	</div>
{/if}

<div class="grid cols-2 merit-workspace">
	<section class="panel">
		<div class="panel-header">
			<div>
				<h2>Merit calculator</h2>
				<p class="muted">Use PCM or PCB inputs, then add GUJCET marks or percentile.</p>
			</div>
		</div>
		<form method="POST" action="?/calculate" use:enhance class="form-grid">
			<div class="field full-width">
				<label for="admission">Admission application</label>
				<select id="admission" name="admission_id" required onchange={selectAdmission}>
					<option value="">Select an application</option>
					{#each admissions as admission}
						<option value={String(admission.id)}
							>{String(admission.application_number ?? '')} · {String(
								admission.applicant_name ?? ''
							)}</option
						>
					{/each}
				</select>
				<p class="field-help">
					{selectedApplicant
						? String(selectedApplicant.applicant_name ?? '')
						: 'The applicant is resolved from the selected admission record.'}
				</p>
			</div>
			<div class="field">
				<label for="admission-type">Admission type</label>
				<Select
					id="admission-type"
					name="admission_type"
					options={[
						{ value: 'ACPC', label: 'ACPC' },
						{ value: 'Management Quota', label: 'Management Quota' },
						{ value: 'NRI', label: 'NRI' },
						{ value: 'Other', label: 'Other' }
					]}
				/>
			</div>
			<div class="field">
				<label for="track">Subject track</label>
				<select id="track" name="track" bind:value={selectedTrack}>
					<option value="pcm">PCM</option>
					<option value="pcb">PCB</option>
				</select>
			</div>
			<div class="field">
				<Input label="Physics" name="physics" type="number" min="0" max="100" required />
			</div>
			<div class="field">
				<Input label="Chemistry" name="chemistry" type="number" min="0" max="100" required />
			</div>
			{#if selectedTrack === 'pcm'}
				<div class="field">
					<Input label="Mathematics" name="mathematics" type="number" min="0" max="100" required />
				</div>
			{:else}
				<div class="field">
					<Input label="Biology" name="biology" type="number" min="0" max="100" required />
				</div>
			{/if}
			<div class="field">
				<Input label="GUJCET marks" name="gujcet_marks" type="number" min="0" max="200" />
			</div>
			<div class="field">
				<Input
					label="GUJCET percentile"
					name="gujcet_percentile"
					type="number"
					min="0"
					max="100"
					step="0.01"
				/>
			</div>
			<div class="field">
				<Input
					label="Minimum eligibility %"
					name="eligibility_minimum"
					type="number"
					min="0"
					max="100"
					step="0.01"
					value="45"
				/>
			</div>
			<div class="full-width form-actions">
				<Button type="submit" variant="primary">Calculate and save</Button>
				<a class="btn btn-ghost" href="/app/admissions">Review admissions</a>
			</div>
		</form>
	</section>

	<section class="panel merit-guide">
		<div class="panel-header"><h2>Rule snapshot</h2></div>
		<div class="metric-row"><span>Board contribution</span><strong>40%</strong></div>
		<div class="metric-row"><span>GUJCET contribution</span><strong>60%</strong></div>
		<div class="metric-row"><span>Eligibility result</span><strong>Board % threshold</strong></div>
		<div class="alert info">
			The calculation engine accepts partial subject sets, so future rule versions can select
			different subjects without changing the route.
		</div>
	</section>
</div>

<section class="panel">
	<div class="panel-header">
		<div>
			<h2>Merit list</h2>
			<p class="muted">Latest calculations for the active college scope.</p>
		</div>
	</div>
	<div class="table-wrap">
		<table>
			<thead
				><tr
					><th>Applicant</th><th>Application</th><th>Track</th><th>Board %</th><th>GUJCET %</th><th
						>Merit index</th
					><th>Eligibility</th><th>Status</th></tr
				></thead
			>
			<tbody>
				{#each scores as score}
					<tr>
						<td>{String(score.applicant_name ?? '')}</td>
						<td>{String(score.application_number ?? '')}</td>
						<td>{String(score.track ?? '')}</td>
						<td>{String(score.board_percentage ?? '-')}</td>
						<td>{String(score.gujcet_percentile ?? '-')}</td>
						<td><strong>{String(score.merit_index ?? '-')}</strong></td>
						<td
							><span
								class:success={score.eligibility_status === 'Eligible'}
								class:danger={score.eligibility_status !== 'Eligible'}
								class="badge">{String(score.eligibility_status ?? '')}</span
							></td
						>
						<td>{String(score.status ?? '')}</td>
					</tr>
				{:else}
					<tr><td colspan="8" class="empty-state">No merit scores calculated yet.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
