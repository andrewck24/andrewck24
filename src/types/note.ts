/**
 * Note Schema - Type Definitions
 *
 * 定義 Notes 功能所有資料結構的 TypeScript 介面
 * 繼承自 ArticleMetadata 基礎型別
 */

import {
  articleMetadataSchema,
  SUPPORTED_LOCALES,
  type ArticleMetadata,
  type ArticlePageData,
  type Locale,
} from "@/types/article";
import { z } from "zod";

// ============================================================================
// Constants
// ============================================================================

/**
 * Featured Notes 顯示數量上限
 */
export const MAX_FEATURED_NOTES = 5;

/**
 * 支援的筆記分類
 */
export const NOTE_CATEGORIES = [
  "frontend",
  "backend",
  "devops",
  "testing",
  "design",
  "other",
] as const;

export type NoteCategory = (typeof NOTE_CATEGORIES)[number];

// ============================================================================
// Zod Schemas
// ============================================================================

/**
 * Note Frontmatter Schema
 *
 * 用於 MDX 檔案 frontmatter 的 Zod schema
 * 繼承 ArticleMetadata 並新增 notes 專屬欄位
 */
export const noteFrontmatterSchema = articleMetadataSchema
  .omit({ slug: true, locale: true, url: true })
  .extend({
    /** 標籤列表 */
    tags: z
      .array(z.string().min(1, "標籤不可為空").max(20, "標籤不可超過 20 字元"))
      .optional(),

    /** 分類 */
    category: z.enum(NOTE_CATEGORIES).optional(),

    /** 是否為精選筆記（預設: false） */
    featured: z.boolean().optional().default(false),
  });

/**
 * Note Metadata Schema
 *
 * 包含 frontmatter + 自動產生的 metadata
 */
export const noteMetadataSchema = noteFrontmatterSchema.extend({
  slug: z.string().min(1),
  locale: z.enum(SUPPORTED_LOCALES),
  url: z.string().url(),
});

// ============================================================================
// TypeScript Interfaces
// ============================================================================

/**
 * Note Frontmatter
 *
 * MDX 檔案中的 YAML frontmatter 結構
 */
export interface NoteFrontmatter {
  /** 筆記標題（≤100 字元） */
  title: string;

  /** 筆記簡述（≤200 字元） */
  description: string;

  /** 圖片類型選擇 */
  imageType?: "static" | "generated";

  /** 靜態圖片路徑（當 imageType: "static"） */
  image?: string;

  /** 動態 OG Image 配置（當 imageType: "generated"） */
  ogImage?: {
    /** 圖示圖片路徑 */
    icon?: string;
    /** 背景樣式（gradient/color/image） */
    background?: string;
    /** 自訂 CSS className（可選） */
    className?: string;
  };

  /** 筆記日期（ISO 8601: YYYY-MM-DD） */
  date: string;

  /** 標籤列表 */
  tags?: string[];

  /** 分類 */
  category?: NoteCategory;

  /** 是否為精選筆記（預設: false） */
  featured?: boolean;
}

/**
 * Note Metadata
 *
 * 完整的筆記資料，包含 frontmatter 和自動產生的 metadata
 * 繼承自 ArticleMetadata
 */
export interface NoteMetadata extends ArticleMetadata {
  /** 標籤列表 */
  tags?: string[];

  /** 分類 */
  category?: NoteCategory;

  /** 是否為精選筆記（預設: false） */
  featured?: boolean;
}

/**
 * Featured Note
 *
 * 精選筆記（featured: true 的筆記子集）
 */
export interface FeaturedNote extends NoteMetadata {
  featured: true;
}

/**
 * Note Page Data
 *
 * 筆記詳細頁面的完整資料
 */
export type NotePageData = ArticlePageData<NoteMetadata>;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * 檢查筆記是否為精選筆記
 */
export function isFeaturedNote(note: NoteMetadata): note is FeaturedNote {
  return note.featured === true;
}

/**
 * 檢查 article 是否為 NoteMetadata
 */
export function isNoteMetadata(
  article: ArticleMetadata
): article is NoteMetadata {
  return "tags" in article || "category" in article;
}

/**
 * 驗證筆記 frontmatter 是否合法
 */
export function validateNoteFrontmatter(
  data: unknown
): data is NoteFrontmatter {
  try {
    noteFrontmatterSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * 筆記列表查詢參數
 */
export interface NoteListQuery {
  /** 語言篩選 */
  locale?: Locale;

  /** 只顯示精選筆記 */
  featuredOnly?: boolean;

  /** 分類篩選 */
  category?: NoteCategory;

  /** 標籤篩選 */
  tags?: string[];

  /** 分頁：每頁數量 */
  limit?: number;

  /** 分頁：偏移量 */
  offset?: number;
}

/**
 * 筆記列表回傳結果
 */
export interface NoteListResult {
  /** 筆記列表 */
  notes: NoteMetadata[];

  /** 總數量 */
  total: number;

  /** 是否有下一頁 */
  hasMore: boolean;
}

// ============================================================================
// Re-export from article
// ============================================================================

export { SUPPORTED_LOCALES } from "./article";
export type { ArticleMetadata, ArticlePageData, Locale };
