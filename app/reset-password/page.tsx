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
  const [hashPresent, setHashPresent] = useState<boolean | null>(null) // null = still checking
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const supabase = createClient()

  // Check if the user is in a valid password recovery session
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Create a variable to track if we've found a valid session
        let validSession = false;
        
        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            // PASSWORD_RECOVERY event is triggered when the recovery link is used
            if (event === 'PASSWORD_RECOVERY') {
              validSession = true;
              setHashPresent(true);
            }
          }
        );

        // Also check if we already have a session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          validSession = true;
          setHashPresent(true);
        } else {
          // Check the URL for recovery tokens
          // Supabase may include the token in the hash or as a query parameter
          const hasRecoveryToken = 
            // Check hash for token
            (window.location.hash && 
             (window.location.hash.includes('access_token=') || 
              window.location.hash.includes('type=recovery'))) ||
            // Check URL for token parameter
            new URLSearchParams(window.location.search).has('token');
          
          if (hasRecoveryToken) {
            validSession = true;
            setHashPresent(true);
          }
        }
        
        // If we haven't found a valid session after all checks, set to false
        // Small delay to avoid immediate state change
        setTimeout(() => {
          if (!validSession) {
            setHashPresent(false);
          }
        }, 100);

        // Clean up listener on unmount
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error checking auth session:", error);
        // In case of error, show the form anyway to avoid blocking the user
        setHashPresent(true);
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
        
        // If we successfully reset the password, we should be logged in
        // Get the updated session
        const { data: { session: updatedSession } } = await supabase.auth.getSession()
        
        // Check if we're authenticated now
        if (updatedSession) {
          // We're logged in, redirect to profile page
          setIsLoggedIn(true)
          router.push('/')
        } else {
          // Not automatically logged in, redirect to login page
          setIsLoggedIn(false)
            router.push('/login')
        }
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
                  Your password has been reset successfully! 
                  {isLoggedIn ? 
                    " You are now logged in and will be redirected to your profile page." : 
                    " You will be redirected to the login page to sign in with your new password."}
                </AlertDescription>
              </Alert>
            )}
            
            {/* Show loading state while checking session */}
            {hashPresent === null && !success && (
              <div className="flex justify-center py-4">
                <div className="animate-pulse flex space-x-2 items-center">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground ml-2">Verifying reset link...</span>
                </div>
              </div>
            )}

            {/* Only show error when we've confirmed the session is not valid */}
            {hashPresent === false && !success && (
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

            {hashPresent === true && !success && (
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
