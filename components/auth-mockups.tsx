import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Github } from "lucide-react"

export function AuthMockups() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-8">Authentication UI</h2>
      <p className="text-muted-foreground mb-8">
        Login and signup interfaces designed for upcoming Supabase integration.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login Mockup */}
        <Card className="max-w-md mx-auto w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" disabled />
            </div>
            <Button className="w-full" disabled>
              Sign in
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" disabled>
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </CardContent>
        </Card>

        {/* Signup Mockup */}
        <Card className="max-w-md mx-auto w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="John Doe" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" type="email" placeholder="name@example.com" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input id="signup-password" type="password" placeholder="••••••••" disabled />
            </div>
            <Button className="w-full" disabled>
              Create account
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" disabled>
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground text-center mt-6">
        * Mockup interfaces - Supabase integration coming soon
      </p>
    </section>
  )
}
