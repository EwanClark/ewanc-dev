"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Code, Upload } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function ProfilePage() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user in localStorage
      const updatedUser = {
        ...user,
        name,
        avatarUrl: avatarUrl || undefined,
      }

      localStorage.setItem("demo-user", JSON.stringify(updatedUser))
      setSuccess(true)

      // Refresh the page to update the navbar
      window.location.reload()
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container py-16 flex items-center justify-center min-h-[calc(100vh-16rem)]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Not Authenticated</CardTitle>
              <CardDescription>You need to be logged in to view this page.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                  <AlertDescription>Your profile has been updated successfully!</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
                  <AvatarFallback>
                    <Code className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="avatar"
                      placeholder="https://example.com/avatar.jpg"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                    />
                    <Button type="button" variant="outline" className="shrink-0" disabled>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Enter a URL for your avatar image</p>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
