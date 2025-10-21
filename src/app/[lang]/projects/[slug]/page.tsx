/**
 * Project Detail Page
 *
 * 專案詳細頁面路由
 * Route: /[lang]/projects/[slug]
 */

import { Article } from "@/components/article";
import { generateProjectStaticParams, getProject } from "@/lib/data/projects";
import type { Locale } from "@/types/project";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProjectPageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { lang, slug } = await params;

  // Get project data
  const project = await getProject(lang as Locale, slug);

  // 404 if project doesn't exist
  if (!project) {
    notFound();
  }

  return (
    <Article
      article={project}
      contentType="projects"
      backLinkText="返回專案列表"
    />
  );
}

// Generate static params for all projects
export async function generateStaticParams() {
  const params = await generateProjectStaticParams();

  // Convert to Next.js format
  return params.map((param) => ({
    lang: param.locale,
    slug: param.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  const project = await getProject(lang as Locale, slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  // 根據 imageType 決定 OG image 策略
  // - static: 直接在 metadata 中指定圖片路徑
  // - generated: 不設定 images，讓 opengraph-image.tsx 動態生成
  const openGraphImages =
    project.imageType === "static" && project.image
      ? [
          {
            url: project.image,
            alt: project.title,
          },
        ]
      : undefined;

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: openGraphImages,
      type: "article",
      publishedTime: project.date,
    },
  };
}
