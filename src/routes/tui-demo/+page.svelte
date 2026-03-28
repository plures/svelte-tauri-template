<script lang="ts">
	import TuiDemo from '$lib/components/TuiDemo.svelte';
</script>

<main>
	<TuiDemo />
	<p class="back-link">
		<a href="/">← Back to home</a>
	</p>
</main>

<style>
	main {
		padding: 2rem;
	}

	.back-link {
		text-align: center;
		margin-top: 1rem;
	}

	a {
		color: #ff3e00;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
