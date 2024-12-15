import { Prisma } from "@prisma/client"

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

export type GroupWithDetailedIncludes = Prisma.GroupGetPayload<{
  include: typeof groupInclude
}>
