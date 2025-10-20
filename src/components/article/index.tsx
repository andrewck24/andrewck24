import { ArticleCard, type ArticleCardProps } from "@/components/article/card";
import {
  ArticleImage,
  type ArticleImageProps,
} from "@/components/article/image";
import type { ArticleMetadata, ArticlePageData } from "@/types/article";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface ArticleProps<T extends ArticleMetadata = ArticleMetadata> {
  /** Article page data (metadata + MDX content) */
  article: ArticlePageData<T>;

  /** Content type for back link */
  contentType?: "projects" | "notes";

  /** Custom back link text (i18n) */
  backLinkText?: string;
}

export function Article<T extends ArticleMetadata = ArticleMetadata>({
  article,
  contentType = "projects",
  backLinkText,
}: ArticleProps<T>) {
  const MDXContent = article.content;

  // Generate back link URL and default text
  const backLinkUrl = `/${article.locale}/${contentType}`;
  const defaultBackLinkText =
    contentType === "projects" ? "返回專案列表" : "返回筆記列表";

  return (
    <div
      className="prose prose-neutral dark:prose-invert mx-4 w-full overflow-x-hidden lg:mx-12"
      data-testid="article-section"
    >
      <article className="bg-background/50 border-border my-4 flex-2 rounded-2xl border px-4 py-10 lg:px-8">
        {/* Hero Image with View Transition */}
        <ArticleImage
          slug={article.slug}
          title={article.title}
          imageType={article.imageType}
          image={article.image}
          ogImage={article.ogImage}
          priority={true}
          className="mb-8 aspect-video"
        />

        {/* Header Section */}
        <header className="mb-12">
          {/* Title */}
          <h1 className="text-foreground mb-4 text-4xl font-bold md:text-5xl">
            {article.title}
          </h1>

          {/* Description */}
          {article.description && (
            <p className="text-muted-foreground mb-6 text-xl">
              {article.description}
            </p>
          )}

          {/* Date */}
          <div className="text-muted-foreground/70 flex items-center gap-4 text-sm">
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString(article.locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </header>

        {/* MDX Content */}
        <div className="prose prose-gray dark:prose-invert mx-auto max-w-none">
          <MDXContent />
        </div>

        {/* Back Link */}
        <footer className="border-border mt-12 border-t pt-8">
          <Link
            href={backLinkUrl}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="size-4" />
            {backLinkText || defaultBackLinkText}
          </Link>
        </footer>
      </article>
    </div>
  );
}

export {
  ArticleCard,
  ArticleImage,
  type ArticleCardProps,
  type ArticleImageProps,
};
