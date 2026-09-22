<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let { form }: { form?: { error?: string; sent?: boolean; email?: string } | null } = $props();
</script>

<div class="auth-card-inner">
	{#if form?.sent}
		<div class="alert alert-success" data-testid="forgot-sent">
			If an account exists for {form.email}, a reset link is on its way.
		</div>
		<div class="auth-links"><a href="/login">← Back to sign in</a></div>
	{:else}
		<h1>Forgot password</h1>
		<p class="auth-subtitle">Enter your account email and we’ll send a reset link.</p>

		{#if form?.error}
			<div class="alert alert-danger">{form.error}</div>
		{/if}

		<form method="POST" use:enhance>
			<Input label="Email" name="email" type="email" required value={form?.email ?? ''} placeholder="you@college.edu" autocomplete="email" />
			<Button type="submit" variant="primary" size="lg" full>Send reset link</Button>
		</form>

		<div class="auth-links"><a href="/login">← Back to sign in</a></div>
	{/if}
</div>
