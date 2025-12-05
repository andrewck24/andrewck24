/**
 * Projects Data Layer
 *
 * 提供專案資料的獲取函式
 */

import { projectsSource } from "@/lib/source";
import type {
  FeaturedProjectCardData,
  Locale,
  ProjectCardData,
  ProjectMetadata,
  ProjectPageData,
} from "@/types/project";
import type * as PageTree from "fumadocs-core/page-tree";
import type { MDXProps } from "mdx/types";
import type { ComponentType } from "react";

/**
 * 取得指定語言的精選專案
 *
 * @param locale - 語言代碼
 * @returns 精選專案陣列（最多 5 個，依照 order 欄位排序）
 *
 * @example
 * ```ts
 * const projects = await getFeaturedProjects("zh-TW");
 * ```
 */
export async function getFeaturedProjects(
  locale: Locale
): Promise<FeaturedProjectCardData[]> {
  // 取得所有頁面
  const pages = projectsSource.getPages(locale);

  // 過濾 featured: true 的專案
  const featuredPages = pages.filter((page) => {
    const data = page.data as { featured?: boolean };
    return data.featured === true;
  });

  // 依照 frontmatter 的 order 欄位排序
  const sortedPages = featuredPages.sort((a, b) => {
    const aData = a.data as unknown as ProjectMetadata;
    const bData = b.data as unknown as ProjectMetadata;
    return (aData.order ?? Infinity) - (bData.order ?? Infinity);
  });

  // 限制最多 5 個
  const limitedPages = sortedPages.slice(0, 5);

  // 轉換為 FeaturedProject 格式
  return limitedPages.map((page) => {
    const data = page.data as unknown as ProjectMetadata;
    return {
      // 只提取 ProjectFrontmatter 定義的欄位
      title: data.title,
      description: data.description,
      imageType: data.imageType,
      image: data.image,
      ogImage: data.ogImage,
      date: data.date,
      tags: data.tags || [],
      featured: true as const,
      order: data.order,
      // 自動產生的 metadata
      slug: page.slugs[0] || "",
      locale,
      url: page.url,
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
 * const project = await getProject("zh-TW", "portfolio-website");
 * if (!project) notFound();
 * ```
 */
export async function getProject(
  locale: Locale,
  slug: string
): Promise<ProjectPageData | null> {
  const page = projectsSource.getPage([slug], locale);

  if (!page) return null;

  const data = page.data as unknown as ProjectMetadata & {
    body: React.ComponentType;
  };

  return {
    // 只提取 ProjectFrontmatter 定義的欄位
    title: data.title,
    description: data.description,
    imageType: data.imageType,
    image: data.image,
    ogImage: data.ogImage,
    date: data.date,
    tags: data.tags || [],
    featured: data.featured,
    order: data.order,
    githubUrl: data.githubUrl,
    demoUrl: data.demoUrl,
    // 自動產生的 metadata
    slug: page.slugs[0] || slug,
    locale,
    url: page.url,
    // ProjectPageData 特有欄位：MDX React 元件
    body: data.body as ComponentType<MDXProps>,
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
): Promise<ProjectCardData[]> {
  const pages = projectsSource.getPages(locale);
  const pageTree = projectsSource.pageTree[locale];

  // 從 pageTree 中提取頁面順序
  const orderedSlugs: string[] = [];
  const extractSlugs = (node: PageTree.Node): void => {
    if (node.type === "page") {
      const slug = node.url.split("/").pop();
      if (slug) orderedSlugs.push(slug);
    } else if (node.type === "folder" && node.children) {
      node.children.forEach(extractSlugs);
    }
  };
  pageTree?.children?.forEach(extractSlugs);

  // 根據 pageTree 的順序排序
  const sortedPages = pages.sort((a, b) => {
    const aSlug = a.slugs[0] || "";
    const bSlug = b.slugs[0] || "";
    const aIndex = orderedSlugs.indexOf(aSlug);
    const bIndex = orderedSlugs.indexOf(bSlug);
    // 如果某個 slug 不在 orderedSlugs 中，放到最後
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return sortedPages.map((page) => {
    const data = page.data as unknown as ProjectMetadata;
    return {
      // 只提取 ProjectFrontmatter 定義的欄位
      title: data.title,
      description: data.description,
      imageType: data.imageType,
      image: data.image,
      ogImage: data.ogImage,
      date: data.date,
      tags: data.tags || [],
      featured: data.featured,
      order: data.order,
      // 自動產生的 metadata
      slug: page.slugs[0] || "",
      locale,
      url: page.url,
    };
  });
}
