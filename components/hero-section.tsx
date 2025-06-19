import { Navbar } from "@/components/navbar"
import { MapPin } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <div>
      <Navbar />
      <div className="container pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-shrink-0 order-1 lg:order-1">
            <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-muted border-2 border-border overflow-hidden relative">
              <Image 
                src="/profile-picture-optimized.jpg" 
                alt="Profile Picture" 
                fill
                priority
                quality={85}
                sizes="(max-width: 768px) 192px, 256px"
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
          </div>

          <div className="flex-1 max-w-2xl order-2 lg:order-2 text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight mb-6">Full-Stack Developer</h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              Year 8 self-taught developer specializing in backend development and full-stack applications. Building
              web solutions with modern technologies.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>London, UK</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Available for projects</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
