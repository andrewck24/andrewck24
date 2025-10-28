/**
 * Project Type Definitions
 *
 * 專案相關的型別定義、常數與輔助函式
 * 核心 schema 定義於 @/types/article
 */

import {
  projectArticleSchema,
  type ProjectArticle,
  type BaseArticle,
  type ArticleCardData,
  type ArticlePageData,
  type Locale,
  isProjectArticle,
  isFeaturedProject as isFeaturedProjectBase,
} from "@/types/article";

// ============================================================================
// Re-exports (主要型別)
// ============================================================================

/**
 * Project Metadata (使用統一的 ProjectArticle 型別)
 */
export type ProjectMetadata = ProjectArticle;

/**
 * Project Card Data
 * 包含 metadata 和導航欄位的專案資料（用於卡片元件）
 */
export type ProjectCardData = ArticleCardData<ProjectArticle>;

/**
 * Project Page Data
 * 包含 MDX 內容的完整專案資料
 */
export type ProjectPageData = ArticlePageData<ProjectArticle>;

/**
 * Featured Project
 * 精選專案（featured: true）
 */
export interface FeaturedProject extends ProjectArticle {
  featured: true;
}

/**
 * Featured Project Card Data
 * 精選專案的卡片資料（用於列表頁）
 */
export type FeaturedProjectCardData = ArticleCardData<FeaturedProject>;

// Re-export locale type
export type { Locale };

// ============================================================================
// Constants
// ============================================================================

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
// Type Guards
// ============================================================================

/**
 * 檢查專案是否為精選專案
 */
export function isFeaturedProject(
  project: ProjectArticle
): project is FeaturedProject {
  return isFeaturedProjectBase(project);
}

/**
 * 檢查 article 是否為 ProjectArticle
 */
export function isProjectMetadata(
  article: BaseArticle
): article is ProjectArticle {
  return isProjectArticle(article);
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * 驗證專案資料是否合法
 */
export function validateProjectMetadata(data: unknown): data is ProjectArticle {
  try {
    projectArticleSchema.parse(data);
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
