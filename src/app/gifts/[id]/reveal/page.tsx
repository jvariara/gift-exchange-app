import React from "react"
import { notFound } from "next/navigation"
import { GiftReveal } from "@/components/GiftReveal"
import { db } from "@/db"
import { auth } from "@/auth"

interface GiftRevealPageProps {
  params: {
    id: string
  }
}

export default async function GiftRevealPage({ params }: GiftRevealPageProps) {
  const session = await auth()
  if (!session?.user) {
    return null
  }

  const gift = await db.gift.findUnique({
    where: {
      id: params.id,
    },
    include: {
      giver: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      photos: true,
      thankYouNotes: {
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
  })

  if (!gift) {
    notFound()
  }

  // Check if the user is either the giver or receiver
  if (gift.giverId !== session.user.id && gift.receiverId !== session.user.id) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gift Reveal</h1>
        <p className="mt-2 text-muted-foreground">
          {gift.receiverId === session.user.id
            ? "Your gift from " + gift.giver.name
            : "Your gift to " + gift.receiver.name}
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <GiftReveal
          gift={gift}
          onAddPhoto={() => {}}
          onAddThankYouNote={() => {}}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  )
} 