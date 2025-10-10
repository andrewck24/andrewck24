/**
 * Project Detail Page
 *
 * 專案詳細頁面路由
 * Route: /[lang]/projects/[slug]
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
    slug?: string[];
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { lang, slug: slugArray } = await params;
  const slug = slugArray?.[0];

  // If no slug provided, redirect to homepage
  if (!slug) {
    notFound();
  }

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
  const slug = slugArray?.[0];

  if (!slug) {
    return {
      title: "Project Not Found",
    };
  }

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
