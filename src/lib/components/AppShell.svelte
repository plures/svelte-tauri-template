<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		titleBar?: Snippet;
		activityBar?: Snippet;
		sidebar?: Snippet;
		panel?: Snippet;
		statusBar?: Snippet;
		children?: Snippet;
	}

	let { titleBar, activityBar, sidebar, panel, statusBar, children }: Props = $props();

	let sidebarOpen = $state(true);
	let panelOpen = $state(true);
	let sidebarWidth = $state(220);
	let panelHeight = $state(180);

	let resizingSidebar = $state(false);
	let resizingPanel = $state(false);

	function startSidebarResize(e: PointerEvent) {
		resizingSidebar = true;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
	}

	function onSidebarHandleMove(e: PointerEvent) {
		if (!resizingSidebar) return;

		let activityBarWidth = 0;

		// Prefer CSS custom property if available (e.g., --activity-bar-width).
		if (typeof document !== 'undefined') {
			const rootStyle = getComputedStyle(document.documentElement);
			const cssValue = rootStyle.getPropertyValue('--activity-bar-width').trim();

			if (cssValue) {
				const parsed = parseFloat(cssValue);
				if (!Number.isNaN(parsed) && parsed > 0) {
					activityBarWidth = parsed;
				}
			}

			// Fallback to measuring the activity bar element if CSS var is not usable.
			if (activityBarWidth === 0) {
				const activityBarElement = document.querySelector<HTMLElement>('[data-role="activity-bar"]');
				if (activityBarElement) {
					const rect = activityBarElement.getBoundingClientRect();
					if (rect.width > 0) {
						activityBarWidth = rect.width;
					}
				}
			}
		}

		// Final fallback to the original hard-coded value to preserve existing behavior.
		if (activityBarWidth === 0) {
			activityBarWidth = 48;
		}
		sidebarWidth = Math.max(120, Math.min(480, e.clientX - activityBarWidth));
	}

	function startPanelResize(e: PointerEvent) {
		resizingPanel = true;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
	}

	function onPanelHandleMove(e: PointerEvent) {
		if (!resizingPanel) return;

		// Use the document root as a proxy for the app shell container.
		const root = document.documentElement;
		const rootRect = root.getBoundingClientRect();

		// Prefer CSS custom property for status bar height, fall back to 24px for backwards compatibility.
		const statusBarVar = getComputedStyle(root).getPropertyValue('--status-bar-height').trim();
		const parsedStatusBarHeight = statusBarVar ? parseFloat(statusBarVar) : NaN;
		const statusBarHeight = Number.isFinite(parsedStatusBarHeight) ? parsedStatusBarHeight : 24;

		// Distance from the pointer to the bottom of the container.
		const distanceFromPointerToBottom = rootRect.bottom - e.clientY;

		panelHeight = Math.max(
			80,
			Math.min(600, distanceFromPointerToBottom - statusBarHeight)
		);
	}

	function stopResize() {
		resizingSidebar = false;
		resizingPanel = false;
	}

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function togglePanel() {
		panelOpen = !panelOpen;
	}
</script>

