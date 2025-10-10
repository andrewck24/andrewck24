/**
 * Featured Project Card Component
 *
 * 展示精選專案卡片，支援 hero 與 compact 兩種變體
 */

import type { FeaturedProject } from "@/types/project";
import Image from "next/image";
import Link from "next/link";

export interface FeaturedProjectCardProps {
  project: FeaturedProject;
  priority?: boolean;
  variant?: "hero" | "compact";
}

export function FeaturedProjectCard({
  project,
  priority = false,
  variant = "compact",
}: FeaturedProjectCardProps) {
  const isHero = variant === "hero";

  return (
    <Link
      href={project.url}
      className="group block rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
      data-testid="project-card"
    >
      {/* Card Container */}
      <article
        className={`flex overflow-hidden rounded-lg ${
          isHero
            ? "flex-col" // Hero: 圖上文下
            : "flex-col md:flex-row" // Compact: Mobile 圖上文下，Desktop 圖左文右
        }`}
      >
        {/* Image Section */}
        <div
          className={`relative overflow-hidden bg-gray-100 dark:bg-gray-900 ${
            isHero
              ? "aspect-video w-full" // Hero: aspect-video
              : "aspect-square w-full md:w-1/3" // Compact: aspect-square, Desktop 1/3 width
          }`}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={
              isHero
                ? "(max-width: 768px) 100vw, 33vw"
                : "(max-width: 768px) 100vw, 25vw"
            }
          />
        </div>

        {/* Content Section */}
        <div
          className={`flex flex-col p-6 ${
            isHero ? "" : "md:w-2/3" // Compact Desktop: 2/3 width
          }`}
        >
          {/* Title */}
          <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
            {project.title}
          </h3>

          {/* Description */}
          <p className="mb-4 flex-grow text-sm text-gray-600 dark:text-gray-400">
            {project.description}
          </p>

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <time dateTime={project.date}>
              {new Date(project.date).toLocaleDateString(project.locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
            {project.featured && (
              <span className="rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                精選
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
