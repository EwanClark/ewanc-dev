"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageCropModal } from '@/components/image-crop-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { User } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [imageToEdit, setImageToEdit] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  // Initialize Supabase client inside the component
  const supabase = createClient()

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
        setAvatarUrl(profile?.avatar_url || '')
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndProfile()
  }, [])

  const handleSaveChanges = async () => {
    if (!user) return
    
    try {
      setUpdating(true)
      
      const updates = {
        id: user.id,
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      }
      
      // Upsert doesn't take the eq clause, it's part of the update
      const { error } = await supabase
        .from('profiles')
        .upsert(updates)
      
      if (error) {
        throw error
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      })
      
      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    } catch (error) {
      console.error('Error updating profile:', error)
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
    setImageToEdit(avatarUrl || profile?.avatar_url || '')
    setIsImageModalOpen(true)
  }

  const handleUploadClick = () => {
    // Create a file input element programmatically
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/*'
    
    // Handle file selection
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      // Create image URL for preview
      const imageUrl = URL.createObjectURL(file)
      setImageToEdit(imageUrl)
      setIsImageModalOpen(true)
    }
    
    // Trigger the file input click event
    fileInput.click()
  }

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!user) return
    
    try {
      setUpdating(true)
      
      // Upload the cropped image to Supabase Storage
      const fileName = `avatar-${user.id}-${Date.now()}.jpg`
      const filePath = `avatars/${fileName}`
      
      // Convert blob to File object for upload
      const file = new File([croppedImageBlob], fileName, { type: 'image/jpeg' })
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars') // Make sure this bucket exists in your Supabase storage
        .upload(filePath, file, { upsert: true })
      
      if (uploadError) {
        throw uploadError
      }
      
      // Get the public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)
      
      const newAvatarUrl = publicUrlData.publicUrl
      
      // Update avatar URL in the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
      
      if (updateError) {
        throw updateError
      }
      
      setAvatarUrl(newAvatarUrl)
      setProfile(prev => prev ? { ...prev, avatar_url: newAvatarUrl } : null)
      
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully.',
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your profile picture.',
        variant: 'destructive',
      })
    } finally {
      setUpdating(false)
    }
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
          <CardDescription>Update your account profile information</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar section */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32 border-2 border-border">
                <AvatarImage src={avatarUrl || profile?.avatar_url || ''} alt={fullName || 'User'} />
                <AvatarFallback>{(fullName || user.email || 'User').substring(0, 2)}</AvatarFallback>
              </Avatar>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleUploadClick}>Upload</Button>
                {(avatarUrl || profile?.avatar_url) && (
                  <Button variant="outline" onClick={handleImageSelect}>Edit</Button>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground text-center">
                <p>Recommended size: 256x256px</p>
                <p>Max file size: 2MB</p>
              </div>
            </div>
            
            {/* Profile details section */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email || ''} disabled />
                <p className="text-sm text-muted-foreground">Your email address cannot be changed</p>
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
              
              <div className="pt-4">
                <Button 
                  onClick={handleSaveChanges} 
                  disabled={updating}
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
  )
}
