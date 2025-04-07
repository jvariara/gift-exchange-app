const { db } = require("../src/db");
const { predefinedQuestions } = require("../src/utils");

const updateExistingQuestions = async () => {
  console.log("Updating existing questions...");

  // Get all questions that match the predefined questions
  const existingQuestions = await db.question.findMany({
    where: {
      text: {
        in: predefinedQuestions
      }
    }
  });

  console.log(`Found ${existingQuestions.length} predefined questions to update`);

  // Update each question to have isCustom: false
  for (const question of existingQuestions) {
    await db.question.update({
      where: {
        id: question.id
      },
      data: {
        isCustom: false
      }
    });
  }

  console.log("Existing questions updated successfully!");
};

const seedQuestions = async () => {
  console.log("Seeding predefined questions...");

  // Insert predefined questions into the database using the db instance
  for (const q of predefinedQuestions) {
    await db.question.create({
      data: {
        text: q,
        isCustom: false, // Explicitly set predefined questions as not custom
      },
    });
  }

  console.log("Predefined questions seeded successfully!");
};

const setupQuestions = async () => {
  console.log("Setting up questions...");

  try {
    // First update existing questions
    await updateExistingQuestions();

    // Then seed any missing predefined questions
    await seedQuestions();

    console.log("Questions setup completed successfully!");
  } catch (error) {
    console.error("Error setting up questions:", error);
  } finally {
    // Disconnect from the database after updating
    await db.$disconnect();
  }
};

setupQuestions(); 