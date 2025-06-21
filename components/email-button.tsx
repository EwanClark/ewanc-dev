"use client"

import { Button } from "@/components/ui/button"
import { FiExternalLink } from "react-icons/fi";
import { MdMailOutline } from "react-icons/md";


interface EmailButtonProps {
  email: string
}

export function EmailButton({ email }: EmailButtonProps) {
  return (
    <Button 
      onClick={() => window.location.href = `mailto:${email}`}
      className="flex items-center gap-2 transition-all duration-200 hover:scale-105 group"
    >
      <MdMailOutline className="h-4 w-4" />
      Send Email
      <FiExternalLink className="h-3.5 w-3.5 ml-1" />
    </Button>
  )
}
