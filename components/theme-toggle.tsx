"use client"

import * as React from "react"
import { FaMoon, FaDesktop } from "react-icons/fa"
import { IoSunny } from "react-icons/io5";
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getIcon = () => {
    if (!mounted) {
      return <FaDesktop className="h-4 w-4" />
    }
    
    switch (theme) {
      case "light":
        return <IoSunny className="h-4 w-4" />
      case "dark":
        return <FaMoon className="h-4 w-4" />
      case "system":
        return <FaDesktop className="h-4 w-4" />
      default:
        return <FaDesktop className="h-4 w-4" />
    }
  }

  const getTooltipText = () => {
    if (!mounted) {
      return "Toggle theme"
    }
    
    switch (theme) {
      case "light":
        return "Switch to dark mode"
      case "dark":
        return "Switch to system mode"
      case "system":
        return "Switch to light mode"
      default:
        return "Toggle theme"
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-9 w-9 transition-all duration-200 hover:scale-105" 
      onClick={cycleTheme}
      title={getTooltipText()}
    >
      {getIcon()}
      <span className="sr-only">{getTooltipText()}</span>
    </Button>
  )
} 