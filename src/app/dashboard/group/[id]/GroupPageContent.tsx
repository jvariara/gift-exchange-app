"use client"
import LoadingSpinner from "@/components/LoadingSpinner"
import InviteLinkModal from "@/components/modals/InviteLinkModal"
import { Button } from "@/components/ui/button"
import { client } from "@/lib/client"
import { GroupWithDetailedIncludes } from "@/lib/types"
import { Group } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

interface GroupPageContentProps {
  group: GroupWithDetailedIncludes
  hasAnsweredQuestions: boolean
  hasEveryoneAnswered: boolean
}

const GroupPageContent = ({
  group,
  hasAnsweredQuestions,
  hasEveryoneAnswered,
}: GroupPageContentProps) => {
  const { data: groupQuestions, isPending: isGroupQuestionsLoading } = useQuery(
    {
      queryKey: ["group-questions"],
      queryFn: async () => {
        const res = await client.group.getGroupQuestions.$get({ id: group.id })
        const { questions } = await res.json()
        return questions
      },
    }
  )

  const { data: groupMembers, isPending: isGroupMembersLoading } = useQuery({
    queryKey: [`group-members-${group.id}`],
    queryFn: async () => {
      const res = await client.group.getGroupMembers.$get({ id: group.id })
      const { groupMembers } = await res.json()
      return groupMembers
    },
  })

  const {
    data: questionsWithAnswers,
    isPending: isQuestionsWithAnswersLoading,
  } = useQuery({
    queryKey: ["drawn-participant-answers"],
    queryFn: async () => {
      const res =
        await client.group.getQuestionsWithDrawnParticipantsAnswers.$get({
          groupId: group.id,
        })
      const { questionsWithDrawnParticipantAnswers } = await res.json()
      return questionsWithDrawnParticipantAnswers
    },
  })

  const { data: invitation, isPending: isInvitationLoading } = useQuery({
    queryKey: ["group-invite-token"],
    queryFn: async () => {
      const res = await client.group.getGroupInviteLink.$get({ id: group.id })
      const { groupInvitation } = await res.json()
      return groupInvitation
    },
  })

  return (
    <>
      {group.hasDrawStarted ? (
        <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-2">
          {/* first bento grid element */}
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem] max-lg:rounded-t-[2rem]" />

            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pb-2 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                  Questions and Answers
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Below is the group questions along with the answers of your
                  secretly drawn participant. Good luck, don&apos;t gift wrong!
                </p>
              </div>

              <div className="flex flex-col flex-1 items-start gap-4 px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-8">
                <div className="h-px bg-gray-600/40 w-full my-2 md:my-4" />
                {isQuestionsWithAnswersLoading && (
                  <div className="relative flex flex-1 w-full items-center justify-center text-center">
                    <LoadingSpinner size="lg" />{" "}
                  </div>
                )}

                {!isQuestionsWithAnswersLoading &&
                  questionsWithAnswers &&
                  questionsWithAnswers.map((answer, index) => (
                    <div className="flex mt-2" key={answer.id}>
                      <span className="text-brand-800/80 text-3xl sm:text-5xl font-semibold tracking-wide tabular-nums">
                        0{index + 1}
                      </span>
                      <div className="flex flex-col ml-4 w-full gap-y-2">
                        <h2 className="text-gray-800 text-xl font-medium">
                          {answer.groupQuestion.question.text}
                        </h2>
                        <p className="text-md text-gray-500">
                          <span className="text-brand-700 font-medium">
                            Answer:
                          </span>{" "}
                          {answer.answer}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem] max-lg:rounded-t-[2rem]" />
          </div>
          {/* second bento grid element */}
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-r-[2rem] max-lg:rounded-b-[2rem]" />

            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pb-2 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                  Group Members
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  List of all group members participating in your gift exchange.
                </p>
              </div>

              <div className="flex flex-col flex-1 items-start gap-4 justify-start px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-8">
                <div className="h-px bg-gray-600/40 w-full my-2 md:my-4" />

                {isGroupMembersLoading && (
                  <div className="relative flex flex-1 w-full items-center justify-center text-center">
                    <LoadingSpinner size="lg" />
                  </div>
                )}

                {!isGroupMembersLoading &&
                  groupMembers &&
                  groupMembers.map((member) => (
                    <div
                      className="flex items-center gap-2 sm:gap-4"
                      key={member.id}
                    >
                      <div className="size-10 sm:size-12 bg-brand-500 rounded-full flex items-center justify-center shadow-md ring-black/5">
                        <p className="text-brand-950 font-semibold text-lg sm:text-2xl uppercase">
                          {member.user.name[0]}
                        </p>
                      </div>
                      <p className="text-md/6 sm:text-lg/7 font-medium tracking-tight text-brand-950">
                        {member.user.name}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-r-[2rem] max-lg:rounded-b-[2rem]" />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-2">
          {/* first bento grid element */}
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem] max-lg:rounded-t-[2rem]" />

            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pb-2 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                  Questions and Answers
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Below is the group questions along with the answers of your
                  secretly drawn participant. Good luck, don&apos;t gift wrong!
                </p>
              </div>

              <div className="flex flex-col flex-1 items-start gap-4 px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-8">
                <div className="h-px bg-gray-600/40 w-full my-2 md:my-4" />

                {!isGroupQuestionsLoading &&
                  groupQuestions &&
                  groupQuestions.map((question, index) => (
                    <div className="flex mt-2" key={question.id}>
                      <span className="text-brand-800/80 text-3xl sm:text-5xl font-semibold tracking-wide tabular-nums">
                        0{index + 1}
                      </span>
                      <div className="flex flex-col ml-4 w-full gap-y-2">
                        <h2 className="text-gray-800 text-xl font-medium">
                          {question.question.text}
                        </h2>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem] max-lg:rounded-t-[2rem]" />
          </div>
          {/* second bento grid element */}
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-r-[2rem] max-lg:rounded-b-[2rem]" />

            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pb-2 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <div className="flex justify-between">
                  <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                    Group Members
                  </p>

                  {invitation && (
                    <InviteLinkModal token={invitation.token}>
                      <Button
                        disabled={isInvitationLoading}
                        className="w-full sm:w-fit"
                      >
                        Invite Members
                      </Button>
                    </InviteLinkModal>
                  )}
                </div>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  List of all group members participating in your gift exchange.
                </p>
              </div>

              <div className="flex flex-col flex-1 items-start gap-4 justify-start px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-8">
                <div className="h-px bg-gray-600/40 w-full my-2 md:my-4" />

                {isGroupMembersLoading && (
                  <div className="relative flex flex-1 w-full items-center justify-center text-center">
                    <LoadingSpinner size="lg" />
                  </div>
                )}

                {!isGroupMembersLoading &&
                  groupMembers &&
                  groupMembers.map((member) => (
                    <div
                      className="flex items-center gap-2 sm:gap-4"
                      key={member.id}
                    >
                      <div className="size-10 sm:size-12 bg-brand-500 rounded-full flex items-center justify-center shadow-md ring-black/5">
                        <p className="text-brand-950 font-semibold text-lg sm:text-2xl uppercase">
                          {member.user.name[0]}
                        </p>
                      </div>
                      <p className="text-md/6 sm:text-lg/7 font-medium tracking-tight text-brand-950">
                        {member.user.name}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-r-[2rem] max-lg:rounded-b-[2rem]" />
          </div>
        </div>
      )}
    </>
  )
}

export default GroupPageContent
