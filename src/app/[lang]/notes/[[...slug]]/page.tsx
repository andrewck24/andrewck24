import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "@/components/layout/page";
import { getMDXComponents } from "@/lib/mdx-components";
import { notesSource } from "@/lib/source";
import type { TOCItemType } from "fumadocs-core/server";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { MDXProps } from "mdx/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { FC } from "react";

interface PageProps {
  params: Promise<{ lang: string; slug?: string[] }>;
}

interface MDXPageData {
  title?: string;
  description?: string;
  toc: TOCItemType[];
  full?: boolean;
  body: FC<MDXProps>;
}

export default async function Page({ params }: PageProps) {
  const { lang, slug } = await params;
  const page = notesSource.getPage(slug, lang);
  if (!page) notFound();

  const pageData = page.data as MDXPageData;
  const MDXContent = pageData.body;

  return (
    <DocsPage toc={pageData.toc} full={pageData.full}>
      <DocsTitle>{pageData.title}</DocsTitle>
      <DocsDescription>{pageData.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(notesSource, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return notesSource.generateParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = notesSource.getPage(slug, lang);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
