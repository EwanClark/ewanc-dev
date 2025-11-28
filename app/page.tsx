import Navbar from "@/components/navbar";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Projects section */}
      <section id="projects" className="container mx-auto max-w-4xl px-6 py-12 md:py-16">
        <h2 className="text-2xl font-bold mb-8">Projects</h2>
        <p className="text-muted-foreground">Your projects will appear here...</p>
      </section>
    </main>
  )
}