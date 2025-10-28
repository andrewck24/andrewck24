/**
 * Article Schema & Type Definitions (T004)
 *
 * 統一的 article schema 與型別系統
 * 此檔案為 schema 定義的唯一來源（Single Source of Truth）
 *
 * @see specs/004-mdx-frontmatter-1/contracts/schema.ts
 */

import { frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";

// ============================================================================
// Locale Types (保留既有定義於 L17-18)
// ============================================================================

/**
 * 支援的語言代碼
 */
export const SUPPORTED_LOCALES = ["zh-TW", "en", "ja"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

// ============================================================================
// Zod Schemas (Single Source of Truth)
// ============================================================================

/**
 * Base article schema (T001)
 *
 * 統一的基礎 schema，供 projects 和 notes 共用
 * 包含共同欄位：imageType, image, ogImage, date, tags
 */
export const baseArticleSchema = frontmatterSchema.extend({
  /**
   * Image type selector
   * @default "static"
   */
  imageType: z.enum(["static", "generated"]).default("static"),

  /**
   * Static image path (when imageType === "static")
   * Pattern: /images/{projects|notes}/{locale}/*.{ext}
   * Note: Simplified path (removed /hero/ nesting)
   */
  image: z
    .string()
    .regex(
      /^\/images\/(projects|notes)\/(zh-TW|en|ja)\/[a-z0-9-]+\.(jpg|jpeg|png|webp|avif)$/i,
      "圖片路徑格式: /images/{projects|notes}/{locale}/*.{jpg|jpeg|png|webp|avif}"
    )
    .optional(),

  /**
   * Generated OG image configuration (when imageType === "generated")
   */
  ogImage: z
    .object({
      icon: z.string().optional(),
      background: z.string().optional(),
      className: z.string().optional(),
    })
    .optional(),

  /**
   * Publication date (YYYY-MM-DD format)
   * Accepts string or Date, transformed to string
   */
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

  /**
   * Tags for search filtering (hybrid mode: suggested + custom)
   * @default []
   */
  tags: z.array(z.string()).default([]),
});

/**
 * Project article schema (T002)
 *
 * 擴充 baseArticleSchema，加入專案特有欄位
 */
export const projectArticleSchema = baseArticleSchema.extend({
  /**
   * GitHub repository URL (optional)
   */
  githubUrl: z.string().url().optional(),

  /**
   * Live demo URL (optional)
   */
  demoUrl: z.string().url().optional(),

  /**
   * Featured flag (for homepage display)
   * @default false
   */
  featured: z.boolean().default(false),

  /**
   * Display order for featured projects (1-99)
   */
  order: z.number().int().min(1).max(99).optional(),
});

/**
 * Note article schema (T003)
 *
 * 擴充 baseArticleSchema，加入筆記特有欄位
 * 保留 featured 以相容既有實作（用於首頁展示）
 */
export const noteArticleSchema = baseArticleSchema.extend({
  /**
   * Featured flag (optional, for homepage display)
   * @default false
   */
  featured: z.boolean().optional().default(false),
});

// ============================================================================
// Inferred TypeScript Types
// ============================================================================

/**
 * Base article type (所有文章的基礎型別)
 *
 * 包含共同欄位：title, description, imageType, image, ogImage, date, tags
 */
export type BaseArticle = z.infer<typeof baseArticleSchema>;

/**
 * Project article type (專案文章型別)
 *
 * 擴充 BaseArticle，額外包含：githubUrl, demoUrl, featured, order
 */
export type ProjectArticle = z.infer<typeof projectArticleSchema>;

/**
 * Note article type (筆記文章型別)
 *
 * 擴充 BaseArticle，額外包含：featured
 */
export type NoteArticle = z.infer<typeof noteArticleSchema>;

/**
 * Article card data (用於卡片元件的文章資料)
 *
 * 包含文章 metadata 和導航欄位，但不包含 MDX 內容
 * 用於列表頁和卡片元件
 *
 * @template T - Article type (BaseArticle | ProjectArticle | NoteArticle)
 */
export type ArticleCardData<T extends BaseArticle = BaseArticle> = T & {
  /** URL slug (fumadocs 自動生成) */
  slug: string;

  /** 語言代碼 (fumadocs 自動生成) */
  locale: Locale;

  /** 完整 URL 路徑 (fumadocs 自動生成) */
  url: string;
};

/**
 * Article page data (包含 MDX 內容的完整文章資料)
 *
 * 泛型 wrapper，結合文章 metadata 與編譯後的 MDX 內容
 * 包含 fumadocs 自動生成的欄位（slug, locale, url）
 *
 * @template T - Article type (BaseArticle | ProjectArticle | NoteArticle)
 */
export type ArticlePageData<T extends BaseArticle = BaseArticle> = T & {
  /** URL slug (fumadocs 自動生成) */
  slug: string;

  /** 語言代碼 (fumadocs 自動生成) */
  locale: Locale;

  /** 完整 URL 路徑 (fumadocs 自動生成) */
  url: string;

  /** 編譯後的 MDX 內容 (React component) */
  content: React.ComponentType;

  /** 原始 MDX body 文字 */
  body: string;
};

// ============================================================================
// Type Guards (型別守衛函式)
// ============================================================================

/**
 * 檢查文章是否為專案類型
 */
export function isProjectArticle(
  article: BaseArticle
): article is ProjectArticle {
  return (
    "githubUrl" in article || "demoUrl" in article || "featured" in article
  );
}

/**
 * 檢查文章是否為筆記類型
 */
export function isNoteArticle(article: BaseArticle): article is NoteArticle {
  return !isProjectArticle(article);
}

/**
 * 檢查專案是否為精選專案
 */
export function isFeaturedProject(article: ProjectArticle): boolean {
  return article.featured === true;
}
