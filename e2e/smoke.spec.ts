import { test, expect } from '@playwright/test';

test('smoke: app loads and primary interaction works', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/');

  // App should render something non-empty.
  await expect(page.locator('body')).toContainText(/\S+/);

  // Heuristic: try the first button and ensure something changes.
  const btn = page.getByRole('button').first();
  if (await btn.count()) {
    const before = await page.locator('body').innerText();
    await btn.click();
    const after = await page.locator('body').innerText();
    expect(after).not.toEqual(before);
  }
});
