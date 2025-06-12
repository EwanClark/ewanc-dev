import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, BookOpen, Code, Coffee } from "lucide-react"

const nowItems = [
  {
    icon: <Code className="h-5 w-5" />,
    title: "Building",
    content: "Working on a new open-source project for developer productivity.",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "Learning",
    content: "Diving deep into Rust and WebAssembly for high-performance web applications.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Exploring",
    content: "Experimenting with AI-powered tools for code generation and optimization.",
  },
  {
    icon: <Coffee className="h-5 w-5" />,
    title: "Enjoying",
    content: "Taking time to contribute to open-source projects and mentor junior developers.",
  },
]

export function NowSection() {
  return (
    <section id="now" className="py-10">
      <div className="space-y-2 mb-10">
        <h2 className="text-3xl font-bold tracking-tight">What I'm Doing Now</h2>
        <p className="text-muted-foreground">Current focus areas and activities.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nowItems.map((item, index) => (
          <Card key={index} className="border border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-2 bg-primary/10 rounded-md">{item.icon}</div>
              <CardTitle className="text-xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
