"use client";

import { useState, useEffect } from "react";
import { AboutSection } from "@/data/about";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export default function AboutSectionItem({ section }: { section: AboutSection }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Trigger attention animation after a short delay
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @keyframes attention-pulse {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
          25% { transform: translateY(-8px) scale(1.2) rotate(12deg); }
          50% { transform: translateY(-4px) scale(1.1) rotate(-6deg); }
          75% { transform: translateY(-8px) scale(1.2) rotate(12deg); }
        }
        .animate-attention-pulse {
          animation: attention-pulse 1s ease-in-out;
        }
      `}</style>
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
                  "h-4 w-4 text-muted-foreground/50 transition-all duration-300 shrink-0 mt-1.5 group-hover:text-muted-foreground/80 group-hover:scale-125",
                  isExpanded 
                    ? "transform rotate-180 text-muted-foreground/80 group-hover:rotate-192" 
                    : "group-hover:rotate-12",
                  !hasAnimated && !isExpanded && "animate-attention-pulse"
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
    </>
  );
}
