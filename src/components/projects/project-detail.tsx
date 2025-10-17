import { ProjectDetailImage } from "@/components/projects/project-detail-image";
import type { ProjectPageData } from "@/types/project";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface ProjectDetailProps {
  project: ProjectPageData;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const MDXContent = project.content;

  return (
    <div className="prose prose-neutral dark:prose-invert mx-4 w-full overflow-x-hidden lg:mx-12">
      <article className="bg-background/50 border-border my-4 flex-2 rounded-2xl border px-4 py-10 lg:px-8">
        {/* Hero Image with View Transition */}
        <ProjectDetailImage
          slug={project.slug}
          title={project.title}
          imageType={project.imageType}
          image={project.image}
          ogImage={project.ogImage}
        />
        <header className="mb-12">
          {/* Title & Meta */}
          <h1 className="text-foreground mb-4 text-4xl font-bold md:text-5xl">
            {project.title}
          </h1>

          <p className="text-muted-foreground mb-6 text-xl">
            {project.description}
          </p>

          <div className="text-muted-foreground/70 flex items-center gap-4 text-sm">
            <time dateTime={project.date}>
              {new Date(project.date).toLocaleDateString(project.locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </header>

        {/* MDX Content */}
        <div className="prose prose-gray dark:prose-invert mx-auto max-w-none">
          <MDXContent />
        </div>

        {/* Back Link */}
        <footer className="border-border mt-12 border-t pt-8">
          <Link
            href={`/${project.locale}/projects`}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="size-4" />
            返回專案列表
          </Link>
        </footer>
      </article>
    </div>
  );
}
