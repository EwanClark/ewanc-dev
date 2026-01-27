import { 
  SiTypescript, 
  SiJavascript, 
  SiNextdotjs, 
  SiReact, 
  SiPython,
  SiNodedotjs,
  SiGit,
  SiVercel,
  SiAmazonwebservices,
} from "react-icons/si"
import { BiLogoPostgresql } from "react-icons/bi"
import { siCursor } from "simple-icons"

const CursorIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d={siCursor.path} fill="currentColor" />
  </svg>
)

export interface Tech {
  name: string
  icon: React.ComponentType<{ className?: string }>
  color?: string
}

export const techs: Tech[] = [
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-400" },
  { name: "JavaScript", icon: SiJavascript, color: "text-yellow-400" },
  { name: "React", icon: SiReact, color: "text-cyan-400" },
  { name: "Next.js", icon: SiNextdotjs},
  { name: "Node.js", icon: SiNodedotjs, color: "text-green-500" },
  { name: "Postgres", icon: BiLogoPostgresql, color: "text-blue-300" },
  { name: "Python", icon: SiPython, color: "text-yellow-500" },
  { name: "Git", icon: SiGit, color: "text-orange-500" },
  { name: "Vercel", icon: SiVercel },
  { name: "AWS", icon: SiAmazonwebservices, color: "text-orange-400" },
  { name: "Cursor", icon: CursorIcon, color: "text-foreground" },
]
