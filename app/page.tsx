import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import CommitGraph from "@/components/commit-graph";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <CommitGraph />
    </main>
  );
}