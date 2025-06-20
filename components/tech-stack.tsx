import { Card } from "@/components/ui/card"
import { SiTypescript, SiJavascript, SiPython, SiRust, SiCplusplus,
  SiNextdotjs, SiReact, SiTailwindcss, SiElectron, SiFigma,
  SiExpress, SiSupabase, SiMongodb, SiVercel,
  SiGit, SiExcalidraw, SiHyprland, SiArchlinux } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import Image from "next/image";



const techStack = [
  {
    category: "Programming Languages",
    technologies: [
      { name: "TypeScript", icon: <SiTypescript className="h-6 w-6" /> },
      { name: "JavaScript", icon: <SiJavascript className="h-6 w-6" /> },
      { name: "Python", icon: <SiPython className="h-6 w-6" /> },
      { name: "Rust", icon: <SiRust className="h-6 w-6" /> },
      { name: "C++", icon: <SiCplusplus className="h-6 w-6" /> },
    ],
  },
  {
    category: "Frontend Development",
    technologies: [
      { name: "Next.js", icon: <SiNextdotjs className="h-6 w-6" /> },
      { name: "React", icon: <SiReact className="h-6 w-6" /> },
      { name: "Tailwind", icon: <SiTailwindcss className="h-6 w-6" /> },
      { name: "Electron", icon: <SiElectron className="h-6 w-6" /> },
      { name: "Figma", icon: <SiFigma className="h-6 w-6" /> },
    ],
  },
  {
    category: "Backend Development",
    technologies: [
      { name: "Express", icon: <SiExpress className="h-6 w-6" /> },
      { name: "Supabase", icon: <SiSupabase className="h-6 w-6" /> },
      { name: "MongoDB", icon: <SiMongodb className="h-6 w-6" /> },
      { name: "Vercel", icon: <SiVercel className="h-6 w-6" /> },
      { name: "AWS", icon: <FaAws className="h-6 w-6" /> },
    ],
  },
  {
    category: "Tools",
    technologies: [
      { name: "Cursor", icon: <Image src="/cursor.svg" width={24} height={24} alt="Cursor" /> },
      { name: "Git", icon: <SiGit className="h-6 w-6" /> },
      { name: "Excalidraw", icon: <SiExcalidraw className="h-6 w-6" /> },
      { name: "Hyprland", icon: <SiHyprland className="h-6 w-6" /> },
      { name: "Arch Linux", icon: <SiArchlinux className="h-6 w-6" /> },
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
                    <div className="text-muted-foreground group-hover:text-foreground transition-colors">
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
