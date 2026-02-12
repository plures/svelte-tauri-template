<script lang="ts">
	let count = $state(0);

	function increment() {
		count += 1;
	}
</script>

<main>
	<h1>Welcome to Svelte + Tauri</h1>
	<div class="card">
		<button onclick={increment}>
			count is {count}
		</button>
	</div>
	<p>
		Edit <code>src/routes/+page.svelte</code> to get started
	</p>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	main {
		text-align: center;
		padding: 2rem;
		max-width: 600px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
	}

	.card {
		padding: 2rem;
	}

	button {
		font-size: 1.2rem;
		padding: 0.8rem 1.5rem;
		border-radius: 8px;
		border: 1px solid transparent;
		background-color: #ff3e00;
		color: white;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.25s;
	}

	button:hover {
		background-color: #ff5722;
		border-color: #ff5722;
	}

	p {
		color: #666;
	}

	code {
		background-color: #f4f4f4;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-family: 'Courier New', monospace;
	}
</style>
