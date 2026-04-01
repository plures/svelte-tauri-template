<script lang="ts">
	import AppShell from '$lib/components/AppShell.svelte';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<AppShell>
	{#snippet activityBar()}
		<button
			class="activity-icon active"
			aria-label="Home"
			aria-pressed="true"
			title="Home"
		>
			<svg
				width="22"
				height="22"
				viewBox="0 0 22 22"
				fill="none"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M3 10.5L11 3l8 7.5V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-4.5h10v4.5"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linejoin="round"
					fill="none"
				/>
			</svg>
		</button>
	{/snippet}

	{#snippet sidebar()}
		<p class="sidebar-label">Navigation</p>
		<ul class="nav-list" aria-label="Main navigation">
			<li>
				<a href="/" class="nav-link" aria-current={page.url.pathname === '/' ? 'page' : undefined}>Home</a>
			</li>
			<li>
				<a href="/tui-demo" class="nav-link" aria-current={page.url.pathname === '/tui-demo' ? 'page' : undefined}>TUI Demo</a>
			</li>
		</ul>
	{/snippet}

	{#snippet panel()}
		<p class="log-entry">PluresDB: connected</p>
		<p class="log-entry">Shell ready</p>
	{/snippet}

	{#snippet statusBar()}
		<span class="status-item">PluresDB: Ready</span>
		<span class="status-sep" aria-hidden="true">|</span>
		<span class="status-item">svelte-tauri-template</span>
	{/snippet}

	{@render children()}
</AppShell>

<style>
	.activity-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border: none;
		border-radius: 6px;
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
		padding: 0;
	}

	.activity-icon:hover {
		background-color: var(--bg-elevated);
		color: var(--text-base);
	}

	.activity-icon:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.activity-icon.active {
		color: var(--text-base);
		border-left: 2px solid var(--accent);
		border-radius: 0;
	}

	.sidebar-label {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin: 0.5rem 0 0.25rem;
		padding: 0 0.25rem;
	}

	.nav-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-link {
		display: block;
		padding: 0.35rem 0.5rem;
		border-radius: 4px;
		color: var(--text-base);
		text-decoration: none;
		font-size: 0.85rem;
		transition: background-color 0.15s;
	}

	.nav-link:hover {
		background-color: var(--bg-elevated);
	}

	.nav-link:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.nav-link[aria-current='page'] {
		background-color: var(--bg-elevated);
		color: var(--text-base);
	}

	.log-entry {
		margin: 0 0 0.25rem;
		font-size: 0.78rem;
		color: var(--text-muted);
		font-family: 'Courier New', 'Consolas', monospace;
	}

	.status-item {
		font-size: 0.72rem;
	}

	.status-sep {
		color: var(--status-bar-sep);
		font-size: 0.72rem;
	}
</style>
