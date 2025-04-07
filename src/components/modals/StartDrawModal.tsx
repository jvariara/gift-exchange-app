"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { client } from "@/lib/client"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface StartDrawModalProps {
  group: Group
  hasEveryoneAnswered: boolean
  children: React.ReactNode
}

const StartDrawModal = ({ isOpen, onClose, groupId }: StartDrawModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  const startGroupDraw = client.group.startGroupDraw.useMutation({
    onSuccess: async () => {
      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ["drawn-participant-answers", groupId] })
      await queryClient.invalidateQueries({ queryKey: ["group-questions", groupId] })
      await queryClient.invalidateQueries({ queryKey: [`group-members-${groupId}`] })
      
      // Update the group data in the cache to reflect that the draw has started
      queryClient.setQueryData(["group", groupId], (oldData: any) => ({
        ...oldData,
        hasDrawStarted: true
      }))

      onClose()
      router.refresh()
    },
  })

  const handleStartDraw = async () => {
    setIsLoading(true)
    try {
      await startGroupDraw.mutateAsync({ id: groupId })
    } catch (error) {
      console.error("Failed to start draw:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start the Draw</DialogTitle>
          <DialogDescription>
            Are you sure you want to start the draw? This will randomly assign
            participants to each other and reveal their answers. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleStartDraw} disabled={isLoading}>
            {isLoading ? "Starting Draw..." : "Start Draw"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default StartDrawModal
