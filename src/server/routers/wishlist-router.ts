import { db } from "@/db"
import { z } from "zod"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"

// Validators for wishlist operations
const WISHLIST_VALIDATOR = z.object({
  name: z.string().min(1, { message: "Wishlist name is required" }),
  description: z.string().optional(),
  isPublic: z.boolean().optional().default(true),
})

const WISHLIST_ITEM_VALIDATOR = z.object({
  name: z.string().min(1, { message: "Item name is required" }),
  description: z.string().optional(),
  price: z.number().optional(),
  url: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  priority: z.number().min(1).max(5).optional().default(3),
  wishlistId: z.string(),
})

export const wishlistRouter = router({
  // Get all wishlists for the current user
  getWishlists: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx

    const wishlists = await db.wishlist.findMany({
      where: {
        userId: user.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return c.json({ wishlists })
  }),

  // Get a specific wishlist by ID
  getWishlist: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { id } = input
      const { user } = ctx

      const wishlist = await db.wishlist.findUnique({
        where: {
          id,
        },
        include: {
          items: {
            orderBy: {
              priority: "desc",
            },
          },
        },
      })

      if (!wishlist) {
        throw new Error("Wishlist not found")
      }

      // Check if the wishlist belongs to the user or is public
      if (wishlist.userId !== user.id && !wishlist.isPublic) {
        throw new Error("Not authorized to access this wishlist")
      }

      return c.json({ wishlist })
    }),

  // Create a new wishlist
  createWishlist: privateProcedure
    .input(WISHLIST_VALIDATOR)
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { name, description, isPublic } = input

      const wishlist = await db.wishlist.create({
        data: {
          name,
          description,
          isPublic,
          userId: user.id,
        },
      })

      return c.json({ wishlist })
    }),

  // Update a wishlist
  updateWishlist: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, { message: "Wishlist name is required" }).optional(),
        description: z.string().optional(),
        isPublic: z.boolean().optional(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { id, ...data } = input
      const { user } = ctx

      // Check if the wishlist belongs to the user
      const existingWishlist = await db.wishlist.findUnique({
        where: {
          id,
        },
      })

      if (!existingWishlist) {
        throw new Error("Wishlist not found")
      }

      if (existingWishlist.userId !== user.id) {
        throw new Error("Not authorized to update this wishlist")
      }

      const wishlist = await db.wishlist.update({
        where: {
          id,
        },
        data,
      })

      return c.json({ wishlist })
    }),

  // Delete a wishlist
  deleteWishlist: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { id } = input
      const { user } = ctx

      // Check if the wishlist belongs to the user
      const existingWishlist = await db.wishlist.findUnique({
        where: {
          id,
        },
      })

      if (!existingWishlist) {
        throw new Error("Wishlist not found")
      }

      if (existingWishlist.userId !== user.id) {
        throw new Error("Not authorized to delete this wishlist")
      }

      await db.wishlist.delete({
        where: {
          id,
        },
      })

      return c.json({ success: true })
    }),

  // Add an item to a wishlist
  addWishlistItem: privateProcedure
    .input(WISHLIST_ITEM_VALIDATOR)
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { name, description, price, url, imageUrl, priority, wishlistId } = input

      // Check if the wishlist belongs to the user
      const wishlist = await db.wishlist.findUnique({
        where: {
          id: wishlistId,
        },
      })

      if (!wishlist) {
        throw new Error("Wishlist not found")
      }

      if (wishlist.userId !== user.id) {
        throw new Error("Not authorized to add items to this wishlist")
      }

      const item = await db.wishlistItem.create({
        data: {
          name,
          description,
          price,
          url,
          imageUrl,
          priority,
          wishlistId,
          userId: user.id,
        },
      })

      return c.json({ item })
    }),

  // Update a wishlist item
  updateWishlistItem: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, { message: "Item name is required" }).optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        url: z.string().url().optional(),
        imageUrl: z.string().url().optional(),
        priority: z.number().min(1).max(5).optional(),
        isPurchased: z.boolean().optional(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { id, ...data } = input
      const { user } = ctx

      // Check if the item belongs to the user
      const existingItem = await db.wishlistItem.findUnique({
        where: {
          id,
        },
        include: {
          wishlist: true,
        },
      })

      if (!existingItem) {
        throw new Error("Item not found")
      }

      if (existingItem.userId !== user.id) {
        throw new Error("Not authorized to update this item")
      }

      const item = await db.wishlistItem.update({
        where: {
          id,
        },
        data,
      })

      return c.json({ item })
    }),

  // Delete a wishlist item
  deleteWishlistItem: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { id } = input
      const { user } = ctx

      // Check if the item belongs to the user
      const existingItem = await db.wishlistItem.findUnique({
        where: {
          id,
        },
      })

      if (!existingItem) {
        throw new Error("Item not found")
      }

      if (existingItem.userId !== user.id) {
        throw new Error("Not authorized to delete this item")
      }

      await db.wishlistItem.delete({
        where: {
          id,
        },
      })

      return c.json({ success: true })
    }),

}) 