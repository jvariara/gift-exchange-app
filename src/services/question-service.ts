import { db } from "@/db"
import { predefinedQuestions } from "@/utils"
import { Prisma, PrismaClient } from "@prisma/client"

class QuestionService {
  /**
   * Create predefined questions for the app
   */
  async initializePredefinedQuestions() {
    // Bulk create or update questions
    const questions = await Promise.all(
      predefinedQuestions.map((question) =>
        db.question.create({
          data: { text: question },
        })
      )
    )

    return questions
  }

  /**
   * Select 3 random questions for a group
   */
  async selectRandomQuestionsForGroup(groupId: string) {
    // Get all predefined questions
    const allQuestions = await db.question.findMany()

    // Randomly select 3 unique questions
    const selectedQuestions = this.getRandomQuestions(allQuestions, 3)

    // Associate these questions with the group
    const groupQuestions = await Promise.all(
      selectedQuestions.map((question) =>
        db.groupQuestion.create({
          data: {
            groupId,
            questionId: question.id,
          },
        })
      )
    )

    return selectedQuestions
  }

  /**
   * Allow group creator to add custom questions
   */
  async addCustomQuestionsToGroup(groupId: string, questions: string[]) {
    const customQuestions = await Promise.all(
      questions.map((questionText) =>
        db.question.create({
          data: {
            text: questionText,
            isCustom: true, // Flag to distinguish custom questions
          },
        })
      )
    )

    const groupQuestions = await Promise.all(
      customQuestions.map((question) =>
        db.groupQuestion.create({
          data: {
            groupId,
            questionId: question.id,
          },
        })
      )
    )

    return customQuestions
  }

  /**
   * Get random unique questions from a list
   */
  private getRandomQuestions(questions: any[], count: number) {
    const shuffled = questions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  /**
   * Assign questions to group members
   */
  async assignQuestionsToGroupMembers(groupId: string) {
    // Get group members
    const members = await db.groupMember.findMany({
      where: { groupId },
      include: { user: true },
    })

    // Get group questions
    const groupQuestions = await db.groupQuestion.findMany({
      where: { groupId },
    })

    // Assign questions to each member
    const userQuestions = await Promise.all(
      members.map(async (member) => {
        // Randomly select 3 questions for the member
        const selectedQuestions = this.getRandomQuestions(groupQuestions, 3)

        return Promise.all(
          selectedQuestions.map((question) =>
            db.userQuestion.create({
              data: {
                userId: member.userId,
                groupQuestionId: question.id,
                answer: ""
              },
            })
          )
        )
      })
    )

    return userQuestions
  }
}
export default QuestionService
