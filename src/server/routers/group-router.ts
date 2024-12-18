import { db } from "@/db"
import { generateSecureToken } from "@/lib/utils"
import { GROUP_VALIDATOR } from "@/lib/validators/group-validator"
import { QUESTION_ANSWER_VALIDATOR } from "@/lib/validators/question-validator"
import QuestionService from "@/services/question-service"
import { z } from "zod"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { selectRandomParticipant, shuffleArray } from "@/utils"
import { Draw, GroupQuestion } from "@prisma/client"

export const groupRouter = router({
  getGroups: privateProcedure.query(async ({ c, ctx }) => {
    const groups = await db.group.findMany({
      where: {
        members: {
          some: {
            userId: ctx.user.id,
          },
        },
      },
      include: {
        members: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return c.superjson({ groups })
  }),
  createGroup: privateProcedure
    .input(GROUP_VALIDATOR)
    .mutation(async ({ c, ctx, input }) => {
      const questionService = new QuestionService()
      const { user } = ctx
      const { name, questionMethod, customQuestions, budget } = input

      // Validate input
      if (!name || name.trim() === "") {
        throw new Error("Group name is required")
      }

      // Generate a random group code
      const groupCode = Math.random().toString(36).slice(2, 8).toUpperCase()

      // Create the group
      const group = await db.group.create({
        data: {
          name,
          code: groupCode,
          createdById: user.id,
          budget: budget as number || null,
        },
      })

      // Add creator as the first group user and an admin
      await db.groupMember.create({
        data: {
          userId: user.id,
          groupId: group.id,
          isAdmin: true,
        },
      })

      // Handle question selection
      if (questionMethod === "random") {
        await questionService.selectRandomQuestionsForGroup(group.id)
      } else if (questionMethod === "custom" && customQuestions) {
        const questionTexts = customQuestions
          .map((customQuestion) => customQuestion.question)
          .filter((q) => q.trim() !== "")

        if (questionTexts.length > 0) {
          await questionService.addCustomQuestionsToGroup(
            group.id,
            questionTexts
          )
        }
      }

      // Generate group invite link
      const invitationLink = await db.groupInvitation.create({
        data: {
          groupId: group.id,
          token: generateSecureToken(), // Use the new function
          expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days
        },
      })

      return c.json({ group, invitationLink })
    }),
  deleteGroup: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { id } = input

      const group = await db.group.findUnique({
        where: { id },
        include: {
          members: {
            where: {
              userId: ctx.user.id,
              isAdmin: true,
            },
          },
        },
      })

      if (!group || group.members.length === 0) {
        throw new Error("Not authorized to delete this group")
      }

      // Delete related records first
      await db.draw.deleteMany({
        where: { groupId: id },
      })

      await db.groupInvitation.deleteMany({
        where: {
          groupId: id,
        },
      })

      await db.groupMember.deleteMany({
        where: { groupId: id },
      })

      await db.groupQuestion.deleteMany({
        where: { groupId: id },
      })

      // Finally delete the group
      await db.group.delete({
        where: { id },
      })

      return c.json({ success: true })
    }),
  joinGroup: privateProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { token } = input
      const { user } = ctx

      // Find the invitation
      const invitation = await db.groupInvitation.findUnique({
        where: {
          token,
          expiresAt: { gt: new Date() }, // Not expired
        },
        include: { group: true },
      })

      // Check if invitation exists and is valid
      if (!invitation) {
        throw new Error("Invalid or expired invitation")
      }

      // Check if user is already in the group
      const existingMember = await db.groupMember.findFirst({
        where: {
          groupId: invitation.groupId,
          userId: user.id,
        },
      })

      if (existingMember) {
        throw new Error("You are already a member of this group")
      }

      // create group member
      await db.groupMember.create({
        data: {
          userId: user.id,
          groupId: invitation.groupId,
          isAdmin: false,
        },
      })

      return c.json({ success: true, group: invitation.group })
    }),
  getGroupMembers: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { id } = input
      const { user } = ctx

      // check if user is in group
      const groupMember = await db.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: user.id,
            groupId: id,
          },
        },
      })

      if (!groupMember) {
        throw new Error("Not authorized to access this group")
      }

      const group = await db.group.findUnique({
        where: {
          id,
        },
      })

      if (!group) {
        throw new Error("Group not found")
      }

      // group exists and user is in group
      const groupMembers = await db.groupMember.findMany({
        where: {
          groupId: group.id,
        },
        select: {
          isAdmin: true,
          user: true,
          hasAnswered: true,
          id: true,
        },
      })
      return c.json({ success: true, groupMembers })
    }),
  getGroupQuestions: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { id } = input
      const { user } = ctx

      // check if user is in group
      const groupMember = await db.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: user.id,
            groupId: id,
          },
        },
      })

      if (!groupMember) {
        throw new Error("Not authorized to access this group")
      }

      const group = await db.group.findUnique({
        where: {
          id,
        },
      })

      if (!group) {
        throw new Error("Group not found")
      }

      // group exists and user is in group
      const questions = await db.groupQuestion.findMany({
        where: {
          groupId: group.id,
        },
        include: {
          question: true,
        },
      })

      if (!questions || questions.length !== 3) {
        throw new Error("No questions found for this group")
      }

      return c.json({ success: true, questions })
    }),
  getGroupInviteLink: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { id } = input

      const group = await db.group.findUnique({
        where: {
          id,
        },
      })

      if (!group) {
        throw new Error("Group not found")
      }

      const groupMember = await db.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: user.id,
            groupId: id,
          },
        },
      })

      if (!groupMember) {
        throw new Error("Not authorized to access this group")
      }

      const groupInvitation = await db.groupInvitation.findFirst({
        where: {
          groupId: group.id,
        },
        select: {
          token: true,
        },
      })

      if (!groupInvitation) {
        throw new Error("Token not found for this group.")
      }

      return c.json({ success: true, groupInvitation })
    }),
  answerGroupQuestions: privateProcedure
    .input(QUESTION_ANSWER_VALIDATOR)
    .mutation(async ({ c, ctx, input }) => {
      try {
        const { answers } = input
        const { user } = ctx

        // Validate answers are not empty
        answers.forEach((answer) => {
          if (!answer || !answer.answer || answer.answer.trim() === "") {
            throw new Error("All 3 answers are required")
          }
        })

        // Verify user is in the group
        const groupQuestion = await db.groupQuestion.findFirst({
          where: { id: answers[0].questionId },
          select: { groupId: true },
        })

        if (!groupQuestion) {
          throw new Error("Invalid group")
        }

        const groupMember = await db.groupMember.findUnique({
          where: {
            userId_groupId: {
              userId: user.id,
              groupId: groupQuestion.groupId,
            },
          },
        })

        if (!groupMember) {
          throw new Error("Not authorized to access this group")
        }

        // Create user questions in a transaction
        await db.$transaction(async (prisma) => {
          for (const answer of answers) {
            await prisma.userQuestion.create({
              data: {
                userId: user.id,
                groupQuestionId: answer.questionId,
                answer: answer.answer,
              },
            })
          }
        })

        // Update groupMember hasAnswered to true
        await db.groupMember.update({
          where: {
            userId_groupId: {
              userId: user.id,
              groupId: groupQuestion.groupId,
            },
          },
          data: {
            hasAnswered: true,
          },
        })

        return c.json({ success: true })
      } catch (error) {
        console.error("Error in answerGroupQuestions:", error)

        // Distinguish between known errors and unexpected errors
        if (error instanceof Error) {
          return c.json(
            {
              success: false,
              error: error.message,
            },
            { status: 400 }
          )
        }

        return c.json(
          {
            success: false,
            error: "An unexpected error occurred",
          },
          { status: 500 }
        )
      }
    }),
  startGroupDraw: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { id } = input

      const group = await db.group.findUnique({
        where: {
          id,
        },
      })

      if (!group) {
        throw new Error("Group not found")
      }

      // check if user is in group
      const groupMember = await db.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: user.id,
            groupId: id,
          },
        },
      })

      if (!groupMember) {
        throw new Error("Not authorized to access this group")
      }

      if (!groupMember.isAdmin) {
        throw new Error("User not authorized to start the draw")
      }

      // check if everyone has answered
      const groupMembers = await db.groupMember.findMany({
        where: {
          groupId: id,
        },
        include: {
          user: true,
        },
      })

      if (!groupMembers.every((member) => member.hasAnswered)) {
        throw new Error("Not everyone has answered the questions")
      }

      // start the draw
      const shuffledMembers = shuffleArray(groupMembers)

      const draws: Draw[] = []
      const usedParticipants = new Set()

      for (const drawer of shuffledMembers) {
        // Filter potential drawees:
        // - Not already drawn
        // - Not the same person
        // - Not in excluded list (for couples)
        // TODO: come back to add excluding logic and add to prisma
        const availableDrawees = groupMembers.filter(
          (drawee) =>
            !usedParticipants.has(drawee.id) && drawee.id !== drawer.id
        )

        if (availableDrawees.length === 0) {
          throw new Error("Cannot perform fair draw")
        }

        const drawnMember = selectRandomParticipant(availableDrawees)

        draws.push({
          drawingParticipantId: drawer.id,
          drawnParticipantId: drawnMember.id,
          groupId: id,
          drawnAt: new Date(),
          id: crypto.randomUUID(),
        })

        usedParticipants.add(drawnMember.id)
      }

      await db.group.update({
        where: {
          id,
        },
        data: {
          hasDrawStarted: true,
        },
      })

      await db.draw.createMany({
        data: draws,
      })

      return c.json({ success: true })
    }),
  getQuestionsWithDrawnParticipantsAnswers: privateProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { groupId } = input
      const { user } = ctx

      const group = await db.group.findUnique({
        where: {
          id: groupId,
        },
      })

      if (!group) {
        throw new Error("Group not found")
      }

      // check if user is in group
      const groupMember = await db.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: user.id,
            groupId: groupId,
          },
        },
      })

      if (!groupMember) {
        throw new Error("Not authorized to access this group")
      }

      // get the draw
      const draw = await db.draw.findFirst({
        where: {
          drawingParticipantId: groupMember.id,
          groupId,
        },
      })

      if (!draw) {
        throw new Error("An error occurred while drawing.")
      }

      // get the drawn participant
      const drawnParticipant = await db.groupMember.findUnique({
        where: {
          id: draw.drawnParticipantId,
        },
        include: {
          user: true,
        },
      })

      if (!drawnParticipant) {
        throw new Error("Drawn participant not found")
      }

      // get the answers of the group questions from draw.drawnParticipantId
      const questionsWithDrawnParticipantAnswers =
        await db.userQuestion.findMany({
          where: {
            userId: drawnParticipant.user.id,
            groupQuestion: {
              groupId: groupId,
            },
          },
          select: {
            answer: true,
            id: true,
            groupQuestion: {
              select: {
                question: {
                  select: {
                    id: true,
                    text: true,
                    isCustom: true,
                  },
                },
              },
            },
          },
        })

      return c.json({
        success: true,
        questionsWithDrawnParticipantAnswers,
      })
    }),
})
