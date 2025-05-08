"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GroupWithDetailedIncludes } from "@/lib/types"
import { Plus, ExternalLink, Trash2 } from "lucide-react"
import { useState } from "react"
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"

interface WishlistsPageContentProps {
  group: GroupWithDetailedIncludes
  currentUserId: string
}

export default function WishlistsPageContent({
  group,
  currentUserId,
}: WishlistsPageContentProps) {
  const [newItemUrl, setNewItemUrl] = useState("")
  const [newItemTitle, setNewItemTitle] = useState("")
  const queryClient = useQueryClient()

  // Add a query to fetch the group data
  const { data: groupData } = useQuery({
    queryKey: ["group", group.id],
    initialData: group
  })

  const addWishlistItem = useMutation({
    mutationFn: async (data: { url: string; title: string }) => {
      const response = await fetch("/api/wishlist/addItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error("Failed to add item")
      }
      return response.json()
    },
    onSuccess: async (newItem) => {
      queryClient.setQueryData(["group", group.id], (oldData: any) => {
        const updatedMembers = oldData.members.map((member: any) => {
          if (member.user.id === currentUserId) {
            return {
              ...member,
              user: {
                ...member.user,
                wishlistItems: [...member.user.wishlistItems, newItem]
              }
            }
          }
          return member
        })
        return { ...oldData, members: updatedMembers }
      })
      setNewItemUrl("")
      setNewItemTitle("")
    },
  })

  const deleteWishlistItem = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`/api/wishlist/deleteItem?id=${itemId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete item")
      }
    },
    onSuccess: async (_, itemId) => {
      queryClient.setQueryData(["group", group.id], (oldData: any) => {
        const updatedMembers = oldData.members.map((member: any) => {
          if (member.user.id === currentUserId) {
            return {
              ...member,
              user: {
                ...member.user,
                wishlistItems: member.user.wishlistItems.filter((item: any) => item.id !== itemId)
              }
            }
          }
          return member
        })
        return { ...oldData, members: updatedMembers }
      })
    },
  })

  const handleAddItem = () => {
    if (!newItemUrl || !newItemTitle) return
    addWishlistItem.mutate({ url: newItemUrl, title: newItemTitle })
  }

  const handleDeleteItem = (itemId: string) => {
    deleteWishlistItem.mutate(itemId)
  }

  return (
    <Tabs defaultValue={currentUserId} className="w-full">
      <TabsList className="w-full justify-start h-12 px-4 mb-6 bg-background gap-x-2">
        {groupData.members.map((member) => (
          <TabsTrigger
            key={member.user.id}
            value={member.user.id}
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground hover:cursor-pointer rounded-full"
          >
            {member.user.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {groupData.members.map((member) => (
        <TabsContent key={member.user.id} value={member.user.id}>
          <div className="grid gap-4">
            {member.user.id === currentUserId && (
              <Card className="p-6">
                <h3 className="font-medium text-lg mb-4">Add New Item</h3>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Input
                      placeholder="Item Title"
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                    />
                    <Input
                      placeholder="Item URL"
                      value={newItemUrl}
                      onChange={(e) => setNewItemUrl(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleAddItem}
                    disabled={!newItemUrl || !newItemTitle || addWishlistItem.isPending}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {member.user.wishlistItems.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-2xl">{item.name}</h3>
                      {member.user.id === currentUserId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={deleteWishlistItem.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary/60 flex items-center gap-1"
                      >
                        View Item <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {member.user.wishlistItems.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No items in wishlist yet
              </div>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
} 