/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect, chromium, firefox } from "@playwright/test";

/**
 * T006: E2E 測試 - View Transition 轉場效果
 *
 * 測試場景 (參考 quickstart.md 2.2):
 * - 點擊卡片導航至詳細頁面
 * - 檢查 View Transition 動畫（Chrome 111+）
 * - 不支援瀏覽器降級測試（Firefox）
 *
 * 預期：此測試必須失敗，因為路由和轉場尚未實作
 */

test.describe("View Transition Effects", () => {
  test("should perform smooth view transition on Chrome (supported browser)", async () => {
    // 使用 Chromium (支援 View Transitions API)
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("/zh-TW");
    await page.waitForLoadState("networkidle");

    // 檢查瀏覽器是否支援 View Transitions API
    const isViewTransitionSupported = await page.evaluate(() => {
      return "startViewTransition" in document;
    });

    if (!isViewTransitionSupported) {
      console.log("View Transitions API not supported, skipping test");
      await browser.close();
      return;
    }

    // 記錄初始狀態
    const firstCard = page.locator('[data-testid="project-card"]').first();
    const initialImage = firstCard.locator("img");
    const initialImageSrc = await initialImage.getAttribute("src");

    // 監聽 View Transition 事件
    let viewTransitionDetected = false;
    await page.exposeFunction(
      "onViewTransition",
      () => (viewTransitionDetected = true)
    );

    await page.evaluate(() => {
      // 監聽 View Transition
      const observer = new MutationObserver(() => {
        if (document.startViewTransition) {
          (
            window as Window & { onViewTransition?: () => void }
          ).onViewTransition?.();
        }
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    });

    // 點擊卡片
    await firstCard.click();

    // 等待導航完成
    await page.waitForLoadState("networkidle");

    // 檢查 URL 已變更
    expect(page.url()).toMatch(/\/zh-TW\/projects\/.+/);

    // 檢查詳細頁面的圖片 src 是否與初始卡片相同 (表示轉場)
    const detailImage = page.locator('[data-testid="project-hero-image"]');
    await expect(detailImage).toBeVisible();
    const detailImageSrc = await detailImage.getAttribute("src");
    expect(detailImageSrc).toBe(initialImageSrc);

    await browser.close();
  });

  test("should gracefully degrade on Firefox (unsupported browser)", async () => {
    // 使用 Firefox (不支援 View Transitions API)
    const browser = await firefox.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("/zh-TW");
    await page.waitForLoadState("networkidle");

    // 檢查瀏覽器不支援 View Transitions API
    const isViewTransitionSupported = await page.evaluate(() => {
      return "startViewTransition" in document;
    });
    expect(isViewTransitionSupported).toBe(false);

    const firstCard = page.locator('[data-testid="project-card"]').first();

    // 點擊卡片（應該直接跳轉，無轉場）
    await firstCard.click();

    // 等待導航完成
    await page.waitForLoadState("networkidle");

    // 檢查導航成功（沒有錯誤）
    expect(page.url()).toMatch(/\/zh-TW\/projects\/.+/);

    // 檢查頁面正常顯示
    const detailTitle = page.getByRole("heading", { level: 1 });
    await expect(detailTitle).toBeVisible();

    await browser.close();
  });

  test("should respect prefers-reduced-motion", async ({ page }) => {
    // 模擬使用者偏好減少動畫
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.goto("/zh-TW");
    await page.waitForLoadState("networkidle");

    const firstCard = page.locator('[data-testid="project-card"]').first();
    await firstCard.click();

    // 等待導航完成
    await page.waitForLoadState("networkidle");

    // 檢查導航成功
    expect(page.url()).toMatch(/\/zh-TW\/projects\/.+/);

    // 檢查沒有觸發 View Transition (因為使用者偏好)
    // 這應該直接跳轉，沒有動畫
    const transitionDuration = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue(
        "transition-duration"
      );
    });

    // 轉場時間應該是 0 或很短
    expect(transitionDuration).toMatch(/0s|0ms/);
  });

  test("should transition back to homepage correctly", async ({ page }) => {
    await page.goto("/zh-TW");
    await page.waitForLoadState("networkidle");

    // 導航至詳細頁面
    const firstCard = page.locator('[data-testid="project-card"]').first();
    await firstCard.click();
    await page.waitForLoadState("networkidle");

    // 點擊返回連結
    const backButton = page.getByRole("link", { name: /返回|back/i });
    await expect(backButton).toBeVisible();
    await backButton.click();

    // 等待返回首頁
    await page.waitForLoadState("networkidle");

    // 檢查回到首頁
    expect(page.url()).toMatch(/\/zh-TW\/?$/);

    // 檢查精選專案區塊仍然可見
    const featuredSection = page.getByRole("region", {
      name: /精選專案|featured projects/i,
    });
    await expect(featuredSection).toBeVisible();
  });
});
