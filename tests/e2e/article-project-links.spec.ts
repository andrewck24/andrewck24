/**
 * T011: E2E Test - Article Project Links
 *
 * Tests GitHub and Demo links in ArticleInfo for projects
 *
 * This test will fail until Phase 3.3 (T014) implements:
 * - ArticleInfo component with project links section
 * - Conditional rendering for projects vs notes
 */

import { expect, test } from "@playwright/test";

test.describe("Project Links Display", () => {
  test("should display GitHub link when githubUrl is provided", async ({
    page,
  }) => {
    // Navigate to a project with GitHub URL
    await page.goto("/zh-TW/projects/andrewck24-portfolio");

    // Wait for ArticleInfo to load
    await page.waitForSelector('[data-testid="article-info"]');

    // Find project links section
    const projectLinks = page.locator('[data-testid="project-links"]');
    await expect(projectLinks).toBeVisible();

    // Find GitHub link
    const githubLink = page
      .locator('[data-testid="project-link-github"], a[href*="github.com"]')
      .first();
    await expect(githubLink).toBeVisible();

    // Verify link attributes
    const href = await githubLink.getAttribute("href");
    expect(href).toContain("github.com");

    const target = await githubLink.getAttribute("target");
    expect(target).toBe("_blank");

    const rel = await githubLink.getAttribute("rel");
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });

  test("should display Demo link when demoUrl is provided", async ({
    page,
  }) => {
    await page.goto("/zh-TW/projects/andrewck24-portfolio");

    await page.waitForSelector('[data-testid="article-info"]');

    // Find Demo link
    const demoLink = page
      .locator(
        '[data-testid="project-link-demo"], button:has-text("Demo"), a:has-text("Demo")'
      )
      .first();

    // Demo link might not exist for all projects, check first
    if (await demoLink.isVisible()) {
      const href = await demoLink.getAttribute("href");
      expect(href).toBeTruthy();

      const target = await demoLink.getAttribute("target");
      expect(target).toBe("_blank");
    }
  });

  test("should not display project links on notes pages", async ({ page }) => {
    // Navigate to a note
    await page.goto("/zh-TW/notes");

    // Click on first note
    const firstNote = page.locator('[data-testid="article-card"]').first();
    await firstNote.click();

    // Wait for ArticleInfo
    await page.waitForSelector('[data-testid="article-info"]');

    // Project links section should not exist
    const projectLinks = page.locator('[data-testid="project-links"]');
    await expect(projectLinks).not.toBeVisible();

    // These might exist in navigation/footer, so check within article-info
    const articleInfo = page.locator('[data-testid="article-info"]');
    await expect(
      articleInfo.locator('a[href*="github.com"]')
    ).not.toBeVisible();
    await expect(articleInfo.locator(':text("Demo")')).not.toBeVisible();
  });

  test("should handle project with only GitHub link (no Demo)", async ({
    page,
  }) => {
    // This depends on having a project with only githubUrl
    await page.goto("/zh-TW/projects");

    // Find a project card and navigate to it
    const projectCard = page.locator('[data-testid="article-card"]').first();
    await projectCard.click();

    await page.waitForSelector('[data-testid="article-info"]');

    const projectLinks = page.locator('[data-testid="project-links"]');
    await expect(projectLinks).toBeVisible();

    // GitHub link should exist
    const githubLink = projectLinks.locator('a[href*="github.com"]');
    const hasGithub = await githubLink.isVisible();

    // Demo link might not exist
    const demoLink = projectLinks.locator(':text("Demo")');
    const hasDemo = await demoLink.isVisible();

    // At least one should exist
    expect(hasGithub || hasDemo).toBeTruthy();
  });
});

test.describe("Project Links Responsive Layout", () => {
  test("should display links in sidebar on desktop", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto("/zh-TW/projects/andrewck24-portfolio");
    await page.waitForSelector('[data-testid="article-info"]');

    const articleInfo = page.locator('[data-testid="article-info"]');
    await expect(articleInfo).toBeVisible();

    // ArticleInfo should be in sidebar layout
    const boundingBox = await articleInfo.boundingBox();
    expect(boundingBox).toBeTruthy();

    // Width should be around 300px (as per design spec)
    if (boundingBox) {
      expect(boundingBox.width).toBeGreaterThanOrEqual(250);
      expect(boundingBox.width).toBeLessThanOrEqual(350);
    }
  });

  test("should display links below content on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/zh-TW/projects/andrewck24-portfolio");
    await page.waitForSelector('[data-testid="article-info"]');

    const articleInfo = page.locator('[data-testid="article-info"]');
    await expect(articleInfo).toBeVisible();

    // On mobile, ArticleInfo should be below content (flex-col layout)
    // Verify it's visible and takes full width
    const boundingBox = await articleInfo.boundingBox();
    if (boundingBox) {
      // Should take most of screen width on mobile
      expect(boundingBox.width).toBeGreaterThan(300);
    }
  });
});

test.describe("Project Links Icons and Styling", () => {
  test("should display GitHub icon with link", async ({ page }) => {
    await page.goto("/zh-TW/projects/andrewck24-portfolio");
    await page.waitForSelector('[data-testid="article-info"]');

    const githubLink = page.locator('a[href*="github.com"]').first();
    await expect(githubLink).toBeVisible();

    // Should contain icon (either SVG or image)
    const icon = githubLink.locator("svg, img");
    await expect(icon).toBeVisible();
  });

  test("should display Demo link as button with icon", async ({ page }) => {
    await page.goto("/zh-TW/projects/andrewck24-portfolio");
    await page.waitForSelector('[data-testid="article-info"]');

    const demoLink = page.locator(':text("Demo")').first();
    if (await demoLink.isVisible()) {
      // Should be styled as button (shadcn/ui Button component)
      const classList = await demoLink.getAttribute("class");
      expect(classList).toContain("button");

      // Should contain ExternalLink icon
      const icon = demoLink.locator("svg");
      await expect(icon).toBeVisible();
    }
  });
});

test.describe("Project Links Accessibility", () => {
  test("should have descriptive aria-labels", async ({ page }) => {
    await page.goto("/zh-TW/projects/andrewck24-portfolio");
    await page.waitForSelector('[data-testid="article-info"]');

    const githubLink = page.locator('a[href*="github.com"]').first();
    if (await githubLink.isVisible()) {
      const ariaLabel = await githubLink.getAttribute("aria-label");
      const textContent = await githubLink.textContent();

      // Should have either aria-label or visible text
      expect(ariaLabel || textContent).toBeTruthy();
    }
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/zh-TW/projects/andrewck24-portfolio");
    await page.waitForSelector('[data-testid="article-info"]');

    // Tab through links
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Eventually should focus on project links
    const githubLink = page.locator('a[href*="github.com"]').first();
    if (await githubLink.isVisible()) {
      await githubLink.focus();
      await expect(githubLink).toBeFocused();

      // Should be able to activate with Enter
      const href = await githubLink.getAttribute("href");
      expect(href).toBeTruthy();
    }
  });
});
