"use client"
import { Group } from "@prisma/client"
import React, { PropsWithChildren, useState } from "react"
import LoadingSpinner from "../LoadingSpinner"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"
import { useMutation } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { useRouter } from "next/navigation"

interface StartDrawModalProps extends PropsWithChildren {
  containerClassName?: string
  hasEveryoneAnswered: boolean
  group: Group
}

const StartDrawModal = ({
  group,
  hasEveryoneAnswered,
  children,
  containerClassName,
}: StartDrawModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const { mutate: startGroupDraw, isPending: isStartGroupDrawPending } =
    useMutation({
      mutationFn: async ({ id }: { id: string }) => {
        const response = await client.group.startGroupDraw.$post({ id })
        const result = await response.json()

        return result
      },
      onSuccess: () => {
        router.refresh()
        setIsOpen(false)
      }
    })

  if (!group || isStartGroupDrawPending) {
    return (
      <div className="flex items-center justify-center flex-1 h-full w-full">
        <LoadingSpinner />
      </div>
    )
  }

  const onSubmit = () => {
    startGroupDraw({ id: group.id })
  }

  return (
    <>
      <div className={containerClassName} onClick={() => setIsOpen(true)}>
        {children}
      </div>

      <Modal
        className="max-w-xl p-8"
        showModal={isOpen}
        setShowModal={setIsOpen}
      >
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
              Start Draw
            </h2>
            <p className="text-sm/6 text-gray-600">
              Click Start to begin your drawing process!
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isStartGroupDrawPending || !hasEveryoneAnswered}
            >
              {isStartGroupDrawPending ? "Drawing..." : "Start Draw"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default StartDrawModal
