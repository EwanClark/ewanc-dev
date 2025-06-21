import { Card } from "@/components/ui/card"
import Image from "next/image";



const techStack = [
  {
    category: "Programming Languages",
    technologies: [
      { name: "TypeScript", icon: <Image src="/typescript.svg" width={32} height={32} alt="TypeScript" className="w-8 h-8" /> },
      { name: "JavaScript", icon: <Image src="/javascript.svg" width={32} height={32} alt="JavaScript" className="w-8 h-8" /> },
      { name: "Python", icon: <Image src="/python.svg" width={32} height={32} alt="Python" className="w-8 h-8" /> },
      { name: "Rust", icon: <Image src="/rust.svg" width={32} height={32} alt="Rust" className="w-8 h-8" /> },
      { name: "C++", icon: <Image src="/cpp.svg" width={32} height={32} alt="C++" className="w-8 h-8" /> },
    ],
  },
  {
    category: "Frontend Development",
    technologies: [
      { name: "Next.js", icon: <Image src="/nextjs.svg" width={32} height={32} alt="Next.js" className="w-8 h-8" /> },
      { name: "React", icon: <Image src="/react.svg" width={32} height={32} alt="React" className="w-8 h-8" /> },
      { name: "Tailwind", icon: <Image src="/tailwindcss.svg" width={32} height={32} alt="Tailwind" className="w-8 h-8" /> },
      { name: "Electron", icon: <Image src="/electron.svg" width={32} height={32} alt="Electron" className="w-8 h-8" /> },
      { name: "Figma", icon: <Image src="/figma.svg" width={32} height={32} alt="Figma" className="w-8 h-8" /> },
    ],
  },
  {
    category: "Backend Development",
    technologies: [
      { name: "Express", icon: <Image src="/expressjs.svg" width={32} height={32} alt="Express" className="w-8 h-8" /> },
      { name: "Supabase", icon: <Image src="/supabase.svg" width={32} height={32} alt="Supabase" className="w-8 h-8" /> },
      { name: "MongoDB", icon: <Image src="/mongodb.svg" width={32} height={32} alt="MongoDB" className="w-8 h-8" /> },
      { name: "Vercel", icon: <Image src="/vercel.svg" width={32} height={32} alt="Vercel" className="w-8 h-8" /> },
      { name: "AWS", icon: <Image src="/aws.svg" width={32} height={32} alt="AWS" className="w-8 h-8" /> },
    ],
  },
  {
    category: "Tools",
    technologies: [
      { name: "Cursor", icon: <Image src="/cursor.svg" width={32} height={32} alt="Cursor" className="w-8 h-8" /> },
      { name: "Git", icon: <Image src="/git.svg" width={32} height={32} alt="Git" className="w-8 h-8" /> },
      { name: "Excalidraw", icon: <Image src="/excalidraw.svg" width={32} height={32} alt="Excalidraw" className="w-8 h-8" /> },
      { name: "Hyprland", icon: <Image src="/hyprland.svg" width={32} height={32} alt="Hyprland" className="w-8 h-8" /> },
      { name: "Arch Linux", icon: <Image src="/arch.svg" width={32} height={32} alt="Arch Linux" className="w-8 h-8" /> },
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
