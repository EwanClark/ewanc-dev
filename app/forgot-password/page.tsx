"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isErrorExiting, setIsErrorExiting] = useState(false)
  const [isSuccessExiting, setIsSuccessExiting] = useState(false)

  const dismissError = () => {
    setIsErrorExiting(true)
    setTimeout(() => {
      setError(null)
      setIsErrorExiting(false)
    }, 300)
  }

  const dismissSuccess = () => {
    setIsSuccessExiting(true)
    setTimeout(() => {
      setSuccess(false)
      setIsSuccessExiting(false)
    }, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await resetPassword(email)

      if (error) {
        setError(error.message)
        setTimeout(dismissError, 5000)
      } else {
        setSuccess(true)
        setTimeout(dismissSuccess, 5000)
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
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we&apos;ll send you a link to reset your password
            </CardDescription>
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

            {success && (
              <Alert
                className={`bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-900 transition-all duration-300 ${
                  isSuccessExiting 
                    ? 'animate-out fade-out slide-out-to-top-2' 
                    : 'animate-in fade-in slide-in-from-top-2'
                }`}
              >
                <AlertDescription>
                  If an account exists with this email, you will receive a password reset link shortly.
                </AlertDescription>
              </Alert>
            )}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2">
            <div className="text-sm text-center">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:underline transition-all duration-200 hover:scale-105">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
