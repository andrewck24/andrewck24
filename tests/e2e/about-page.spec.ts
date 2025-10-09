import { expect, test } from "@playwright/test";

test.describe("About Page", () => {
  test.describe("T004: Basic page access and content rendering", () => {
    test("should display all content sections in Chinese", async ({ page }) => {
      await page.goto("/zh-TW/about");

      // Verify page title (關於 | Andrew Tseng - Software Engineer)
      await expect(page).toHaveTitle(/關於.*Andrew Tseng/);

      // Verify main sections exist
      const introSection = page.getByTestId("about-section-introduction");
      const skillsSection = page.getByTestId("about-section-skills");
      const educationSection = page.getByTestId("about-section-education");
      const certificationsSection = page.getByTestId(
        "about-section-certifications"
      );

      await expect(introSection).toBeVisible();
      await expect(skillsSection).toBeVisible();
      await expect(educationSection).toBeVisible();
      await expect(certificationsSection).toBeVisible();
    });

    test("should display correct education details", async ({ page }) => {
      await page.goto("/zh-TW/about");

      const educationSection = page.getByTestId("about-section-education");

      // Verify Education content
      await expect(educationSection).toContainText("國立台灣大學");
      await expect(educationSection).toContainText("2017");
      await expect(educationSection).toContainText("2023");
      await expect(educationSection).toContainText("文學士");
      await expect(educationSection).toContainText("日本語文學");
      await expect(educationSection).toContainText("經濟學");
    });

    test("should display all certifications", async ({ page }) => {
      await page.goto("/zh-TW/about");

      const certificationsSection = page.getByTestId(
        "about-section-certifications"
      );

      // Verify all 4 certifications
      await expect(certificationsSection).toContainText(
        "Google Cloud Platform"
      );
      await expect(certificationsSection).toContainText("2025");
      await expect(certificationsSection).toContainText("TOEIC");
      await expect(certificationsSection).toContainText("965");
      await expect(certificationsSection).toContainText("USCPA");
      await expect(certificationsSection).toContainText("2023");
      await expect(certificationsSection).toContainText("JLPT");
      await expect(certificationsSection).toContainText("N1");
      await expect(certificationsSection).toContainText("2019");
    });
  });

  test.describe("T005: Multi-language content", () => {
    test("should display Chinese content correctly", async ({ page }) => {
      await page.goto("/zh-TW/about");

      // Verify page title
      await expect(page).toHaveTitle(/關於.*Andrew Tseng/);

      // Verify Chinese content
      await expect(page.getByText("國立台灣大學")).toBeVisible();
      await expect(page.getByText("文學士")).toBeVisible();
      await expect(page.getByText("日本語文學")).toBeVisible();
      await expect(page.getByText("經濟學")).toBeVisible();
    });

    test("should display English content correctly", async ({ page }) => {
      await page.goto("/en/about");

      // Verify page title
      await expect(page).toHaveTitle(/About.*Andrew Tseng/);

      // Verify English content
      await expect(page.getByText("National Taiwan University")).toBeVisible();
      await expect(page.getByText("Bachelor of Arts")).toBeVisible();
      await expect(
        page.getByText("Japanese Language and Literature")
      ).toBeVisible();
    });

    test("should display Japanese content correctly", async ({ page }) => {
      await page.goto("/ja/about");

      // Verify page title
      await expect(page).toHaveTitle(/私について.*Andrew Tseng/);

      // Verify Japanese content
      await expect(page.getByText("国立台湾大学")).toBeVisible();
      await expect(page.getByText("文学士")).toBeVisible();
      await expect(page.getByText("日本語文学")).toBeVisible();
    });

    test("should maintain content parity across languages", async ({
      page,
    }) => {
      // Count sections in Chinese version
      await page.goto("/zh-TW/about");
      const zhSections = await page
        .locator('section[data-testid^="about-section-"]')
        .count();

      // Count sections in English version
      await page.goto("/en/about");
      const enSections = await page
        .locator('section[data-testid^="about-section-"]')
        .count();

      // Count sections in Japanese version
      await page.goto("/ja/about");
      const jaSections = await page
        .locator('section[data-testid^="about-section-"]')
        .count();

      // All versions should have same number of sections
      expect(zhSections).toBe(enSections);
      expect(enSections).toBe(jaSections);
      expect(zhSections).toBeGreaterThan(0);
    });
  });

  test.describe("T006: Responsive design", () => {
    test("should be readable on mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/en/about");

      // Verify no horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);

      // Verify minimum font size (14px)
      const fontSize = await page
        .locator("body")
        .evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue("font-size")
        );
      const fontSizeValue = parseInt(fontSize);
      expect(fontSizeValue).toBeGreaterThanOrEqual(14);

      // Verify content is visible
      await expect(page.getByTestId("about-page")).toBeVisible();
    });

    test("should adapt layout on tablet viewport", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/en/about");

      // Verify page loads and content is visible
      await expect(page.getByTestId("about-page")).toBeVisible();
      await expect(
        page.getByTestId("about-section-introduction")
      ).toBeVisible();

      // Verify no horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
    });

    test("should display properly on desktop viewport", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto("/en/about");

      await expect(page.getByTestId("about-page")).toBeVisible();
      await expect(
        page.getByTestId("about-section-introduction")
      ).toBeVisible();
      await expect(page.getByTestId("about-section-skills")).toBeVisible();
      await expect(page.getByTestId("about-section-education")).toBeVisible();
      await expect(
        page.getByTestId("about-section-certifications")
      ).toBeVisible();
    });
  });
});
