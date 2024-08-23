export interface Problem {
  category: string;
  href: string;
  text: string;
  difficulty: string;
  isPremium: boolean;
}

const url = "./problems/neetcode150.json";

let problems: Problem[] = [];
let isLoaded = false;

async function loadProblems() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    problems = data;
    isLoaded = true;
  } catch (error) {
    console.error("Error loading JSON:", error);
  }
}

export async function getProblem() {
  if (!isLoaded) {
    await loadProblems();
  }
  // const newProblemIdx = Math.floor(Math.random() * problems.length);
  return problems[0]; // Remove once dev done;
}
