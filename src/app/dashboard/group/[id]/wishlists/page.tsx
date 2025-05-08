import { db } from "@/db"
import getQueryClient from "@/lib/getQueryClient"
import { currentUser } from "@clerk/nextjs/server"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import WishlistsPageContent from "./WishlistsPageContent"

interface WishlistsPageProps {
  params: {
    id: string
  }
}

export default async function WishlistsPage({ params }: WishlistsPageProps) {
  const auth = await currentUser()
  if (!auth) return notFound()

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) return notFound()

  const queryClient = getQueryClient()

  const group = await db.group.findUnique({
    where: {
      id: params.id,
      members: {
        some: {
          userId: user.id,
        },
      }
    },
    include: {
      members: {
        include: {
          user: {
            include: {
              wishlistItems: true
            }
          }
        }
      }
    }
  })

  if (!group) {
    notFound()
  }

  await queryClient.prefetchQuery({
    queryKey: ["group", group.id],
    queryFn: () => group
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <div className="flex min-h-[calc(100vh-(--spacing(16)))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold">Group Wishlists</h1>
      </div>
      <HydrationBoundary state={dehydratedState}>
        <WishlistsPageContent 
          group={group} 
          currentUserId={user.id}
        />
      </HydrationBoundary>
    </div>
  )
} 