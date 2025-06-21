import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmailButton } from "@/components/email-button"
import { FaWpforms } from "react-icons/fa6"
import { FaGithub, FaDesktop } from "react-icons/fa"
import { MdMailOutline } from "react-icons/md"
import { generateMetadata } from "@/lib/seo"
import { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: "Contact Me",
  description: "Get in touch with me for project collaborations, job opportunities, or developer connections. Email me at ewanclark4312@gmail.com for inquiries.",
  path: "/contact",
  keywords: ["contact", "email", "collaboration", "hire developer", "freelance", "job opportunities"]
});


export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-8 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Contact Me</h1>
          <p className="text-muted-foreground mb-6 sm:mb-8">
            Have a project in mind? Reach out via email!
          </p>
          
          <div className="grid gap-6 sm:gap-8">
            {/* Contact card with improved design */}
            <Card className="border border-border hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <MdMailOutline className="h-5 w-5 text-primary" />
                  <CardTitle>Get in Touch</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-normal mb-1">Email Address:</h3>
                    <p className="text-base sm:text-lg font-bold mb-2">ewanclark4312@gmail.com</p>
                  </div>
                  <EmailButton email="ewanclark4312@gmail.com" />
                </div>
              </CardContent>
            </Card>
            
            {/* Additional informative cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="border border-border hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <FaWpforms className="h-8 w-8 sm:h-10 sm:w-10 mb-3 sm:mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Recruiters</h3>
                    <p className="text-sm text-muted-foreground">
                      Interested in discussing job opportunities or potential roles? Let&apos;s connect!
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <FaGithub className="h-8 w-8 sm:h-10 sm:w-10 mb-3 sm:mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Developers</h3>
                    <p className="text-sm text-muted-foreground">
                      Want to collaborate, pair program, or discuss tech? I&apos;m open to developer connections.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border sm:col-span-2 lg:col-span-1 hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <FaDesktop className="h-8 w-8 sm:h-10 sm:w-10 mb-3 sm:mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Project Requests</h3>
                    <p className="text-sm text-muted-foreground">
                      Need a website or app built? Reach out to discuss your project requirements.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
