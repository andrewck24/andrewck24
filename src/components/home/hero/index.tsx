import { MapPin } from "@/components/animate-ui/icons/map-pin";
import { CtaButtons } from "@/components/home/hero/cta-buttons";
import { SkillTags } from "@/components/home/hero/skill-tags";
import { TerminalAnimation } from "@/components/home/hero/terminal-animation";
import { profileData } from "@/lib/data/profile";
import { coreSkills } from "@/lib/data/skills";
import { socialLinks } from "@/lib/data/social-links";

interface ProfileHeroProps {
  locale: string;
}

export function ProfileHero({ locale }: ProfileHeroProps) {
  const profile =
    profileData[locale as keyof typeof profileData] || profileData["zh-TW"];
  return (
    <section
      data-testid="profile-hero-section"
      className="relative z-10 flex size-full min-h-[80vh] flex-1 flex-col items-center justify-start px-4 py-16 md:px-6 md:py-24 lg:py-32"
    >
      <div className="flex flex-col items-center justify-start gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
        {/* Main Content */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="space-y-4">
            <h1
              className="from-foreground to-foreground/70 bg-gradient-to-b bg-clip-text font-mono text-4xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl xl:text-8xl"
              data-testid="profile-name"
            >
              {profile.name}
            </h1>
            <h2
              className="from-primary via-primary/80 to-primary/60 bg-gradient-to-r bg-clip-text text-xl font-semibold text-transparent md:text-2xl lg:text-3xl"
              data-testid="profile-title"
            >
              {profile.title}
            </h2>
            <p
              className="text-muted-foreground flex items-center justify-center gap-2 text-base md:text-lg lg:justify-start"
              data-testid="profile-location"
            >
              <MapPin className="size-5" aria-hidden="true" animateOnHover />
              {profile.location}
            </p>
          </div>

          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <p
              className="text-foreground/80 text-lg leading-relaxed md:text-xl"
              data-testid="profile-bio"
            >
              {profile.bio}
            </p>
          </div>

          <div className="space-y-6">
            <SkillTags skills={coreSkills} />
            <CtaButtons locale={locale} social={socialLinks} />
          </div>
        </div>
        <TerminalAnimation />
      </div>
    </section>
  );
}
