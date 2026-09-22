<script lang="ts">
	let { children } = $props();
</script>

<div class="auth-page">
	<div class="auth-shell">
		<div class="auth-brand">
			<span class="brandmark">🎓</span>
			<strong>College ERP</strong>
		</div>
		{@render children()}
	</div>
</div>
