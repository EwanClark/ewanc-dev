import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FaArrowLeft, FaLink, FaGlobe, FaGithub, FaExternalLinkAlt } from "react-icons/fa"
import Link from "next/link"

const projects = {
  "url-shortener": {
    title: "Short URL Tool",
    description:
      "A comprehensive URL shortening service featuring advanced analytics, password protection, and custom aliases. Built as a full-featured project within my portfolio website, demonstrating full-stack development skills with user authentication, database management, and real-time analytics.",
    icon: <FaLink className="h-8 w-8" />,
    tags: ["Next.js 15", "Supabase", "TypeScript", "Analytics", "Authentication", "shadcn/ui"],
    status: "Live",
    github: "https://github.com/EwanClark/ewanc-dev",
    demo: "https://ewanc.dev/projects/short-url",
    features: [
      "Custom short URL generation with alias support",
      "Advanced click analytics and tracking",
      "Password protection for sensitive links",
      "User authentication and personal URL management",
      "Real-time click statistics and unique visitor tracking",
      "Responsive design with modern UI components",
      "Bulk URL management and organization",
      "Secure URL validation and sanitization",
    ],
    techDetails: {
      Frontend: "Next.js 15 with App Router and TypeScript for type-safe development",
      Database: "Supabase for URL storage, user management, and analytics data",
      Authentication: "Supabase Auth with email/password and OAuth providers (GitHub, Google)",
      Styling: "Tailwind CSS with shadcn/ui component library for modern design",
      Analytics: "Custom analytics engine tracking clicks, unique visitors, and referrers",
      Security: "Input validation, password hashing, and rate limiting protection",
      Performance: "Server-side rendering with optimized database queries and caching",
    },
  },
  "portfolio-site": {
    title: "Portfolio Website",
    description:
      "A modern, responsive portfolio website built to showcase my projects, skills, and experience as a developer. Features user authentication, project showcases, contact forms, and integrated tools like the URL shortener. Built with Next.js and Supabase, demonstrating full-stack development capabilities.",
    icon: <FaGlobe className="h-8 w-8" />,
    tags: ["Next.js 15", "Supabase", "TypeScript", "Full-Stack", "Authentication", "SEO"],
    status: "Live",
    github: "https://github.com/EwanClark/ewanc-dev",
    demo: "https://ewanc.dev",
    features: [
      "Responsive portfolio with project showcase",
      "User authentication system with profile management",
      "Integrated project tools and demonstrations",
      "Modern UI with dark/light mode support",
      "SEO optimization with meta tags and structured data",
      "Contact forms and professional information",
      "Dynamic routing for project details",
      "Performance monitoring and analytics integration",
    ],
    techDetails: {
      Framework: "Next.js 15 with App Router, TypeScript, and server-side rendering",
      Database: "Supabase for user profiles, authentication, and application data",
      Authentication: "Multi-provider auth (email, GitHub, Google) with profile management",
      Styling: "Tailwind CSS with shadcn/ui for consistent, modern component library",
      SEO: "Dynamic meta tags, structured data, sitemap generation, and social sharing",
      Performance: "Static generation, image optimization, and edge deployment on Vercel",
      Security: "CSRF protection, input validation, and secure authentication flows",
      Deployment: "Vercel with automatic deployments and continuous integration",
    },
  },
}

type Params = {
  id: string
}

// type SearchParams = {
//   [key: string]: string | string[] | undefined
// }

export default async function ProjectPage({ 
  params
}: {
  params: Promise<Params>
}) {
  const resolvedParams = await params
  const project = projects[resolvedParams.id as keyof typeof projects]

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-8 sm:py-16">
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <FaArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
            <div className="text-muted-foreground flex-shrink-0">{project.icon}</div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold">{project.title}</h1>
                <Badge variant="outline" className="self-start">{project.status}</Badge>
              </div>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">{project.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href={project.github} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <FaGithub className="h-4 w-4" />
                View Code
              </Button>
            </Link>
            <Link href={project.demo} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
              <Button className="w-full sm:w-auto gap-2">
                <FaExternalLinkAlt className="h-4 w-4" />
                Live Demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>Main functionality and capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
            <CardHeader>
              <CardTitle>Technical Implementation</CardTitle>
              <CardDescription>Technologies and architecture details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(project.techDetails).map(([category, detail]) => (
                  <div key={category}>
                    <h4 className="font-medium text-sm mb-1">{category}</h4>
                    <p className="text-sm text-muted-foreground">{detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
