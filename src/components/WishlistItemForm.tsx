import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "./ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { WishlistItem } from "@prisma/client"

const wishlistItemSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  price: z.number().optional(),
  url: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  priority: z.number().min(1).max(5).optional().default(3),
})

type WishlistItemFormValues = z.infer<typeof wishlistItemSchema>

interface WishlistItemFormProps {
  item?: WishlistItem
  onSubmit: (data: WishlistItemFormValues) => void
  onCancel: () => void
}

export function WishlistItemForm({ item, onSubmit, onCancel }: WishlistItemFormProps) {
  const form = useForm<WishlistItemFormValues>({
    resolver: zodResolver(wishlistItemSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      price: item?.price || undefined,
      url: item?.url || "",
      imageUrl: item?.imageUrl || "",
      priority: item?.priority || 3,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter item name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter item description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter item price"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Enter item URL"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Link to where the item can be purchased
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Enter image URL"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Link to an image of the item
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  placeholder="Enter priority (1-5)"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                1 = Highest priority, 5 = Lowest priority
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {item ? "Update Item" : "Add Item"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 