"use client"
import React, { useState } from "react"
import { Button } from "../ui/button"
import { Modal } from "../ui/modal"
import { Input } from "../ui/input"
import { Clipboard } from "lucide-react"

interface InviteLinkModalProps {
  containerClassName?: string
  token: string
  children?: React.ReactNode
}

const InviteLinkModal = ({
  token,
  children,
  containerClassName,
}: InviteLinkModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      {children && (
        <div className={containerClassName} onClick={() => setIsOpen(true)}>
          {children}
        </div>
      )}

      <Modal
        className="max-w-xl p-8"
        showModal={isOpen}
        setShowModal={setIsOpen}
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
              Invite your Friends/Family!
            </h2>
            <p className="text-sm/6 text-gray-600">
              Send this link to your friends and family to join your group.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Input
              value={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/join-group?token=${token}`}
              readOnly
            />
            <Button
              onClick={() =>
                navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/join-group?token=${token}`
                )
              }
            >
              <Clipboard className="size-4" />
            </Button>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default InviteLinkModal
