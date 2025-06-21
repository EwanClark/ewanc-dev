import { HeroSection } from "@/components/hero-section"
import { TechStack } from "@/components/tech-stack"
import { ProjectsGrid } from "@/components/projects-grid"
import { generateMetadata } from "@/lib/seo"
import { Metadata } from "next"
// import { ExperienceTimeline } from "@/components/experience-timeline" // Uncomment when ready to show experience

export const metadata: Metadata = generateMetadata({
  title: "Full-Stack Developer Portfolio",
  description: "Year 8 self-taught developer from London, UK. Specializing in backend development, full-stack applications, and modern web technologies. View my projects and tech stack.",
  keywords: ["portfolio", "homepage", "web developer", "projects", "tech stack"]
})

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
