import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaLink, FaGlobe } from "react-icons/fa"
import { TechBadge } from "@/lib/tech-icons"
import { ProjectCarousel } from "@/components/ui/project-carousel"

const projects = [
  {
    id: "url-shortener",
    title: "Short URL Tool",
    description: "Full-stack URL shortening service with real-time analytics dashboard, PostgreSQL database with RLS, and custom analytics engine. Features JWT authentication, password-protected links, and comprehensive click tracking with geolocation data.",
    icon: <FaLink className="h-6 w-6" />,
    tags: ["Next.js", "TypeScript", "React", "Vercel", "Supabase", "PostgreSQL", "Real-time", "OAuth", "IpInfo"],
    images: [
      "/placeholders/desktop-1.png",
      "/placeholders/desktop-2.png",
      "/placeholders/demo-1.png"
    ]
  },
  {
    id: "portfolio-site",
    title: "Portfolio Website",
    description: "Server-side rendered portfolio using Next.js App Router with TypeScript, Supabase authentication, and shadcn/ui component library. Features profile management with image cropping and dynamic metadata generation.",
    icon: <FaGlobe className="h-6 w-6" />,
    tags: ["Next.js", "TypeScript", "React", "Vercel", "shadcn/ui", "Tailwind CSS", "React Icons", "Chart.js", "Radix UI"],
    images: [
      "/placeholders/desktop-2.png",
      "/placeholders/mobile-1.png",
      "/placeholders/demo-2.png"
    ]
  },
]

export function ProjectsGrid() {
  return (
    <section>
      <div className="flex items-center justify-start mb-12">
        <h2 className="text-2xl font-semibold">Projects</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="group">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer bg-gradient-to-br from-card to-card/50 border-border/50 group-hover:border-primary/20">
              {/* Project Carousel */}
              <ProjectCarousel 
                images={project.images}
                alt={project.title}
              />

              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {project.icon}
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{project.title}</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed group-hover:text-foreground/90 transition-colors">
                  {project.description}
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <TechBadge key={tag} tech={tag} />
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
