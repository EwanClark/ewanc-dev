import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const experiences = [
  {
    company: "Tech Innovations Inc.",
    position: "Senior Frontend Developer",
    period: "2021 - Present",
    description:
      "Led the development of the company's flagship product, improving performance by 40% and implementing new features that increased user engagement by 25%.",
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  },
  {
    company: "Digital Solutions Ltd.",
    position: "Full Stack Developer",
    period: "2018 - 2021",
    description:
      "Developed and maintained multiple client projects, focusing on responsive design and accessibility. Implemented CI/CD pipelines that reduced deployment time by 60%.",
    technologies: ["Vue.js", "Node.js", "PostgreSQL", "Docker"],
  },
  {
    company: "StartUp Ventures",
    position: "Junior Developer",
    period: "2016 - 2018",
    description:
      "Contributed to the development of web applications for various clients, focusing on frontend development and user experience.",
    technologies: ["JavaScript", "HTML", "CSS", "jQuery"],
  },
]

export function WorkExperience() {
  return (
    <section id="experience" className="py-10">
      <div className="space-y-2 mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Work Experience</h2>
        <p className="text-muted-foreground">My professional journey and the companies I've worked with.</p>
      </div>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <Card key={index} className="border border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                <div>
                  <CardTitle>{exp.position}</CardTitle>
                  <CardDescription className="text-base">{exp.company}</CardDescription>
                </div>
                <Badge variant="outline" className="md:ml-auto shrink-0">
                  {exp.period}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech, i) => (
                  <Badge key={i} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
