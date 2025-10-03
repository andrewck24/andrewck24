import { BackgroundAnimation } from "@/components/home/background-animation";
import { ProfileHero } from "./hero";

interface HomeProps {
  lang: string;
}

export function Home({ lang }: HomeProps) {
  return (
    <>
      <BackgroundAnimation />
      <ProfileHero locale={lang} />
    </>
  );
}
