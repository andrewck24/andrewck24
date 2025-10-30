/**
 * 語言可用性檢查工具
 *
 * 執行時機：Build time（靜態生成時）
 * 快取機制：React.cache()（單一請求內）
 */

import { cache } from "react";
import { projectsSource, notesSource } from "@/lib/source";
import type { Locale } from "@/types/article";
import { SUPPORTED_LOCALES } from "@/types/article";

/**
 * 取得指定內容的可用語言版本
 *
 * 使用 React.cache() 在單一請求/渲染樹中快取結果
 * 避免同一 slug 的重複 I/O 操作
 *
 * @param slug - 內容 slug
 * @param contentType - 內容類型
 * @returns 可用的語言代碼陣列（至少包含一個）
 *
 * @example
 * const availableLocales = await getAvailableLocales("portfolio", "projects");
 * // => ["zh-TW", "en"]
 */
export const getAvailableLocales = cache(
  async (
    slug: string,
    contentType: "projects" | "notes"
  ): Promise<Locale[]> => {
    const source = contentType === "projects" ? projectsSource : notesSource;
    const availableLocales: Locale[] = [];

    // 檢查每個支援的語言
    for (const locale of SUPPORTED_LOCALES) {
      const page = source.getPage([slug], locale);
      if (page) {
        availableLocales.push(locale);
      }
    }

    return availableLocales;
  }
);

/**
 * 檢查特定語言版本是否存在
 */
export async function hasLocale(
  slug: string,
  locale: Locale,
  contentType: "projects" | "notes"
): Promise<boolean> {
  const availableLocales = await getAvailableLocales(slug, contentType);
  return availableLocales.includes(locale);
}
