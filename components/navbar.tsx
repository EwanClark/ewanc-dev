"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FaChevronDown } from "react-icons/fa6"
import { FaGithub } from "react-icons/fa"
import { MdLogout } from "react-icons/md";
import { FaRegUser, FaBars } from "react-icons/fa";
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  // const [, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Determine if we're in a specific project section
  const isInShortUrl = pathname.startsWith("/projects/short-url")
  const currentProject = isInShortUrl ? "Short URL" : null

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 font-semibold text-lg hover:text-foreground/80 transition-all duration-200 group">
                {currentProject ? `${currentProject}` : "Portfolio"} <FaChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180 group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="/">Portfolio</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/projects/short-url">Short URL</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop Navigation */}
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
          {/* Mobile Navigation */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 transition-all duration-200 hover:scale-105">
                <FaBars className="h-4 w-4" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleMobileNavClick}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-foreground/80 px-4 py-2 rounded-md hover:bg-accent",
                      pathname === item.href ? "text-foreground bg-accent" : "text-foreground/60",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Auth Section */}
                {user ? (
                  <div className="border-t pt-4 mt-4">
                    {/* Profile Button - Clickable */}
                    <Link
                      href="/profile"
                      onClick={handleMobileNavClick}
                      className="flex items-center gap-3 px-4 py-3 mb-4 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatarSource === "default" ? undefined : (user.avatarUrl || undefined)} alt={user.name ?? undefined} />
                        <AvatarFallback className="bg-[#121212] text-white">
                          {(user.name || user.email || 'User').split(' ').map(part => part[0] || '').join('').substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">{user.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                      </div>
                      <FaRegUser className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    
                    <button
                      onClick={() => {
                        signOut()
                        handleMobileNavClick()
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors hover:text-foreground/80 hover:bg-accent rounded-md w-full text-left"
                    >
                      <MdLogout className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="border-t pt-4 mt-4 space-y-2">
                    <Link href="/login" onClick={handleMobileNavClick}>
                      <Button variant="ghost" className="w-full justify-start">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={handleMobileNavClick}>
                      <Button className="w-full">Sign up</Button>
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Theme Toggle */}
          <ThemeToggle />

          <Link href="https://github.com/ewanclark/" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-9 w-9 transition-all duration-200 hover:scale-105">
              <FaGithub style={{ width: 20, height: 20 }} />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>

          {/* Desktop User authentication */}
          <div className="hidden md:block">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full transition-all duration-200 hover:scale-105">
                    <Avatar className="h-8 w-8 transition-all duration-200">
                      <AvatarImage src={user.avatarSource === "default" ? undefined : (user.avatarUrl || undefined)} alt={user.name ?? undefined} />
                      <AvatarFallback className="bg-[#121212] text-white">
                        {(user.name || user.email || 'User').split(' ').map(part => part[0] || '').join('').substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <FaRegUser className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <MdLogout className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="transition-all duration-200 hover:scale-105">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="transition-all duration-200 hover:scale-105">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
