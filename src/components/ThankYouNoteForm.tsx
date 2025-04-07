import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Textarea } from "./ui/textarea"

const thankYouNoteSchema = z.object({
  content: z.string().min(1, { message: "Thank you note is required" }),
})

type ThankYouNoteFormValues = z.infer<typeof thankYouNoteSchema>

interface ThankYouNoteFormProps {
  onSubmit: (data: ThankYouNoteFormValues) => void
  onCancel: () => void
}

export function ThankYouNoteForm({ onSubmit, onCancel }: ThankYouNoteFormProps) {
  const form = useForm<ThankYouNoteFormValues>({
    resolver: zodResolver(thankYouNoteSchema),
    defaultValues: {
      content: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thank You Note</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your thank you note..."
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
          <Button type="submit">Send Thank You Note</Button>
        </div>
      </form>
    </Form>
  )
} 