"use client";
import { GeneratedHero } from "@/components/custom/generated-hero";
import { cn } from "@/lib/utils";
import type { FeaturedProject } from "@/types/project";
import Image from "next/image";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";

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
      className={cn(
        "group border-border block rounded-lg border shadow-sm transition-all hover:shadow-md",
        "flex overflow-hidden",
        isHero ? "flex-col md:col-span-2 lg:flex-row" : "flex-col md:flex-row"
      )}
      data-testid="project-card"
    >
      {/* Image Section with View Transition */}
      <ViewTransition name={`project-image-${project.slug}`}>
        <div
          className={cn("relative overflow-hidden", {
            "aspect-square w-full md:aspect-video": isHero,
            "aspect-video w-full md:aspect-square md:w-1/3": !isHero,
          })}
          style={{
            viewTransitionName: `project-image-${project.slug}`,
          }}
        >
          {project.imageType === "generated" ? (
            <GeneratedHero ogImage={project.ogImage} />
          ) : (
            <Image
              src={project.image || ""}
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
          )}
        </div>
      </ViewTransition>

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
        </div>
      </div>
    </Link>
  );
}
