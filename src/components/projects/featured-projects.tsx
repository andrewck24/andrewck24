import { ArticleCard } from "@/components/article/card";
import type { FeaturedProject, Locale } from "@/types/project";

export interface FeaturedProjectsProps {
  projects: FeaturedProject[];
  locale: Locale;
}

// i18n 標題對照
const sectionTitles: Record<Locale, string> = {
  "zh-TW": "精選專案",
  en: "Featured Projects",
  ja: "注目プロジェクト",
};

export function FeaturedProjects({ projects, locale }: FeaturedProjectsProps) {
  // 空狀態處理
  if (projects.length === 0) {
    return (
      <section
        className="w-full py-12"
        aria-labelledby="featured-projects-heading"
        role="region"
        aria-label={sectionTitles[locale]}
      >
        <p className="text-muted-foreground text-center">
          {locale === "zh-TW" && "目前沒有中文精選專案介紹。"}
          {locale === "en" &&
            "Featured projects are not available in English at the moment."}
          {locale === "ja" &&
            "現在、日本語の注目プロジェクトは利用できません。"}
        </p>
      </section>
    );
  }

  return (
    <section
      className="w-full py-12"
      aria-labelledby="featured-projects-heading"
      role="region"
      aria-label={sectionTitles[locale]}
    >
      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        data-testid="featured-projects-grid"
      >
        {projects.map((project, index) => (
          <ArticleCard
            key={project.slug}
            article={project}
            variant={index === 0 ? "hero" : "compact"} // 首張為 hero，其他為 compact
            priority={index === 0} // 首張圖片使用 priority loading
            contentType="projects"
          />
        ))}
      </div>
    </section>
  );
}
