import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('background-changer/');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Change Photo Background - Background Changer | Picsart/);
});
