/**
 * Notes Detail Page
 *
 * 使用 Article 元件顯示筆記詳細頁面
 * T048: Implementation
 */

import { Article } from "@/components/article";
import { getNote, generateNoteStaticParams } from "@/lib/data/notes";
import type { Locale } from "@/types/note";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ lang: string; slug: string[] }>;
}

// i18n 返回連結文字
const backLinkTexts: Record<Locale, string> = {
  "zh-TW": "返回筆記列表",
  en: "Back to Notes",
  ja: "ノート一覧に戻る",
};

export default async function Page({ params }: PageProps) {
  const { lang, slug } = await params;
  const locale = lang as Locale;

  // 取第一個 segment 作為 note slug
  const noteSlug = Array.isArray(slug) ? slug[0] : slug;

  if (!noteSlug) {
    notFound();
  }

  const note = await getNote(locale, noteSlug);

  if (!note) {
    notFound();
  }

  return (
    <Article
      article={note}
      contentType="notes"
      backLinkText={backLinkTexts[locale]}
    />
  );
}

export async function generateStaticParams() {
  const params = await generateNoteStaticParams();

  // 轉換為 Next.js 期望的格式：{ lang, slug: string[] }
  return params.map((param) => ({
    lang: param.locale,
    slug: [param.slug],
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const noteSlug = Array.isArray(slug) ? slug[0] : slug;

  if (!noteSlug) {
    return {};
  }

  const note = await getNote(locale, noteSlug);

  if (!note) {
    return {};
  }

  return {
    title: note.title,
    description: note.description,
  };
}