<div class="app-shell" role="application">
	{#if titleBar}
		<header class="title-bar" data-tauri-drag-region>
			{@render titleBar()}
		</header>
	{/if}

	<div class="work-area">
		{#if activityBar}
			<nav
				class="activity-bar"
				aria-label="Activity bar"
				style="width: var(--activity-bar-width)"
			>
				<div class="activity-bar-top">
					{@render activityBar()}
				</div>
				<div class="activity-bar-bottom">
					<button
						class="icon-btn"
						onclick={toggleSidebar}
						aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
						aria-pressed={sidebarOpen}
						title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect x="3" y="4" width="5" height="12" rx="1" fill="currentColor" opacity="0.7" />
							<rect x="10" y="4" width="7" height="2" rx="1" fill="currentColor" />
							<rect x="10" y="9" width="7" height="2" rx="1" fill="currentColor" />
							<rect x="10" y="14" width="7" height="2" rx="1" fill="currentColor" />
						</svg>
					</button>
				</div>
			</nav>
		{/if}

		{#if sidebar && sidebarOpen}
			<aside
				class="sidebar"
				style="width: {sidebarWidth}px"
				aria-label="Sidebar"
			>
				<div class="sidebar-content">
					{@render sidebar()}
				</div>
				<div
					class="sidebar-resize-handle"
					role="slider"
					aria-orientation="vertical"
					aria-label="Sidebar width"
					aria-valuenow={sidebarWidth}
					aria-valuemin={120}
					aria-valuemax={480}
					tabindex="0"
					onpointerdown={startSidebarResize}
					onpointermove={onSidebarHandleMove}
					onpointerup={stopResize}
					onpointercancel={stopResize}
					onkeydown={(e) => {
						let handled = false;

						if (e.key === 'ArrowRight') {
							sidebarWidth = Math.min(480, sidebarWidth + 10);
							handled = true;
						} else if (e.key === 'ArrowLeft') {
							sidebarWidth = Math.max(120, sidebarWidth - 10);
							handled = true;
						} else if (e.key === 'Home') {
							sidebarWidth = 120;
							handled = true;
						} else if (e.key === 'End') {
							sidebarWidth = 480;
							handled = true;
						}

						if (handled) {
							e.preventDefault();
						}
					}}
				></div>
			</aside>
		{/if}

		<div class="center-column">
			<main class="main-content">
				{#if children}
					{@render children()}
				{/if}
			</main>

			{#if panel && panelOpen}
				<section
					class="panel"
					style="height: {panelHeight}px"
					aria-label="Panel"
				>
					<div
						class="panel-resize-handle"
						role="slider"
						aria-orientation="horizontal"
						aria-label="Panel height"
						aria-valuenow={panelHeight}
						aria-valuemin={80}
						aria-valuemax={600}
						tabindex="0"
						onpointerdown={startPanelResize}
						onpointermove={onPanelHandleMove}
						onpointerup={stopResize}
						onpointercancel={stopResize}
						onkeydown={(e) => {
							if (e.key === 'ArrowUp') panelHeight = Math.min(600, panelHeight + 10);
							if (e.key === 'ArrowDown') panelHeight = Math.max(80, panelHeight - 10);
						}}
					></div>
					<div class="panel-header">
						<span class="panel-title">Panel</span>
						<button
							class="icon-btn panel-close"
							onclick={togglePanel}
							aria-label="Close panel"
							title="Close panel"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
							>
								<line x1="4" y1="4" x2="12" y2="12" stroke="currentColor" stroke-width="1.5" />
								<line x1="12" y1="4" x2="4" y2="12" stroke="currentColor" stroke-width="1.5" />
							</svg>
						</button>
					</div>
					<div class="panel-content">
						{@render panel()}
					</div>
				</section>
			{/if}

			{#if panel && !panelOpen}
				<button
					class="panel-reopen"
					onclick={togglePanel}
					aria-label="Open panel"
					title="Open panel"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 14 14"
						fill="none"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect x="1" y="8" width="12" height="4" rx="1" fill="currentColor" opacity="0.7" />
						<rect x="1" y="2" width="12" height="1.5" rx="0.75" fill="currentColor" />
						<rect x="1" y="5" width="12" height="1.5" rx="0.75" fill="currentColor" />
					</svg>
					Panel
				</button>
			{/if}
		</div>
	</div>

	{#if statusBar}
		<footer
			class="status-bar"
			style="height: var(--status-bar-height)"
			aria-label="Status bar"
		>
			{@render statusBar()}
		</footer>
	{/if}
</div>

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		background-color: var(--bg-base);
		color: var(--text-base);
	}

	.title-bar {
		flex-shrink: 0;
		height: 32px;
		background-color: var(--bg-surface);
		border-bottom: 1px solid var(--border);
		display: flex;
		align-items: center;
		padding: 0 0.5rem;
		user-select: none;
		-webkit-user-select: none;
	}

	.work-area {
		flex: 1;
		min-height: 0;
		display: flex;
		overflow: hidden;
	}

	.activity-bar {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		background-color: var(--bg-surface);
		border-right: 1px solid var(--border);
		overflow: hidden;
	}

	.activity-bar-top {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 0.25rem;
		gap: 0.25rem;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.activity-bar-bottom {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 0.5rem;
		gap: 0.25rem;
	}

	.icon-btn {
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
		transition: background-color 0.15s, color 0.15s;
		padding: 0;
	}

	.icon-btn:hover {
		background-color: var(--bg-elevated);
		color: var(--text-base);
	}

	.icon-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.icon-btn[aria-pressed='true'] {
		color: var(--text-base);
	}

	.sidebar {
		flex-shrink: 0;
		min-width: 120px;
		max-width: 480px;
		display: flex;
		position: relative;
		background-color: var(--bg-surface);
		border-right: 1px solid var(--border);
		overflow: hidden;
	}

	.sidebar-content {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 0.5rem;
	}

	.sidebar-resize-handle {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		cursor: col-resize;
		background: transparent;
		transition: background-color 0.15s;
	}

	.sidebar-resize-handle:hover,
	.sidebar-resize-handle:focus-visible {
		background-color: var(--accent);
		outline: none;
	}

	.center-column {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.main-content {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		background-color: var(--bg-base);
	}

	.panel {
		flex-shrink: 0;
		min-height: 80px;
		max-height: 600px;
		display: flex;
		flex-direction: column;
		background-color: var(--bg-surface);
		border-top: 1px solid var(--border);
		overflow: hidden;
	}

	.panel-resize-handle {
		flex-shrink: 0;
		height: 4px;
		cursor: row-resize;
		background: transparent;
		transition: background-color 0.15s;
	}

	.panel-resize-handle:hover,
	.panel-resize-handle:focus-visible {
		background-color: var(--accent);
		outline: none;
	}

	.panel-header {
		flex-shrink: 0;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 0.5rem;
		border-bottom: 1px solid var(--border);
	}

	.panel-title {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
	}

	.panel-close {
		width: 24px;
		height: 24px;
	}

	.panel-content {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem;
	}

	.panel-reopen {
		flex-shrink: 0;
		height: 22px;
		display: flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0 0.75rem;
		background-color: var(--bg-surface);
		border: none;
		border-top: 1px solid var(--border);
		color: var(--text-muted);
		font-size: 0.75rem;
		cursor: pointer;
		transition: color 0.15s, background-color 0.15s;
		width: 100%;
	}

	.panel-reopen:hover {
		color: var(--text-base);
		background-color: var(--bg-elevated);
	}

	.panel-reopen:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: -2px;
	}

	.status-bar {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0 0.5rem;
		background-color: var(--accent);
		color: var(--status-bar-text);
		font-size: 0.72rem;
		overflow: hidden;
	}
</style>
