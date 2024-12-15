import { z } from "zod"

export const QUESTION_SELECTION_METHOD = z.enum(["random", "custom"])

export const GROUP_VALIDATOR = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    questionMethod: z.enum(["random", "custom"]),
    customQuestions: z
      .array(
        z.object({
          question: z.string(),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    // When questionMethod is custom, ensure exactly 3 non-empty questions
    if (data.questionMethod === "custom") {
      // Ensure questions are provided
      if (!data.customQuestions || data.customQuestions.length !== 3) {
        ctx.addIssue({
          path: ["customQuestions"],
          message: "You must provide exactly 3 custom questions",
          code: z.ZodIssueCode.custom,
        })
      } else {
        // Ensure each custom question is non-empty
        const nonEmptyQuestions = data.customQuestions.filter(q => q.question.trim() !== '')
        
        if (nonEmptyQuestions.length !== 3) {
          ctx.addIssue({
            path: ["customQuestions"],
            message: "All 3 questions must be filled",
            code: z.ZodIssueCode.custom,
          })
        }
      }
    }
  })

export type GroupForm = z.infer<typeof GROUP_VALIDATOR>