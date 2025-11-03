/**
 * Schema Contracts: Zod Schemas and Inferred Types
 *
 * This file defines the unified frontmatter schemas for Projects and Notes,
 * along with their inferred TypeScript types using z.infer.
 *
 * Implementation Location: source.config.ts
 */

import { frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";

// ============================================================================
// Base Article Schema (Shared by Projects and Notes)
// ============================================================================

/**
 * Base schema for all articles (projects and notes).
 * Extends fumadocs frontmatterSchema with common fields.
 *
 * @see data-model.md Section 1: BaseArticle
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

  /**
   * Featured flag (for homepage display)
   * Shared field: Both Projects and Notes support featured functionality
   * @default false
   */
  featured: z.boolean().default(false),
});

/**
 * Inferred TypeScript type for BaseArticle
 * Includes all fumadocs base fields + custom extensions
 */
export type BaseArticle = z.infer<typeof baseArticleSchema>;

// ============================================================================
// Project Article Schema (Extends BaseArticle)
// ============================================================================

/**
 * Projects-specific schema extension.
 * Adds GitHub/Demo links and order field.
 * Note: featured is now in baseArticleSchema (shared with Notes)
 *
 * @see data-model.md Section 2: ProjectArticle
 */
export const projectArticleSchema = baseArticleSchema.extend({
  /**
   * GitHub repository URL (optional)
   * Must be valid URL if provided
   */
  githubUrl: z.string().url().optional(),

  /**
   * Live demo URL (optional)
   * Must be valid URL if provided
   */
  demoUrl: z.string().url().optional(),

  /**
   * Display order for featured projects (1-99)
   * Only used when featured === true
   * Projects-specific: Notes don't have ordering
   */
  order: z.number().int().min(1).max(99).optional(),
});

/**
 * Inferred TypeScript type for ProjectArticle
 * Extends BaseArticle with project-specific fields
 */
export type ProjectArticle = z.infer<typeof projectArticleSchema>;

// ============================================================================
// Note Article Schema (= BaseArticle, no extensions)
// ============================================================================

/**
 * Notes schema (identical to base schema).
 * Notes have featured support (from baseArticleSchema) but NOT GitHub/Demo links or order field.
 *
 * @see data-model.md Section 3: NoteArticle
 */
export const noteArticleSchema = baseArticleSchema;

/**
 * Inferred TypeScript type for NoteArticle
 * Identical to BaseArticle
 */
export type NoteArticle = z.infer<typeof noteArticleSchema>;

// ============================================================================
// Article Page Data (Wrapper Type)
// ============================================================================

/**
 * Generic wrapper type that combines article metadata with MDX content.
 * Used by Article component to render page.
 *
 * @template T - Article metadata type (BaseArticle | ProjectArticle | NoteArticle)
 * @see data-model.md Section 4: ArticlePageData
 */
export type ArticlePageData<T extends BaseArticle = BaseArticle> = T & {
  /**
   * Compiled MDX content as React component
   */
  content: React.ComponentType;

  /**
   * Raw MDX body text (for search indexing, etc.)
   */
  body: string;
};

// ============================================================================
// Locale Types (NOTE: Import from existing file)
// ============================================================================

/**
 * IMPORTANT: Locale types are ALREADY DEFINED in src/types/article.ts
 *
 * DO NOT duplicate the definition. Import from existing file:
 *
 * @example
 * ```typescript
 * import { SUPPORTED_LOCALES, Locale } from '@/types/article';
 * ```
 *
 * Existing definition (src/types/article.ts:17-18):
 * ```typescript
 * export const SUPPORTED_LOCALES = ["zh-TW", "en", "ja"] as const;
 * export type Locale = (typeof SUPPORTED_LOCALES)[number];
 * ```
 *
 * @see src/types/article.ts
 */

// ============================================================================
// Implementation Notes
// ============================================================================

/**
 * IMPLEMENTATION CHECKLIST:
 *
 * 1. In source.config.ts:
 *    - Import schemas from this file (or define inline as shown above)
 *    - Use projectArticleSchema for projects.defineDocs()
 *    - Use noteArticleSchema for notes.defineDocs()
 *
 * 2. In src/types/article.ts:
 *    - Update existing schemas to match these definitions
 *    - Keep SUPPORTED_LOCALES and Locale where they are (L17-18)
 *    - Use z.infer for type definitions instead of manual types
 *    - Remove any duplicate type definitions
 *
 * 3. Validation:
 *    - Fumadocs will validate all frontmatter against these schemas at build time
 *    - Invalid frontmatter will cause build errors with clear messages
 */

/**
 * USAGE EXAMPLES:
 *
 * // Generic article (any type)
 * function processArticle(article: BaseArticle) { ... }
 *
 * // Project-specific
 * function processProject(project: ProjectArticle) {
 *   if (project.githubUrl) { ... }
 * }
 *
 * // With MDX content
 * function ArticleComponent({ article }: { article: ArticlePageData<ProjectArticle> }) {
 *   const Content = article.content;
 *   return <Content />;
 * }
 *
 * // Type narrowing for project links
 * function getLinks(article: BaseArticle): string[] {
 *   const links: string[] = [];
 *   if ('githubUrl' in article && article.githubUrl) links.push(article.githubUrl);
 *   if ('demoUrl' in article && article.demoUrl) links.push(article.demoUrl);
 *   return links;
 * }
 */
