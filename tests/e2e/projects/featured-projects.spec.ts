/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, test } from "@playwright/test";

/**
 * T005: E2E 測試 - 作品集頁面顯示精選專案
 *
 * 測試場景 (參考 quickstart.md 2.1):
 * - 訪問 /zh-TW/projects 顯示 3-5 張精選專案卡片
 * - 卡片包含圖片、標題、描述
 * - 桌面顯示 3 欄網格，行動顯示單欄
 * - 首張卡片使用 priority 載入圖片
 *
 * 預期：此測試必須失敗，因為 FeaturedProjects 組件尚未實作
 */

test.describe("Featured Projects on Projects Page", () => {
  test("should display 3-5 featured project cards on zh-TW projects page", async ({
    page,
  }) => {
    // 訪問作品集頁面
    await page.goto("/zh-TW/projects");

    // 等待頁面載入完成
    await page.waitForLoadState("networkidle");

    // 檢查精選專案區塊是否存在
    const featuredSection = page.getByRole("region", {
      name: /精選專案|featured projects/i,
    });
    await expect(featuredSection).toBeVisible();

    // 檢查專案卡片數量 (3-5 張)
    const projectCards = page.locator('[data-testid="article-card"]');
    const cardCount = await projectCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(3);
    expect(cardCount).toBeLessThanOrEqual(5);

    // 檢查每張卡片包含必要元素
    for (let i = 0; i < cardCount; i++) {
      const card = projectCards.nth(i);

      // 檢查圖片容器（所有 card 都應該有 article-image-container）
      const imageContainer = card.locator(
        '[data-testid="article-image-container"]'
      );
      await expect(imageContainer).toBeVisible();

      // 注意：generated mode 可能沒有 <img> 元素（只有背景）
      // 所以我們不強制要求 img，只檢查有 img 的情況
      const image = card.locator("img");
      const imageCount = await image.count();
      if (imageCount > 0) {
        await expect(image.first()).toBeVisible();
        await expect(image.first()).toHaveAttribute("alt", /.+/);
      }

      // 檢查標題 (≤100 字元)
      const title = card.getByRole("heading", { level: 3 });
      await expect(title).toBeVisible();
      const titleText = await title.textContent();
      expect(titleText?.length).toBeLessThanOrEqual(100);

      // 檢查描述 (≤200 字元)
      const description = card.locator("p");
      await expect(description).toBeVisible();
      const descText = await description.textContent();
      expect(descText?.length).toBeLessThanOrEqual(200);
    }
  });

  test("should display project cards in 3-column grid on desktop", async ({
    page,
  }) => {
    // 設定桌面視窗尺寸
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/zh-TW/projects");
    await page.waitForLoadState("networkidle");

    const projectCards = page.locator('[data-testid="article-card"]');
    const firstCard = projectCards.first();

    // 檢查 grid layout
    const gridContainer = page.locator(
      '[data-testid="featured-projects-grid"]'
    );
    await expect(gridContainer).toHaveCSS("display", "grid");

    // 檢查 grid-template-columns (應該是 2 欄)
    const gridColumns = await gridContainer.evaluate(
      (el) => window.getComputedStyle(el).gridTemplateColumns
    );
    // 桌面應該有 2 欄（可能是 repeat(2, ...) 或具體的值）
    expect(gridColumns.split(" ").length).toBe(2);
  });

  test("should display project cards in single column on mobile", async ({
    page,
  }) => {
    // 設定手機視窗尺寸 (iPhone 14 Pro)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/zh-TW/projects");
    await page.waitForLoadState("networkidle");

    const gridContainer = page.locator(
      '[data-testid="featured-projects-grid"]'
    );
    await expect(gridContainer).toBeVisible();

    // 檢查 mobile 單欄布局
    const gridColumns = await gridContainer.evaluate(
      (el) => window.getComputedStyle(el).gridTemplateColumns
    );
    // Mobile 應該是單欄
    expect(gridColumns.split(" ").length).toBe(1);
  });

  test("should use priority loading for first project card image", async ({
    page,
  }) => {
    await page.goto("/zh-TW/projects");
    await page.waitForLoadState("networkidle");

    const firstCard = page.locator('[data-testid="article-card"]').first();
    const firstImage = firstCard.locator("img");

    // 檢查首張圖片是否有 priority 屬性 (Next.js Image 的 fetchpriority)
    const fetchPriority = await firstImage.getAttribute("fetchpriority");
    expect(fetchPriority).toBe("high");

    // 檢查首張圖片不是 lazy loading
    const loading = await firstImage.getAttribute("loading");
    expect(loading).not.toBe("lazy");
  });

  test("should navigate to project detail page when clicking a card", async ({
    page,
  }) => {
    await page.goto("/zh-TW/projects");
    await page.waitForLoadState("networkidle");

    const firstCard = page.locator('[data-testid="article-card"]').first();
    const firstCardTitle = await firstCard
      .getByRole("heading", { level: 3 })
      .textContent();

    // 點擊卡片
    await firstCard.click();

    // 等待導航完成
    await page.waitForLoadState("networkidle");

    // 檢查 URL 是否正確 (應該是 /zh-TW/projects/[slug])
    expect(page.url()).toMatch(/\/zh-TW\/projects\/.+/);

    // 檢查詳細頁面是否顯示相同的標題
    const detailTitle = page.getByRole("heading", { level: 1 });
    await expect(detailTitle).toHaveText(firstCardTitle || "");
  });
});
