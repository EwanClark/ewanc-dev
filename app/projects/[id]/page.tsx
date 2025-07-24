import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { FaArrowLeft, FaLink, FaGlobe, FaGithub, FaExternalLinkAlt } from "react-icons/fa"
import Link from "next/link"
import { TechBadge } from "@/lib/tech-icons"
import { ProjectCarousel } from "@/components/ui/project-carousel"

const projects = {
  "url-shortener": {
    title: "Short URL Tool",
    description:
      "Enterprise-grade URL shortening service with real-time analytics dashboard, PostgreSQL database with Row Level Security (RLS), and custom analytics engine. Built with Next.js App Router, TypeScript for type safety, and Supabase for backend infrastructure. Features comprehensive JWT authentication, bcrypt password protection, and advanced click tracking with geolocation data parsing.",
    icon: <FaLink className="h-8 w-8" />,
    tags: ["Next.js", "TypeScript", "React", "Vercel", "Supabase", "PostgreSQL", "Real-time", "OAuth", "IpInfo"],
    github: "https://github.com/EwanClark/ewanc-dev",
    demo: "https://ewanc.dev/projects/short-url",
    images: [
      "/placeholders/desktop-1.png",
      "/placeholders/desktop-2.png",
      "/placeholders/demo-1.png"
    ],
    technicalDetails: [
      {
        title: "Live Analytics via Supabase Realtime",
        description: "Dashboard updates without refresh using Supabase WebSocket subscriptions and PostgreSQL trigger functions for real-time click tracking.",
        accent: "from-muted/30 to-muted/10 border-muted/40 dark:from-muted/20 dark:to-muted/5 dark:border-muted/30"
      },
      {
        title: "bcrypt Password Protection",
        description: "Optional link protection using bcrypt with 10 salt rounds and server-side validation before URL redirection.",
        accent: "from-muted/30 to-muted/10 border-muted/40 dark:from-muted/20 dark:to-muted/5 dark:border-muted/30"
      },
      {
        title: "Next.js App Router Architecture",
        description: "Built with Next.js 15 App Router, React Server Components, TypeScript for type safety, and optimized client-side hydration.",
        accent: "from-muted/30 to-muted/10 border-muted/40 dark:from-muted/20 dark:to-muted/5 dark:border-muted/30"
      },
      {
        title: "PostgreSQL Row Level Security",
        description: "Database policies restrict data access by user ID with Supabase RLS, preventing unauthorized access to user data.",
        accent: "from-muted/30 to-muted/10 border-muted/40 dark:from-muted/20 dark:to-muted/5 dark:border-muted/30"
      },
      {
        title: "IP Geolocation & User Agent Parsing",
        description: "Click analytics with geographic data via ipinfo.io API and detailed browser/device information parsing.",
        accent: "from-muted/30 to-muted/10 border-muted/40 dark:from-muted/20 dark:to-muted/5 dark:border-muted/30"
      },
      {
        title: "PostgreSQL Database Design",
        description: "Structured schema with indexed columns, foreign key relationships, and automated trigger functions for analytics updates.",
        accent: "from-muted/30 to-muted/10 border-muted/40 dark:from-muted/20 dark:to-muted/5 dark:border-muted/30"
      },
      {
        title: "Supabase Authentication System",
        description: "JWT-based auth with automatic session management, OAuth integration (GitHub/Google), and secure profile handling.",
        accent: "from-muted/30 to-muted/10 border-muted/40 dark:from-muted/20 dark:to-muted/5 dark:border-muted/30"
      }
    ],
  },
  "portfolio-site": {
    title: "Portfolio Website",
    description:
      "Server-side rendered portfolio application using Next.js App Router with TypeScript, Supabase authentication infrastructure, and shadcn/ui component library. Features multi-provider OAuth integration, profile management with image cropping capabilities, SEO optimization with dynamic metadata generation, and comprehensive project showcases with interactive carousels.",
    icon: <FaGlobe className="h-8 w-8" />,
    tags: ["Next.js", "TypeScript", "React", "Vercel", "shadcn/ui", "Tailwind CSS", "React Icons", "Chart.js", "Radix UI"],
    github: "https://github.com/EwanClark/ewanc-dev",
    demo: "https://ewanc.dev",
    images: [
      "/placeholders/desktop-2.png",
      "/placeholders/mobile-1.png",
      "/placeholders/demo-2.png"
    ],
    technicalDetails: [
      {
        title: "Next.js App Router with Server Components",
        description: "Built using Next.js 15 App Router with React Server Components for optimal performance and SEO optimization.",
        accent: "from-muted/30 to-muted/10 border-muted/40 dark:from-muted/20 dark:to-muted/5 dark:border-muted/30"
      },
      {
        title: "Multi-Provider OAuth Authentication",
        description: "GitHub and Google OAuth integration via Supabase Auth with automatic profile creation and session management.",
        accent: "from-muted/30 to-muted/10 border-muted/40 dark:from-muted/20 dark:to-muted/5 dark:border-muted/30"
      },
      {
        title: "Profile Image Upload & Management",
        description: "Avatar upload to Supabase Storage with client-side image cropping capabilities and automatic optimization.",
        accent: "from-muted/30 to-muted/10 border-muted/40 dark:from-muted/20 dark:to-muted/5 dark:border-muted/30"
      },
      {
        title: "TypeScript Full-Stack Implementation",
        description: "End-to-end TypeScript for type safety across frontend, API routes, and database interactions with strict mode enabled.",
        accent: "from-muted/30 to-muted/10 border-muted/40 dark:from-muted/20 dark:to-muted/5 dark:border-muted/30"
      },
      {
        title: "Interactive Project Showcase",
        description: "Dynamic project galleries with keyboard navigation, responsive image carousels, and detailed technical specifications.",
        accent: "from-muted/30 to-muted/10 border-muted/40 dark:from-muted/20 dark:to-muted/5 dark:border-muted/30"
      },
      {
        title: "Supabase Backend Integration",
        description: "PostgreSQL database with Row Level Security, real-time subscriptions, and comprehensive user profile management.",
        accent: "from-muted/30 to-muted/10 border-muted/40 dark:from-muted/20 dark:to-muted/5 dark:border-muted/30"
      },
      {
        title: "SEO & Social Media Optimization",
        description: "Dynamic metadata generation, Open Graph tags, structured data, and automated sitemap for search engine visibility.",
        accent: "from-muted/30 to-muted/10 border-muted/40 dark:from-muted/20 dark:to-muted/5 dark:border-muted/30"
      },
      {
        title: "Modern UI Component Architecture",
        description: "shadcn/ui component library built on Radix UI primitives with Tailwind CSS and comprehensive dark mode support.",
        accent: "from-muted/30 to-muted/10 border-muted/40 dark:from-muted/20 dark:to-muted/5 dark:border-muted/30"
      }
    ],
  },
}

