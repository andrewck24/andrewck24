import { HomeLayout } from "@/components/layout/home";
import { baseOptions } from "@/lib/layout.shared";
import type { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function Layout({ params, children }: HomeLayoutProps) {
  const { lang } = await params;
  return (
    <HomeLayout backgroundAnimation {...baseOptions(lang)}>
      {children}
    </HomeLayout>
  );
}
