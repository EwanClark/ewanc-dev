"use client"

import * as React from "react"
import { FaMoon } from "react-icons/fa"
import { IoSunny } from "react-icons/io5";
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light")
  }

  const getIcon = () => {
    if (!mounted) {
      return <IoSunny className="h-4 w-4" />
    }
    
    return resolvedTheme === "light" 
      ? <IoSunny className="h-4 w-4" />
      : <FaMoon className="h-4 w-4" />
  }

  const getTooltipText = () => {
    if (!mounted) {
      return "Toggle theme"
    }
    
    // Use resolvedTheme for tooltip text as well
    return resolvedTheme === "light" 
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