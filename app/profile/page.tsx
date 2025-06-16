"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageCropModal } from '@/components/image-crop-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/components/ui/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, XCircle, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { User } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { Navbar } from '@/components/navbar'

type Profile = Database['public']['Tables']['profiles']['Row']

export default function ProfilePage() {
  const { user: authUser, updateProfile, uploadAvatar, getDisplayAvatarUrl } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [website, setWebsite] = useState('')
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
  const hasProviders = availableProviders.length > 0

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
        setWebsite(profile?.website || '')
        
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
        if (savedAvatarSource === 'provider' && profile?.avatar_url) {
          const matchingProvider = availableProviders.find(p => p.avatarUrl === profile.avatar_url)
          if (matchingProvider) {
            setSelectedProvider(matchingProvider.provider)
          } else if (availableProviders.length > 0) {
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
          if (selectedProvider) {
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
        website: website || null,
      })
      
      const { error } = await updateProfile({
        name: fullName,
        avatarUrl,
        avatarSource,
        website: website || null,
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
        website: website || null,
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
        if (selectedProvider) {
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
            <Card className="border border-border/40">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-muted h-12 w-12"></div>
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                      </div>
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

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <Card className="border border-border/40">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                  <div className="text-center">
                    <UserIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
                    <p className="text-muted-foreground mb-6">You need to be logged in to view your profile.</p>
                    <Button size="lg" asChild>
                      <a href="/login">Log In</a>
                    </Button>
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
            <h1 className="text-3xl font-bold">Your Profile</h1>
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
            </Alert>
          )}

      <Card className="mb-6 border border-border/40 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account profile information</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar section */}
            <div className="flex flex-col items-center gap-5">
              <div className="relative group">
                <Avatar className="w-36 h-36 border-2 border-border shadow-md transition-all group-hover:shadow-lg">
                  <AvatarImage src={getPreviewAvatarUrl() || ''} alt={fullName || 'User'} />
                  <AvatarFallback className="text-2xl">{(fullName || user.email || 'User').substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {avatarSource === 'upload' && (
                    <Button size="sm" variant="secondary" className="text-xs" onClick={handleImageSelect}>
                      Edit
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Avatar Source Selection */}
              <div className="w-full max-w-sm space-y-4 pt-2 bg-card/50 p-4 rounded-lg">
                <Label className="text-sm font-medium">Profile Picture Source</Label>
                <RadioGroup 
                  value={avatarSource} 
                  onValueChange={(value) => setAvatarSource(value as 'upload' | 'provider' | 'url' | 'default')}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 rounded-md p-1 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="upload" id="upload" />
                    <Label htmlFor="upload" className="cursor-pointer">Upload custom image</Label>
                  </div>
                  
                  {/* Show provider option if providers are available */}
                  {hasProviders && (
                    <div className="flex items-center space-x-2 rounded-md p-1 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="provider" id="provider" />
                      <Label htmlFor="provider" className="cursor-pointer">Use OAuth provider picture</Label>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 rounded-md p-1 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="url" id="url" />
                    <Label htmlFor="url" className="cursor-pointer">Use custom URL</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md p-1 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="default" id="default" />
                    <Label htmlFor="default" className="cursor-pointer">Use default image</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Provider selection - only show when provider is selected */}
              {avatarSource === 'provider' && hasProviders && (
                <div className="w-full max-w-sm space-y-3 bg-card/50 p-4 rounded-lg mt-2">
                  <Label className="text-sm font-medium">Select Provider</Label>
                  <RadioGroup value={selectedProvider} onValueChange={handleProviderSelection} className="space-y-2">
                    {availableProviders.map((providerOption) => (
                      <div key={providerOption.provider} className="flex items-center space-x-2 rounded-md p-1 hover:bg-muted/50 transition-colors">
                        <RadioGroupItem 
                          value={providerOption.provider} 
                          id={`sel-${providerOption.provider}`}
                        />
                        <Label 
                          htmlFor={`sel-${providerOption.provider}`}
                          className="flex items-center cursor-pointer"
                        >
                          {providerOption.provider}
                          {providerOption.avatarUrl && (
                            <img 
                              src={providerOption.avatarUrl} 
                              alt={`${providerOption.provider} avatar`}
                              className="inline-block w-6 h-6 ml-2 rounded-full border shadow-sm"
                            />
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Upload buttons - only show for upload source */}
              {avatarSource === 'upload' && (
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={handleUploadClick} className="flex-1">
                    Upload New
                  </Button>
                  {uploadedAvatarUrl && (
                    <Button variant="outline" onClick={handleImageSelect} className="flex-1">
                      Edit Current
                    </Button>
                  )}
                </div>
              )}

              {/* URL input - only show for URL source */}
              {avatarSource === 'url' && (
                <div className="w-full max-w-sm space-y-2">
                  <Label htmlFor="customUrl" className="text-sm font-medium">Image URL</Label>
                  <Input
                    id="customUrl"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="bg-background"
                  />
                </div>
              )}
              
              <div className="text-xs text-muted-foreground text-center p-2 bg-muted/40 rounded-md mt-2">
                <p>Recommended size: 256x256px</p>
                {avatarSource === 'upload' && <p>Max file size: 2MB</p>}
              </div>
            </div>
            
            {/* Profile details section */}
            <div className="flex-1 space-y-6">
              <div className="bg-card/50 p-5 rounded-lg space-y-2">
                <h3 className="text-md font-semibold mb-3">Account Information</h3>
              
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="email" 
                    value={user.email || ''} 
                    disabled 
                    className="bg-background/70"
                  />
                  <p className="text-xs text-muted-foreground">Your email address cannot be changed</p>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="fullName" className="text-sm font-medium">Full name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-background/70"
                  />
                </div>
              </div>

              <div className="bg-card/50 p-5 rounded-lg space-y-2">
                <h3 className="text-md font-semibold mb-3">Additional Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium">Website (optional)</Label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="bg-background/70"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={handleSaveChanges} 
                  disabled={updating}
                  size="lg"
                  className="transition-all"
                >
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
      </div>
    </div>
  )
}