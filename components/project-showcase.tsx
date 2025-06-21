"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FiArrowUpRight } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import Link from "next/link"

const projects = {
  "Web Apps": [
    {
      title: "ShortURL",
      description: "A URL shortener with analytics and custom links.",
      tags: ["Next.js", "Prisma", "PostgreSQL"],
      github: "https://github.com",
      demo: "https://example.com",
    },
    {
      title: "DevChat",
      description: "Real-time chat application for developer teams.",
      tags: ["React", "Socket.io", "Express", "MongoDB"],
      github: "https://github.com",
      demo: "https://example.com",
    },
  ],
  Mobile: [
    {
      title: "TaskMaster",
      description: "A productivity app for managing tasks and projects.",
      tags: ["React Native", "Redux", "Firebase"],
      github: "https://github.com",
      demo: "https://example.com",
    },
  ],
  Libraries: [
    {
      title: "ReactComponents",
      description: "A collection of reusable React components.",
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
              <Card key={index} className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer group">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">{project.title}</h3>
                      <p className="text-muted-foreground mt-1 group-hover:text-foreground/80 transition-colors">{project.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="transition-colors group-hover:bg-primary/10">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-4 pt-2">
                      <Link href={project.github} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          <FaGithub className="h-4 w-4" /> GitHub
                        </Button>
                      </Link>
                      <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="gap-2">
                          Live Demo <FiArrowUpRight className="h-4 w-4" />
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
