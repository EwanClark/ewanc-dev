import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Github } from "lucide-react"
import Link from "next/link"

const projects = [
  {
    title: "DevConnect",
    description: "A platform for developers to connect, share projects, and collaborate.",
    status: "In Progress",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    title: "AI Code Assistant",
    description: "An AI-powered code assistant that helps developers write better code faster.",
    status: "Active Development",
    tags: ["React", "Python", "Machine Learning", "OpenAI"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    title: "ShortURL",
    description: "A URL shortener service with analytics and custom links.",
    status: "Beta",
    tags: ["Next.js", "Prisma", "PostgreSQL", "Vercel"],
    github: "https://github.com",
    demo: "https://example.com",
  },
]

export function CurrentProjects() {
  return (
    <section id="current-projects" className="py-10">
      <div className="space-y-2 mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Current Projects</h2>
        <p className="text-muted-foreground">What I'm actively working on right now.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <Card key={index} className="group border border-border/50 bg-card/50 backdrop-blur overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                  {project.status}
                </Badge>
              </div>
              <CardDescription className="text-base">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="bg-secondary/50">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Link href={project.github} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <Github className="h-4 w-4" /> GitHub
                </Button>
              </Link>
              <Link href={project.demo} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full gap-2">
                  Demo <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
