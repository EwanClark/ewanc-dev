"use client"

import TechPill from "@/components/tech-pill"
import { techs } from "@/lib/tech-data"

export default function TechStack() {
  return (
      <section id="tech-stack" className="py-12">
        <div className="container mx-auto max-w-5xl px-6">
          {/* Tech Pills Grid - Centered */}
          <div className="flex flex-wrap justify-center gap-4">
            {techs.map((tech, index) => (
              <div
                key={tech.name}
                className="animate-fade-in-up"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  opacity: 0,
                  animation: 'fadeInUp 0.5s ease-out forwards'
                }}
              >
                <TechPill
                  label={tech.name}
                  icon={tech.icon}
                  colorClass={tech.color}
                  size="lg"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

  )
}
