import { AnimeFormat } from "@/types";

export function removeDuplicatesById<T extends { id: number }>(objects: T[]): T[] {
  const uniqueObjectsMap: Map<number, T> = new Map();

  // Iterate through the array of objects
  for (const obj of objects) {
    // Check if the ID of the object is already present in the map
    if (!uniqueObjectsMap.has(obj.id)) {
      // If the ID is not present, add the object to the map
      uniqueObjectsMap.set(obj.id, obj);
    }
  }

  // Convert the values of the map back to an array
  const uniqueObjectsArray: T[] = Array.from(uniqueObjectsMap.values());

  return uniqueObjectsArray;
}

export function isEven(num: number): boolean {
  return num % 2 === 0;
}

export function getRandomString(strings: string[]): string | null {
  if (strings.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * strings.length);
  return strings[randomIndex];
}

export function selectRandomObjects<T>(objects: T[], count: number): T[] {
  const randomObjects: T[] = [];

  // Check if the count is greater than the length of the array
  if (count > objects.length) {
    throw new Error("Count cannot be greater than the length of the array");
  }

  // Generate random indices and select objects from the array
  while (randomObjects.length < count) {
    const randomIndex = Math.floor(Math.random() * objects.length);
    const randomObject = objects[randomIndex];

    // Check if the object is already selected
    if (!randomObjects.includes(randomObject)) {
      randomObjects.push(randomObject);
    }
  }

  return randomObjects;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function shuffleArray<T extends { id: number }>(objects: T[]): T[] {
  const shuffledArray = [...objects];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

export function getScore(questions: AnimeFormat[]) {
  const total = questions.length;
  let score = 0;
  let message = "";
  for (let i = 0; i < total; i++) {
    if (questions[i].answer === questions[i].title) {
      score++;
    }
  }

  if (score > total / 2) {
    message = "Great Job! You know your stuff.";
  } else {
    message = "Better luck next time.";
  }

  return { score, total, message };
}
