"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Github } from "lucide-react"
import Link from "next/link"

const projects = {
  "Web Apps": [
    {
      title: "ShortURL",
      description: "A URL shortener with analytics and custom links.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["Next.js", "Prisma", "PostgreSQL"],
      github: "https://github.com",
      demo: "https://example.com",
    },
    {
      title: "DevChat",
      description: "Real-time chat application for developer teams.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["React", "Socket.io", "Express", "MongoDB"],
      github: "https://github.com",
      demo: "https://example.com",
    },
  ],
  Mobile: [
    {
      title: "TaskMaster",
      description: "A productivity app for managing tasks and projects.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["React Native", "Redux", "Firebase"],
      github: "https://github.com",
      demo: "https://example.com",
    },
  ],
  Libraries: [
    {
      title: "ReactComponents",
      description: "A collection of reusable React components.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["React", "TypeScript", "Storybook"],
      github: "https://github.com",
      demo: "https://example.com",
    },
  ],
}

export function ProjectShowcase() {
  const [activeTab, setActiveTab] = useState("Web Apps")

  return (
    <section id="projects" className="py-10">
      <div className="space-y-2 mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Project Showcase</h2>
        <p className="text-muted-foreground">A selection of my work across different platforms.</p>
      </div>

      <Tabs defaultValue="Web Apps" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto">
          {Object.keys(projects).map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(projects).map(([category, projectList]) => (
          <TabsContent key={category} value={category} className="space-y-6">
            {projectList.map((project, index) => (
              <Card key={index} className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold">{project.title}</h3>
                      <p className="text-muted-foreground mt-1">{project.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-4 pt-2">
                      <Link href={project.github} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Github className="h-4 w-4" /> GitHub
                        </Button>
                      </Link>
                      <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="gap-2">
                          Live Demo <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
