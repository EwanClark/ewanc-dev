"use client"

import * as React from "react"
import { FaMoon } from "react-icons/fa"
import { IoSunny } from "react-icons/io5";
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch and handle first-time visitors
  React.useEffect(() => {
    setMounted(true)
    
    // Check if user has a theme preference set
    const hasThemePreference = localStorage.getItem('theme') !== null
    
    if (!hasThemePreference) {
      // First-time visitor: detect their system preference and set it
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const systemTheme = systemPrefersDark ? 'dark' : 'light'
      
      // Set their preference based on system theme
      setTheme(systemTheme)
    }
  }, [setTheme])

  const toggleTheme = () => {
    // Simple toggle between dark and light only
    setTheme(theme === "light" ? "dark" : "light")
  }

  const getIcon = () => {
    if (!mounted) {
      // Default to light icon during SSR
      return <IoSunny className="h-4 w-4" />
    }
    
    return theme === "light" 
      ? <IoSunny className="h-4 w-4" />
      : <FaMoon className="h-4 w-4" />
  }

  const getTooltipText = () => {
    if (!mounted) {
      return "Toggle theme"
    }
    
    return theme === "light" 
      ? "Switch to dark mode" 
      : "Switch to light mode"
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-9 w-9 transition-all duration-200 hover:scale-105" 
      onClick={toggleTheme}
      title={getTooltipText()}
    >
      {getIcon()}
      <span className="sr-only">{getTooltipText()}</span>
    </Button>
  )
} 