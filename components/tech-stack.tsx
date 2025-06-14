import { Card } from "@/components/ui/card"
import { Database, Server, Code, Globe, Layers, Terminal, FileCode, Cpu } from "lucide-react"

const techStack = [
  {
    category: "Backend",
    technologies: [
      { name: "Node.js", icon: <Server className="h-5 w-5" /> },
      { name: "Express", icon: <Layers className="h-5 w-5" /> },
      { name: "PostgreSQL", icon: <Database className="h-5 w-5" /> },
      { name: "Supabase", icon: <Database className="h-5 w-5" /> },
    ],
  },
  {
    category: "Frontend",
    technologies: [
      { name: "React", icon: <Code className="h-5 w-5" /> },
      { name: "Next.js", icon: <Globe className="h-5 w-5" /> },
      { name: "TypeScript", icon: <FileCode className="h-5 w-5" /> },
      { name: "Tailwind CSS", icon: <Cpu className="h-5 w-5" /> },
    ],
  },
  {
    category: "Tools",
    technologies: [
      { name: "Git", icon: <Terminal className="h-5 w-5" /> },
      { name: "Docker", icon: <Layers className="h-5 w-5" /> },
      { name: "Vercel", icon: <Globe className="h-5 w-5" /> },
      { name: "VS Code", icon: <Code className="h-5 w-5" /> },
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {category.technologies.map((tech) => (
                <Card
                  key={tech.name}
                  className="p-4 hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {tech.icon}
                    </div>
                    <span className="font-medium text-sm">{tech.name}</span>
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
