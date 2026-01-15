"use client";

import { SiTypescript, SiNextdotjs } from "react-icons/si"

export interface ProjectSkill {
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export interface Project {
  title: string;
  image: string;
  description: string;
  skills: ProjectSkill[];
  features: string[];
  github: string;
  live: string;
}

export const projects: Project[] = [
  {
    title: "Example Project",
    image: "/placeholder.png",
    description: "A sample project showcasing modern web development.",
    skills: [
      {
        label: "TypeScript",
        color: "text-blue-400",
        icon: SiTypescript,
        description: "JavaScript with type safety.",
      },
      {
        label: "Next.js",
        color: "text-foreground",
        icon: SiNextdotjs,
        description: "React Framework",
      },
    ],
    features: [
      "Modern UI/UX design",
      "Responsive layout",
      "Fast performance",
    ],
    github: "https://github.com/example/project",
    live: "https://example.com",
  },  
  {
    title: "Another Project",
    image: "/placeholder.png",
    description: "Another example showcasing different technologies.",
    skills: [
      {
        label: "TypeScript",
        color: "text-blue-400",
        icon: SiTypescript,
        description: "JavaScript with type safety.",
      },
      {
        label: "Next.js",
        color: "text-foreground",
        icon: SiNextdotjs,
        description: "React Framework",
      },
    ],
    features: [
      "API integration",
      "Database management",
      "Authentication system",
    ],
    github: "https://github.com/example/another-project",
    live: "https://example2.com",
  }
];
