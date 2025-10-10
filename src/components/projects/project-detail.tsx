/**
 * Project Detail Component
 *
 * 展示專案詳細頁面內容
 */

import type { ProjectPageData } from "@/types/project";
import Image from "next/image";
import Link from "next/link";

export interface ProjectDetailProps {
  project: ProjectPageData;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const MDXContent = project.content;

  return (
    <article className="mx-auto max-w-4xl">
      {/* Hero Section */}
      <header className="mb-12">
        {/* Hero Image */}
        <div
          className="relative mb-8 aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900"
          data-testid="project-hero-image-container"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            fetchPriority="high"
            className="object-cover"
            data-testid="project-hero-image"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>

        {/* Title & Meta */}
        <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-gray-100">
          {project.title}
        </h1>

        <p className="mb-6 text-xl text-gray-600 dark:text-gray-400">
          {project.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <time dateTime={project.date}>
            {new Date(project.date).toLocaleDateString(project.locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {project.featured && (
            <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              精選專案
            </span>
          )}
        </div>
      </header>

      {/* MDX Content */}
      <div className="prose prose-gray dark:prose-invert mx-auto max-w-none">
        <MDXContent />
      </div>

      {/* Back Link */}
      <footer className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
        <Link
          href={`/${project.locale}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          返回首頁
        </Link>
      </footer>
    </article>
  );
}
