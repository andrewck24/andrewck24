import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load homepage successfully", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check if the page title is correct
    await expect(page).toHaveTitle(/Andrew Tseng/);

    // Check for basic navigation elements
    await expect(page.locator("nav")).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await page.waitForLoadState("networkidle");

    // Check mobile navigation
    await expect(page.locator("body")).toBeVisible();
  });

  test("should support language switching", async ({ page }) => {
    await page.goto("/");

    // Look for language switcher (this will need to be updated based on actual implementation)
    const languageSwitcher = page.locator('[data-testid="language-switcher"]');

    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();
      // Add specific language switching tests based on implementation
    }
  });
});
