"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { FaGithub, FaNodeJs, FaPython } from "react-icons/fa"
import { SiTypescript, SiNextdotjs } from "react-icons/si"
import { ChevronDown } from "lucide-react"
import { getAge } from "@/lib/age"

const skills = [
  { name: "Next.js", icon: SiNextdotjs, color: "text-foreground" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-400" },
  { name: "Node.js", icon: FaNodeJs, color: "text-green-500" },
  { name: "Python", icon: FaPython, color: "text-yellow-500" },
]

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToProjects = () => {
    const el = document.getElementById("projects")
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative flex flex-col">
      {/* Main content */}
      <div className="container mx-auto max-w-4xl px-6 pt-20 pb-12 md:pt-28 md:pb-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
          {/* Profile Picture */}
          <div 
            className={`relative shrink-0 transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl" />
            
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
              className={`transition-all duration-700 delay-100 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                Ewan Clark
              </h1>
              <p className="text-xl text-muted-foreground font-light">
                Full-Stack Developer
              </p>
            </div>

            {/* Bio */}
            <p 
              className={`text-foreground/80 text-lg leading-relaxed max-w-lg transition-all duration-700 delay-200 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            > 
              {getAge()} Year Old Full-Stack Developer with a passion on building complex backend applications with modern technologies.
            </p>

            {/* Skills - compact icon row */}
            <div
              className={`transition-all duration-700 delay-300 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {skills.map((skill, i) => (
                  <div
                    key={skill.name}
                    className="group relative"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 border border-border/50 hover:border-border hover:bg-secondary transition-all cursor-default">
                      <skill.icon className={`w-4 h-4 ${skill.color} transition-transform group-hover:scale-110`} />
                      <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                        {skill.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub link */}
            <div
              className={`pt-2 transition-all duration-700 delay-[400ms] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Link 
                href="https://github.com/ewanclark" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border bg-secondary/50 hover:bg-secondary hover:border-border/80 transition-all text-sm font-medium group"
              >
                <FaGithub className="w-5 h-5" />
                <span>github.com/ewanclark</span>
                <span className="text-muted-foreground group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className={`flex justify-center pb-10 transition-all duration-700 delay-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <button
          onClick={scrollToProjects}
          className="group flex flex-col items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          aria-label="Scroll to projects"
        >
          <span className="text-xs uppercase tracking-[0.2em] font-medium">Projects</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>
    </section>
  )
}
