<script lang="ts">
	let {
		label = '',
		value = $bindable(''),
		type = 'text',
		placeholder = '',
		required = false,
		name = '',
		disabled = false,
		hint = '',
		error = '',
		autocomplete,
		min,
		max,
		step,
		maxlength,
		classes = '',
		id = ''
	}: {
		label?: string;
		value?: string;
		type?: string;
		placeholder?: string;
		required?: boolean;
		name?: string;
		disabled?: boolean;
		hint?: string;
		error?: string;
		autocomplete?: string;
		min?: number | string;
		max?: number | string;
		step?: number | string;
		maxlength?: number;
		classes?: string;
		id?: string;
	} = $props();

	const inputId = id || name || `input-${Math.random().toString(36).slice(2, 8)}`;
</script>

<div class="field {classes}">
	{#if label}
		<label for={inputId}>{label}{#if required}<span class="required">*</span>{/if}</label>
	{/if}
	<input
		{id: inputId}
		{name}
		{type}
		bind:value
		{placeholder}
		{disabled}
		{required}
		{autocomplete}
		{min}
		{max}
		{step}
		{maxlength}
		class="input {error ? 'invalid' : ''}"
	/>
	{#if hint && !error}<span class="hint">{hint}</span>{/if}
	{#if error}<span class="error">{error}</span>{/if}
</div>