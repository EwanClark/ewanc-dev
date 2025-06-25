import { HeroSection } from "@/components/hero-section"
import { TechStack } from "@/components/tech-stack"
import { ProjectsGrid } from "@/components/projects-grid"
// import { ExperienceTimeline } from "@/components/experience-timeline" // Uncomment when ready to show experience

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="container py-12 space-y-20">
        {/* <ExperienceTimeline /> */}
        <TechStack />
        <ProjectsGrid />
      </div>
    </div>
  )
}
