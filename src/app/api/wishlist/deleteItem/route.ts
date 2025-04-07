import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { NextResponse } from "next/server"

export async function DELETE(req: Request) {
  const user = await auth()
  if (!user || !user.userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const itemId = searchParams.get("id")

  if (!itemId) {
    return new NextResponse("Item ID is required", { status: 400 })
  }

  const dbUser = await db.user.findUnique({
    where: { externalId: user.userId },
  })

  if (!dbUser) {
    return new NextResponse("User not found", { status: 404 })
  }

  // Verify the item belongs to the user
  const item = await db.wishlistItem.findFirst({
    where: {
      id: itemId,
      userId: dbUser.id
    }
  })

  if (!item) {
    return new NextResponse("Item not found or unauthorized", { status: 404 })
  }

  await db.wishlistItem.delete({
    where: {
      id: itemId
    }
  })

  return new NextResponse(null, { status: 204 })
} 