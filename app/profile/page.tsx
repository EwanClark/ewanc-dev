"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ImageCropModal } from '@/components/image-crop-modal'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth-context'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

export default function ProfilePage() {
  const {
    user: authUser,
    updateProfile,
    uploadAvatar,
    getDisplayAvatarUrl,
  } = useAuth()

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarSource, setAvatarSource] = useState<string>('upload')
  const [customAvatarUrl, setCustomAvatarUrl] = useState('')
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState('')
  const [selectedProviderUrl, setSelectedProviderUrl] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [imageToEdit, setImageToEdit] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  const supabase = createClient()
  const availableProviders = authUser?.availableProviders || []

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        setLoading(true)
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return
        setUser(user)

        const { data: prof, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        if (error) {
          console.error('Error fetching profile:', error)
          return
        }

        setProfile(prof)
        setFullName(prof.full_name || '')
        setWebsite(prof.website || '')

        const savedAvatarSource = prof.avatar_source || 'upload'
        if (savedAvatarSource === 'provider') {
          const match = availableProviders.find(
            (p) => p.avatarUrl === prof.avatar_url
          )
          if (match) {
            setAvatarSource(`provider-${match.provider}`)
            setSelectedProvider(match.provider)
            setSelectedProviderUrl(match.avatarUrl || '')
          } else if (availableProviders.length > 0) {
            setAvatarSource(`provider-${availableProviders[0].provider}`)
            setSelectedProvider(availableProviders[0].provider)
            setSelectedProviderUrl(
              availableProviders[0].avatarUrl || ''
            )
          }
        } else {
          setAvatarSource(savedAvatarSource)
        }

        if (prof.avatar_source === 'url') {
          setCustomAvatarUrl(prof.avatar_url || '')
        } else if (prof.avatar_source === 'upload') {
          setUploadedAvatarUrl(prof.avatar_url || '')
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndProfile()
  }, [availableProviders, supabase])

  const handleSaveChanges = async () => {
    if (!user) return

    try {
      setUpdating(true)

      let avatarUrl: string | null = null
      let finalAvatarSource = avatarSource

      if (avatarSource === 'upload') {
        avatarUrl = uploadedAvatarUrl || null
      } else if (avatarSource === 'url') {
        avatarUrl = customAvatarUrl || null
      } else if (avatarSource === 'default') {
        avatarUrl = '/default-profile-picture.jpg'
      } else if (avatarSource.startsWith('provider-')) {
        const providerName = avatarSource.replace('provider-', '')
        const match = availableProviders.find(
          (p) => p.provider === providerName
        )
        avatarUrl = match?.avatarUrl || null
        finalAvatarSource = 'provider'
      }

      const { error } = await updateProfile({
        name: fullName,
        avatarUrl,
        avatarSource: finalAvatarSource as
          | 'upload'
          | 'provider'
          | 'url'
          | 'default',
        website: website || null,
      })
      if (error) throw error

      // SUCCESS
      toast({
        title: 'Profile updated',
        description:
          'Your profile information has been updated successfully.',
      })

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              full_name: fullName,
              avatar_url: avatarUrl,
              avatar_source: finalAvatarSource,
              website: website || null,
              updated_at: new Date().toISOString(),
            }
          : prev
      )
    } catch (err) {
      console.error('Error updating profile:', err)
      toast({
        title: 'Update failed',
        description: 'There was an error updating your profile.',
        variant: 'destructive',
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleImageSelect = () => {
    const currentUrl = getPreviewAvatarUrl()
    setImageToEdit(currentUrl || '')
    setIsImageModalOpen(true)
  }

  const handleUploadClick = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/*'
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      setImageToEdit(URL.createObjectURL(file))
      setIsImageModalOpen(true)
    }
    fileInput.click()
  }

  const handleCropComplete = async (blob: Blob) => {
    if (!user) return

    try {
      setUpdating(true)
      const file = new File([blob], `avatar-${user.id}.jpg`, {
        type: 'image/jpeg',
      })
      const { url, error } = await uploadAvatar(file)
      if (error) throw error

      setUploadedAvatarUrl(url || '')
      setAvatarSource('upload')

      // SUCCESS
      toast({
        title: 'Avatar uploaded',
        description:
          'Your profile picture has been uploaded successfully. Click "Save changes" to apply.',
      })
    } catch (err) {
      console.error('Error uploading avatar:', err)
      toast({
        title: 'Upload failed',
        description:
          'There was an error uploading your profile picture.',
        variant: 'destructive',
      })
    } finally {
      setUpdating(false)
    }
  }

  const getPreviewAvatarUrl = () => {
    if (avatarSource === 'upload') {
      return uploadedAvatarUrl || null
    }
    if (avatarSource === 'url') {
      return customAvatarUrl || null
    }
    if (avatarSource === 'default') {
      return '/default-profile-picture.jpg'
    }
    if (avatarSource.startsWith('provider-')) {
      const providerName = avatarSource.replace('provider-', '')
      return (
        availableProviders.find((p) => p.provider === providerName)
          ?.avatarUrl || null
      )
    }
    return null
  }

  const handleProviderSelection = (
    providerName: string,
    avatarUrl: string
  ) => {
    setAvatarSource(`provider-${providerName}`)
    setSelectedProvider(providerName)
    setSelectedProviderUrl(avatarUrl)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <p>Loading profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <p>You need to be logged in to view your profile.</p>
              <Button className="mt-4" asChild>
                <a href="/login">Log In</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar section */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32 border-2 border-border">
                <AvatarImage
                  src={getPreviewAvatarUrl() || ''}
                  alt={fullName || 'User'}
                />
                <AvatarFallback>
                  {(fullName || user.email || 'User').substring(0, 2)}
                </AvatarFallback>
              </Avatar>

              {/* Avatar Source */}
              <div className="w-full max-w-sm space-y-3">
                <Label>Profile Picture Source</Label>
                <RadioGroup
                  value={avatarSource}
                  onValueChange={setAvatarSource}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upload" id="upload" />
                    <Label htmlFor="upload">Upload custom image</Label>
                  </div>

                  {availableProviders.map((providerOption) => (
                    <div
                      key={providerOption.provider}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={`provider-${providerOption.provider}`}
                        id={`provider-${providerOption.provider}`}
                        onClick={() =>
                          handleProviderSelection(
                            providerOption.provider,
                            providerOption.avatarUrl || ''
                          )
                        }
                      />
                      <Label
                        htmlFor={`provider-${providerOption.provider}`}
                        className="flex items-center cursor-pointer"
                      >
                        Use {providerOption.provider} profile picture
                        {providerOption.avatarUrl && (
                          <img
                            src={providerOption.avatarUrl}
                            alt={`${providerOption.provider} avatar`}
                            className="inline-block w-6 h-6 ml-2 rounded-full border"
                          />
                        )}
                      </Label>
                    </div>
                  ))}

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="url" id="url" />
                    <Label htmlFor="url">Use custom URL</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="default" />
                    <Label htmlFor="default">Use default image</Label>
                  </div>
                </RadioGroup>
              </div>

              {avatarSource === 'upload' && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleUploadClick}>
                    Upload New
                  </Button>
                  {uploadedAvatarUrl && (
                    <Button variant="outline" onClick={handleImageSelect}>
                      Edit Current
                    </Button>
                  )}
                </div>
              )}

              {avatarSource === 'url' && (
                <div className="w-full max-w-sm space-y-2">
                  <Label htmlFor="customUrl">Image URL</Label>
                  <Input
                    id="customUrl"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              )}

              <div className="text-sm text-muted-foreground text-center">
                <p>Recommended size: 256x256px</p>
                {avatarSource === 'upload' && <p>Max file size: 2MB</p>}
              </div>
            </div>

            {/* Profile details */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email || ''} disabled />
                <p className="text-sm text-muted-foreground">
                  Your email address cannot be changed
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website (optional)</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div className="pt-4">
                <Button onClick={handleSaveChanges} disabled={updating}>
                  {updating ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isImageModalOpen && imageToEdit && (
        <ImageCropModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          onCropComplete={handleCropComplete}
          imageSrc={imageToEdit}
        />
      )}
    </div>
  )
}