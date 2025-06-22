"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image";
import { useTheme } from "next-themes";

const TechIcon = ({ name, lightIcon, darkIcon }: { name: string; lightIcon?: string; darkIcon: string }) => {
  const { resolvedTheme } = useTheme();
  
  // Use light icon if available and theme is light, otherwise use dark icon
  const iconSrc = lightIcon && resolvedTheme === "light" ? lightIcon : darkIcon;
  
  return (
    <Image 
      src={iconSrc} 
      width={32} 
      height={32} 
      alt={name} 
      className="w-8 h-8" 
    />
  );
};

const techStack = [
  {
    category: "Programming Languages",
    technologies: [
      { name: "TypeScript", icon: <TechIcon name="TypeScript" darkIcon="/typescript.svg" /> },
      { name: "JavaScript", icon: <TechIcon name="JavaScript" darkIcon="/javascript.svg" /> },
      { name: "Python", icon: <TechIcon name="Python" darkIcon="/python.svg" /> },
      { name: "Rust", icon: <TechIcon name="Rust" lightIcon="/rust-light.svg" darkIcon="/rust.svg" /> },
      { name: "C++", icon: <TechIcon name="C++" darkIcon="/cpp.svg" /> },
    ],
  },
  {
    category: "Frontend Development",
    technologies: [
      { name: "Next.js", icon: <TechIcon name="Next.js" darkIcon="/nextjs.svg" /> },
      { name: "React", icon: <TechIcon name="React" darkIcon="/react.svg" /> },
      { name: "Tailwind", icon: <TechIcon name="Tailwind" darkIcon="/tailwindcss.svg" /> },
      { name: "Electron", icon: <TechIcon name="Electron" darkIcon="/electron.svg" /> },
      { name: "Figma", icon: <TechIcon name="Figma" darkIcon="/figma.svg" /> },
    ],
  },
  {
    category: "Backend Development",
    technologies: [
      { name: "Express", icon: <TechIcon name="Express" lightIcon="/expressjs-light.svg" darkIcon="/expressjs.svg" /> },
      { name: "Supabase", icon: <TechIcon name="Supabase" darkIcon="/supabase.svg" /> },
      { name: "MongoDB", icon: <TechIcon name="MongoDB" darkIcon="/mongodb.svg" /> },
      { name: "Vercel", icon: <TechIcon name="Vercel" lightIcon="/vercel-light.svg" darkIcon="/vercel.svg" /> },
      { name: "AWS", icon: <TechIcon name="AWS" lightIcon="/aws-light.svg" darkIcon="/aws.svg" /> },
    ],
  },
  {
    category: "Tools",
    technologies: [
      { name: "Cursor", icon: <TechIcon name="Cursor" lightIcon="/cursor-light.svg" darkIcon="/cursor.svg" /> },
      { name: "Git", icon: <TechIcon name="Git" darkIcon="/git.svg" /> },
      { name: "Excalidraw", icon: <TechIcon name="Excalidraw" darkIcon="/excalidraw.svg" /> },
      { name: "Hyprland", icon: <TechIcon name="Hyprland" darkIcon="/hyprland.svg" /> },
      { name: "Arch Linux", icon: <TechIcon name="Arch Linux" darkIcon="/arch.svg" /> },
    ],
  },
]

export function TechStack() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-8">Tech Stack</h2>
      <div className="space-y-8">
        {techStack.map((category) => (
          <div key={category.category}>
            <h3 className="text-lg font-medium mb-4 text-muted-foreground">{category.category}</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {category.technologies.map((tech) => (
                <Card
                  key={tech.name}
                  className="p-4 hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0">
                      {tech.icon}
                    </div>
                    <span className="font-semibold text-sm">{tech.name}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
