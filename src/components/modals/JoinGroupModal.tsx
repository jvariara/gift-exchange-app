"use client"
import { client } from "@/lib/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { redirect, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"

const JoinGroupModal = () => {
  const [isOpen, setIsOpen] = useState(true)
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      const response = await client.group.joinGroup.$post({ token })
      const data = await response.json()

      return data
    },
    onSuccess: async (data) => {
      setIsOpen(false)
      queryClient.invalidateQueries({
        queryKey: [`group-members-${data.group.id}`],
      })
      redirect(`/dashboard/group/${data.group.id}`)
    },
    onError: (error) => {
      console.log("Error while joining group: ", error)
    },
  })

  if (!token) {
    router.push("/dashboard")
    return
  }

  // const {} = useForm({})

  return (
    <>
      <Modal
        className="max-w-xl p-8"
        showModal={isOpen}
        setShowModal={setIsOpen}
      >
        <form onSubmit={() => mutate({ token })}>
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
              Join Group
            </h2>
            <p className="text-sm/6 text-gray-600">
              Would you like to join this group?
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
            <Button type="submit" disabled={isPending}>
              {isPending ? "Joining..." : "Join Group"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default JoinGroupModal
