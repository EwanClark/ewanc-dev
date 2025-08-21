"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ImageCropModal } from "@/components/image-crop-modal"
import Image from "next/image"

type AvatarSource = 'upload' | 'provider' | 'url' | 'default'

interface AvailableProvider {
  provider: string
  avatarUrl: string | null
  name: string | null
}

interface ProfileAvatarSectionProps {
  fullName: string
  userEmail: string
  avatarSource: AvatarSource
  setAvatarSource: (source: AvatarSource) => void
  selectedProvider: string
  setSelectedProvider: (provider: string) => void
  customAvatarUrl: string
  setCustomAvatarUrl: (url: string) => void
  uploadedAvatarUrl: string
  setUploadedAvatarUrl: (url: string) => void
  availableProviders: AvailableProvider[]
  hasProviders: boolean
  onUploadAvatar: (file: File) => Promise<{ url?: string; error: Error | null }>
  onShowAlert: (status: 'success' | 'error') => void
  updating: boolean
  setUpdating: (updating: boolean) => void
}

export function ProfileAvatarSection({
  fullName,
  userEmail,
  avatarSource,
  setAvatarSource,
  selectedProvider,
  setSelectedProvider,
  customAvatarUrl,
  setCustomAvatarUrl,
  uploadedAvatarUrl,
  setUploadedAvatarUrl,
  availableProviders,
  hasProviders,
  onUploadAvatar,
  onShowAlert,
  // updating: _,
  setUpdating
}: ProfileAvatarSectionProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [imageToEdit, setImageToEdit] = useState<string | null>(null)

  const getPreviewAvatarUrl = () => {
    switch (avatarSource) {
      case 'upload':
        return uploadedAvatarUrl || null
      case 'url':
        return customAvatarUrl || null
      case 'default':
        return null
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
    try {
      setUpdating(true)
      
      const { url, error } = await onUploadAvatar(new File([croppedImageBlob], `avatar.jpg`, { type: 'image/jpeg' }))
      
      if (error) {
        throw error
      }
      
      if (url) {
        setUploadedAvatarUrl(url)
        setAvatarSource('upload')
        onShowAlert('success')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      onShowAlert('error')
    } finally {
      setUpdating(false)
    }
  }

  const handleProviderSelection = (providerName: string) => {
    setSelectedProvider(providerName)
  }

  return (
    <>
      {/* Avatar Preview */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="relative group">
          <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-2 border-border shadow-md transition-all group-hover:shadow-lg">
            <AvatarImage src={avatarSource === 'default' ? undefined : (getPreviewAvatarUrl() || undefined)} alt={fullName || 'User'} />
            <AvatarFallback 
              className="text-xl sm:text-2xl font-medium bg-[#121212] text-white"
            >
              {(fullName || userEmail || 'User').split(' ').map(part => part[0] || '').join('').substring(0, 2).toUpperCase()}
            </AvatarFallback>
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
          <h3 className="font-medium text-sm sm:text-base">{fullName || userEmail || 'User'}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{userEmail}</p>
        </div>
      </div>

      {/* Avatar Settings */}
      <div className="bg-card/50 p-4 sm:p-6 rounded-lg border border-border/40">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-semibold mb-3 block">Profile Picture</Label>
            <RadioGroup 
              value={avatarSource} 
              onValueChange={(value) => {
                const newValue = value as AvatarSource;
                setAvatarSource(newValue);
                
                // If switching to provider mode and no provider is selected, select the first available
                if (newValue === 'provider' && !selectedProvider && availableProviders?.length > 0) {
                  setSelectedProvider(availableProviders[0].provider);
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <Label 
                htmlFor="upload" 
                className="cursor-pointer rounded-md p-3 border border-border/20 hover:bg-muted/50 transition-colors w-full"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload" />
                  <span className="text-sm">Upload custom image</span>
                </div>
              </Label>
              
              {hasProviders && (
                <Label 
                  htmlFor="provider" 
                  className="cursor-pointer rounded-md p-3 border border-border/20 hover:bg-muted/50 transition-colors w-full"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="provider" id="provider" />
                    <span className="text-sm">Login provider</span>
                  </div>
                </Label>
              )}
              
              <Label 
                htmlFor="url" 
                className="cursor-pointer rounded-md p-3 border border-border/20 hover:bg-muted/50 transition-colors w-full"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="url" id="url" />
                  <span className="text-sm">Custom URL</span>
                </div>
              </Label>
              
              <Label 
                htmlFor="default" 
                className="cursor-pointer rounded-md p-3 border border-border/20 hover:bg-muted/50 transition-colors w-full"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="default" />
                  <span className="text-sm">Initials</span>
                </div>
              </Label>
            </RadioGroup>
          </div>

          {/* Provider selection */}
          {avatarSource === 'provider' && hasProviders && (
            <div className="space-y-3 p-4 bg-card/50 rounded-lg border border-border/10">
              <Label className="text-sm font-medium">Connected Accounts</Label>
              <RadioGroup value={selectedProvider} onValueChange={handleProviderSelection} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableProviders.map((providerOption) => (
                  <Label 
                    key={providerOption.provider}
                    htmlFor={`sel-${providerOption.provider}`}
                    className="cursor-pointer block p-3 rounded-md border border-border/20 hover:bg-background/50 transition-colors"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem 
                          value={providerOption.provider} 
                          id={`sel-${providerOption.provider}`}
                        />
                        <span className="font-medium capitalize text-sm">
                          {providerOption.provider}
                        </span>
                      </div>
                      {providerOption.avatarUrl && (
                        <Image 
                          src={providerOption.avatarUrl} 
                          alt={`${providerOption.provider} avatar`}
                          width={32}
                          height={32}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border shadow-sm"
                        />
                      )}
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Upload options */}
          {avatarSource === 'upload' && (
            <div className="space-y-3 p-4 bg-card/50 rounded-lg border border-border/40">
              <Label className="text-sm font-medium">Upload Options</Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
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

          {/* URL input */}
          {avatarSource === 'url' && (
            <div className="space-y-3 p-4 bg-card/50 rounded-lg border border-border/40">
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

      {/* Image Crop Modal */}
      {isImageModalOpen && imageToEdit && (
        <ImageCropModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          onCropComplete={handleCropComplete}
          imageSrc={imageToEdit}
        />
      )}
    </>
  )
} 