"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { FaRegCheckCircle} from "react-icons/fa";
interface ProfilePasswordSectionProps {
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<{ error: Error | null }>
}

export function ProfilePasswordSection({ onChangePassword }: ProfilePasswordSectionProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [isErrorExiting, setIsErrorExiting] = useState(false)
  const [isSuccessExiting, setIsSuccessExiting] = useState(false)
  const { toast } = useToast()

  const dismissError = () => {
    setIsErrorExiting(true)
    setTimeout(() => {
      setPasswordError(null)
      setIsErrorExiting(false)
    }, 300)
  }

  const dismissSuccess = () => {
    setIsSuccessExiting(true)
    setTimeout(() => {
      setPasswordSuccess(false)
      setIsSuccessExiting(false)
    }, 300)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)
    setPasswordLoading(true)
    
    // Validate passwords
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long")
      setTimeout(dismissError, 5000)
      setPasswordLoading(false)
      return
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match")
      setTimeout(dismissError, 5000)
      setPasswordLoading(false)
      return
    }
    
    try {
      const { error } = await onChangePassword(currentPassword, newPassword)
      
      if (error) {
        setPasswordError(error.message)
        setTimeout(dismissError, 5000)
      } else {
        setPasswordSuccess(true)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        
        // Show toast notification
        toast({
          title: 'Password updated',
          description: 'Your password has been changed successfully.',
        })
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          dismissSuccess()
        }, 5000)
      }
    } catch (err) {
      setPasswordError("An unexpected error occurred")
      setTimeout(dismissError, 5000)
      console.error(err)
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <Card className="mb-6 border border-border/40 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-semibold">Change Password</h2>
          
          {passwordError && (
            <Alert 
              variant="destructive"
              className={`transition-all duration-300 ${
                isErrorExiting 
                  ? 'animate-out fade-out slide-out-to-top-2' 
                  : 'animate-in fade-in slide-in-from-top-2'
              }`}
            >
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="text-sm">{passwordError}</AlertDescription>
            </Alert>
          )}
          
          {passwordSuccess && (
            <Alert 
              className={`bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-900 transition-all duration-300 ${
                isSuccessExiting 
                  ? 'animate-out fade-out slide-out-to-top-2' 
                  : 'animate-in fade-in slide-in-from-top-2'
              }`}
            >
              <FaRegCheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription className="text-sm">Your password has been changed successfully.</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-semibold">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="bg-background/70 border-border/30"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-semibold">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a new password"
                className="bg-background/70 border-border/30"
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 8 characters long
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="bg-background/70 border-border/30"
                required
              />
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit"
                disabled={passwordLoading || newPassword !== confirmPassword || newPassword.length < 8}
                size="default"
                className="w-full sm:w-auto font-medium"
              >
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
} 