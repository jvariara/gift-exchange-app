import { predefinedQuestions } from "../src/utils"
import { db } from "../src/db" // Import the db instance

export const seedQuestions = async () => {
  console.log("Seeding predefined questions...")

  // Insert predefined questions into the database using the db instance
  for (const q of predefinedQuestions) {
    await db.question.create({
      data: {
        text: q, // Assuming your Prisma model has a 'question' field
        isCustom: false, // Explicitly set predefined questions as not custom
      },
    })
  }

  console.log("Predefined questions seeded successfully!")

  // Disconnect from the database after seeding
  await db.$disconnect()
}

// Only run if this file is executed directly
if (require.main === module) {
  seedQuestions().catch((error) => {
    console.error("Error seeding questions:", error)
    process.exit(1) // Exit the process with an error code
  })
}
