<script lang="ts">
	let recentItems = $state([
		{ id: 1, label: 'TUI Demo', href: '/tui-demo', description: 'Dual-mode rendering demo' },
	]);
</script>

<div class="home">
	<header class="home-header">
		<h1 class="home-title">svelte-tauri-template</h1>
		<p class="home-subtitle">
			Cross-platform app shell — Svelte 5 · Tauri 2 · PluresDB
		</p>
	</header>

	<section class="section" aria-labelledby="moduli-heading">
		<h2 id="moduli-heading" class="section-title">Installed Moduli</h2>
		<p class="empty-state">No moduli installed. Select a modulus from the registry to get started.</p>
	</section>

	<section class="section" aria-labelledby="recent-heading">
		<h2 id="recent-heading" class="section-title">Recent Activity</h2>
		{#if recentItems.length > 0}
			<ul class="card-list">
				{#each recentItems as item (item.id)}
					<li>
						<a href={item.href} class="card">
							<span class="card-label">{item.label}</span>
							<span class="card-desc">{item.description}</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="empty-state">No recent activity.</p>
		{/if}
	</section>
</div>

<style>
	.home {
		padding: 2rem;
		max-width: 720px;
	}

	.home-header {
		margin-bottom: 2.5rem;
	}

	.home-title {
		font-size: 1.6rem;
		font-weight: 700;
		color: var(--text-base);
		margin: 0 0 0.4rem;
	}

	.home-subtitle {
		color: var(--text-muted);
		font-size: 0.9rem;
		margin: 0;
	}

	.section {
		margin-bottom: 2rem;
	}

	.section-title {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin: 0 0 0.75rem;
	}

	.empty-state {
		font-size: 0.85rem;
		color: var(--text-muted);
		margin: 0;
		padding: 1rem;
		border: 1px dashed var(--border);
		border-radius: 6px;
	}

	.card-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0.75rem 1rem;
		background-color: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: 6px;
		text-decoration: none;
		transition: border-color 0.15s, background-color 0.15s;
	}

	.card:hover {
		border-color: var(--accent);
		background-color: var(--bg-elevated);
	}

	.card:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.card-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-base);
	}

	.card-desc {
		font-size: 0.85rem;
		color: var(--text-muted);
	}
</style>

