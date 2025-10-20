"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { unstable_ViewTransition as ViewTransition } from "react";

export interface ArticleImageProps {
  /** Article slug (用於 view transition name) */
  slug: string;

  /** Article title (用於 alt text) */
  title: string;

  /** Image type: static image or generated */
  imageType?: "static" | "generated";

  /** Static image path (required when imageType="static") */
  image?: string;

  /** Generated OG image config (optional when imageType="generated") */
  ogImage?: {
    text?: string;
    background?: string; // CSS gradient / color / image path
    className?: string;
  };

  /** Additional CSS classes */
  className?: string;

  /** Image priority (for LCP optimization) */
  priority?: boolean;
}

export function ArticleImage({
  slug,
  title,
  imageType = "static",
  image,
  ogImage,
  className,
  priority = false,
}: ArticleImageProps) {
  // Fallback to generated mode if static mode but image is missing
  const effectiveImageType =
    imageType === "static" && !image ? "generated" : imageType;

  // Log warning in development if falling back
  if (
    process.env.NODE_ENV === "development" &&
    imageType === "static" &&
    !image
  ) {
    console.warn(
      `[ArticleImage] Missing image for slug "${slug}". Falling back to generated mode.`
    );
  }

  // Render generated mode
  if (effectiveImageType === "generated") {
    return (
      <ViewTransition name={`article-image-${slug}`}>
        <div
          className={cn(
            "relative h-full w-full overflow-hidden rounded-lg",
            ogImage?.className,
            className
          )}
          data-testid="article-image-container"
          style={{
            viewTransitionName: `article-image-${slug}`,
          }}
        >
          <GeneratedContent ogImage={ogImage} />
        </div>
      </ViewTransition>
    );
  }

  // Render static mode
  return (
    <ViewTransition name={`article-image-${slug}`}>
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-lg",
          className
        )}
        data-testid="article-image-container"
        style={{
          viewTransitionName: `article-image-${slug}`,
        }}
      >
        <Image
          src={image || ""}
          alt={title || "Article image"}
          fill
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
          className="m-0 object-cover"
          sizes="(max-width: 896px) 100vw, 896px"
        />
      </div>
    </ViewTransition>
  );
}

interface GeneratedContentProps {
  ogImage?: {
    text?: string;
    background?: string;
    className?: string;
  };
}

function GeneratedContent({ ogImage }: GeneratedContentProps) {
  const background = ogImage?.background;

  // Background format detection
  const isImagePath = background?.startsWith("/");
  const backgroundStyle = isImagePath
    ? `url(${background})`
    : background || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: isImagePath ? undefined : backgroundStyle,
        backgroundImage: isImagePath ? backgroundStyle : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        padding: "2rem",
      }}
    >
      {ogImage?.text && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.3,
            height: "80%",
            maxHeight: "80%",
            aspectRatio: "1 / 1",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {ogImage.text}
        </div>
      )}
    </div>
  );
}
