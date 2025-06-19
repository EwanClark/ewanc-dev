"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

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
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      case "system":
        return <Monitor className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getTooltipText = () => {
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
      className="h-9 w-9" 
      onClick={cycleTheme}
      title={getTooltipText()}
    >
      {getIcon()}
      <span className="sr-only">{getTooltipText()}</span>
    </Button>
  )
} 