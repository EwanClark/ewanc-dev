"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { FaGithub } from "react-icons/fa"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

export default function SignupPage() {
  const router = useRouter()
  const { signUp, signInWithGithub, signInWithGoogle } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isErrorExiting, setIsErrorExiting] = useState(false)

  const dismissError = () => {
    setIsErrorExiting(true)
    setTimeout(() => {
      setError(null)
      setIsErrorExiting(false)
    }, 300)
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setTimeout(dismissError, 5000)
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setTimeout(dismissError, 5000)
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password, name)

      if (error) {
        setError(error.message)
        setTimeout(dismissError, 5000)
      } else {
        router.push("/signup-success")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setTimeout(dismissError, 5000)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGithubSignup = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await signInWithGithub()
      if (error) {
        setError(error.message)
        setTimeout(dismissError, 5000)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setTimeout(dismissError, 5000)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleGoogleSignup = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setError(error.message)
        setTimeout(dismissError, 5000)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setTimeout(dismissError, 5000)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container py-16 flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create an account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert 
                variant="destructive"
                className={`transition-all duration-300 ${
                  isErrorExiting 
                    ? 'animate-out fade-out slide-out-to-top-2' 
                    : 'animate-in fade-in slide-in-from-top-2'
                }`}
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={handleGoogleSignup}>
                <Image src="/google.svg" alt="Google" width={18} height={18} className="w-5 h-5" />
                  Google
              </Button>
              <Button variant="outline" className="w-full" onClick={handleGithubSignup}>
                <FaGithub style={{ width: 20, height: 20 }} />
                  GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline transition-all duration-200 hover:scale-105">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
