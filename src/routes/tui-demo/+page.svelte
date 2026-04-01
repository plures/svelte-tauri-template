<script lang="ts">
	import TuiDemo from '$lib/components/TuiDemo.svelte';
</script>

<div class="page">
	<TuiDemo />
	<p class="back-link">
		<a href="/">← Back to home</a>
	</p>
</div>

<style>
	.page {
		padding: 2rem;
	}

	.back-link {
		text-align: center;
		margin-top: 1rem;
	}

	a {
		color: var(--accent);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
