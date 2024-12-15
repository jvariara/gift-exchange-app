import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// from chat-gpt
export function shuffleArray<T>(array: T[]): T[] {
  // Create a copy of the original array to avoid modifying the original
  const shuffledArray = [...array]

  // Fisher-Yates (Knuth) shuffle algorithm
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1))

    // Swap elements
    ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
  }

  return shuffledArray
}

export function selectRandomParticipant<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error("Cannot select from an empty array");
  }
  
  // Generate a random index between 0 and the last index of the array
  const randomIndex = Math.floor(Math.random() * array.length);
  
  // Return the item at the random index
  return array[randomIndex];
}

export const predefinedQuestions = [
  "What’s your favorite color?",
  "What’s your favorite food?",
  "What’s your favorite drink?",
  "What’s your favorite sport?",
  "Do you prefer cats or dogs?",
  "What’s your favorite type of candy?",
  "What’s your favorite TV show?",
  "What’s your favorite season of the year?",
  "Do you prefer coffee or tea?",
  "What’s your favorite fast food restaurant?",
  "What’s your favorite ice cream flavor?",
  "What’s your favorite pizza topping?",
  "Do you prefer the beach or the mountains?",
  "What’s your favorite type of music?",
  "What’s your favorite movie genre?",
  "What’s your favorite holiday?",
  "What’s your favorite breakfast food?",
  "Do you prefer sweet or savory snacks?",
  "What’s your favorite fruit?",
  "What’s your favorite vegetable?",
  "What’s your go-to drink at a bar or party?",
  "What’s your favorite board game?",
  "What’s your favorite video game?",
  "Do you prefer mornings or nights?",
  "What’s your favorite way to spend a weekend?",
  "What’s your favorite childhood toy?",
  "Do you prefer books or movies?",
  "What’s your favorite dessert?",
  "What’s your favorite outdoor activity?",
  "What’s your favorite indoor activity?",
  "What’s your favorite type of cake?",
  "What’s your favorite animal?",
  "What’s your favorite type of cookie?",
  "What’s your favorite holiday tradition?",
  "Do you prefer hot or cold weather?",
  "What’s your favorite superhero?",
  "What’s your favorite Disney character?",
  "Do you prefer texting or calling?",
  "What’s your favorite snack?",
  "Do you prefer staying in or going out?",
  "What’s your favorite cereal?",
  "What’s your favorite item of clothing?",
  "What’s your favorite hobby?",
  "What’s your favorite flower or plant?",
  "What’s your favorite type of car?",
  "What’s your dream vacation spot?",
  "What’s your favorite chocolate bar?",
  "What’s your favorite mode of transportation?",
  "What’s your favorite soft drink?",
  "What’s your favorite type of sandwich?",
]
