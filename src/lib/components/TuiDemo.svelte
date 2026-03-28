<script lang="ts">
	let count = $state(0);
	let message = $state('Hello from TUI Demo!');

	function increment() {
		count += 1;
		message = `Button pressed ${count} time${count === 1 ? '' : 's'}`;
	}

	function reset() {
		count = 0;
		message = 'Counter reset';
	}
</script>

<!--
  TuiDemo — works in both GUI (browser/webview) and TUI (terminal) modes.
  In TUI mode the svelte-ratatui compiler maps these HTML elements to
  Ratatui widgets according to tui.config.ts.
-->
<div class="tui-demo" role="region" aria-label="TUI Demo">
	<h1>TUI Demo</h1>
	<p>{message}</p>
	<div class="controls">
		<button onclick={increment} aria-label="Increment counter">
			Count: {count}
		</button>
		<button onclick={reset} aria-label="Reset counter">
			Reset
		</button>
	</div>
	<ul aria-label="Feature list">
		<li>Dual-mode rendering (GUI + TUI)</li>
		<li>Widget mappings via tui.config.ts</li>
		<li>Ratatui-powered terminal UI</li>
	</ul>
</div>

<style>
	.tui-demo {
		max-width: 480px;
		margin: 2rem auto;
		padding: 1.5rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		text-align: center;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
	}

	h1 {
		color: #ff3e00;
		margin: 0 0 0.5rem 0;
	}

	p {
		color: #666;
		margin: 0 0 1rem 0;
	}

	.controls {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
		margin-bottom: 1rem;
	}

	button {
		font-size: 1rem;
		padding: 0.6rem 1.2rem;
		border-radius: 6px;
		border: 1px solid transparent;
		background-color: #ff3e00;
		color: white;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	button:hover {
		background-color: #ff5722;
	}

	button:focus-visible {
		outline: 2px solid #40b3ff;
		outline-offset: 2px;
	}

	ul {
		text-align: left;
		margin: 0 auto;
		padding-left: 1.5rem;
		color: #555;
		max-width: 320px;
	}

	li {
		margin-bottom: 0.25rem;
	}
</style>
