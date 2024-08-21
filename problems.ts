import { Problem } from "./types";

let problems: Problem[] = [];
let isLoaded = false;

export function setProblemText(problem: Problem) {
  const problemTitle = document.getElementById("question");
  if (problemTitle) {
    problemTitle.textContent = problem.text;
  }
}

async function loadProblems() {
  try {
    const response = await fetch("./problems/neetcode150.json");
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
  const problemIdx = localStorage.getItem("problemIdx");
  if (problemIdx) {
    return problems[parseInt(problemIdx)];
  }
  const newProblemIdx = Math.floor(Math.random() * problems.length);
  localStorage.setItem("problemIdx", newProblemIdx.toString());
  return problems[newProblemIdx];
}
