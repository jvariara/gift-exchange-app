import { Prisma } from "@prisma/client"
import { Group, User, WishlistItem } from "@prisma/client"

const groupInclude = Prisma.validator<Prisma.GroupInclude>()({
  members: {
    select: {
      id: true,
      isAdmin: true,
      hasAnswered: true,
      user: {
        select: {
          name: true,
          id: true,
          email: true,
          wishlistItems: true,
        },
      },
    },
  },
  questions: true,
  _count: {
    select: {
      members: true,
    },
  },
  createdBy: {
    select: {
      name: true,
      id: true,
      email: true,
    },
  },
})

export type GroupWithDetailedIncludes = Group & {
  members: {
    id: string
    isAdmin: boolean
    hasAnswered: boolean
    user: User & {
      wishlistItems: WishlistItem[]
    }
  }[]
}
