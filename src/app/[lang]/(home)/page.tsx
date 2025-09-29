import { ProfileHero } from "@/components/home/hero";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  return <ProfileHero locale={lang} />;
}
