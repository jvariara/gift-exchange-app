"use client"

import { Button } from "@/components/ui/button"
import StartDrawModal from "@/components/modals/StartDrawModal"
import { GroupWithDetailedIncludes } from "@/lib/types"
import { useState } from "react"

interface StartDrawButtonProps {
  group: GroupWithDetailedIncludes
  hasEveryoneAnswered: boolean
}

export default function StartDrawButton({ group, hasEveryoneAnswered }: StartDrawButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <StartDrawModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      groupId={group.id}
      group={group}
      hasEveryoneAnswered={hasEveryoneAnswered}
    >
      <Button 
        className="w-full sm:w-fit"
        onClick={() => setIsOpen(true)}
      >
        Start Draw
      </Button>
    </StartDrawModal>
  )
} 