type Params = {
  id: string
}

export default async function ProjectPage({ 
  params
}: {
  params: Promise<Params>
}) {
  const { id } = await params

  if (!projects[id as keyof typeof projects]) {
    notFound()
  }

  const project = projects[id as keyof typeof projects]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        {/* Back to Projects Link */}
        <div className="mb-8">
          <Link href="/projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <FaArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Project Info */}
          <div>
            <div className="flex items-start gap-4">
              <div className="text-muted-foreground flex-shrink-0">{project.icon}</div>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">{project.title}</h1>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <TechBadge key={tag} tech={tag} />
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={project.github} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                    <Button variant="outline" className="w-full sm:w-auto gap-2 hover:bg-muted/80 transition-all">
                      <FaGithub className="h-4 w-4" />
                      View Code
                    </Button>
                  </Link>
                  <Link href={project.demo} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                    <Button className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all">
                      <FaExternalLinkAlt className="h-4 w-4" />
                      Live Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Project Carousel */}
          <div className="relative aspect-video lg:aspect-[4/3] overflow-hidden rounded-xl bg-muted shadow-xl">
            <ProjectCarousel 
              images={project.images}
              alt={project.title}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Technical Specification */}
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Technical Implementation</h2>
            <p className="text-muted-foreground">Detailed breakdown of key technical features and architectural decisions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.technicalDetails.map((detail, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-lg border bg-gradient-to-br ${detail.accent} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
              >
                <h3 className="font-semibold text-lg mb-3 text-foreground">{detail.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{detail.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
