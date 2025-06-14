"use client"

import React, { useState, useRef, useCallback } from 'react'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageCropModalProps {
  isOpen: boolean
  onClose: () => void
  onCropComplete: (croppedImageBlob: Blob) => void
  imageSrc: string
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export function ImageCropModal({ isOpen, onClose, onCropComplete, imageSrc }: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 1))
  }

  const getCroppedImg = useCallback(
    async (image: HTMLImageElement, crop: PixelCrop, scale = 1, rotation = 0) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('No 2d context')
      }

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      const pixelRatio = window.devicePixelRatio

      canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
      canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

      ctx.scale(pixelRatio, pixelRatio)
      ctx.imageSmoothingQuality = 'high'

      const cropX = crop.x * scaleX
      const cropY = crop.y * scaleY

      const rotateRads = rotation * Math.PI / 180
      const centerX = image.naturalWidth / 2
      const centerY = image.naturalHeight / 2

      ctx.save()

      ctx.translate(-cropX, -cropY)
      ctx.translate(centerX, centerY)
      ctx.rotate(rotateRads)
      ctx.scale(scale, scale)
      ctx.translate(-centerX, -centerY)
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
      )

      ctx.restore()

      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create blob'))
          }
        }, 'image/jpeg', 0.9)
      })
    },
    []
  )

  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current) {
      try {
        const croppedImageBlob = await getCroppedImg(
          imgRef.current,
          completedCrop,
          scale,
          rotation
        )
        onCropComplete(croppedImageBlob)
        onClose()
      } catch (error) {
        console.error('Error cropping image:', error)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crop Your Avatar</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              minWidth={100}
              minHeight={100}
              circularCrop
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imageSrc}
                style={{ 
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  maxHeight: '400px',
                  maxWidth: '100%'
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="scale">Zoom: {scale.toFixed(2)}x</Label>
              <Slider
                id="scale"
                min={0.5}
                max={3}
                step={0.1}
                value={[scale]}
                onValueChange={(value) => setScale(value[0])}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="rotation">Rotation: {rotation}°</Label>
              <Slider
                id="rotation"
                min={-180}
                max={180}
                step={1}
                value={[rotation]}
                onValueChange={(value) => setRotation(value[0])}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCropComplete} disabled={!completedCrop}>
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
