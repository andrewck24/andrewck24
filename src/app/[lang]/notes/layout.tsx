import { DocsLayout } from "@/components/layout/docs";
import { baseOptions } from "@/lib/layout.shared";
import { notesSource } from "@/lib/source";
import type { ReactNode } from "react";

interface DocsLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function Layout({ children, params }: DocsLayoutProps) {
  const { lang } = await params;

  return (
    <DocsLayout tree={notesSource.pageTree[lang]} {...baseOptions(lang)}>
      {children}
    </DocsLayout>
  );
}
