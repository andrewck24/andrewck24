import { Badge } from "@/components/ui/badge";
import type { Skill } from "@/lib/data/skills";
import { cn } from "@/lib/utils";

interface SkillTagsProps {
  skills: Skill[];
  className?: string;
}

const skillLevelVariants = {
  beginner: "secondary",
  intermediate: "outline",
  advanced: "default",
  expert: "destructive",
} as const;

export function SkillTags({ skills, className }: SkillTagsProps) {
  return (
    <div
      className={cn(
        "flex flex-row flex-wrap items-center justify-center gap-2 lg:justify-start",
        className
      )}
      data-testid="skill-tags"
    >
      {skills.map((skill) => (
        <Badge
          key={skill.name}
          variant={skillLevelVariants[skill.level]}
          data-testid="skill-tag"
        >
          {skill.name}
        </Badge>
      ))}
    </div>
  );
}
