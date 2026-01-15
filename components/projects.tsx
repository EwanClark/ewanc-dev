"use client";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { projects } from "@/lib/project-data";
import { ProjectCard } from "@/components/project-card";
import { ProjectDetail } from "@/components/project-detail";

export default function Projects() {
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.7s ease-out forwards;
        }
      `}</style>

      <section 
        id="projects" 
        className="mb-8 py-8 animate-fade-in-up"
        style={{ animationDelay: '400ms' }}
      >
        <div className="container mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {projects.map((project, index) => (
              <div
                key={index}
                className="animate-fade-in-up h-full"
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="w-full h-full">
                      <ProjectCard project={project} onClick={() => {}} />
                    </div>
                  </DialogTrigger>
                  <ProjectDetail project={project} />
                </Dialog>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
