export interface Skill {
  name: string;
  category: "frontend" | "backend" | "cloud" | "language" | "tool";
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

export const coreSkills: Skill[] = [
  // Frontend
  { name: "React", category: "frontend", level: "advanced" },
  { name: "TypeScript", category: "language", level: "advanced" },
  { name: "Next.js", category: "frontend", level: "advanced" },
  { name: "Tailwind CSS", category: "frontend", level: "advanced" },

  // Backend
  { name: "Node.js", category: "backend", level: "advanced" },
  { name: "Express.js", category: "backend", level: "intermediate" },
  { name: "MongoDB", category: "backend", level: "intermediate" },
  { name: "Clean Architecture", category: "backend", level: "intermediate" },

  // Cloud
  { name: "GCP", category: "cloud", level: "intermediate" },
  { name: "Vercel", category: "cloud", level: "advanced" },
];
