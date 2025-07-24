"use client"

import { Card } from "@/components/ui/card"
import { TechIcon, techIconMap } from "@/lib/tech-icons"

const techStack = [
  {
    category: "Programming Languages",
    technologies: ["TypeScript", "JavaScript", "Python", "Rust", "C++"],
  },
  {
    category: "Frontend Development", 
    technologies: ["Next.js", "React", "Tailwind", "Electron", "Figma"],
  },
  {
    category: "Backend Development",
    technologies: ["Express", "Supabase", "MongoDB", "Vercel", "AWS"],
  },
  {
    category: "Tools",
    technologies: ["Cursor", "Git", "Excalidraw", "Hyprland", "Arch Linux"],
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
              {category.technologies.map((techName) => {
                const iconConfig = techIconMap[techName]
                return (
                  <Card
                    key={techName}
                    className="p-4 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group bg-gradient-to-br from-card to-card/50 border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0">
                        {iconConfig && (
                          <TechIcon 
                            name={techName}
                            lightIcon={iconConfig.lightIcon}
                            darkIcon={iconConfig.darkIcon}
                            size={24}
                          />
                        )}
                      </div>
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">{techName}</span>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
