<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let { form, data }: { form?: { error?: string; email?: string } | null; data: { available: boolean } } = $props();
</script>

<div class="auth-card-inner">
	{#if data.available}
		<h1>First-time setup</h1>
		<p class="auth-subtitle">Create the first Super Administrator account for your ERP.</p>

		{#if form?.error}
			<div class="alert alert-danger">{form.error}</div>
		{/if}

		<form method="POST" use:enhance>
			<Input label="Full name" name="full_name" type="text" required placeholder="Dr. Priya Sharma" />
			<Input label="Email" name="email" type="email" required value={form?.email ?? ''} placeholder="admin@college.edu" />
			<Input label="Password" name="password" type="password" required placeholder="At least 8 characters" hint="You’ll use this to sign in every time." />
			<Button type="submit" variant="primary" size="lg" full>Create Super Admin</Button>
		</form>
	{:else}
		<h1>Already set up</h1>
		<p class="auth-subtitle">A Super Administrator already exists.</p>
		<div class="auth-links"><a href="/login">← Back to sign in</a></div>
	{/if}
</div>
