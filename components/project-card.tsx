import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/lib/project-data";
import TechPill from "@/components/tech-pill";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card 
      className="group relative bg-card border cursor-pointer hover:shadow-lg transition-colors duration-200 hover:bg-accent/40 flex flex-col"
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="relative w-full h-81 rounded-lg overflow-hidden mb-4">
          <Image
            src={project.image}
            fill
            alt={project.title}
            className="object-cover transition-all duration-200 hover:brightness-110"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-primary tracking-tighter">
            {project.title}
          </CardTitle>
          <div className="flex items-center gap-1 rounded-full bg-secondary/60 border border-border/50 px-2 py-1 text-xs text-foreground/80">
            View
            <ArrowUpRight className="h-3 w-3" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 pt-0">
        <CardDescription className="text-muted-foreground flex-1 mb-4">
          {project.description}
        </CardDescription>
        <div className="flex flex-wrap gap-2 mb-3">
          {project.skills.map((skill) => (
            <TechPill
              key={skill.label}
              label={skill.label}
              icon={skill.icon}
              colorClass={skill.color}
              size="sm"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
