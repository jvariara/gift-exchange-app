"use client"
import CreateGroupModal from "@/components/modals/CreateGroupModal"
import LoadingSpinner from "@/components/LoadingSpinner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { client } from "@/lib/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ArrowRight, DollarSign, Trash2, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface DashboardPageContentProps {
  userId: string
}

const DashboardPageContent = ({ userId }: DashboardPageContentProps) => {
  const [deletingGroupID, setDeletingGroupID] = useState<string | null>(null)
  const [deletingGroupName, setDeletingGroupName] = useState<string | null>(
    null
  )
  const queryClient = useQueryClient()

  const { data: groups, isPending: isGroupsLoading } = useQuery({
    queryKey: ["user-groups"],
    queryFn: async () => {
      const res = await client.group.getGroups.$get()
      const { groups } = await res.json()
      return groups
    },
  })

  const { mutate: deleteGroup, isPending: isDeletingGroup } = useMutation({
    mutationFn: async (id: string) => {
      await client.group.deleteGroup.$post({ id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] })
      setDeletingGroupID(null)
      setDeletingGroupName(null)
    },
  })

  if (isGroupsLoading) {
    return (
      <div className="flex items-center justify-center flex-1 h-full w-full">
        <LoadingSpinner />
      </div>
    )
  }

  if (!groups || groups.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center rounded-2xl flex-1 text-center p-6">
        <div className="flex justify-center w-full">
          <img src="/present.svg" alt="Present" className="size-48 -mt-24" />
        </div>

        <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
          No Groups Yet
        </h1>

        <p className="text-sm/6 text-gray-600 max-w-prose mt-2 mb-8">
          Start your group gifting fun by creating your first group!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <CreateGroupModal containerClassName="w-full sm:w-auto">
            <Button className="flex items-center space-x-2 w-full sm:w-auto">
              <span>Create Group</span>
            </Button>
          </CreateGroupModal>
        </div>
      </Card>
    )
  }

  return (
    <>
      <ul className="grid max-w-6xl grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {groups?.map((group) => (
          <li
            key={group.id}
            className="relative group z-10 transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="absolute z-0 inset-px rounded-lg bg-white" />

            <div className="pointer-events-none z-0 absolute inset-px rounded-lg shadow-xs transition-all duration-300 group-hover:shadow-md ring-1 ring-black/5" />
            <div className="relative p-6 z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-4 rounded-full bg-primary" />

                <div>
                  <h3 className="text-lg/7 font-medium tracking-tight text-gray-950">
                    {group.name}
                  </h3>
                  <p className="text-sm/6 text-gray-600">
                    {format(group.createdAt, "MMM d, yyy")}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm/5 text-gray-600">
                  <User className="size-4 mr-2 text-secondary" />
                  <span className="font-medium">Total members:</span>
                  <span className="ml-1">{group._count.members}</span>
                </div>

                {group.budget && group.budget > 0 && (
                  <div className="flex items-center text-sm/5 text-gray-600">
                    <DollarSign className="size-4 mr-2 text-secondary" />
                    <span className="font-medium">Budget:</span>
                    <span className="ml-1">{group.budget}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <Link
                  href={`/dashboard/group/${group.id}`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "flex items-center gap-2 text-sm",
                  })}
                >
                  View <ArrowRight className="size-4" />
                </Link>
                {group.members.some(
                  (member) => member.userId === userId && member.isAdmin
                ) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-600 hover:bg-red-200 transition-colors hover:cursor-pointer"
                    aria-label={`Delete ${group.name}`}
                    onClick={() => {
                      setDeletingGroupName(group.name)
                      setDeletingGroupID(group.id)
                    }}
                  >
                    <Trash2 className="size-5" />
                  </Button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        showModal={!!deletingGroupID}
        setShowModal={() => {
          setDeletingGroupName(null)
          setDeletingGroupID(null)
        }}
        className="max-w-md p-8"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
              Delete Group
            </h2>
            <p className="text-sm/6 text-gray-600">
              Are you sure you want to delete the group &quot;
              {deletingGroupName}
              &quot;? This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setDeletingGroupName(null)
                setDeletingGroupID(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingGroupID && deleteGroup(deletingGroupID)}
              disabled={isDeletingGroup}
            >
              {isDeletingGroup ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default DashboardPageContent
