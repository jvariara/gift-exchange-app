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
    user: {
      id: string
      name: string
      email: string
      wishlistItems: WishlistItem[]
    }
  }[]
  questions?: {
    id: string
    questionId: string
    groupId: string
  }[]
  _count?: {
    members: number
  }
  createdBy?: {
    id: string
    name: string
    email: string
  }
}

export interface GroupMember {
  id: string
  userId: string
  groupId: string
  isAdmin: boolean
  hasAnswered: boolean
  user: User
  group: Group
}

export interface Question {
  id: string
  text: string
  groupId: string
  group: Group
  answers: Answer[]
}

export interface Answer {
  id: string
  text: string
  questionId: string
  userId: string
  question: Question
  user: User
}

export interface UserWithWishlist extends User {
  wishlistItems: WishlistItem[]
}
