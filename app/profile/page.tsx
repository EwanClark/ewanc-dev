"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Code, Upload } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ImageCropModal } from "@/components/image-crop-modal"

export default function ProfilePage() {
  const { user, updateProfile, uploadAvatar } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await updateProfile({
        name,
        avatarUrl: avatarUrl || null,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size must be less than 5MB")
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file")
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
        setCropModalOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setUploadLoading(true)
    setError(null)

    try {
      // Convert blob to file
      const file = new File([croppedImageBlob], 'avatar.jpg', {
        type: 'image/jpeg',
      })

      const { url, error } = await uploadAvatar(file)
      
      if (error) {
        throw error
      }

      if (url) {
        setAvatarUrl(url)
        // Auto-save the profile with the new avatar
        const { error: updateError } = await updateProfile({
          name,
          avatarUrl: url,
        })
        
        if (updateError) {
          throw updateError
        }
        
        setSuccess(true)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload avatar"
      setError(errorMessage)
      console.error(err)
    } finally {
      setUploadLoading(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
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
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="shrink-0" 
                      onClick={handleUploadClick}
                      disabled={uploadLoading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadLoading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Enter a URL for your avatar image</p>
                  
                  {!avatarUrl && user.providerAvatarUrl && user.provider && (
                    <div className="mt-3 bg-primary/10 text-primary rounded-md p-3 flex items-start gap-2">
                      <div>
                        <Avatar className="h-10 w-10 border border-primary/20">
                          <AvatarImage src={user.providerAvatarUrl} />
                          <AvatarFallback>{user.provider.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="text-sm font-medium">We found a profile picture from {user.provider === 'google' ? 'Google' : 'GitHub'}</p>
                        <p className="text-xs text-primary/80">Would you like to use your {user.provider === 'google' ? 'Google' : 'GitHub'} profile picture?</p>
                        <Button 
                          type="button" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => setAvatarUrl(user.providerAvatarUrl || '')}
                        >
                          Use this avatar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedImage && (
        <ImageCropModal
          isOpen={cropModalOpen}
          onClose={() => {
            setCropModalOpen(false)
            setSelectedImage(null)
          }}
          onCropComplete={handleCropComplete}
          imageSrc={selectedImage}
        />
      )}
    </>
  )
}
