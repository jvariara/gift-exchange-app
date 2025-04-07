import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Eye, Lock, Pencil, Trash2 } from "lucide-react"
import { Wishlist } from "@prisma/client"

interface WishlistCardProps {
  wishlist: Wishlist & {
    items: {
      id: string
      name: string
      price: number | null
      imageUrl: string | null
    }[]
  }
  onEdit: (wishlist: Wishlist) => void
  onDelete: (wishlist: Wishlist) => void
  onView: (wishlist: Wishlist) => void
}

export function WishlistCard({ wishlist, onEdit, onDelete, onView }: WishlistCardProps) {
  const totalItems = wishlist.items.length
  const totalValue = wishlist.items.reduce((sum, item) => sum + (item.price || 0), 0)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{wishlist.name}</CardTitle>
          <Badge variant={wishlist.isPublic ? "default" : "secondary"}>
            {wishlist.isPublic ? <Eye className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          </Badge>
        </div>
        {wishlist.description && (
          <CardDescription>{wishlist.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Items:</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Value:</span>
            <span>${totalValue.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onView(wishlist)}>
          View
        </Button>
        <div className="space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(wishlist)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(wishlist)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 