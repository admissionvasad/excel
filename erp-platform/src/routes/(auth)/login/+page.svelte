<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let { form }: { form?: { error?: string; email?: string } | null } = $props();
</script>

<div class="auth-card-inner">
	<h1>Sign in</h1>
	<p class="auth-subtitle">Welcome back. Enter your credentials to continue.</p>

	{#if form?.error}
		<div class="alert alert-danger" data-testid="login-error">{form.error}</div>
	{/if}

	<form method="POST" use:enhance>
		<Input
			label="Email"
			name="email"
			type="email"
			required
			value={form?.email ?? ''}
			placeholder="you@college.edu"
			autocomplete="email"
		/>
		<Input
			label="Password"
			name="password"
			type="password"
			required
			placeholder="••••••••"
			autocomplete="current-password"
			hint="Your organization password, set by your administrator."
		/>
		<Button type="submit" variant="primary" size="lg" full>Sign in</Button>
	</form>

	<div class="auth-links">
		<a href="/forgot-password">Forgot password?</a>
		<a href="/setup">First-time setup</a>
	</div>
</div>
