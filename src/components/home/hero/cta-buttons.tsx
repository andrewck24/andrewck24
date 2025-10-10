import { GithubIcon } from "@/components/icons/github-icon";
import { LinkedInIcon } from "@/components/icons/linkedin-icon";
import { Button } from "@/components/ui/button";
import type { SocialLinks as SocialLinksType } from "@/types/profile";
import Link from "next/link";

interface CtaButtonsProps {
  locale: string;
  social: SocialLinksType;
}

export function CtaButtons({ locale, social }: CtaButtonsProps) {
  const socialPlatforms = [
    {
      name: "GitHub",
      url: social.github,
      icon: GithubIcon,
      testId: "github-link",
    },
    {
      name: "LinkedIn",
      url: social.linkedin,
      icon: LinkedInIcon,
      testId: "linkedin-link",
    },
  ];

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
      data-testid="cta-buttons"
    >
      <div className="flex items-center justify-center gap-4 max-sm:w-full">
        <Button
          asChild
          size="lg"
          variant="destructive"
          data-testid="view-portfolio-btn"
          className="max-sm:flex-1"
        >
          <Link href={`/${locale}/projects`}>檢視作品集</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          data-testid="view-about-btn"
          className="max-sm:flex-1"
        >
          <Link href={`/${locale}/about`}>關於我</Link>
        </Button>
      </div>
      <div className="flex items-center justify-center gap-4">
        {socialPlatforms.map(({ name, url, icon: Icon, testId }) => {
          if (!url) return null;

          return (
            <Link
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-foreground hover:text-foreground flex items-center justify-center transition-colors"
              aria-label={name}
              data-testid={testId}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
