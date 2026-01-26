"use client";

import { useState } from "react";
import { aboutSections, AboutSection } from "@/data/about";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

function AboutSectionItem({ section }: { section: AboutSection }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left group transition-opacity duration-200 hover:opacity-90"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${section.title}`}
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold text-xl text-foreground">
              {section.title}
            </h3>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground/50 transition-all duration-300 shrink-0 mt-1.5 group-hover:text-muted-foreground/80",
                isExpanded && "transform rotate-180 text-muted-foreground/80"
              )}
            />
          </div>
          <div className="relative overflow-hidden">
            <div
              className={cn(
                "transition-all duration-500 ease-in-out",
                isExpanded
                  ? "opacity-0 absolute inset-0 pointer-events-none translate-y-2 scale-[0.98]"
                  : "opacity-100 translate-y-0 scale-100"
              )}
              style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
            >
              <p className="text-sm text-foreground/70 leading-relaxed mt-2">
                {section.quick}
              </p>
            </div>
            <div
              className={cn(
                "transition-all duration-500 ease-in-out",
                isExpanded
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 absolute inset-0 pointer-events-none -translate-y-2 scale-[0.98]"
              )}
              style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
            >
              <p className="text-sm text-foreground/70 leading-relaxed mt-2">
                {section.detailed}
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default function About() {
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
        id="about"
        className="py-12 animate-fade-in-up"
        style={{ animationDelay: "400ms" }}
      >
        <div className="container mx-auto max-w-2xl px-6">
          <div className="space-y-6">
            {aboutSections.map((section, index) => (
              <div
                key={section.id}
                className="animate-fade-in-up pb-3 border-b border-border last:border-b-0 last:pb-0"
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <AboutSectionItem section={section} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
