"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'

interface ProjectCarouselProps {
  images: string[]
  alt: string
  className?: string
  enableModal?: boolean
}

export function ProjectCarousel({ images, alt, className, enableModal = false }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [previousIndex, setPreviousIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [isModalTransitioning, setIsModalTransitioning] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollTimeRef = useRef<number>(0)
  const autoRotateTimeoutRef = useRef<NodeJS.Timeout | null>(null)



  const goToImage = (index: number) => {
    if (isTransitioning) return // Prevent spamming during transitions
    setIsTransitioning(true)
    setPreviousIndex(currentIndex)
    setCurrentIndex(index)
    // Reset transition flag after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  const goToPrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setPreviousIndex(currentIndex)
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  const goToNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setPreviousIndex(currentIndex)
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  // Modal navigation functions
  const openModal = (index: number) => {
    setModalImageIndex(index)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const goToNextModal = () => {
    if (isModalTransitioning) return
    setIsModalTransitioning(true)
    setModalImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
    setTimeout(() => setIsModalTransitioning(false), 300)
  }

  const goToPreviousModal = () => {
    if (isModalTransitioning) return
    setIsModalTransitioning(true)
    setModalImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
    setTimeout(() => setIsModalTransitioning(false), 300)
  }

  // Auto-rotation effect - runs every 5 seconds, pauses on hover
  useEffect(() => {
    if (images.length <= 1) return

    const startAutoRotate = () => {
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current)
      }
      
      autoRotateTimeoutRef.current = setTimeout(() => {
        if (!isHovered && !isTransitioning) {
          goToNext()
        }
        startAutoRotate() // Schedule next rotation
      }, 5000)
    }

    // Start auto-rotation if not hovered
    if (!isHovered) {
      startAutoRotate()
    }

    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current)
      }
    }
  }, [isHovered, isTransitioning, images.length])

  // Scroll navigation with throttling
  const handleScroll = useCallback((event: WheelEvent) => {
    event.preventDefault()
    
    const now = Date.now()
    const timeSinceLastScroll = now - lastScrollTimeRef.current
    
    // Throttle scroll events to prevent rapid changes (minimum 200ms between changes)
    if (timeSinceLastScroll < 200 || isTransitioning) {
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
  }, [isTransitioning])

  // Keyboard navigation - works on focus OR hover
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Modal keyboard navigation (only when modal is enabled)
      if (enableModal && isModalOpen) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault()
            if (!isModalTransitioning) {
              goToPreviousModal()
            }
            break
          case 'ArrowRight':
            event.preventDefault()
            if (!isModalTransitioning) {
              goToNextModal()
            }
            break
          case 'Escape':
            event.preventDefault()
            closeModal()
            break
        }
        return
      }

      // Carousel keyboard navigation
      const isFocused = document.activeElement === carouselRef.current
      const canNavigate = isFocused || isHovered
      
      if (canNavigate && !isTransitioning) {
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
          case 'Enter':
          case ' ':
            if (enableModal) {
              event.preventDefault()
              openModal(currentIndex)
            }
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [images.length, isHovered, isTransitioning, isModalOpen, currentIndex, modalImageIndex, enableModal, isModalTransitioning])

  // Modal-specific scroll navigation
  useEffect(() => {
    if (!isModalOpen || !enableModal) return

    const handleModalScroll = (event: WheelEvent) => {
      if (isModalTransitioning) return
      
      event.preventDefault()
      
      if (event.deltaY > 0) {
        // Scrolling down - next image
        goToNextModal()
      } else if (event.deltaY < 0) {
        // Scrolling up - previous image
        goToPreviousModal()
      }
    }

    // Add scroll listener to the entire document when modal is open
    document.addEventListener('wheel', handleModalScroll, { passive: false })
    
    return () => {
      document.removeEventListener('wheel', handleModalScroll)
    }
  }, [isModalOpen, enableModal, isModalTransitioning])

  // Focus modal when it opens to capture keyboard events
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isModalOpen])

  // Carousel scroll event listener
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
      className={cn("relative group outline-none", enableModal ? "cursor-pointer" : "cursor-grab active:cursor-grabbing", className)}
      tabIndex={0}
      role="region"
      aria-label={`${alt} image carousel`}
      aria-describedby="carousel-instructions"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        if (enableModal) {
          e.preventDefault()
          e.stopPropagation()
          openModal(currentIndex)
        }
      }}
      style={{ zIndex: 1 }}
    >
            {/* Main Image Container with Sliding Animation */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted">
        {images.map((image, index) => {
          // Calculate position for proper circular animation
          let position = index - currentIndex;
          
          // Handle wrap-around for smooth circular transitions
          if (isTransitioning) {
            // Determine if we're going from last to first or first to last
            const isWrapForward = previousIndex === images.length - 1 && currentIndex === 0;
            const isWrapBackward = previousIndex === 0 && currentIndex === images.length - 1;
            
            if (isWrapForward && index === images.length - 1) {
              // Going from last to first - position the last image to the left
              position = -1;
            } else if (isWrapBackward && index === 0) {
              // Going from first to last - position the first image to the right  
              position = 1;
            }
          }
          
          return (
            <div 
              key={index} 
              className="absolute inset-0 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(${position * 100}%)`
              }}
            >
              <Image
                src={image}
                alt={`${alt} - Image ${index + 1} of ${images.length}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                quality={95}
                priority={index === 0 || index === currentIndex}
              />
              {/* Click overlay with expand indicator - only show when modal is enabled */}
              {enableModal && (
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 flex items-center justify-center cursor-pointer z-20 group/expand">
                  <div className="opacity-0 group-hover/expand:opacity-100 transition-opacity duration-200 bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        
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
              disabled={isTransitioning}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed",
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
        Use arrow keys to navigate between images, scroll to change images, or click dots to jump to specific images.
        {enableModal && " Press Enter or Space to expand current image."}
        {" "}Auto-rotates every 5 seconds, pauses on hover. Works when focused or hovering.
      </div>

      {/* Image Modal - only render when modal is enabled */}
      {enableModal && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent 
            className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none focus:outline-none"
            tabIndex={-1}
          >
            <DialogTitle className="sr-only">
              {alt} - Image {modalImageIndex + 1} of {images.length}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Expanded view of project image. Use arrow keys or buttons to navigate between images, or press Escape to close.
            </DialogDescription>
            
            <div 
              ref={modalRef}
              className="relative w-full h-[85vh] flex items-center justify-center p-4 outline-none"
              tabIndex={0}
            >
              {/* Modal Image Container with Sliding Animation */}
              <div className="relative w-full h-full max-w-7xl max-h-full border border-white/10 rounded-lg overflow-hidden bg-black/20">
                {images.map((image, index) => {
                  // Calculate position for modal sliding
                  const position = index - modalImageIndex;
                  
                  return (
                    <div 
                      key={index}
                      className="absolute inset-0 transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(${position * 100}%)`
                      }}
                    >
                      <Image
                        src={image}
                        alt={`${alt} - Image ${index + 1} of ${images.length} (expanded view)`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 95vw, (max-width: 1400px) 90vw, 1400px"
                        quality={100}
                        priority={index === modalImageIndex}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Navigation Controls */}
              {images.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (!isModalTransitioning) {
                        goToPreviousModal()
                      }
                    }}
                    disabled={isModalTransitioning}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 transition-all duration-200 z-20 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous image"
                  >
                    <FaChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (!isModalTransitioning) {
                        goToNextModal()
                      }
                    }}
                    disabled={isModalTransitioning}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 transition-all duration-200 z-20 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next image"
                  >
                    <FaChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  closeModal()
                }}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 transition-all duration-200 z-20 hover:scale-110"
                aria-label="Close expanded view"
              >
                <FaTimes className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-base font-medium z-20">
                  {modalImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 