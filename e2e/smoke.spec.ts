import { test, expect } from '@playwright/test';

test('smoke: app shell loads with correct layout regions', async ({ page }) => {
	await page.goto('http://127.0.0.1:4173/');

	// App shell should be present and fill the viewport.
	const shell = page.locator('.app-shell');
	await expect(shell).toBeVisible();

	// Core layout regions must be rendered.
	await expect(page.locator('.activity-bar')).toBeVisible();
	await expect(page.locator('.sidebar')).toBeVisible();
	await expect(page.locator('.main-content')).toBeVisible();
	await expect(page.locator('.status-bar')).toBeVisible();

	// Home page content should appear in the main content area.
	await expect(page.locator('.main-content')).toContainText('svelte-tauri-template');

	// Sidebar toggle button should exist and collapse the sidebar.
	const toggleBtn = page.getByRole('button', { name: /collapse sidebar/i });
	await expect(toggleBtn).toBeVisible();
	await toggleBtn.click();
	await expect(page.locator('.sidebar')).not.toBeVisible();

	// Clicking toggle again should re-open the sidebar.
	const expandBtn = page.getByRole('button', { name: /expand sidebar/i });
	await expandBtn.click();
	await expect(page.locator('.sidebar')).toBeVisible();
});

