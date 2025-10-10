/**
 * Project Detail Page
 *
 * 專案詳細頁面路由
 * Route: /[lang]/projects/[...slug]
 *
 * 支援單層或多層路由結構：
 * - /[lang]/projects/project-name (單層)
 * - /[lang]/projects/category/project-name (多層，未來擴展)
 */

import { ProjectDetail } from "@/components/projects/project-detail";
import {
  generateProjectStaticParams,
  getProjectBySlug,
} from "@/lib/data/projects";
import type { Locale } from "@/types/project";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProjectPageProps {
  params: Promise<{
    lang: string;
    slug: string[];
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { lang, slug: slugArray } = await params;

  // Currently using single-level structure (first segment only)
  // Future: can support multi-level by joining slugArray
  const slug = slugArray[0];

  // Get project data
  const project = await getProjectBySlug(lang as Locale, slug);

  // 404 if project doesn't exist
  if (!project) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <ProjectDetail project={project} />
    </main>
  );
}

// Generate static params for all projects
export async function generateStaticParams() {
  const params = await generateProjectStaticParams();

  // Convert to Next.js format
  return params.map((param) => ({
    lang: param.locale,
    slug: [param.slug],
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { lang, slug: slugArray } = await params;

  // Currently using single-level structure (first segment only)
  const slug = slugArray[0];

  const project = await getProjectBySlug(lang as Locale, slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [
        {
          url: project.image,
          alt: project.title,
        },
      ],
      type: "article",
      publishedTime: project.date,
    },
  };
}
