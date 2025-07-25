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
    tags: ["Next.js", "TypeScript", "React", "Vercel", "shadcn/ui", "Tailwind CSS", "React Icons", "Radix UI"],
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
      <div className="flex items-center justify-start mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold">Projects</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="group block">
            <Card className="h-full overflow-hidden border border-border/50 bg-gradient-to-br from-card to-card/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] group-hover:border-primary/20">
              {/* Project Carousel */}
              <div className="relative aspect-video overflow-hidden">
                <ProjectCarousel 
                  images={project.images}
                  alt={project.title}
                  className="w-full h-full"
                />
              </div>

              <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-3">
                  <div className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1">
                    {project.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl group-hover:text-primary transition-colors leading-tight">
                      {project.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-sm sm:text-base leading-relaxed group-hover:text-foreground/90 transition-colors line-clamp-4 mb-4 sm:mb-6">
                  {project.description}
                </CardDescription>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 6).map((tag) => (
                    <TechBadge key={tag} tech={tag} />
                  ))}
                  {project.tags.length > 6 && (
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted/80 text-muted-foreground border border-border/50">
                      +{project.tags.length - 6} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
