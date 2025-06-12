import { HeroSection } from "@/components/hero-section"
import { TechStack } from "@/components/tech-stack"
import { ProjectsGrid } from "@/components/projects-grid"

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto px-4 py-16 space-y-24">
        <TechStack />
        <ProjectsGrid />
      </div>
    </div>
  )
}
