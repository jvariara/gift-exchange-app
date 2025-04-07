import React from "react"
import { notFound } from "next/navigation"
import { WishlistItemCard } from "@/components/WishlistItemCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"

interface WishlistPageProps {
  params: {
    id: string
  }
}

export default async function WishlistPage({ params }: WishlistPageProps) {
  const session = await currentUser()
  if (!session?.user) {
    return null
  }

  const wishlist = await db.wishlist.findUnique({
    where: {
      id: params.id,
    },
    include: {
      items: {
        orderBy: {
          priority: "asc",
        },
      },
    },
  })

  if (!wishlist) {
    notFound()
  }

  // Check if the user has access to this wishlist
  if (wishlist.userId !== session.user.id && !wishlist.isPublic) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{wishlist.name}</h1>
        {wishlist.description && (
          <p className="mt-2 text-muted-foreground">{wishlist.description}</p>
        )}
      </div>

      {wishlist.userId === session.user.id && (
        <div className="mb-8">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.items.map((item) => (
          <WishlistItemCard
            key={item.id}
            item={item}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}
      </div>

      {wishlist.items.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No items yet</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {wishlist.userId === session.user.id
                ? "Add your first item to your wishlist."
                : "This wishlist doesn't have any items yet."}
            </p>
            {wishlist.userId === session.user.id && (
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 