"use client"

import { useState, useCallback, useRef } from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload } from "lucide-react"
import { uploadFile, getPublicUrl } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface AvatarUploadProps {
  initialAvatarUrl?: string | null
  onAvatarChange: (url: string) => void
  userId: string
}

export function AvatarUpload({ initialAvatarUrl, onAvatarChange, userId }: AvatarUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }
      
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setImage(reader.result as string)
        setIsDialogOpen(true)
      })
      reader.readAsDataURL(file)
    }
  }
  
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener("load", () => resolve(image))
      image.addEventListener("error", (error) => reject(error))
      image.src = url
    })

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number }
  ): Promise<Blob> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    
    if (!ctx) {
      throw new Error("Could not get canvas context")
    }

    // Set canvas dimensions to the cropped size
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )

    // Convert the canvas to a blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else throw new Error("Canvas is empty")
      }, "image/jpeg", 0.95)
    })
  }

  const handleSave = async () => {
    if (!image || !croppedAreaPixels) return
    
    try {
      // Set upload state to show the loading indicator
      setIsUploading(true)
      
      // Get the cropped image as a blob
      const croppedImage = await getCroppedImg(image, croppedAreaPixels)
      
      // Convert Blob to File
      const file = new File([croppedImage], `avatar-${Date.now()}.jpg`, { type: "image/jpeg" })
      
      // Upload to Supabase Storage
      const filePath = `${userId}/avatar-${Date.now()}.jpg`
      await uploadFile("avatars", filePath, file)
      
      // Get the public URL
      const publicUrl = getPublicUrl("avatars", filePath)
      
      // Update the parent component
      onAvatarChange(publicUrl)
      
      // Close the dialog
      setIsDialogOpen(false)
      setImage(null)
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully",
      })
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <Button 
        type="button" 
        variant="outline" 
        className="shrink-0" 
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Your Avatar</DialogTitle>
          </DialogHeader>

          <div className="text-sm text-muted-foreground text-center mb-2">
            Drag to position and use mouse wheel to zoom
          </div>
          
          <div className="relative w-full h-64 overflow-hidden my-4">
            {image && (
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                zoomSpeed={0.1}
                maxZoom={3}
                minZoom={1}
              />
            )}
          </div>
          
          <div className="flex flex-col space-y-4 py-2">
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isUploading}>
                {isUploading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
