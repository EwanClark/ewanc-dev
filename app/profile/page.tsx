"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FaRegUser, FaRegCheckCircle} from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import { useAuth } from "@/lib/auth-context"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { Navbar } from "@/components/navbar"
import { ProfileAvatarSection } from "@/components/profile-avatar-section"
import { ProfilePasswordSection } from "@/components/profile-password-section"
import { ProfileDangerZone } from "@/components/profile-danger-zone"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export default function ProfilePage() {
  const { user: authUser, updateProfile, uploadAvatar, changePassword, deleteAccount } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [avatarSource, setAvatarSource] = useState<'upload' | 'provider' | 'url' | 'default'>('upload')
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [customAvatarUrl, setCustomAvatarUrl] = useState('')
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [alertStatus, setAlertStatus] = useState<'success' | 'error' | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [isAlertExiting, setIsAlertExiting] = useState(false)
  const { toast } = useToast()

  const supabase = createClient()

  // Check if user has OAuth providers
  const availableProviders = useMemo(() => authUser?.availableProviders || [], [authUser?.availableProviders])
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
  }, [availableProviders, supabase])

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
          avatarUrl = null
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
      
      const { error } = await updateProfile({
        name: fullName,
        avatarUrl,
        avatarSource,
      })
      
      if (error) {
        throw error
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      })
      
      setAlertStatus('success')
      setShowAlert(true)
      
      setTimeout(() => {
        dismissAlert()
      }, 5000)
      
      setProfile(prev => prev ? { 
        ...prev, 
        full_name: fullName,
        avatar_url: avatarUrl,
        avatar_source: avatarSource,
        updated_at: new Date().toISOString()
      } : null)
    } catch (error) {
      console.error('Error updating profile:', error)
      
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'There was an error updating your profile.',
        variant: 'destructive',
      })
      
      setAlertStatus('error')
      setShowAlert(true)
      
      setTimeout(() => {
        dismissAlert()
      }, 5000)
    } finally {
      setUpdating(false)
    }
  }

  const dismissAlert = () => {
    setIsAlertExiting(true)
    setTimeout(() => {
      setShowAlert(false)
      setIsAlertExiting(false)
    }, 300)
  }

  const handleShowAlert = (status: 'success' | 'error') => {
    setAlertStatus(status)
    setShowAlert(true)
    setTimeout(() => {
      dismissAlert()
    }, 5000)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-8 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="animate-pulse w-48 sm:w-60">
                <div className="h-6 sm:h-8 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
            
            <Card className="border border-border/40 shadow-sm">
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
        <div className="container py-8 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Profile Settings</h1>
              </div>
            </div>
            
            <Card className="border border-border/40 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col items-center justify-center min-h-[400px] relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>
                  <div className="text-center z-10 p-8">
                    <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                      <FaRegUser className="h-10 w-10 text-primary/70" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-6">Authentication Required</h2>
                    <div className="flex gap-4 justify-center">
                      <Button size="lg" asChild className="px-8 font-medium">
                        <Link href="/login">Log In</Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild className="px-8 font-medium">
                        <Link href="/signup">Create Account</Link>
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
      <div className="container py-8 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Profile Settings</h1>
            </div>
          </div>
          
          {/* Display alert message */}
          {showAlert && (
            <Alert 
              variant={alertStatus === 'error' ? 'destructive' : 'default'} 
              className={`mb-6 transition-all duration-300 ${
                alertStatus === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-900' : ''
              } ${
                isAlertExiting 
                  ? 'animate-out fade-out slide-out-to-top-2' 
                  : 'animate-in fade-in slide-in-from-top-2'
              }`}
            >
              {alertStatus === 'success' ? (
                <FaRegCheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <FaRegCircleXmark className="h-4 w-4" />
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
            <CardContent className="pt-6 relative">
              <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
                <Button 
                  onClick={handleSaveChanges} 
                  disabled={updating}
                  size="sm"
                  className="font-medium sm:px-6"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
              <div className="flex flex-col gap-8">
                <ProfileAvatarSection
                  fullName={fullName}
                  userEmail={user.email || ''}
                  avatarSource={avatarSource}
                  setAvatarSource={setAvatarSource}
                  selectedProvider={selectedProvider}
                  setSelectedProvider={setSelectedProvider}
                  customAvatarUrl={customAvatarUrl}
                  setCustomAvatarUrl={setCustomAvatarUrl}
                  uploadedAvatarUrl={uploadedAvatarUrl}
                  setUploadedAvatarUrl={setUploadedAvatarUrl}
                  availableProviders={availableProviders}
                  hasProviders={hasProviders}
                  onUploadAvatar={uploadAvatar}
                  onShowAlert={handleShowAlert}
                  updating={updating}
                  setUpdating={setUpdating}
                />
                
                <div className="space-y-6 w-full">
                  {/* Profile Information Section */}
                  <div className="bg-card/50 p-6 rounded-lg border border-border/40">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
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
                        <Label htmlFor="fullName" className="text-sm font-semibold">Name</Label>
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
                </div>
              </div>
            </CardContent>
          </Card>
      
          {/* Password Change Section */}
          <ProfilePasswordSection onChangePassword={changePassword} />
      
          {/* Danger Zone - Delete Account */}
          <ProfileDangerZone onDeleteAccount={deleteAccount} />
        </div>
      </div>
    </div>
  )
}
