import React from "react"
import { WishlistCard } from "@/components/WishlistCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { db } from "@/db"
import { auth } from "@/auth"

export default async function WishlistsPage() {
  const session = await auth()
  if (!session?.user) {
    return null
  }

  const wishlists = await db.wishlist.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Wishlists</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Wishlist
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {wishlists.map((wishlist) => (
          <WishlistCard
            key={wishlist.id}
            wishlist={wishlist}
            onEdit={() => {}}
            onDelete={() => {}}
            onView={() => {}}
          />
        ))}
      </div>

      {wishlists.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No wishlists yet</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Create your first wishlist to start adding items you want.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Wishlist
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 