/**
 * Notes Data Layer
 *
 * 提供筆記資料的獲取函式
 * Implementation: T035-T038 (TDD Green Phase)
 */

import { notesSource } from "@/lib/source";
import type {
  FeaturedNote,
  Locale,
  NoteMetadata,
  NotePageData,
} from "@/types/note";

/**
 * 取得指定語言的精選筆記
 *
 * @param locale - 語言代碼
 * @returns 精選筆記陣列（最多 5 個，依照 meta.json 順序）
 *
 * @example
 * ```ts
 * const notes = await getFeaturedNotes("zh-TW");
 * ```
 *
 * T035: Implementation
 */
export async function getFeaturedNotes(
  locale: Locale
): Promise<FeaturedNote[]> {
  // 取得所有頁面
  const pages = notesSource.getPages(locale);

  // 過濾 featured: true 的筆記
  const featuredPages = pages.filter((page) => {
    const data = page.data as { featured?: boolean };
    return data.featured === true;
  });

  // 依照 meta.json 順序（getPages 已排序）
  // 限制最多 5 個
  const limitedPages = featuredPages.slice(0, 5);

  // 轉換為 FeaturedNote 格式
  return limitedPages.map((page) => {
    const data = page.data as unknown as NoteMetadata;
    return {
      // 只提取 NoteFrontmatter 定義的欄位
      title: data.title,
      description: data.description,
      imageType: data.imageType,
      image: data.image,
      ogImage: data.ogImage,
      date: data.date,
      featured: true as const,
      tags: data.tags,
      category: data.category,
      // 自動產生的 metadata
      slug: page.slugs[0] || "",
      locale,
      url: page.url,
    };
  });
}

/**
 * 取得指定 slug 的筆記詳細資料
 *
 * @param locale - 語言代碼
 * @param slug - 筆記 slug
 * @returns 筆記詳細資料，若不存在則回傳 null
 *
 * @example
 * ```ts
 * const note = await getNote("zh-TW", "react-hooks-guide");
 * if (!note) notFound();
 * ```
 *
 * T036: Implementation
 */
export async function getNote(
  locale: Locale,
  slug: string
): Promise<NotePageData | null> {
  const page = notesSource.getPage([slug], locale);

  if (!page) return null;

  const data = page.data as unknown as NoteMetadata & {
    body: React.ComponentType;
  };

  return {
    // 只提取 NoteFrontmatter 定義的欄位
    title: data.title,
    description: data.description,
    imageType: data.imageType,
    image: data.image,
    ogImage: data.ogImage,
    date: data.date,
    featured: data.featured,
    tags: data.tags,
    category: data.category,
    // 自動產生的 metadata
    slug: page.slugs[0] || slug,
    locale,
    url: page.url,
    // NotePageData 特有欄位
    content: data.body,
    body: "", // fumadocs-mdx 不提供原始 body 字串，若需要可從 MDX 解析
  };
}

/**
 * 取得指定語言的所有筆記
 *
 * @param locale - 語言代碼
 * @returns 筆記陣列（依照 meta.json 順序）
 *
 * @example
 * ```ts
 * const notes = await getAllNotes("zh-TW");
 * ```
 *
 * T037: Implementation
 */
export async function getAllNotes(locale: Locale): Promise<NoteMetadata[]> {
  const pages = notesSource.getPages(locale);

  return pages.map((page) => {
    const data = page.data as unknown as NoteMetadata;
    return {
      // 只提取 NoteFrontmatter 定義的欄位
      title: data.title,
      description: data.description,
      imageType: data.imageType,
      image: data.image,
      ogImage: data.ogImage,
      date: data.date,
      featured: data.featured,
      tags: data.tags,
      category: data.category,
      // 自動產生的 metadata
      slug: page.slugs[0] || "",
      locale,
      url: page.url,
    };
  });
}

/**
 * 產生所有筆記的靜態路徑參數
 *
 * 用於 Next.js generateStaticParams()
 *
 * @returns 所有筆記的 { locale, slug } 組合
 *
 * @example
 * ```ts
 * export const generateStaticParams = generateNoteStaticParams;
 * ```
 *
 * T038: Implementation
 */
export async function generateNoteStaticParams(): Promise<
  { locale: string; slug: string }[]
> {
  const params = notesSource.generateParams();

  // 轉換格式：從 { lang, slug } 轉為 { locale, slug }
  return params.map((param) => ({
    locale: param.lang,
    slug: Array.isArray(param.slug) ? param.slug[0] : param.slug || "",
  }));
}
