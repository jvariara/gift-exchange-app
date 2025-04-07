import { db } from "../src/db"
import { predefinedQuestions } from "../src/utils"

export const updateExistingQuestions = async () => {
  console.log("Updating existing questions...")

  // Get all questions that match the predefined questions
  const existingQuestions = await db.question.findMany({
    where: {
      text: {
        in: predefinedQuestions
      }
    }
  })

  console.log(`Found ${existingQuestions.length} predefined questions to update`)

  // Update each question to have isCustom: false
  for (const question of existingQuestions) {
    await db.question.update({
      where: {
        id: question.id
      },
      data: {
        isCustom: false
      }
    })
  }

  console.log("Existing questions updated successfully!")

  // Disconnect from the database after updating
  await db.$disconnect()
}

// Only run if this file is executed directly
if (require.main === module) {
  updateExistingQuestions().catch((error) => {
    console.error("Error updating questions:", error)
    process.exit(1) // Exit the process with an error code
  })
} 