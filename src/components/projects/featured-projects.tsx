/**
 * Featured Projects Section Component
 *
 * 展示精選專案列表區塊
 */

import type { FeaturedProject, Locale } from "@/types/project";
import { FeaturedProjectCard } from "./featured-project-card";

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
        className="py-12"
        aria-labelledby="featured-projects-heading"
        role="region"
        aria-label={sectionTitles[locale]}
      >
        <h2
          id="featured-projects-heading"
          className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100"
        >
          {sectionTitles[locale]}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400">
          目前沒有精選專案
        </p>
      </section>
    );
  }

  return (
    <section
      className="py-12"
      aria-labelledby="featured-projects-heading"
      role="region"
      aria-label={sectionTitles[locale]}
    >
      {/* Section Title */}
      <h2
        id="featured-projects-heading"
        className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100"
      >
        {sectionTitles[locale]}
      </h2>

      {/* Projects Grid */}
      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
        data-testid="featured-projects-grid"
      >
        {projects.map((project, index) => (
          <FeaturedProjectCard
            key={project.slug}
            project={project}
            variant={index === 0 ? "hero" : "compact"} // 首張為 hero，其他為 compact
            priority={index === 0} // 首張圖片使用 priority loading
          />
        ))}
      </div>
    </section>
  );
}
