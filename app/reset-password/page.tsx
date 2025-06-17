"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/utils/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hashPresent, setHashPresent] = useState(false)
  const supabase = createClient()

  // Check if the user is in a valid password recovery session
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("Auth event:", event);
            // PASSWORD_RECOVERY event is triggered when the recovery link is used
            if (event === 'PASSWORD_RECOVERY') {
              setHashPresent(true);
            }
          }
        );

        // Also check if we already have a session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setHashPresent(true);
        } else if (window.location.hash && window.location.hash.length > 1) {
          // We have a hash in the URL which might be the recovery token
          setHashPresent(true);
        }

        // Clean up listener on unmount
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error checking auth session:", error);
      }
    };
    
    checkSession();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession()
      
      // Try to update the password directly
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        // If there's an error, it might be because we don't have a valid session
        // Check if we can extract a token from the URL or hash
        const hash = window.location.hash
        
        if (hash && hash.length > 1) {
          // We have a hash, try to parse it
          try {
            // The hash can be complex, so we attempt to handle different formats
            // Supabase usually includes type=recovery in the hash for password reset flows
            setError("Unable to reset password with the provided link. Please request a new password reset link.")
          } catch (parseErr) {
            setError("Invalid password reset link format. Please request a new reset link.")
          }
        } else {
          setError(error.message)
        }
      } else {
        setSuccess(true)
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    } catch (err) {
      setError("An unexpected error occurred")
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
              Enter your new password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>
                  Your password has been reset successfully! You will be redirected to the login page.
                </AlertDescription>
              </Alert>
            )}

            {!hashPresent && !success && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertDescription>
                    Invalid or expired password reset link. Please try again by requesting a new password reset.
                  </AlertDescription>
                </Alert>
                <div className="flex justify-center">
                  <Button asChild>
                    <Link href="/forgot-password">Request New Reset Link</Link>
                  </Button>
                </div>
              </div>
            )}

            {hashPresent && !success && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-center">
              <Link href="/login" className="text-primary hover:underline">
                Back to Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
