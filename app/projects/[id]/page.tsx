import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaDatabase, FaLink, FaGlobe, FaComments } from "react-icons/fa"
import Link from "next/link"

const projects = {
  "task-manager": {
    title: "Task Manager API",
    description:
      "A comprehensive RESTful API for task management with user authentication, role-based permissions, and real-time updates. Built with Node.js and Express, featuring JWT authentication and PostgreSQL database integration.",
    icon: <FaDatabase className="h-8 w-8" />,
    tags: ["Node.js", "Express", "PostgreSQL", "JWT", "REST API", "Authentication"],
    status: "Completed",
    github: "https://github.com/username/task-manager-api",
    demo: "https://task-manager-api.vercel.app",
    features: [
      "User authentication with JWT tokens",
      "CRUD operations for tasks and projects",
      "Role-based access control",
      "Real-time notifications",
      "Data validation and error handling",
      "API documentation with Swagger",
    ],
    techDetails: {
      Backend: "Node.js with Express framework for robust API development",
      Database: "PostgreSQL with Prisma ORM for type-safe database operations",
      Authentication: "JWT-based authentication with refresh token rotation",
      Validation: "Joi schema validation for request data",
      Testing: "Jest and Supertest for comprehensive API testing",
      Deployment: "Docker containerization with CI/CD pipeline",
    },
  },
  "chat-app": {
    title: "Real-time Chat Application",
    description:
      "A full-stack real-time chat application featuring WebSocket connections, message persistence, and user presence indicators. Built with Next.js frontend and Socket.io for real-time communication.",
    icon: <FaComments className="h-8 w-8" />,
    tags: ["Next.js", "Socket.io", "Supabase", "TypeScript", "Real-time", "WebSocket"],
    status: "In Progress",
    github: "https://github.com/username/chat-app",
    demo: "https://chat-app-demo.vercel.app",
    features: [
      "Real-time messaging with Socket.io",
      "User authentication and profiles",
      "Message history and persistence",
      "Online/offline user status",
      "Typing indicators",
      "File sharing capabilities",
    ],
    techDetails: {
      Frontend: "Next.js with TypeScript for type-safe development",
      "Real-time": "Socket.io for bidirectional WebSocket communication",
      Database: "Supabase for user management and message storage",
      Styling: "Tailwind CSS with custom chat UI components",
      "State Management": "React Context for global state management",
      Deployment: "Vercel for frontend, Railway for Socket.io server",
    },
  },
  "url-shortener": {
    title: "URL Shortener Service",
    description:
      "A custom URL shortening service with comprehensive analytics, click tracking, and custom alias support. Features Redis caching for high performance and MongoDB for data persistence.",
    icon: <FaLink className="h-8 w-8" />,
    tags: ["React", "Node.js", "MongoDB", "Redis", "Analytics", "Caching"],
    status: "Completed",
    github: "https://github.com/username/url-shortener",
    demo: "https://short-url-service.vercel.app",
    features: [
      "Custom short URL generation",
      "Click analytics and tracking",
      "QR code generation",
      "Custom alias support",
      "Bulk URL shortening",
      "API rate limiting",
    ],
    techDetails: {
      Frontend: "React with modern hooks and context API",
      Backend: "Node.js with Express and MongoDB integration",
      Caching: "Redis for high-performance URL resolution",
      Analytics: "Custom analytics engine with chart visualization",
      Security: "Rate limiting and input sanitization",
      Performance: "CDN integration and optimized database queries",
    },
  },
  "portfolio-site": {
    title: "Portfolio Website",
    description:
      "A modern, responsive portfolio website built with Next.js and deployed on Vercel. Features a clean design, project showcase, and optimized performance with static generation.",
    icon: <FaGlobe className="h-8 w-8" />,
    tags: ["Next.js", "Tailwind CSS", "Vercel", "shadcn/ui", "Responsive", "SEO"],
    status: "Live",
    github: "https://github.com/username/portfolio",
    demo: "https://portfolio.vercel.app",
    features: [
      "Responsive design for all devices",
      "Project showcase with filtering",
      "SEO optimization",
      "Fast loading with static generation",
      "Contact form integration",
      "Dark/light mode support",
    ],
    techDetails: {
      Framework: "Next.js 14 with App Router for modern development",
      Styling: "Tailwind CSS with shadcn/ui component library",
      Performance: "Static site generation with optimized images",
      SEO: "Meta tags, structured data, and sitemap generation",
      Deployment: "Vercel with automatic deployments from Git",
      Analytics: "Vercel Analytics for performance monitoring",
    },
  },
}

type Params = {
  id: string
}

// type SearchParams = {
//   [key: string]: string | string[] | undefined
// }

export default function ProjectPage({ 
  params
}: {
  params: Params
}) {
  const project = projects[params.id as keyof typeof projects]

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
          <Card>
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

          <Card>
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
