import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IoSchoolOutline } from "react-icons/io5";
import { FaCode } from "react-icons/fa6";
import { FiMapPin } from "react-icons/fi";
import { LuCalendar } from "react-icons/lu";


export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-8 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">About Me</h1>

          <div className="space-y-6 sm:space-y-8">
            <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="text-muted-foreground flex-shrink-0">
                    <IoSchoolOutline className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">
                      Self-Taught Developer
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Currently in Year 8, I&apos;ve been successfully building
                      applications since 2020, focusing primarily on backend
                      development and full-stack applications. My journey
                      started with curiosity about how complex technologies
                      work, leading me to dive deep into server-side
                      technologies and database management.
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <LuCalendar className="h-4 w-4" />
                        <span>Started programming in 2020</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiMapPin className="h-4 w-4" />
                        <span>London, UK</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="text-muted-foreground flex-shrink-0">
                    <FaCode className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Development Focus</h3>
                    <p className="text-muted-foreground mb-4">
                      I specialize in backend development with skills in Python,
                      Express, and database technologies. My approach emphasizes
                      clean code, scalable architecture, and efficient
                      problem-solving. I enjoy building APIs, working with
                      databases, and creating full-stack applications.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Backend Development</Badge>
                      <Badge variant="secondary">API Design</Badge>
                      <Badge variant="secondary">Artificial Intelligence</Badge>
                      <Badge variant="secondary">Full-Stack Applications</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Current Learning</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• PostgreSQL for keeping user data secure</li>
                    <li>• Supabase for backend as a service</li>
                    <li>• TypeScript for better code quality</li>
                    <li>• TensorFlow for artificial intelligence</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Interests</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• AI and how it is similar to our brains</li>
                    <li>• Linux to improve my developer environment</li>
                    <li>• Performance optimization with Rust and C++</li>
                    <li>• Developer tools for better productivity</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Goals</h3>
                <p className="text-muted-foreground">
                  My goal is to continue developing my skills in backend
                  development while expanding into Rust and C++ to build
                  lightning-fast and scalable applications that solve real-world
                  problems and improve the lives of others.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
