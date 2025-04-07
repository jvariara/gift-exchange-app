import { updateExistingQuestions } from "./updateExistingQuestions"
import { seedQuestions } from "./seedQuestions"

const setupQuestions = async () => {
  console.log("Setting up questions...")

  // First update existing questions
  await updateExistingQuestions()

  // Then seed any missing predefined questions
  await seedQuestions()

  console.log("Questions setup completed successfully!")
}

setupQuestions().catch((error) => {
  console.error("Error setting up questions:", error)
  process.exit(1) // Exit the process with an error code
}) 