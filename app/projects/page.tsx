import { Navbar } from "@/components/navbar"
import { ProjectsGrid } from "@/components/projects-grid"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6">All Projects</h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed">
              A collection of full-stack applications and backend services I&apos;ve built, showcasing modern web development practices and technologies.
            </p>
          </div>
          <ProjectsGrid />
        </div>
      </div>
    </div>
  )
}
