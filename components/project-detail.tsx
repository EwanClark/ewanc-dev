import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Project } from "@/lib/project-data";

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <>
      <style>{`
        @keyframes projectDialogIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes projectDialogOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.96);
          }
        }
        .project-dialog[data-state="open"] {
          animation: projectDialogIn 220ms ease-out;
        }
        .project-dialog[data-state="closed"] {
          animation: projectDialogOut 160ms ease-in;
        }
      `}</style>
      <DialogContent className="project-dialog sm:max-w-[500px] rounded-lg bg-card max-h-[90vh] overflow-y-auto origin-center">
        <div className="absolute top-4 right-14 flex items-center">
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 transition-all duration-200 hover:scale-105"
            >
              <FaGithub className="h-4! w-4!" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => window.open(project.live, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-extrabold text-primary tracking-tight pr-20">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {project.description}
          </DialogDescription>
          <div className="my-4 flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <div
                key={skill.label}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 border border-border/50 hover:border-border hover:bg-secondary transition-all"
              >
                <skill.icon
                  className={`w-5 h-5 ${skill.color} transition-transform group-hover:scale-110`}
                />
                <span className="text-sm font-medium text-foreground group-hover:text-foreground transition-colors">
                  {skill.label}
                </span>
              </div>
            ))}
          </div>
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image
              src={project.image}
              fill
              alt={project.title}
              className="object-cover"
            />
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-primary mb-2 text-base">
              Features
            </h4>
            <ul className="space-y-1">
              {project.features.map((feature) => (
                <li
                  className="text-sm text-muted-foreground ml-4 list-disc"
                  key={feature}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </>
  );
}
