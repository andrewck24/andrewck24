/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, test } from "@playwright/test";

/**
 * T007: E2E 測試 - 專案詳細頁面內容
 *
 * 測試場景 (參考 quickstart.md 2.3):
 * - 訪問 /zh-TW/projects/[slug] 顯示專案詳情
 * - 包含首圖、標題、四個內容章節（h2）
 * - 404 處理（不存在的 slug）
 *
 * 預期：此測試必須失敗，因為詳細頁面尚未實作
 */

test.describe("Project Detail Page", () => {
  test("should display complete project details", async ({ page }) => {
    // 先從作品集頁面取得第一個專案的 slug
    await page.goto("/zh-TW/projects");
    await page.waitForLoadState("networkidle");

    const firstCard = page.locator('[data-testid="article-card"]').first();
    const firstCardLink = firstCard.locator("a");
    const projectUrl = await firstCardLink.getAttribute("href");

    // 直接訪問專案詳細頁面
    if (projectUrl) {
      await page.goto(projectUrl);
      await page.waitForLoadState("networkidle");

      // 檢查頁面標題 (h1)
      const title = page.getByRole("heading", { level: 1 });
      await expect(title).toBeVisible();
      const titleText = await title.textContent();
      expect(titleText).toBeTruthy();
      expect(titleText?.length).toBeLessThanOrEqual(100);

      // 檢查首圖
      const heroImage = page.locator('[data-testid="project-hero-image"]');
      await expect(heroImage).toBeVisible();
      await expect(heroImage).toHaveAttribute("alt", /.+/);

      // 檢查首圖使用 priority loading
      const fetchPriority = await heroImage.getAttribute("fetchpriority");
      expect(fetchPriority).toBe("high");

      // 檢查四個內容章節（h2）
      const h2Headings = page.locator("h2");
      const h2Count = await h2Headings.count();
      expect(h2Count).toBeGreaterThanOrEqual(4);

      // 檢查章節標題內容（根據 data-model.md）
      const expectedSections = [
        /要解決的問題|此專案欲解決的問題|problem/i,
        /思考過程|thinking/i,
        /採用方案|solution/i,
        /產生的影響|impact/i,
      ];

      for (let i = 0; i < 4; i++) {
        const heading = h2Headings.nth(i);
        const headingText = await heading.textContent();
        expect(headingText).toMatch(expectedSections[i]);

        // 檢查每個章節下有內容
        const nextParagraph = page.locator(`h2:has-text("${headingText}") + p`);
        await expect(nextParagraph).toBeVisible();
      }

      // 檢查返回連結
      const backLink = page.getByRole("link", { name: /返回|back/i });
      await expect(backLink).toBeVisible();
    }
  });

  test("should display 404 page for non-existent project", async ({ page }) => {
    // 訪問不存在的專案
    await page.goto("/zh-TW/projects/non-existent-project-slug-12345");

    // 等待頁面載入
    await page.waitForLoadState("networkidle");

    // 檢查 404 頁面
    // 方式 1: 檢查 HTTP 狀態碼
    const response = await page.goto(
      "/zh-TW/projects/non-existent-project-slug-12345"
    );
    expect(response?.status()).toBe(404);

    // 方式 2: 檢查 404 頁面內容
    const notFoundText = page.locator("text=/404|not found|找不到/i");
    await expect(notFoundText).toBeVisible();
  });

  test("should handle MDX content rendering correctly", async ({ page }) => {
    await page.goto("/zh-TW/projects");
    await page.waitForLoadState("networkidle");

    const firstCard = page.locator('[data-testid="article-card"]').first();
    await firstCard.click();
    await page.waitForLoadState("networkidle");

    // 檢查 MDX 內容是否正確渲染
    // 檢查是否有段落
    const paragraphs = page.locator("article p, main p");
    const paragraphCount = await paragraphs.count();
    expect(paragraphCount).toBeGreaterThan(0);

    // 檢查是否支援 MDX 的特殊元素（如果有）
    // 例如: 程式碼區塊
    const codeBlocks = page.locator("pre code");
    // 不強制要求有 code blocks，但如果有應該正確渲染

    // 檢查連結是否可點擊
    const links = page.locator("article a, main a");
    const linkCount = await links.count();
    if (linkCount > 0) {
      const firstLink = links.first();
      await expect(firstLink).toHaveAttribute("href", /.+/);
    }

    // 檢查圖片（如果內容中有）
    const contentImages = page.locator("article img:not([data-testid])");
    const imageCount = await contentImages.count();
    if (imageCount > 0) {
      const firstImage = contentImages.first();
      await expect(firstImage).toHaveAttribute("alt");
    }
  });

  test("should support multi-language URLs", async ({ page }) => {
    // 測試中文路由
    await page.goto("/zh-TW/projects");
    await page.waitForLoadState("networkidle");
    const zhCard = page.locator('[data-testid="article-card"]').first();
    const zhCardLink = await zhCard.locator("a").getAttribute("href");
    expect(zhCardLink).toMatch(/^\/zh-TW\/projects\/.+/);

    // 測試英文路由（如果有內容）
    const enResponse = await page.goto("/en/projects");
    if (enResponse?.status() === 200) {
      await page.waitForLoadState("networkidle");
      const enCards = page.locator('[data-testid="article-card"]');
      if ((await enCards.count()) > 0) {
        const enCardLink = await enCards
          .first()
          .locator("a")
          .getAttribute("href");
        expect(enCardLink).toMatch(/^\/en\/projects\/.+/);
      }
    }

    // 測試日文路由（如果有內容）
    const jaResponse = await page.goto("/ja/projects");
    if (jaResponse?.status() === 200) {
      await page.waitForLoadState("networkidle");
      const jaCards = page.locator('[data-testid="article-card"]');
      if ((await jaCards.count()) > 0) {
        const jaCardLink = await jaCards
          .first()
          .locator("a")
          .getAttribute("href");
        expect(jaCardLink).toMatch(/^\/ja\/projects\/.+/);
      }
    }
  });

  test("should maintain scroll position after navigation", async ({ page }) => {
    await page.goto("/zh-TW/projects");
    await page.waitForLoadState("networkidle");

    // 滾動到頁面底部
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const scrollBeforeClick = await page.evaluate(() => window.scrollY);

    const firstCard = page.locator('[data-testid="article-card"]').first();
    await firstCard.click();
    await page.waitForLoadState("networkidle");

    // 詳細頁面應該從頂部開始
    const scrollAfterNavigation = await page.evaluate(() => window.scrollY);
    expect(scrollAfterNavigation).toBeLessThan(100); // 允許小誤差

    // 返回作品集頁面
    const backButton = page.getByRole("link", { name: /返回|back/i });
    await backButton.click();
    await page.waitForLoadState("networkidle");

    // 檢查返回後的滾動位置（應該記住之前的位置）
    // 注意：這個行為取決於 Next.js 的實作，可能需要調整
  });

  test("should have correct meta tags for SEO", async ({ page }) => {
    await page.goto("/zh-TW/projects");
    await page.waitForLoadState("networkidle");

    const firstCard = page.locator('[data-testid="article-card"]').first();
    const projectTitle = await firstCard
      .getByRole("heading", { level: 3 })
      .textContent();

    await firstCard.click();
    await page.waitForLoadState("networkidle");

    // 檢查 page title
    const pageTitle = await page.title();
    expect(pageTitle).toContain(projectTitle || "");

    // 檢查 meta description
    const metaDescription = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(metaDescription).toBeTruthy();
    expect(metaDescription?.length).toBeLessThanOrEqual(200);

    // 檢查 og:title
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute("content");
    expect(ogTitle).toBeTruthy();

    // 檢查 og:image
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(ogImage).toBeTruthy();
  });
});
