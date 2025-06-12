import { Navbar } from "@/components/navbar"
import { MapPin } from "lucide-react"

export function HeroSection() {
  return (
    <div>
      <Navbar />
      <div className="container py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-shrink-0 order-1 lg:order-1">
            <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-muted border-2 border-border overflow-hidden">
              <img 
                src="/profile-picture.jpg" 
                alt="Profile Picture" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 max-w-2xl order-2 lg:order-2 text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight mb-6">Full-Stack Developer</h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              Year 9 self-taught developer specializing in backend development and full-stack applications. Building
              scalable web solutions with modern technologies.
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
