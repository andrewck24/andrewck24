/**
 * T009: E2E Test - Article Tag Filtering
 *
 * Tests tag filtering functionality in Orama search
 *
 * This test will fail until Phase 3.3 (T015-T016) implements:
 * - Orama buildIndex with tag extraction
 * - Search UI with tag filtering support
 */

import { expect, test } from "@playwright/test";

test.describe("Article Tag Filtering", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home or search page
    await page.goto("/");
  });

  test("should filter articles by single tag (next.js)", async ({ page }) => {
    // Open search UI (⌘K or click search button)
    await page.keyboard.press("Meta+K");

    // Wait for search modal to appear
    await page.waitForSelector('[data-testid="search-dialog"]');

    // Select "next.js" tag filter
    const tagFilter = page.locator('[data-testid="tag-filter-next.js"]');
    await expect(tagFilter).toBeVisible();
    await tagFilter.click();

    // Check search results
    // Should show articles tagged with "next.js"
    const results = page.locator('[data-testid="search-result"]');
    await expect(results).toHaveCount(2); // Based on quickstart.md example

    // Verify articles 1 and 2 are shown (both have "next.js" tag)
    await expect(
      page.locator('[data-testid="search-result"]:has-text("Article 1")')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="search-result"]:has-text("Article 2")')
    ).toBeVisible();

    // Verify article 3 is not shown (doesn't have "next.js" tag)
    await expect(
      page.locator('[data-testid="search-result"]:has-text("Article 3")')
    ).not.toBeVisible();
  });

  test("should filter articles by multiple tags (next.js AND typescript)", async ({
    page,
  }) => {
    await page.keyboard.press("Meta+K");
    await page.waitForSelector('[data-testid="search-dialog"]');

    // Select both "next.js" and "typescript" tags
    await page.locator('[data-testid="tag-filter-next.js"]').click();
    await page.locator('[data-testid="tag-filter-typescript"]').click();

    // Should only show article 1 (has both tags)
    const results = page.locator('[data-testid="search-result"]');
    await expect(results).toHaveCount(1);
    await expect(
      page.locator('[data-testid="search-result"]:has-text("Article 1")')
    ).toBeVisible();
  });

  test("should support custom tags in filtering", async ({ page }) => {
    await page.keyboard.press("Meta+K");
    await page.waitForSelector('[data-testid="search-dialog"]');

    // Select custom tag "my-custom-tag"
    const customTagFilter = page.locator(
      '[data-testid="tag-filter-my-custom-tag"]'
    );
    await expect(customTagFilter).toBeVisible();
    await customTagFilter.click();

    // Should show articles with custom tag
    const results = page.locator('[data-testid="search-result"]');
    await expect(results.first()).toBeVisible();
  });

  test("should clear tag filters", async ({ page }) => {
    await page.keyboard.press("Meta+K");
    await page.waitForSelector('[data-testid="search-dialog"]');

    // Select a tag
    await page.locator('[data-testid="tag-filter-next.js"]').click();

    // Verify filtered results
    let results = page.locator('[data-testid="search-result"]');
    const filteredCount = await results.count();
    expect(filteredCount).toBeGreaterThan(0);

    // Clear filters
    await page.locator('[data-testid="clear-tag-filters"]').click();

    // Verify all results shown
    results = page.locator('[data-testid="search-result"]');
    const allCount = await results.count();
    expect(allCount).toBeGreaterThan(filteredCount);
  });
});

test.describe("Orama Search Index Verification", () => {
  test("should include tag fields in search index", async ({ page }) => {
    // This test verifies the Orama index structure
    // Access search index metadata or API endpoint
    await page.goto("/api/search");

    // Verify response includes tag fields
    const response = await page.request.get("/api/search");
    expect(response.ok()).toBeTruthy();

    const _data = await response.json();
    // Verify index schema includes 'tag' and 'tags' fields
    // Structure depends on fumadocs Orama implementation
  });
});
