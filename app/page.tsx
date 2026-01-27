import Hero from "@/components/hero";
import CommitGraph from "@/components/commit-graph";
import ScrollIndicator from "@/components/scroll-indicator";
import Projects from "@/components/projects";
import TechStack from "@/components/tech-stack";
import Journey from "@/components/journey";
import About from "@/components/about";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ScrollIndicator sectionId="projects" sectionName="projects" />
      <Projects />
      <ScrollIndicator sectionId="tech-stack" sectionName="tech stack" />
      <TechStack />
      <ScrollIndicator sectionId="journey" sectionName="journey" />
      <Journey />
      <ScrollIndicator sectionId="commits" sectionName="commits" />
      <CommitGraph />
      <ScrollIndicator sectionId="about" sectionName="about me" />
      <About />
    </main>
  );
}
