<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'secondary',
		size = 'md',
		disabled = false,
		type = 'button',
		full = false,
		class: className = '',
		onclick,
		href,
		title = '',
		children
	}: {
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		full?: boolean;
		class?: string;
		onclick?: (event: MouseEvent) => void;
		href?: string;
		title?: string;
		children: Snippet;
	} = $props();

	const classes =
		`btn btn-${variant} ${size !== 'md' ? `btn-${size}` : ''} ${full ? 'btn-full' : ''} ${className}`.trim();
</script>

{#if href}
	<a
		{href}
		class={classes}
		{title}
		onclick={disabled
			? (event) => {
					event.preventDefault();
				}
			: onclick}
	>
		{@render children()}
	</a>
{:else}
	<button {type} class={classes} {disabled} {title} {onclick}>
		{@render children()}
	</button>
{/if}
