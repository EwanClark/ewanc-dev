import { SiRust, SiNextdotjs, SiTailwindcss, SiVercel, SiGnubash, SiLinux } from "react-icons/si"
import { IoLogoElectron } from "react-icons/io5";

export interface ProjectSkill {
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export interface Project {
  title: string;
  image: string;
  description: string;
  skills: ProjectSkill[];
  features: string[];
  github: string;
  live?: string;
}

export const projects: Project[] = [
  {
    title: "Line Counter",
    image: "/projects/linecounter.png",
    description: "A GUI, CLI and website to count lines, words, and characters of either files or folders.",
    skills: [
      {
        label: "Electron",
        color: "text-blue-400",
        icon: IoLogoElectron,
        description: "JavaScript with type safety.",
      },
      {
        label: "Rust",
        color: "text-orange-500",
        icon: SiRust,
        description: "React Framework",
      },
      {
        label: "Next.js",
        color: "text-foreground",
        icon: SiNextdotjs,
        description: "React Framework",
      }
    ],
    features: [
      "GUI application in Electron",
      "CLI tool in Rust",
      "Web application in Next.js",
      "Counts lines, words, and characters",
      "Files, Folders or GitHub repositories",
    ],
    github: "https://github.com/ewanclark/linecounter",
  },  
  {
    title: "Portfolio",
    image: "/projects/portfolio.png",
    description: "My personal portfolio website built to showcase my projects and skills.",
    skills: [
      {
        label: "Next.js",
        color: "text-foreground",
        icon: SiNextdotjs,
        description: "React Framework",
      },
      {
        label: "Tailwind CSS",
        color: "text-blue-400",
        icon: SiTailwindcss,
        description: "CSS Framework",
      },
      {
        label: "Vercel",
        color: "text-foreground",
        icon: SiVercel,
        description: "Deployment",
      }
    ],
    features: [
      "Smooth animations",
      "Dark/Light mode",
      "Quick to get information",
      "Minimalistic design",
    ],
    github: "https://github.com/ewanclark/ewanc-dev",
    live: "https://ewanc.dev",
  },
  {
    title: "Arch Install Script",
    image: "/projects/archinstall.png",
    description: "A script to quickly install Arch Linux with custom setup options for advanced features.",
    skills: [
      {
        label: "Bash",
        color: "text-foreground",
        icon: SiGnubash,
        description: "Shell Scripting",
      },
      {
        label: "Linux",
        color: "text-foreground",
        icon: SiLinux,
        description: "Operating System",
      },
    ],
    features: [
      "Customizable setup options",
      "Secure boot setup",
      "Nvidia GPU setup",
      "Interactive partitioning",
      "Automatic hardware detection",
    ],
    github: "https://github.com/ewanclark/archinstall",
  }
];
