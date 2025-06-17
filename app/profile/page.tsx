"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageCropModal } from "@/components/image-crop-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, UserIcon } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { Navbar } from "@/components/navbar"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export default function ProfilePage() {
  const { user: authUser, updateProfile, uploadAvatar, getDisplayAvatarUrl } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [avatarSource, setAvatarSource] = useState<'upload' | 'provider' | 'url' | 'default'>('upload')
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [customAvatarUrl, setCustomAvatarUrl] = useState('')
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState('')
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [imageToEdit, setImageToEdit] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [alertStatus, setAlertStatus] = useState<'success' | 'error' | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const { toast } = useToast()

  const supabase = createClient()

  // Check if user has OAuth providers
  const availableProviders = authUser?.availableProviders || []
  const hasProviders = availableProviders && availableProviders.length > 0

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        setLoading(true)
        
        // Get user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        
        setUser(user)
        
        // Get profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (error) {
          console.error('Error fetching profile:', error)
          return
        }
        
        setProfile(profile)
        setFullName(profile?.full_name || '')
        
        // Handle avatar source - ensure it's one of the valid values
        let savedAvatarSource = profile?.avatar_source || 'upload'
        
        // Clean up any old provider-specific values
        if (typeof savedAvatarSource === 'string' && savedAvatarSource.startsWith('provider-')) {
          savedAvatarSource = 'provider'
        }
        
        // Ensure it's a valid value
        if (!['upload', 'provider', 'url', 'default'].includes(savedAvatarSource)) {
          savedAvatarSource = 'upload'
        }
        
        setAvatarSource(savedAvatarSource as 'upload' | 'provider' | 'url' | 'default')
        
        // If using provider source, try to determine which provider based on avatar_url
        if (savedAvatarSource === 'provider' && profile?.avatar_url && availableProviders?.length > 0) {
          const matchingProvider = availableProviders.find(p => p.avatarUrl === profile.avatar_url)
          if (matchingProvider) {
            setSelectedProvider(matchingProvider.provider)
          } else {
            // Default to first available provider if no match found
            setSelectedProvider(availableProviders[0].provider)
          }
        }
        
        // Set the appropriate avatar URL based on source
        if (savedAvatarSource === 'url') {
          setCustomAvatarUrl(profile?.avatar_url || '')
        } else if (savedAvatarSource === 'upload') {
          setUploadedAvatarUrl(profile?.avatar_url || '')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndProfile()
  }, [availableProviders])

  const handleSaveChanges = async () => {
    if (!user) return
    
    try {
      setUpdating(true)
      setShowAlert(false)
      
      let avatarUrl: string | null = null
      
      // Determine avatar URL based on selected source
      switch (avatarSource) {
        case 'upload':
          avatarUrl = uploadedAvatarUrl || null
          break
        case 'url':
          avatarUrl = customAvatarUrl || null
          break
        case 'default':
          avatarUrl = '/default-profile-picture.jpg'
          break
        case 'provider':
          if (selectedProvider && availableProviders?.length > 0) {
            const matchingProvider = availableProviders.find(p => p.provider === selectedProvider)
            avatarUrl = matchingProvider?.avatarUrl || null
          }
          break
        default:
          avatarUrl = null
      }
      
      console.log('Saving profile with:', {
        name: fullName,
        avatarUrl,
        avatarSource,
      })
      
      const { error } = await updateProfile({
        name: fullName,
        avatarUrl,
        avatarSource,
      })
      
      if (error) {
        throw error
      }
      
      // Show toast notification
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      })
      
      // Show persistent success alert
      setAlertStatus('success')
      setShowAlert(true)
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false)
      }, 5000)
      
      // Update local profile state
      setProfile(prev => prev ? { 
        ...prev, 
        full_name: fullName,
        avatar_url: avatarUrl,
        avatar_source: avatarSource,
        updated_at: new Date().toISOString()
      } : null)
    } catch (error) {
      console.error('Error updating profile:', error)
      
      // Show toast notification
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'There was an error updating your profile.',
        variant: 'destructive',
      })
      
      // Show persistent error alert
      setAlertStatus('error')
      setShowAlert(true)
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false)
      }, 5000)
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
    
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      const imageUrl = URL.createObjectURL(file)
      setImageToEdit(imageUrl)
      setIsImageModalOpen(true)
    }
    
    fileInput.click()
  }

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!user) return
    
    try {
      setUpdating(true)
      setShowAlert(false)
      
      const { url, error } = await uploadAvatar(new File([croppedImageBlob], `avatar-${user.id}.jpg`, { type: 'image/jpeg' }))
      
      if (error) {
        throw error
      }
      
      if (url) {
        setUploadedAvatarUrl(url)
        setAvatarSource('upload')
        
        // Show toast notification
        toast({
          title: 'Avatar uploaded',
          description: 'Your profile picture has been uploaded successfully. Click "Save changes" to apply.',
        })
        
        // Show persistent success alert
        setAlertStatus('success')
        setShowAlert(true)
        
        // Auto-hide alert after 5 seconds
        setTimeout(() => {
          setShowAlert(false)
        }, 5000)
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      
      // Show toast notification
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'There was an error uploading your profile picture.',
        variant: 'destructive',
      })
      
      // Show persistent error alert
      setAlertStatus('error')
      setShowAlert(true)
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false)
      }, 5000)
    } finally {
      setUpdating(false)
    }
  }

  const getPreviewAvatarUrl = () => {
    switch (avatarSource) {
      case 'upload':
        return uploadedAvatarUrl || null
      case 'url':
        return customAvatarUrl || null
      case 'default':
        return '/default-profile-picture.jpg'
      case 'provider':
        if (selectedProvider && availableProviders?.length > 0) {
          const matchingProvider = availableProviders.find(p => p.provider === selectedProvider)
          return matchingProvider?.avatarUrl || null
        }
        return null
      default:
        return null
    }
  }

  const handleProviderSelection = (providerName: string) => {
    setSelectedProvider(providerName)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="animate-pulse w-60">
                <div className="h-8 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
            
            <Card className="border border-border/40 shadow-sm">
              <CardHeader className="border-b border-border/30">
                <div className="animate-pulse w-full">
                  <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col items-center">
                    <div className="animate-pulse space-y-6 w-full">
                      <div className="flex justify-center">
                        <div className="rounded-full bg-muted h-40 w-40"></div>
                      </div>
                      <div className="h-12 bg-muted rounded w-60 mx-auto"></div>
                    </div>
                  </div>
                  
                  <div className="animate-pulse space-y-6 w-full">
                    <div className="h-40 bg-muted rounded w-full"></div>
                    <div className="h-64 bg-muted rounded w-full"></div>
                    <div className="h-10 bg-muted rounded w-1/3 ml-auto"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Profile Settings</h1>
              </div>
            </div>
            
            <Card className="border border-border/40 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col items-center justify-center min-h-[400px] relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>
                  <div className="text-center z-10 p-8">
                    <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                      <UserIcon className="h-10 w-10 text-primary/70" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-6">Authentication Required</h2>
                    <div className="flex gap-4 justify-center">
                      <Button size="lg" asChild className="px-8 font-medium">
                        <a href="/login">Log In</a>
                      </Button>
                      <Button size="lg" variant="outline" asChild className="px-8 font-medium">
                        <a href="/signup">Create Account</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Profile Settings</h1>
            </div>
          </div>
          
          {/* Display alert message */}
          {showAlert && (
            <Alert 
              variant={alertStatus === 'error' ? 'destructive' : 'default'} 
              className={`mb-6 ${alertStatus === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-900' : ''}`}
            >
              {alertStatus === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {alertStatus === 'success' ? 'Success!' : 'Error!'}
              </AlertTitle>
              <AlertDescription>
                {alertStatus === 'success' 
                  ? 'Your profile has been updated successfully.'
                  : 'There was an error saving your profile. Please try again.'}
              </AlertDescription>
            </Alert>          )}

          <Card className="mb-6 border border-border/40 shadow-sm">
            <CardHeader className="border-b border-border/30">
              <CardTitle className="text-xl">Account Settings</CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="flex flex-col gap-8">
                {/* Left side - Avatar Preview Only */}
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="relative group">
                    <Avatar className="w-40 h-40 border-2 border-border shadow-md transition-all group-hover:shadow-lg">
                      <AvatarImage src={getPreviewAvatarUrl() || ''} alt={fullName || 'User'} />
                      <AvatarFallback className="text-2xl font-medium">{(fullName || user.email || 'User').substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {avatarSource === 'upload' && (
                        <Button size="sm" variant="secondary" className="text-xs font-medium shadow-sm" onClick={handleImageSelect}>
                          Edit Image
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-medium">{fullName || user.email || 'User'}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <div className="space-y-6 w-full">
                  {/* Profile Information Section */}
                  <div className="bg-card/50 p-6 rounded-lg border border-border/40">
                    <h3 className="text-base font-semibold mb-4">Profile Information</h3>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Verified</span>
                        </div>
                        <Input 
                          id="email" 
                          value={user.email || ''} 
                          disabled 
                          className="bg-background/70 border-border/30 text-muted-foreground"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Your email address cannot be changed
                        </p>
                      </div>
                      
                      <div className="space-y-2 pt-2">
                        <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className="bg-background/70 border-border/30"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Avatar Settings Section */}
                  <div className="bg-card/50 p-6 rounded-lg border border-border/40">
                    <h3 className="text-base font-semibold mb-4">Profile Picture Settings</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Picture Source</Label>
                        <RadioGroup 
                          value={avatarSource} 
                          onValueChange={(value) => setAvatarSource(value as 'upload' | 'provider' | 'url' | 'default')}
                          className="grid grid-cols-2 gap-3"
                        >
                          <div className="flex items-center space-x-2 rounded-md p-3 border border-border/20 hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="upload" id="upload" />
                            <Label htmlFor="upload" className="cursor-pointer text-sm">
                              Upload custom image
                            </Label>
                          </div>
                          
                          {hasProviders && (
                            <div className="flex items-center space-x-2 rounded-md p-3 border border-border/20 hover:bg-muted/50 transition-colors">
                              <RadioGroupItem value="provider" id="provider" />
                              <Label htmlFor="provider" className="cursor-pointer text-sm">
                                OAuth provider picture
                              </Label>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2 rounded-md p-3 border border-border/20 hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="url" id="url" />
                            <Label htmlFor="url" className="cursor-pointer text-sm">
                              Use custom URL
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2 rounded-md p-3 border border-border/20 hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="default" id="default" />
                            <Label htmlFor="default" className="cursor-pointer text-sm">
                              Use default image
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Provider selection - show when provider is selected */}
                      {avatarSource === 'provider' && hasProviders && (
                        <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-border/10">
                          <Label className="text-sm font-medium">Connected Accounts</Label>
                          <RadioGroup value={selectedProvider} onValueChange={handleProviderSelection} className="space-y-2">
                            {availableProviders.map((providerOption) => (
                              <div key={providerOption.provider} className="flex items-center justify-between p-3 rounded-md border border-border/20 hover:bg-background/50 transition-colors">
                                <div className="flex items-center space-x-3">
                                  <RadioGroupItem 
                                    value={providerOption.provider} 
                                    id={`sel-${providerOption.provider}`}
                                  />
                                  <Label 
                                    htmlFor={`sel-${providerOption.provider}`}
                                    className="cursor-pointer font-medium capitalize"
                                  >
                                    {providerOption.provider}
                                  </Label>
                                </div>
                                {providerOption.avatarUrl && (
                                  <img 
                                    src={providerOption.avatarUrl || "/placeholder.svg"} 
                                    alt={`${providerOption.provider} avatar`}
                                    className="w-8 h-8 rounded-full border shadow-sm"
                                  />
                                )}
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      )}

                      {/* Upload options - show when upload is selected */}
                      {avatarSource === 'upload' && (
                        <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-border/10">
                          <Label className="text-sm font-medium">Upload Options</Label>
                          <div className="flex gap-3">
                            <Button 
                              variant="secondary" 
                              onClick={handleUploadClick} 
                              className="flex-1 font-medium"
                            >
                              Upload New Image
                            </Button>
                            {uploadedAvatarUrl && (
                              <Button 
                                variant="outline" 
                                onClick={handleImageSelect} 
                                className="flex-1 font-medium"
                              >
                                Edit Current Image
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* URL input - show when URL is selected */}
                      {avatarSource === 'url' && (
                        <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-border/10">
                          <Label htmlFor="customUrl" className="text-sm font-medium">External Image URL</Label>
                          <Input
                            id="customUrl"
                            value={customAvatarUrl}
                            onChange={(e) => setCustomAvatarUrl(e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                            className="bg-background/70 border-border/30"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveChanges} 
                      disabled={updating}
                      size="lg"
                      className="font-medium px-8"
                    >
                      {updating ? 'Saving...' : 'Save Changes'}
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
      </div>
    </div>
  )
}
