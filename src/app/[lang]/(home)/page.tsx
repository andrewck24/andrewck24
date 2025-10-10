import { FeaturedProjects } from "@/components/projects/featured-projects";
import { getFeaturedProjects } from "@/lib/data/projects";
import type { Locale } from "@/types/project";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  // Fetch featured projects
  const featuredProjects = await getFeaturedProjects(lang as Locale);

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section - Placeholder */}
      <section className="mb-16">
        <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-gray-100">
          Andrew CK
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Full-Stack Engineer & Financial Analyst
        </p>
      </section>

      {/* Featured Projects Section */}
      <FeaturedProjects projects={featuredProjects} locale={lang as Locale} />
    </main>
  );
}
