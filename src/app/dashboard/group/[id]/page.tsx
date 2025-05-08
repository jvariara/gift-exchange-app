import DashboardPage from "@/components/DashboardPage"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import GroupPageContent from "./GroupPageContent"
import AnswerQuestionModal from "@/components/modals/AnswerQuestionModal"
import { Button } from "@/components/ui/button"
import StartDrawButton from "./StartDrawButton"
import { GroupWithDetailedIncludes } from "@/lib/types"

interface PageProps {
  params: {
    id: string | string[] | undefined
  }
}

const Page = async ({ params }: PageProps) => {
  if (typeof params.id !== "string") notFound()

  const auth = await currentUser()

  if (!auth) return notFound()

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) return notFound()

  const group = await db.group.findUnique({
    where: {
      id: params.id,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      members: {
        select: {
          isAdmin: true,
          user: {
            include: {
              wishlistItems: true
            }
          },
          hasAnswered: true,
          id: true,
        },
      },
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
      questions: true,
    },
  })

  if (!group) return notFound()


  const groupMember = await db.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId: user.id,
        groupId: group.id,
      },
    },
  })

  if (!groupMember) return notFound()

  return (
    <DashboardPage
      title={`${group.name}`}
      cta={
        !groupMember.hasAnswered ? (
          <AnswerQuestionModal
            group={group}
            hasAnsweredQuestions={groupMember.hasAnswered}
          >
            <Button className="w-full sm:w-fit">Answer Questions</Button>
          </AnswerQuestionModal>
        ) : null
      }
      cta2={
        groupMember.isAdmin && !group.hasDrawStarted ? (
          <StartDrawButton
            group={group}
            hasEveryoneAnswered={group.members.every(
              (member) => member.hasAnswered
            )}
          />
        ) : null
      }
    >
      <GroupPageContent
        group={group}
        hasAnsweredQuestions={groupMember.hasAnswered}
        hasEveryoneAnswered={group.members.every(
          (member) => member.hasAnswered
        )}
      />
    </DashboardPage>
  )
}

export default Page
