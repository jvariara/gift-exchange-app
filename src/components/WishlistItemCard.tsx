import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { ExternalLink, Pencil, Trash2 } from "lucide-react"
import { WishlistItem } from "@prisma/client"

interface WishlistItemCardProps {
  item: WishlistItem
  onEdit: (item: WishlistItem) => void
  onDelete: (item: WishlistItem) => void
}

export function WishlistItemCard({ item, onEdit, onDelete }: WishlistItemCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          {item.price && (
            <Badge variant="secondary">
              ${item.price.toFixed(2)}
            </Badge>
          )}
        </div>
        {item.description && (
          <CardDescription>{item.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {item.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="object-cover"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {item.url && (
          <Button variant="outline" size="sm" asChild>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Item
            </a>
          </Button>
        )}
        <div className="space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 