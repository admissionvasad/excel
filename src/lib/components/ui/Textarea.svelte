<script lang="ts">
	let {
		label = '',
		value = $bindable(''),
		placeholder = '',
		required = false,
		name = '',
		disabled = false,
		hint = '',
		error = '',
		rows = 4
	}: {
		label?: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
		name?: string;
		disabled?: boolean;
		hint?: string;
		error?: string;
		rows?: number;
	} = $props();

	const inputId = name || `textarea-${Math.random().toString(36).slice(2, 8)}`;
</script>

<div class="field">
	{#if label}
		<label for={inputId}>{label}{#if required}<span class="required">*</span>{/if}</label>
	{/if}
	<textarea {id: inputId} {name} {rows} bind:value {placeholder} {disabled} {required} class="textarea {error ? 'invalid' : ''}"></textarea>
	{#if hint && !error}<span class="hint">{hint}</span>{/if}
	{#if error}<span class="error">{error}</span>{/if}
</div>