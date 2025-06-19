import { Navbar } from "@/components/navbar"
import { ProjectsGrid } from "@/components/projects-grid"

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
