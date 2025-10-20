/**
 * Article Schema - Base Type Definitions
 *
 * 定義泛用型 article 元件系統的基礎資料結構
 * 供 projects 和 notes 共用
 */

import { z } from "zod";

// ============================================================================
// Enums & Constants
// ============================================================================

/**
 * 支援的語言
 */
export const SUPPORTED_LOCALES = ["zh-TW", "en", "ja"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

// ============================================================================
// Zod Schemas
// ============================================================================

/**
 * OGImageConfig Schema
 *
 * 動態生成 OG Image 的配置
 * 支援三種 background 格式：CSS gradient / 純色 / 圖片路徑
 */
export const ogImageConfigSchema = z.object({
  /** 圖示圖片路徑 */
  icon: z.string().optional(),

  /**
   * 背景樣式
   * 支援：
   * - 圖片路徑：/images/projects/og-backgrounds/common/bg.jpg
   * - CSS Gradient：linear-gradient(135deg, #667eea 0%, #764ba2 100%)
   * - Hex Color：#667eea, #f3f4f6
   * - RGB/RGBA：rgb(102, 126, 234), rgba(102, 126, 234, 0.8)
   * - HSL/HSLA：hsl(235, 72%, 61%), hsla(235, 72%, 61%, 0.8)
   */
  background: z
    .string()
    .refine(
      (val) => {
        // 允許圖片路徑、CSS gradient、或純色
        if (val.startsWith("/")) return true; // 圖片路徑
        if (val.includes("gradient")) return true; // CSS gradient
        if (/^#[0-9a-f]{3,8}$/i.test(val)) return true; // Hex color
        if (val.startsWith("rgb")) return true; // RGB/RGBA
        if (val.startsWith("hsl")) return true; // HSL/HSLA
        return false;
      },
      {
        message: "background 必須為圖片路徑、CSS gradient、或有效的 CSS color",
      }
    )
    .optional(),

  /** 自訂 CSS className */
  className: z.string().optional(),
});

/**
 * Article Metadata Schema
 *
 * 所有文章類型的共同屬性
 */
export const articleMetadataSchema = z.object({
  /** 文章標題（≤100 字元） */
  title: z.string().min(1, "標題不可為空").max(100, "標題不可超過 100 字元"),

  /** 文章簡述（≤200 字元） */
  description: z
    .string()
    .min(1, "描述不可為空")
    .max(200, "描述不可超過 200 字元"),

  /** 主視覺類型 */
  imageType: z.enum(["static", "generated"]).default("static"),

  /** 靜態圖片路徑（當 imageType="static" 時必填） */
  image: z
    .string()
    .regex(
      /^\/images\/(projects|notes)\/hero\/(zh-TW|en|ja)\/[a-z0-9-]+\.(jpg|jpeg|png|webp|avif)$/i,
      "圖片路徑格式: /images/{projects|notes}/hero/{locale}/*.{jpg|jpeg|png|webp|avif}"
    )
    .optional(),

  /** 動態生成設定（當 imageType="generated" 時選填） */
  ogImage: ogImageConfigSchema.optional(),

  /** 發布日期（ISO 8601: YYYY-MM-DD） */
  date: z
    .union([
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式: YYYY-MM-DD"),
      z.date(),
    ])
    .transform((val) => {
      if (val instanceof Date) {
        return val.toISOString().split("T")[0];
      }
      return val;
    }),

  /** URL slug（自動產生自檔名） */
  slug: z.string().min(1),

  /** 語言代碼 */
  locale: z.enum(SUPPORTED_LOCALES),

  /** 完整 URL 路徑 */
  url: z.string().url(),
});

// ============================================================================
// TypeScript Interfaces
// ============================================================================

/**
 * OGImageConfig
 *
 * 動態生成 OG Image 的配置
 */
export interface OGImageConfig {
  /** 圖示圖片路徑 */
  icon?: string;

  /** 背景樣式（支援 gradient/color/image） */
  background?: string;

  /** 自訂 CSS className */
  className?: string;
}

/**
 * ArticleMetadata
 *
 * 所有文章類型的共同屬性（基礎型別）
 */
export interface ArticleMetadata {
  /** 文章標題（≤100 字元） */
  title: string;

  /** 文章簡述（≤200 字元） */
  description: string;

  /** 主視覺類型 */
  imageType?: "static" | "generated";

  /** 靜態圖片路徑 */
  image?: string;

  /** 動態生成設定 */
  ogImage?: OGImageConfig;

  /** 發布日期（ISO 8601: YYYY-MM-DD） */
  date: string;

  /** URL slug */
  slug: string;

  /** 語言代碼 */
  locale: Locale;

  /** 完整 URL 路徑 */
  url: string;
}

/**
 * ArticlePageData
 *
 * 包含 MDX 內容的完整文章資料（泛用型 wrapper）
 */
export type ArticlePageData<T extends ArticleMetadata = ArticleMetadata> = T & {
  /** MDX 內容（已編譯的 React component） */
  content: React.ComponentType;

  /** MDX 檔案的原始 body 內容 */
  body: string;
};

// ============================================================================
// Type Guards
// ============================================================================

/**
 * 檢查文章是否為精選文章
 *
 * 泛用型 helper，適用於 projects 和 notes
 */
export function isFeaturedArticle(article: ArticleMetadata): boolean {
  return "featured" in article && article.featured === true;
}

/**
 * 檢查 article 是否為 ProjectMetadata
 *
 * Note: 此函式需要在 runtime 使用，因為 ProjectMetadata 定義在 project.ts
 * 檢查邏輯：ProjectMetadata 包含 featured 和 order 欄位
 */
export function isProjectMetadata(article: ArticleMetadata): boolean {
  return "featured" in article && "order" in article;
}

/**
 * 檢查 article 是否為 NoteMetadata
 *
 * Note: 此函式需要在 runtime 使用，因為 NoteMetadata 定義在 note.ts
 * 檢查邏輯：NoteMetadata 包含 tags 或 category 欄位
 */
export function isNoteMetadata(article: ArticleMetadata): boolean {
  return "tags" in article || "category" in article;
}
