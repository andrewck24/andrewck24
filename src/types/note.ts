/**
 * Note Type Definitions
 *
 * 筆記相關的型別定義、常數與輔助函式
 * 核心 schema 定義於 @/types/article
 */

import {
  type ArticleCardData,
  type ArticlePageData,
  type Locale,
  type NoteArticle,
} from "@/types/article";

// ============================================================================
// Re-exports (主要型別)
// ============================================================================

/**
 * Note Metadata (使用統一的 NoteArticle 型別)
 */
export type NoteMetadata = NoteArticle;

/**
 * Note Card Data
 * 包含 metadata 和導航欄位的筆記資料（用於卡片元件）
 */
export type NoteCardData = ArticleCardData<NoteArticle>;

/**
 * Note Page Data
 * 包含 MDX 內容的完整筆記資料
 */
export type NotePageData = ArticlePageData<NoteArticle>;

/**
 * Featured Note
 * 精選筆記（featured: true）
 */
export interface FeaturedNote extends NoteArticle {
  featured: true;
}

/**
 * Featured Note Card Data
 * 精選筆記的卡片資料（用於列表頁）
 */
export type FeaturedNoteCardData = ArticleCardData<FeaturedNote>;

// Re-export locale type
export type { Locale };

// ============================================================================
// Constants
// ============================================================================

/**
 * Featured Notes 顯示數量上限
 */
export const MAX_FEATURED_NOTES = 5;

// ============================================================================
// Helper Types
// ============================================================================

/**
 * 筆記列表查詢參數
 */
export interface NoteListQuery {
  /** 語言篩選 */
  locale?: Locale;

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
