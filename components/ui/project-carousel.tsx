"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProjectCarouselProps {
  images: string[]
  alt: string
  className?: string
}

export function ProjectCarousel({ images, alt, className }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollTimeRef = useRef<number>(0)

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  // Scroll navigation with throttling
  const handleScroll = useCallback((event: WheelEvent) => {
    event.preventDefault()
    
    const now = Date.now()
    const timeSinceLastScroll = now - lastScrollTimeRef.current
    
    // Throttle scroll events to prevent rapid changes (minimum 200ms between changes)
    if (timeSinceLastScroll < 200) {
      return
    }
    
    lastScrollTimeRef.current = now
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    // Determine scroll direction and change image
    if (event.deltaY > 0) {
      // Scrolling down - next image
      goToNext()
    } else if (event.deltaY < 0) {
      // Scrolling up - previous image
      goToPrevious()
    }
  }, [])

  // Keyboard navigation - works on focus OR hover
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isFocused = document.activeElement === carouselRef.current
      const canNavigate = isFocused || isHovered
      
      if (canNavigate) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault()
            goToPrevious()
            break
          case 'ArrowRight':
            event.preventDefault()
            goToNext()
            break
          case 'Home':
            event.preventDefault()
            goToImage(0)
            break
          case 'End':
            event.preventDefault()
            goToImage(images.length - 1)
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [images.length, isHovered])

  // Scroll event listener
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    // Add scroll event listener to the carousel element
    carousel.addEventListener('wheel', handleScroll, { passive: false })
    
    return () => {
      carousel.removeEventListener('wheel', handleScroll)
      // Clean up any pending timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [handleScroll])

  if (images.length === 0) return null

  return (
    <div 
      ref={carouselRef}
      className={cn("relative group outline-none cursor-grab active:cursor-grabbing", className)}
      tabIndex={0}
      role="region"
      aria-label={`${alt} image carousel`}
      aria-describedby="carousel-instructions"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted">
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1} of ${images.length}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={currentIndex === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Focus indicator */}
        <div className="absolute inset-0 ring-2 ring-primary ring-offset-2 ring-offset-background opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>

      {/* Sleek Dot Navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                goToImage(index)
                carouselRef.current?.focus()
              }}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300 hover:scale-110",
                index === currentIndex
                  ? "bg-white shadow-md"
                  : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to image ${index + 1} of ${images.length}`}
            />
          ))}
        </div>
      )}

      {/* Screen reader instructions */}
      <div id="carousel-instructions" className="sr-only">
        Use arrow keys to navigate between images, scroll to change images, or click dots to jump to specific images. Works when focused or hovering.
      </div>
    </div>
  )
} 