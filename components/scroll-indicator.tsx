"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";

const scrollToSection = (section: string) => {
  const el = document.getElementById(section);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export default function ScrollIndicator({ section }: { section: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`flex justify-center pb-10 transition-all duration-700 delay-500 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <button
        onClick={() => scrollToSection(section)}
        className="group flex flex-col items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        aria-label={`Scroll to ${section}`}
      >
        <span className="text-xs uppercase tracking-[0.2em] font-medium">
          {section}
        </span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>
    </div>
  );
}
