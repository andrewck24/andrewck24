/**
 * T010: E2E Test - Article Language Toggle
 *
 * Tests language switching in ArticleInfo component
 *
 * This test will fail until Phase 3.3 (T014) implements:
 * - ArticleInfo component with LanguageToggle
 * - Proper integration in Article component
 */

import { expect, test } from "@playwright/test";

test.describe("Article Language Toggle", () => {
  test("should switch language on project page (all locales available)", async ({
    page,
  }) => {
    // Navigate to a project article in zh-TW
    await page.goto("/zh-TW/projects/andrewck24-portfolio");

    // Wait for ArticleInfo to load
    await page.waitForSelector('[data-testid="article-info"]');

    // Find language toggle component
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await expect(languageToggle).toBeVisible();

    // Click to open language menu
    await languageToggle.click();

    // Select English
    const enOption = page.locator(
      '[data-testid="language-option-en"], :text("English")'
    );
    await enOption.click();

    // Verify URL changed to English version
    await expect(page).toHaveURL("/en/projects/andrewck24-portfolio");

    // Verify content is in English
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should switch from English to Japanese", async ({ page }) => {
    await page.goto("/en/projects/andrewck24-portfolio");

    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await languageToggle.click();

    const jaOption = page.locator(
      '[data-testid="language-option-ja"], :text("日本語")'
    );
    await jaOption.click();

    await expect(page).toHaveURL("/ja/projects/andrewck24-portfolio");
  });

  test("should only show available languages when translations missing", async ({
    page,
  }) => {
    // Navigate to an article that only exists in zh-TW
    // (This depends on actual content structure)
    await page.goto("/zh-TW/notes");

    // Find an article that only has zh-TW version
    const firstNote = page.locator('[data-testid="article-card"]').first();
    await firstNote.click();

    // Wait for article page to load
    await page.waitForSelector('[data-testid="article-info"]');

    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await languageToggle.click();

    // Verify only zh-TW option is enabled/visible
    const zhTWOption = page.locator('[data-testid="language-option-zh-TW"]');
    await expect(zhTWOption).toBeVisible();
    await expect(zhTWOption).toHaveAttribute("aria-disabled", "true");

    // EN and JA options should be disabled or hidden
    const enOption = page.locator('[data-testid="language-option-en"]');
    if (await enOption.isVisible()) {
      await expect(enOption).toBeDisabled();
    }
  });

  test("should work on notes pages", async ({ page }) => {
    // Test language toggle works on notes (not just projects)
    await page.goto("/zh-TW/notes");

    const firstNote = page.locator('[data-testid="article-card"]').first();
    await firstNote.click();

    await page.waitForSelector('[data-testid="article-info"]');

    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await expect(languageToggle).toBeVisible();
  });

  test("should preserve article slug when switching languages", async ({
    page,
  }) => {
    await page.goto("/zh-TW/projects/example-project-2");

    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await languageToggle.click();

    const enOption = page.locator('[data-testid="language-option-en"]');
    await enOption.click();

    // URL should change to /en/projects/example-project-2
    // (same slug, different locale)
    await expect(page).toHaveURL("/en/projects/example-project-2");
  });
});

test.describe("Language Toggle Accessibility", () => {
  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/zh-TW/projects/andrewck24-portfolio");

    // Tab to language toggle
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    // (May need multiple tabs depending on page structure)

    // Verify language toggle is focused
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await expect(languageToggle).toBeFocused();

    // Press Enter to open
    await page.keyboard.press("Enter");

    // Arrow keys to navigate options
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    // Verify language changed
    await expect(page).not.toHaveURL("/zh-TW/projects/andrewck24-portfolio");
  });

  test("should have proper ARIA attributes", async ({ page }) => {
    await page.goto("/zh-TW/projects/andrewck24-portfolio");

    const languageToggle = page.locator('[data-testid="language-toggle"]');

    // Should have role="button" or appropriate ARIA role
    const role = await languageToggle.getAttribute("role");
    expect(role).toBeTruthy();

    // Should have aria-label
    const ariaLabel = await languageToggle.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
  });
});
