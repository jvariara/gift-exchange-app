import { db } from "@/db"
import { z } from "zod"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"

// Validators for social features
const MESSAGE_VALIDATOR = z.object({
  content: z.string().min(1, { message: "Message content is required" }),
  groupId: z.string(),
})

const REACTION_VALIDATOR = z.object({
  type: z.enum(["like", "love", "laugh", "wow", "sad", "angry"]),
  messageId: z.string(),
})

const THANK_YOU_NOTE_VALIDATOR = z.object({
  content: z.string().min(1, { message: "Thank you note content is required" }),
  giftId: z.string(),
})

const GIFT_PHOTO_VALIDATOR = z.object({
  url: z.string().url(),
  caption: z.string().optional(),
  giftId: z.string(),
})

export const socialRouter = router({
  // Get messages for a group
  getMessages: privateProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { groupId } = input
      const { user } = ctx

      // Check if user is a member of the group
      const membership = await db.groupMember.findFirst({
        where: {
          groupId,
          userId: user.id,
        },
      })

      if (!membership) {
        throw new Error("Not authorized to access messages in this group")
      }

      const messages = await db.message.findMany({
        where: {
          groupId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          reactions: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return c.json({ messages })
    }),

  // Send a message in a group
  sendMessage: privateProcedure
    .input(MESSAGE_VALIDATOR)
    .mutation(async ({ c, ctx, input }) => {
      const { content, groupId } = input
      const { user } = ctx

      // Check if user is a member of the group
      const membership = await db.groupMember.findFirst({
        where: {
          groupId,
          userId: user.id,
        },
      })

      if (!membership) {
        throw new Error("Not authorized to send messages in this group")
      }

      const message = await db.message.create({
        data: {
          content,
          groupId,
          userId: user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      })

      return c.json({ message })
    }),

  // Add a reaction to a message
  addReaction: privateProcedure
    .input(REACTION_VALIDATOR)
    .mutation(async ({ c, ctx, input }) => {
      const { type, messageId } = input
      const { user } = ctx

      // Check if the message exists and user has access to it
      const message = await db.message.findUnique({
        where: {
          id: messageId,
        },
        include: {
          group: {
            include: {
              members: true,
            },
          },
        },
      })

      if (!message) {
        throw new Error("Message not found")
      }

      const isMember = message.group.members.some((member) => member.userId === user.id)
      if (!isMember) {
        throw new Error("Not authorized to react to this message")
      }

      // Check if user already reacted with this type
      const existingReaction = await db.reaction.findFirst({
        where: {
          messageId,
          userId: user.id,
          type,
        },
      })

      if (existingReaction) {
        // Remove the reaction if it already exists
        await db.reaction.delete({
          where: {
            id: existingReaction.id,
          },
        })
        return c.json({ reaction: null })
      }

      // Create new reaction
      const reaction = await db.reaction.create({
        data: {
          type,
          messageId,
          userId: user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      })

      return c.json({ reaction })
    }),

  // Get thank you notes for a gift
  getThankYouNotes: privateProcedure
    .input(z.object({ giftId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { giftId } = input
      const { user } = ctx

      // Check if user has access to the gift
      const gift = await db.gift.findUnique({
        where: {
          id: giftId,
        },
        include: {
          group: {
            include: {
              members: true,
            },
          },
        },
      })

      if (!gift) {
        throw new Error("Gift not found")
      }

      const isMember = gift.group.members.some((member) => member.userId === user.id)
      if (!isMember) {
        throw new Error("Not authorized to view thank you notes for this gift")
      }

      const notes = await db.thankYouNote.findMany({
        where: {
          giftId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return c.json({ notes })
    }),

  // Add a thank you note to a gift
  addThankYouNote: privateProcedure
    .input(THANK_YOU_NOTE_VALIDATOR)
    .mutation(async ({ c, ctx, input }) => {
      const { content, giftId } = input
      const { user } = ctx

      // Check if user has access to the gift
      const gift = await db.gift.findUnique({
        where: {
          id: giftId,
        },
        include: {
          group: {
            include: {
              members: true,
            },
          },
        },
      })

      if (!gift) {
        throw new Error("Gift not found")
      }

      const isMember = gift.group.members.some((member) => member.userId === user.id)
      if (!isMember) {
        throw new Error("Not authorized to add thank you notes to this gift")
      }

      const note = await db.thankYouNote.create({
        data: {
          content,
          giftId,
          userId: user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      })

      return c.json({ note })
    }),

  // Get photos for a gift
  getGiftPhotos: privateProcedure
    .input(z.object({ giftId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { giftId } = input
      const { user } = ctx

      // Check if user has access to the gift
      const gift = await db.gift.findUnique({
        where: {
          id: giftId,
        },
        include: {
          group: {
            include: {
              members: true,
            },
          },
        },
      })

      if (!gift) {
        throw new Error("Gift not found")
      }

      const isMember = gift.group.members.some((member) => member.userId === user.id)
      if (!isMember) {
        throw new Error("Not authorized to view photos for this gift")
      }

      const photos = await db.giftPhoto.findMany({
        where: {
          giftId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return c.json({ photos })
    }),

  // Add a photo to a gift
  addGiftPhoto: privateProcedure
    .input(GIFT_PHOTO_VALIDATOR)
    .mutation(async ({ c, ctx, input }) => {
      const { url, caption, giftId } = input
      const { user } = ctx

      // Check if user has access to the gift
      const gift = await db.gift.findUnique({
        where: {
          id: giftId,
        },
        include: {
          group: {
            include: {
              members: true,
            },
          },
        },
      })

      if (!gift) {
        throw new Error("Gift not found")
      }

      const isMember = gift.group.members.some((member) => member.userId === user.id)
      if (!isMember) {
        throw new Error("Not authorized to add photos to this gift")
      }

      const photo = await db.giftPhoto.create({
        data: {
          url,
          caption,
          giftId,
          userId: user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      })

      return c.json({ photo })
    }),

  // Delete a gift photo
  deleteGiftPhoto: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { id } = input
      const { user } = ctx

      // Check if the photo belongs to the user
      const photo = await db.giftPhoto.findUnique({
        where: {
          id,
        },
      })

      if (!photo) {
        throw new Error("Photo not found")
      }

      if (photo.userId !== user.id) {
        throw new Error("Not authorized to delete this photo")
      }

      await db.giftPhoto.delete({
        where: {
          id,
        },
      })

      return c.json({ success: true })
    }),
}) 