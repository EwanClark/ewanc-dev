"use client"

import Image from "next/image"
import Link from "next/link"
import { FaNodeJs, FaPython, FaGithub } from "react-icons/fa"
import { SiTypescript, SiNextdotjs } from "react-icons/si"
import { getAge } from "@/lib/age"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"
import TechPill from "@/components/tech-pill"

const skills = [
  { name: "Next.js", icon: SiNextdotjs, color: "text-foreground" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-400" },
  { name: "Node.js", icon: FaNodeJs, color: "text-green-500" },
  { name: "Python", icon: FaPython, color: "text-yellow-500" },
]

export default function Hero() {

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
      
      <section id="hero" className="relative flex flex-col">
        {/* Main content */}
        <div className="container mx-auto max-w-4xl px-6 pt-20 pb-12 md:pt-28 md:pb-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
            {/* Profile Picture */}
            <div 
              className="relative shrink-0 animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
            >
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-linear-to-br from-primary/20 to-accent/20 rounded-full blur-xl" />
            
            {/* Image container */}
            <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden ring-2 ring-border bg-background">
              <Image
                src="/profile-picture.png"
                alt="Ewan Clark"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left space-y-5">
            {/* Name */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: '500ms' }}
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Ewan Clark
                  </h1>
                  {/* Controls - Theme Toggle & GitHub */}
                  <div className="flex items-end gap-1.5 md:gap-2 shrink-0 md:ml-40">
                    <ThemeToggle />

                    <Link href="https://github.com/ewanclark/" target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="h-9 w-9 transition-all duration-200 hover:scale-105">
                        <FaGithub style={{ width: 20, height: 20 }} />
                      </Button>
                    </Link>
                  </div>
                </div>
                <p className="text-xl text-muted-foreground font-light">
                  Full-Stack Developer
                </p>
              </div>
            </div>

            {/* Bio */}
            <p 
              className="text-foreground/80 text-lg leading-relaxed max-w-lg animate-fade-in-up"
              style={{ animationDelay: '600ms' }}
            > 
              {getAge()} Year Old Full-Stack Developer based in the UK, focusing on backend systems.
            </p>

            {/* Skills - compact icon row */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: '700ms' }}
            >
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {skills.map((skill, i) => (
                  <div
                    key={skill.name}
                    className="group relative"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <TechPill label={skill.name} icon={skill.icon} colorClass={skill.color} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
