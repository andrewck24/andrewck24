import { PersonalInfo } from "@/components/about/personal-info";
import { getMDXComponents } from "@/lib/mdx-components";
import { aboutSource } from "@/lib/source";
import { cn } from "@/lib/utils";
import type { MDXProps } from "mdx/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

interface PageProps {
  params: Promise<{ lang: string; slug?: string[] }>;
}

export interface MDXPageData {
  title?: string;
  description?: string;
  body: ComponentType<MDXProps>;
}

export default async function AboutPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const page = aboutSource.getPage(slug, lang);
  if (!page) notFound();

  const pageData = page.data as MDXPageData;
  const MDXContent = pageData.body;

  return (
    <div
      data-testid="about-page"
      className={cn(
        "relative backdrop-blur-lg",
        "flex flex-col items-center justify-start gap-4 lg:flex-row lg:items-start lg:justify-center"
      )}
    >
      <PersonalInfo data={pageData} />
      <article className="prose prose-neutral dark:prose-invert bg-background/50 border-border my-4 flex-2 rounded-2xl border px-4 py-12 lg:px-8">
        <MDXContent components={getMDXComponents()} />
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  return aboutSource.generateParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = aboutSource.getPage(slug, lang);
  if (!page) notFound();

  const pageData = page.data as MDXPageData;

  return {
    title: pageData.title,
    description: pageData.description,
  };
}
