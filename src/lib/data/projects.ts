/**
 * Projects Data Layer
 *
 * 提供專案資料的獲取函式
 */

import { projectsSource } from "@/lib/source";
import type {
  FeaturedProject,
  Locale,
  ProjectMetadata,
  ProjectPageData,
} from "@/types/project";

/**
 * 取得指定語言的精選專案
 *
 * @param locale - 語言代碼
 * @returns 精選專案陣列（最多 5 個，依照 meta.json 順序）
 *
 * @example
 * ```ts
 * const projects = await getFeaturedProjects("zh-TW");
 * ```
 */
export async function getFeaturedProjects(
  locale: Locale
): Promise<FeaturedProject[]> {
  // 取得所有頁面
  const pages = projectsSource.getPages(locale);

  // 過濾 featured: true 的專案
  const featuredPages = pages.filter((page) => {
    const data = page.data as { featured?: boolean };
    return data.featured === true;
  });

  // 依照 meta.json 順序（getPages 已排序）
  // 限制最多 5 個
  const limitedPages = featuredPages.slice(0, 5);

  // 轉換為 FeaturedProject 格式
  return limitedPages.map((page) => {
    const data = page.data as unknown as ProjectMetadata;
    return {
      ...data,
      slug: page.slugs[0] || "",
      locale,
      url: page.url,
      featured: true as const,
    };
  });
}

/**
 * 取得指定 slug 的專案詳細資料
 *
 * @param locale - 語言代碼
 * @param slug - 專案 slug
 * @returns 專案詳細資料，若不存在則回傳 null
 *
 * @example
 * ```ts
 * const project = await getProjectBySlug("zh-TW", "portfolio-website");
 * if (!project) {
 *   notFound();
 * }
 * ```
 */
export async function getProjectBySlug(
  locale: Locale,
  slug: string
): Promise<ProjectPageData | null> {
  const page = projectsSource.getPage([slug], locale);

  if (!page) {
    return null;
  }

  const data = page.data as unknown as ProjectMetadata & {
    body: React.ComponentType;
  };

  return {
    ...data,
    slug: page.slugs[0] || slug,
    locale,
    url: page.url,
    content: data.body,
    body: "", // fumadocs-mdx 不提供原始 body 字串，若需要可從 MDX 解析
  };
}

/**
 * 產生所有專案的靜態路徑參數
 *
 * 用於 Next.js generateStaticParams()
 *
 * @returns 所有專案的 { locale, slug } 組合
 *
 * @example
 * ```ts
 * export const generateStaticParams = generateProjectStaticParams;
 * ```
 */
export async function generateProjectStaticParams(): Promise<
  { locale: string; slug: string }[]
> {
  const params = projectsSource.generateParams();

  // 轉換格式：從 { lang, slug } 轉為 { locale, slug }
  return params.map((param) => ({
    locale: param.lang,
    slug: Array.isArray(param.slug) ? param.slug[0] : param.slug || "",
  }));
}

/**
 * 取得指定語言的所有專案
 *
 * @param locale - 語言代碼
 * @returns 專案陣列（依照 meta.json 順序）
 *
 * @example
 * ```ts
 * const projects = await getAllProjects("zh-TW");
 * ```
 */
export async function getAllProjects(
  locale: Locale
): Promise<ProjectMetadata[]> {
  const pages = projectsSource.getPages(locale);

  return pages.map((page) => {
    const data = page.data as unknown as ProjectMetadata;
    return {
      ...data,
      slug: page.slugs[0] || "",
      locale,
      url: page.url,
    };
  });
}
