<script lang="ts">
	let {
		label = '',
		checked = $bindable(false),
		name = '',
		description = '',
		disabled = false,
		required = false
	}: {
		label?: string;
		checked?: boolean;
		name?: string;
		description?: string;
		disabled?: boolean;
		required?: boolean;
	} = $props();

	const inputId = name || `check-${Math.random().toString(36).slice(2, 8)}`;
</script>

<label class="checkbox" for={inputId}>
	<input {id: inputId} {name} type="checkbox" bind:checked {disabled} {required} />
	<span>
		{label}{#if required}<span class="required">*</span>{/if}
		{#if description}<span class="hint" style="display:block">{description}</span>{/if}
	</span>
</label>