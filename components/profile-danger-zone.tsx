"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { FiAlertTriangle } from "react-icons/fi";

interface ProfileDangerZoneProps {
  onDeleteAccount: () => Promise<{ error: Error | null }>
}

export function ProfileDangerZone({ onDeleteAccount }: ProfileDangerZoneProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { toast } = useToast()

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try {
      const { error } = await onDeleteAccount()
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted.",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting your account.",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <Card className="border-red-200 dark:border-red-900/40 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-semibold text-red-600 dark:text-red-500">Danger Zone</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Once you delete your account, there is no going back. This action is permanent.
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteDialog(true)}
                className="w-full sm:w-auto"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="mx-4 sm:mx-0 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FiAlertTriangle className="h-5 w-5 text-red-500" />
              Delete Account
            </DialogTitle>
            <DialogDescription className="text-sm">
              This action cannot be undone. This will permanently delete your account 
              and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Are you absolutely sure you want to delete your account? 
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className="w-full sm:w-auto"
            >
              {deleteLoading ? "Deleting..." : "Yes, Delete My Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 