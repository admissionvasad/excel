<script lang="ts">
	export interface SelectOption {
		value: string;
		label: string;
	}

	let {
		label = '',
		value = $bindable(''),
		options = [] as SelectOption[],
		placeholder = 'Select…',
		required = false,
		name = '',
		disabled = false,
		hint = '',
		error = '',
		allowEmpty = true,
		classes = '',
		id = ''
	}: {
		label?: string;
		value?: string;
		options?: SelectOption[];
		placeholder?: string;
		required?: boolean;
		name?: string;
		disabled?: boolean;
		hint?: string;
		error?: string;
		allowEmpty?: boolean;
		classes?: string;
		id?: string;
	} = $props();

	const inputId = id || name || `select-${Math.random().toString(36).slice(2, 8)}`;
</script>

<div class="field {classes}">
	{#if label}
		<label for={inputId}>{label}{#if required}<span class="required">*</span>{/if}</label>
	{/if}
	<select {id: inputId} {name} bind:value {disabled} {required} class="select {error ? 'invalid' : ''}">
		<option value="" disabled={!allowEmpty}>{placeholder}</option>
		{#each options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
	{#if hint && !error}<span class="hint">{hint}</span>{/if}
	{#if error}<span class="error">{error}</span>{/if}
</div>