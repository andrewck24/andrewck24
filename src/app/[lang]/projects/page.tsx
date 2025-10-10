import { FeaturedProjects } from "@/components/projects/featured-projects";
import { getFeaturedProjects } from "@/lib/data/projects";
import type { Locale } from "@/types/project";
import type { Metadata } from "next";

interface ProjectsPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { lang } = await params;

  // Fetch featured projects
  const featuredProjects = await getFeaturedProjects(lang as Locale);

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          {lang === "zh-TW" && "專案作品集"}
          {lang === "en" && "Projects Portfolio"}
          {lang === "ja" && "プロジェクトポートフォリオ"}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {lang === "zh-TW" &&
            "精選專案展示，涵蓋全端開發、雲端架構與財務分析等領域"}
          {lang === "en" &&
            "Featured projects showcasing full-stack development, cloud architecture, and financial analysis"}
          {lang === "ja" &&
            "フルスタック開発、クラウドアーキテクチャ、財務分析などの分野をカバーする注目プロジェクト"}
        </p>
      </header>

      {/* Featured Projects Section */}
      <FeaturedProjects projects={featuredProjects} locale={lang as Locale} />
    </main>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { lang } = await params;

  const titles = {
    "zh-TW": "專案作品集",
    en: "Projects Portfolio",
    ja: "プロジェクトポートフォリオ",
  };

  const descriptions = {
    "zh-TW": "精選專案展示，涵蓋全端開發、雲端架構與財務分析等領域",
    en: "Featured projects showcasing full-stack development, cloud architecture, and financial analysis",
    ja: "フルスタック開発、クラウドアーキテクチャ、財務分析などの分野をカバーする注目プロジェクト",
  };

  return {
    title: titles[lang as Locale] || titles["zh-TW"],
    description: descriptions[lang as Locale] || descriptions["zh-TW"],
  };
}
