/**
 * Project Schema - Type Definitions
 *
 * 定義 Projects 功能所有資料結構的 TypeScript 介面
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

/**
 * Featured Projects 顯示數量上限
 */
export const MAX_FEATURED_PROJECTS = 5;

/**
 * Order 欄位範圍
 */
export const ORDER_MIN = 1;
export const ORDER_MAX = 99;

// ============================================================================
// Zod Schemas
// ============================================================================

/**
 * Project Frontmatter Schema
 *
 * 用於 MDX 檔案 frontmatter 的 Zod schema
 */
export const projectFrontmatterSchema = z.object({
  title: z.string().min(1, "標題不可為空").max(100, "標題不可超過 100 字元"),

  description: z
    .string()
    .min(1, "描述不可為空")
    .max(200, "描述不可超過 200 字元"),

  // Image type selector
  imageType: z.enum(["static", "generated"]).default("static"),

  // Static image path (for imageType: "static")
  image: z
    .string()
    .regex(
      /^\/images\/projects\/hero\/(zh-TW|en|ja)\/[a-z0-9-]+\.(jpg|jpeg|png|webp|avif)$/i,
      "圖片路徑格式: /images/projects/hero/{locale}/*.{jpg|jpeg|png|webp|avif}"
    )
    .optional(),

  // Generated OG Image config (for imageType: "generated")
  ogImage: z
    .object({
      text: z.string().optional(),
      background: z
        .string()
        .regex(
          /^\/images\/projects\/og-backgrounds\/(common|zh-TW|en|ja)\/[a-z0-9-]+\.(jpg|jpeg|png|webp|avif)$/i,
          "背景圖路徑格式: /images/projects/og-backgrounds/{common|locale}/*.{jpg|jpeg|png|webp|avif}"
        )
        .optional(),
      className: z.string().optional(),
    })
    .optional(),

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

  featured: z.boolean().optional().default(false),

  order: z
    .number()
    .int("order 必須為整數")
    .min(ORDER_MIN, `order 最小值為 ${ORDER_MIN}`)
    .max(ORDER_MAX, `order 最大值為 ${ORDER_MAX}`)
    .optional(),
});

/**
 * Project Metadata Schema
 *
 * 包含 frontmatter + 自動產生的 metadata
 */
export const projectMetadataSchema = projectFrontmatterSchema.extend({
  slug: z.string().min(1),
  locale: z.enum(SUPPORTED_LOCALES),
  url: z.string().url(),
});

// ============================================================================
// TypeScript Interfaces
// ============================================================================

/**
 * Project Frontmatter
 *
 * MDX 檔案中的 YAML frontmatter 結構
 */
export interface ProjectFrontmatter {
  /** 專案標題（≤100 字元） */
  title: string;

  /** 專案簡述（≤200 字元） */
  description: string;

  /** 圖片類型選擇 */
  imageType?: "static" | "generated";

  /** 靜態圖片路徑（當 imageType: "static"） */
  image?: string;

  /** 動態 OG Image 配置（當 imageType: "generated"） */
  ogImage?: {
    /** 自訂圖片文字內容（純文字） */
    text?: string;
    /** 背景圖路徑（可選） */
    background?: string;
    /** 自訂 CSS className（可選） */
    className?: string;
  };

  /** 專案日期（ISO 8601: YYYY-MM-DD） */
  date: string;

  /** 是否為精選專案（預設: false） */
  featured?: boolean;

  /** 排序順序（1-99，僅用於 featured=true 的專案） */
  order?: number;
}

/**
 * Project Metadata
 *
 * 完整的專案資料，包含 frontmatter 和自動產生的 metadata
 */
export interface ProjectMetadata extends ProjectFrontmatter {
  /** 專案 slug（檔名不含副檔名） */
  slug: string;

  /** 語言代碼 */
  locale: Locale;

  /** 完整 URL 路徑（/[locale]/projects/[slug]） */
  url: string;
}

/**
 * Featured Project
 *
 * 精選專案（featured: true 的專案子集）
 */
export interface FeaturedProject extends ProjectMetadata {
  featured: true;
}

/**
 * Project Page Data
 *
 * 專案詳細頁面的完整資料
 */
export interface ProjectPageData extends ProjectMetadata {
  /** MDX 內容（已編譯的 React component） */
  content: React.ComponentType;

  /** MDX 檔案的原始 body 內容 */
  body: string;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * 檢查專案是否為精選專案
 */
export function isFeaturedProject(
  project: ProjectMetadata
): project is FeaturedProject {
  return project.featured === true;
}

/**
 * 驗證專案 frontmatter 是否合法
 */
export function validateProjectFrontmatter(
  data: unknown
): data is ProjectFrontmatter {
  try {
    projectFrontmatterSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * 專案列表查詢參數
 */
export interface ProjectListQuery {
  /** 語言篩選 */
  locale?: Locale;

  /** 只顯示精選專案 */
  featuredOnly?: boolean;

  /** 分頁：每頁數量 */
  limit?: number;

  /** 分頁：偏移量 */
  offset?: number;
}

/**
 * 專案列表回傳結果
 */
export interface ProjectListResult {
  /** 專案列表 */
  projects: ProjectMetadata[];

  /** 總數量 */
  total: number;

  /** 是否有下一頁 */
  hasMore: boolean;
}
