"use client";

import { ChevronDown } from "lucide-react";

const scrollToSection = (section: string) => {
  const el = document.getElementById(section);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export default function ScrollIndicator({ 
  sectionId, 
  sectionName 
}: { 
  sectionId: string;
  sectionName: string;
}) {
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
      <div
        className="flex justify-center my-6 sm:my-10 animate-fade-in-up"
        style={{ animationDelay: "400ms" }}
      >
      <button
        onClick={() => scrollToSection(sectionId)}
        className="group flex flex-col items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        aria-label={`Scroll to ${sectionName}`}
      >
        <span className="text-xs uppercase tracking-[0.2em] font-medium">
          {sectionName}
        </span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>
      </div>
    </>
  );
}
