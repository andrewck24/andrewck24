/**
 * ArticleCard Component
 *
 * 泛用型文章卡片元件
 * 支援 hero 和 compact 兩種佈局變體
 * 泛用化自 FeaturedProjectCard
 */

"use client";

import { ArticleImage } from "@/components/article/image";
import { cn } from "@/lib/utils";
import type { ArticleMetadata } from "@/types/article";
import Link from "next/link";

// ============================================================================
// Types
// ============================================================================

export interface ArticleCardProps<T extends ArticleMetadata = ArticleMetadata> {
  /** Article metadata */
  article: T;

  /** Card layout variant */
  variant?: "hero" | "compact";

  /** Image loading priority (for first card) */
  priority?: boolean;

  /** Content type for URL prefix */
  contentType?: "projects" | "notes";

  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function ArticleCard<T extends ArticleMetadata = ArticleMetadata>({
  article,
  variant = "compact",
  priority = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  contentType = "projects", // Reserved for future use (URL construction)
  className,
}: ArticleCardProps<T>) {
  const isHero = variant === "hero";

  return (
    <Link
      href={article.url}
      className={cn(
        "group border-border block rounded-lg border shadow-sm transition-all hover:shadow-md",
        "flex overflow-hidden",
        isHero ? "flex-col md:col-span-2 lg:flex-row" : "flex-col md:flex-row",
        className
      )}
      data-testid="article-card"
    >
      {/* Article Image */}
      <div
        className={cn("relative overflow-hidden", {
          "aspect-square w-full md:aspect-video": isHero,
          "aspect-video w-full md:aspect-square md:w-1/3": !isHero,
        })}
      >
        <ArticleImage
          slug={article.slug}
          title={article.title}
          imageType={article.imageType}
          image={article.image}
          ogImage={article.ogImage}
          priority={priority}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div
        className={cn("flex flex-col p-6", {
          "": isHero, // Hero: full width
          "md:w-2/3": !isHero, // Compact: 2/3 width on desktop
        })}
      >
        {/* Title */}
        <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
          {article.title}
        </h3>

        {/* Description */}
        <p className="mb-4 flex-grow text-sm text-gray-600 dark:text-gray-400">
          {article.description}
        </p>

        {/* Meta Information */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
          <time dateTime={article.date}>
            {new Date(article.date).toLocaleDateString(article.locale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
      </div>
    </Link>
  );
}
