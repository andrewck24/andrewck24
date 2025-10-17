"use client";
import { GeneratedHero } from "@/components/custom/generated-hero";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { unstable_ViewTransition as ViewTransition } from "react";

export interface ProjectDetailImageProps {
  slug: string;
  title: string;
  imageType?: "static" | "generated";
  image?: string;
  ogImage?: {
    children?: string;
    background?: string;
    className?: string;
  };
  className?: string;
}

export function ProjectDetailImage({
  slug,
  title,
  imageType = "static",
  image,
  ogImage,
  className,
}: ProjectDetailImageProps) {
  return (
    <ViewTransition name={`project-image-${slug}`}>
      <div
        className={cn(
          "relative mb-8 aspect-video overflow-hidden rounded-lg",
          className
        )}
        data-testid="project-hero-image-container"
        style={{
          viewTransitionName: `project-image-${slug}`,
        }}
      >
        {imageType === "generated" ? (
          <GeneratedHero ogImage={ogImage} />
        ) : (
          <Image
            src={image || ""}
            alt={title}
            fill
            priority
            fetchPriority="high"
            className="m-0 object-cover"
            data-testid="project-hero-image"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        )}
      </div>
    </ViewTransition>
  );
}
