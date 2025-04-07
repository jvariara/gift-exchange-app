import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const user = await auth()
  if (!user || !user.userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { url, title } = await req.json()

  // Get the user from our database using the Clerk user ID
  const dbUser = await db.user.findUnique({
    where: { externalId: user.userId },
    include: {
      wishlists: true
    }
  })

  if (!dbUser) {
    return new NextResponse("User not found", { status: 404 })
  }

  // Get or create the user's default wishlist
  let wishlist = dbUser.wishlists[0]
  if (!wishlist) {
    wishlist = await db.wishlist.create({
      data: {
        name: "My Wishlist",
        userId: dbUser.id
      }
    })
  }

  const wishlistItem = await db.wishlistItem.create({
    data: {
      url,
      name: title,
      userId: dbUser.id,
      wishlistId: wishlist.id
    }
  })

  return NextResponse.json(wishlistItem)
} 