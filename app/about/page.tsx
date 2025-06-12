import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, GraduationCap, Code } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">About Me</h1>

          <div className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="text-muted-foreground">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Self-Taught Developer</h3>
                    <p className="text-muted-foreground mb-4">
                      Currently in Year 9, I've been learning programming for the past two years, focusing primarily on
                      backend development and full-stack applications. My journey started with curiosity about how
                      websites work, leading me to dive deep into server-side technologies and database management.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Started coding in 2022</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>Australia</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="text-muted-foreground">
                    <Code className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Development Focus</h3>
                    <p className="text-muted-foreground mb-4">
                      I specialize in backend development with a strong foundation in Node.js, Express, and database
                      technologies. My approach emphasizes clean code, scalable architecture, and efficient
                      problem-solving. I enjoy building APIs, working with databases, and creating full-stack
                      applications.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Backend Development</Badge>
                      <Badge variant="secondary">API Design</Badge>
                      <Badge variant="secondary">Database Management</Badge>
                      <Badge variant="secondary">Full-Stack Applications</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Current Learning</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Advanced PostgreSQL and database optimization</li>
                    <li>• Docker containerization and deployment</li>
                    <li>• TypeScript for better code quality</li>
                    <li>• Testing strategies and best practices</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Interests</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• System architecture and scalability</li>
                    <li>• Open source contributions</li>
                    <li>• Performance optimization</li>
                    <li>• Developer tools and automation</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Goals</h3>
                <p className="text-muted-foreground">
                  My goal is to continue developing my skills in backend development while expanding into DevOps and
                  system architecture. I'm particularly interested in building scalable applications that solve
                  real-world problems and contributing to open-source projects that help other developers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
