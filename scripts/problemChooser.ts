import { Questions, Question } from "../types/questions.js";
import { QuestionBankEnum } from "../types/questions.js";
import { questions } from "./data.js";

const URL = "../data/leetcode.json";

export interface Chooser {
  init(): Promise<void>;
  setProblemSet(problemSet: QuestionBankEnum): Promise<void>;
  getAllProblems(): Promise<Question[]>;
  getAllTopics(): Promise<string[]>;
  chooseProblems(
    n: number,
    filters: { filterName: string; filterValue: string | boolean }[],
  ): Promise<Question[]>;
}

class ProblemChooser implements Chooser {
  private questionInfo: Questions | null = null;
  private problemSet: QuestionBankEnum;

  constructor(problemSet: QuestionBankEnum) {
    this.problemSet = problemSet;
  }

  async init(): Promise<void> {
    this.questionInfo = await (await fetch(URL)).json();
    this.loadProblemsInSet();
  }

  async loadProblemsInSet() {
    await this.getAllProblems();
    await this.getAllTopics();
  }

  async setProblemSet(problemSet: QuestionBankEnum) {
    this.problemSet = problemSet;
    await this.loadProblemsInSet();
  }

  async getAllProblems(): Promise<Question[]> {
    if (!this.questionInfo) {
      throw new Error("No question info");
    }
    const questionInfo = this.questionInfo as Questions;
    const questionsInSet = questions[this.problemSet];
    const allProblems = questionsInSet.map(
      (problemSlug) => questionInfo[problemSlug].data.question,
    );
    return allProblems;
  }

  async getAllTopics(): Promise<string[]> {
    if (!this.questionInfo) {
      throw new Error("No question info");
    }
    const allProblems = await this.getAllProblems();  
    const topicSet = new Set<string>();
    allProblems.forEach((problem) => {
      problem.topicTags.forEach((tag) => {
        topicSet.add(tag.name);
      });
    });
    const allTopics = Array.from(topicSet);
    return allTopics;
  }
  async chooseProblems(
    n: number,
    filters: { filterName: string; filterValue: string | boolean }[],
  ): Promise<Question[]> {
    function capitalizeFirstCharacter(s?: string) {
      if (!s) return ""; // Check if the string is empty
      return s.charAt(0).toUpperCase() + s.slice(1);
    }

    let validProblems = await this.getAllProblems();
    if (filters.find((filter) => filter.filterName === "difficulty")) {
      const difficulty = capitalizeFirstCharacter(
        filters.find((filter) => filter.filterName === "difficulty")
          ?.filterValue as string,
      );
      validProblems = validProblems.filter(
        (problem) => problem.difficulty === difficulty,
      );
    }

    if (filters.find((filter) => filter.filterName === "premium")) {
      const premium: boolean = filters.find(
        (filter) => filter.filterName === "premium",
      )?.filterValue as boolean;
      if (premium) {
        validProblems = validProblems.filter(
          (problem) => problem.isPaidOnly === false,
        );
      }
    }

    if (filters.find((filter) => filter.filterName === "topic")) {
      const topic: string = filters.find(
        (filter) => filter.filterName === "topic",
      )?.filterValue as string;
      validProblems = validProblems.filter((problem) =>
        problem.topicTags.map((tag) => tag.name).includes(topic),
      );
    }

    let randomIndex = Math.floor(Math.random() * validProblems.length);
    const problems = [];
    for (let i = 0; i < n; i++) {
      problems.push(validProblems[randomIndex]);
      randomIndex = Math.floor(Math.random() * validProblems.length);
    }

    return problems;
  }
}

export default ProblemChooser;
