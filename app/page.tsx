import { headers } from "next/headers";
import Hero from "@/components/hero";
import CommitGraph from "@/components/commit-graph";
import ScrollIndicator from "@/components/scroll-indicator";
import Projects from "@/components/projects";

async function getInitialGitHubData() {
  try {
    // Fetch from API route - Next.js Data Cache will handle caching
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;
    
    const response = await fetch(`${baseUrl}/api/github`, {
      next: { revalidate: 6*60*60 }, // Revalidate every 24 hours
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch initial GitHub data:", error);
    return null;
  }
}

export default async function Home() {
  const initialData = await getInitialGitHubData();

  return (
    <main className="min-h-screen">
      <Hero />
      <ScrollIndicator section="projects" />
      <Projects />
      <ScrollIndicator section="commits" />
      <CommitGraph initialData={initialData} />
    </main>
  );
}
