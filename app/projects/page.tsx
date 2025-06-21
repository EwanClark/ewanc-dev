import { Navbar } from "@/components/navbar"
import { ProjectsGrid } from "@/components/projects-grid"
import { generateMetadata } from "@/lib/seo"
import { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: "Projects",
  description: "Explore my portfolio of full-stack applications and backend services. Built with modern technologies including Python, JavaScript, TypeScript, Next.js, and more.",
  path: "/projects"
})

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">All Projects</h1>
          <p className="text-muted-foreground">
            A collection of full-stack applications and backend services I&apos;ve built.
          </p>
        </div>
        <ProjectsGrid />
      </div>
    </div>
  )
}
