import Hero from "@/components/hero";
import CommitGraph from "@/components/commit-graph";
import ScrollIndicator from "@/components/scroll-indicator";
import Projects from "@/components/projects";
import TechStack from "@/components/tech-stack";

interface ContributionDay {
  contributionCount: number
  date: string
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

interface GitHubResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
          weeks: ContributionWeek[]
        }
      }
    }
  }
}

async function getInitialGitHubData() {
  try {
    const token = process.env.GITHUB_ACCESS_TOKEN

    if (!token) {
      return null
    }

    const query = `
      query {
        user(login: "EwanClark") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `

    // Fetch directly from GitHub API - enables static generation
    // Uses stale-while-revalidate: returns cached data immediately if available,
    // then revalidates in background. If cache is older than 6 hours, still returns
    // stale data immediately, then fetches fresh data in background.
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { 
        revalidate: 6*60*60, // Revalidate every 6 hours (stale-while-revalidate)
      },
    })

    if (!response.ok) {
      return null
    }

    const data: GitHubResponse = await response.json()
    const calendar = data.data.user.contributionsCollection.contributionCalendar

    return {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
      cachedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Failed to fetch initial GitHub data:", error)
    return null
  }
}

export default async function Home() {
  const initialData = await getInitialGitHubData();

  return (
    <main className="min-h-screen">
      <Hero />
      <ScrollIndicator section="projects" />
      <Projects />
      <ScrollIndicator section="tech-stack" />
      <TechStack />
      <ScrollIndicator section="commits" />
      <CommitGraph initialData={initialData} />
    </main>
  );
}
