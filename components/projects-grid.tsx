import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FaLink, FaGlobe } from "react-icons/fa"

const projects = [
  {
    id: "url-shortener",
    title: "Short URL Tool",
    description: "Advanced URL shortening service with analytics, password protection, and custom aliases. A full-featured project built within my portfolio site.",
    icon: <FaLink className="h-6 w-6" />,
    tags: ["Next.js", "Supabase", "TypeScript", "Analytics"],
    status: "Live",
  },
  {
    id: "portfolio-site",
    title: "Portfolio Website",
    description: "Modern responsive portfolio website showcasing my projects and skills. Built with Next.js, featuring authentication and integrated project tools.",
    icon: <FaGlobe className="h-6 w-6" />,
    tags: ["Next.js", "Supabase", "Tailwind CSS", "shadcn/ui"],
    status: "Live",
  },
]

export function ProjectsGrid() {
  return (
    <section>
      <div className="flex items-center justify-start mb-8">
        <h2 className="text-2xl font-semibold">Projects</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="h-full hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {project.icon}
                    </div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">{project.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
