import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "./ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Switch } from "./ui/switch"
import { Wishlist } from "@prisma/client"

const wishlistSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
})

type WishlistFormValues = z.infer<typeof wishlistSchema>

interface WishlistFormProps {
  wishlist?: Wishlist
  onSubmit: (data: WishlistFormValues) => void
  onCancel: () => void
}

export function WishlistForm({ wishlist, onSubmit, onCancel }: WishlistFormProps) {
  const form = useForm<WishlistFormValues>({
    resolver: zodResolver(wishlistSchema),
    defaultValues: {
      name: wishlist?.name || "",
      description: wishlist?.description || "",
      isPublic: wishlist?.isPublic ?? true,
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
                <Input placeholder="Enter wishlist name" {...field} />
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
                  placeholder="Enter wishlist description"
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
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public Wishlist</FormLabel>
                <FormDescription>
                  Make this wishlist visible to other users
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {wishlist ? "Update Wishlist" : "Create Wishlist"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 