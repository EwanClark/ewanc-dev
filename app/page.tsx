import Hero from "@/components/hero";
import CommitGraph from "@/components/commit-graph";
import ScrollIndicator from "@/components/scroll-indicator";
import Projects from "@/components/projects";
import TechStack from "@/components/tech-stack";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ScrollIndicator section="projects" />
      <Projects />
      <ScrollIndicator section="tech-stack" />
      <TechStack />
      <ScrollIndicator section="commits" />
      <CommitGraph />
    </main>
  );
}
