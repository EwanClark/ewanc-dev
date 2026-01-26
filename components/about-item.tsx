"use client";

import { useState } from "react";
import { AboutSection } from "@/data/about";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export default function AboutSectionItem({ section }: { section: AboutSection }) {
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
