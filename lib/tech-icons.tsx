"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

const TechIcon = ({ name, lightIcon, darkIcon, size = 16 }: { 
  name: string; 
  lightIcon?: string; 
  darkIcon: string;
  size?: number;
}) => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const getIconSrc = () => {
    if (!mounted) {
      return darkIcon
    }
    
    if (lightIcon && resolvedTheme === "light") {
      return lightIcon
    }
    
    return darkIcon
  }
  
  return (
    <div className="transition-all duration-200 flex-shrink-0">
      <Image 
        src={getIconSrc()} 
        width={size} 
        height={size} 
        alt={name} 
        className={`w-${size/4} h-${size/4}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        priority={false}
      />
    </div>
  )
}

const techIconMap: Record<string, { lightIcon?: string; darkIcon: string }> = {
  "TypeScript": { darkIcon: "/typescript.svg" },
  "JavaScript": { darkIcon: "/javascript.svg" },
  "Python": { darkIcon: "/python.svg" },
  "Rust": { lightIcon: "/rust-light.svg", darkIcon: "/rust.svg" },
  "C++": { darkIcon: "/cpp.svg" },
  "Next.js": { darkIcon: "/nextjs.svg" },
  "React": { darkIcon: "/react.svg" },
  "Tailwind CSS": { darkIcon: "/tailwindcss.svg" },
  "Tailwind": { darkIcon: "/tailwindcss.svg" },
  "Electron": { darkIcon: "/electron.svg" },
  "Figma": { darkIcon: "/figma.svg" },
  "Express": { lightIcon: "/expressjs-light.svg", darkIcon: "/expressjs.svg" },
  "Supabase": { darkIcon: "/supabase.svg" },
  "MongoDB": { darkIcon: "/mongodb.svg" },
  "PostgreSQL": { darkIcon: "/postgresql.svg" },
  "Vercel": { lightIcon: "/vercel-light.svg", darkIcon: "/vercel.svg" },
  "AWS": { lightIcon: "/aws-light.svg", darkIcon: "/aws.svg" },
  "shadcn/ui": { darkIcon: "/shadcn-dark.svg", lightIcon: "/shadcn-light.svg" },
  "Radix UI": { darkIcon: "/radixui-dark.svg", lightIcon: "/radixui-light.svg" },
  "Chart.js": { darkIcon: "/chartjs.svg" },
  "React Icons": { darkIcon: "/reacticons.svg"},
  "Cursor": { lightIcon: "/cursor-light.svg", darkIcon: "/cursor.svg" },
  "Git": { darkIcon: "/git.svg" },
  "Excalidraw": { darkIcon: "/excalidraw.svg" },
  "Hyprland": { darkIcon: "/hyprland.svg" },
  "Arch Linux": { darkIcon: "/arch.svg" },
  "Real-time": { darkIcon: "/supabase.svg" },
  "OAuth": { darkIcon: "/google.svg" },
  "IpInfo": { darkIcon: "/ipinfo.svg" },
}

export function TechBadge({ 
  tech, 
  variant = "secondary", 
  className = "" 
}: { 
  tech: string; 
  variant?: "secondary" | "outline"; 
  className?: string;
}) {
  const iconConfig = techIconMap[tech]
  
  return (
    <Badge 
      variant={variant} 
      className={`bg-gradient-to-r from-secondary to-secondary/80 flex items-center gap-2 px-3 py-1.5 ${className}`}
    >
      {iconConfig && (
        <TechIcon 
          name={tech}
          lightIcon={iconConfig.lightIcon}
          darkIcon={iconConfig.darkIcon}
          size={24}
        />
      )}
      <span className="text-sm font-medium">{tech}</span>
    </Badge>
  )
}

export { TechIcon, techIconMap }