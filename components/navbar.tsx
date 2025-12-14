"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import ThemeToggle from "@/components/theme-toggle"

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    // { name: "Experience", href: "/experience" }, // Uncomment when ready to show experience
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between max-w-5xl px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-lg hover:text-foreground/80 transition-all duration-200">
            Portfolio
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          <Link href="https://github.com/ewanclark/" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-9 w-9 transition-all duration-200 hover:scale-105">
              <FaGithub style={{ width: 20, height: 20 }} />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
