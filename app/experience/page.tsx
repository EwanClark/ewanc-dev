import { Navbar } from "@/components/navbar"
import { WorkExperience } from "@/components/work-experience"
import { TechStack } from "@/components/tech-stack"

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <Navbar />
      <div className="container py-12">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Experience & Skills</h1>
          <p className="text-xl text-muted-foreground">My professional journey and technical expertise</p>
        </div>
        <WorkExperience />
        <div className="py-12"></div>
        <TechStack />
      </div>
    </div>
  )
}
