import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "./ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"

const giftPhotoSchema = z.object({
  url: z.string().url({ message: "Please enter a valid image URL" }),
  caption: z.string().optional(),
})

type GiftPhotoFormValues = z.infer<typeof giftPhotoSchema>

interface GiftPhotoFormProps {
  onSubmit: (data: GiftPhotoFormValues) => void
  onCancel: () => void
}

export function GiftPhotoForm({ onSubmit, onCancel }: GiftPhotoFormProps) {
  const form = useForm<GiftPhotoFormValues>({
    resolver: zodResolver(giftPhotoSchema),
    defaultValues: {
      url: "",
      caption: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Enter image URL"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the URL of the image you want to add
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a caption for your photo..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Photo</Button>
        </div>
      </form>
    </Form>
  )
} 