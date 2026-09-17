<script lang="ts">
	let {
		label = '',
		value = $bindable(''),
		type = 'date',
		required = false,
		name = '',
		disabled = false,
		hint = '',
		error = ''
	}: {
		label?: string;
		value?: string;
		type?: 'date' | 'time' | 'datetime-local';
		required?: boolean;
		name?: string;
		disabled?: boolean;
		hint?: string;
		error?: string;
	} = $props();

	const inputId = name || `date-${Math.random().toString(36).slice(2, 8)}`;
</script>

<div class="field">
	{#if label}
		<label for={inputId}>{label}{#if required}<span class="required">*</span>{/if}</label>
	{/if}
	<input {id: inputId} {name} {type} bind:value={value} {required} {disabled} class="input {error ? 'invalid' : ''}" />
	{#if hint && !error}<span class="hint">{hint}</span>{/if}
	{#if error}<span class="error">{error}</span>{/if}
</div>