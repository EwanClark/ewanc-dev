import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import CommitGraph from "@/components/commit-graph";
import ScrollIndicator from "@/components/scroll-indicator";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ScrollIndicator section="commits" />
      <CommitGraph />
    </main>
  );
}
