import { z } from "zod"

const ANSWER_SCHEMA = z.string().min(1, { message: "Answer is required" })

export const QUESTION_ANSWER_VALIDATOR = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        answer: ANSWER_SCHEMA,
      })
    )
    .length(3, { message: "All 3 answers are required" }),
})

export type QuestionAnswerForm = z.infer<typeof QUESTION_ANSWER_VALIDATOR>
