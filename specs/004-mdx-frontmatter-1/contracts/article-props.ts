/**
 * Article Component Props Contracts
 *
 * Type definitions for Article component and its internal ArticleInfo component.
 *
 * Implementation Location: src/components/article/index.tsx
 */

import type { Locale } from "@/types/article"; // Import from existing file
import type { ArticlePageData, BaseArticle } from "./schema";

// ============================================================================
// Article Component Props
// ============================================================================

/**
 * Props for the main Article component.
 * Generic type T allows for type-safe handling of different article types.
 *
 * @template T - Article metadata type (BaseArticle | ProjectArticle | NoteArticle)
 *
 * @example
 * ```tsx
 * // For projects
 * <Article<ProjectArticle>
 *   article={projectPageData}
 *   contentType="projects"
 *   backLinkText="返回專案列表"
 * />
 *
 * // For notes
 * <Article<NoteArticle>
 *   article={notePageData}
 *   contentType="notes"
 * />
 * ```
 */
export interface ArticleProps<T extends BaseArticle = BaseArticle> {
  /**
   * Article page data (metadata + MDX content)
   */
  article: ArticlePageData<T>;

  /**
   * Content type for determining:
   * - Back link URL pattern (/{locale}/{contentType})
   * - Whether to show project-specific links (GitHub/Demo)
   */
  contentType: "projects" | "notes";

  /**
   * Custom back link text (i18n)
   * @default "返回專案列表" for projects, "返回筆記列表" for notes
   */
  backLinkText?: string;
}

// ============================================================================
// Article Info Component Props (Internal Component)
// ============================================================================

/**
 * Props for ArticleInfo internal component.
 * This component is defined inside Article component, not exported.
 *
 * Displays metadata in sidebar (lg+) or inline (mobile):
 * - Publication date
 * - Tags
 * - Project links (GitHub/Demo) - Projects only
 * - Language toggle
 *
 * @internal This is an internal component, not exported from Article
 *
 * @example
 * ```tsx
 * // Inside Article component
 * function ArticleInfo({ date, locale, tags, githubUrl, demoUrl, contentType }: ArticleInfoProps) {
 *   return (
 *     <aside className="space-y-6">
 *       {/* Date display *\/}
 *       {/* Tags display *\/}
 *       {/* Project links (conditional) *\/}
 *       {/* Language toggle *\/}
 *     </aside>
 *   );
 * }
 * ```
 */
export interface ArticleInfoProps {
  /**
   * Publication date (YYYY-MM-DD format)
   * Will be formatted using toLocaleDateString(locale)
   */
  date: string;

  /**
   * Current locale for date formatting
   */
  locale: Locale;

  /**
   * Tags array for display
   * Empty array if no tags
   */
  tags: string[];

  /**
   * GitHub repository URL (Projects only)
   * @optional Only for contentType="projects"
   */
  githubUrl?: string;

  /**
   * Live demo URL (Projects only)
   * @optional Only for contentType="projects"
   */
  demoUrl?: string;

  /**
   * Content type determines:
   * - Whether to render project links section
   * - Back link destination
   */
  contentType: "projects" | "notes";
}

// ============================================================================
// Implementation Guidelines
// ============================================================================

/**
 * ARTICLE COMPONENT STRUCTURE:
 *
 * ```tsx
 * export function Article<T extends BaseArticle>({
 *   article,
 *   contentType,
 *   backLinkText,
 * }: ArticleProps<T>) {
 *   // Internal ArticleInfo component (not exported)
 *   function ArticleInfo(props: ArticleInfoProps) { ... }
 *
 *   return (
 *     <div className="w-full">
 *       <article className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
 *         {/* Main content *\/}
 *         <div>
 *           <ArticleImage {...} />
 *           <header>...</header>
 *           <MDXContent />
 *         </div>
 *
 *         {/* Article Info sidebar *\/}
 *         <ArticleInfo
 *           date={article.date}
 *           locale={article.locale}
 *           tags={article.tags}
 *           githubUrl={'githubUrl' in article ? article.githubUrl : undefined}
 *           demoUrl={'demoUrl' in article ? article.demoUrl : undefined}
 *           contentType={contentType}
 *         />
 *       </article>
 *     </div>
 *   );
 * }
 * ```
 *
 * LAYOUT BEHAVIOR:
 * - Mobile (<1024px): Single column, ArticleInfo below content
 * - Desktop (≥1024px): Two columns, ArticleInfo in right sidebar (300px width)
 *
 * CONDITIONAL RENDERING:
 * - Project links only show when:
 *   1. contentType === "projects"
 *   2. At least one of githubUrl or demoUrl is provided
 * - Tags section only shows when tags.length > 0
 *
 * TYPE SAFETY:
 * - Use 'in' operator to check for project-specific fields:
 *   if ('githubUrl' in article && article.githubUrl) { ... }
 * - TypeScript will narrow the type correctly
 */

/**
 * COMPONENT REUSE:
 * - LanguageToggle: Import from '@/components/language-toggle'
 * - Badge: Import from '@/components/ui/badge' (for tags)
 * - Button: Import from '@/components/ui/button' (for demo link)
 * - Fumadocs GitHub component: Verify availability, fallback to custom Link
 * - lucide-react icons: Github, ExternalLink, Tags, Languages
 */

/**
 * RESPONSIVE DESIGN:
 * - Use Tailwind grid: lg:grid lg:grid-cols-[1fr_300px] lg:gap-8
 * - Sidebar width: 300px (fixed)
 * - Gap between columns: 2rem (gap-8)
 * - Mobile: flex flex-col (natural stacking)
 *
 * ACCESSIBILITY:
 * - Use semantic HTML: <aside> for ArticleInfo
 * - Include data-testid attributes for E2E testing
 * - Ensure keyboard navigation works for all interactive elements
 * - Use <time> element with dateTime attribute for dates
 */
