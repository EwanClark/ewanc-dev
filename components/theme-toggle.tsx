'use client'

import { Moon, Sun } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = useCallback(() => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    
    // Trigger icon animation
    setIsAnimating(true)
    
    // First spin out the current icon fast, then spin in the new icon slowly
    setTimeout(() => {
      setTheme(newTheme)
    }, 300) // Change theme halfway through animation
    
    setTimeout(() => setIsAnimating(false), 600) // Total animation time
    
  }, [resolvedTheme, setTheme])

  if (!mounted) {
    return null
  }

  return (
    <>
      <style>{`
        @keyframes spin-out-fast {
          0% { transform: rotate(0deg); opacity: 1; }
          100% { transform: rotate(720deg); opacity: 0; }
        }
        @keyframes spin-in-slow {
          0% { transform: rotate(-180deg); opacity: 0; }
          100% { transform: rotate(0deg); opacity: 1; }
        }
      `}</style>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleThemeToggle}
        className="h-9 w-9 group relative overflow-hidden"
        aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
      >
        <div 
          className="flex items-center justify-center"
          style={{
            animation: isAnimating 
              ? 'spin-out-fast 0.4s ease-in-out forwards, spin-in-slow 0.4s 0.4s ease-out forwards'
              : 'none'
          }}
        >
          {resolvedTheme === 'light' ? (
            <Sun className="!h-5 !w-5 transition-all duration-200 group-hover:rotate-6 group-hover:scale-105" />
          ) : (
            <Moon className="!h-5 !w-5 transition-all duration-200 group-hover:-rotate-6 group-hover:scale-105" />
          )}
        </div>
        
        {/* Subtle ripple effect on click */}
        <span 
          className={`absolute inset-0 rounded-md bg-foreground/5 ${
            isAnimating 
              ? 'animate-[ping_0.4s_cubic-bezier(0.4,0,0.2,1)]' 
              : 'opacity-0'
          }`}
        />
      </Button>
    </>
  )
}

export default ThemeToggle
