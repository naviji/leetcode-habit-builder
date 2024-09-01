import { QuestionBankEnum, Question, Questions } from "../types/questions.js";
import { StorageEngine } from "../types/storageEngine.js";
import { questions } from "./data.js";
import { Navigator } from "../types/navigator.js";
import { App } from "../types/app.js";

export class Application implements App {
  private problemTopics: string[] | null = null;
  private allProblems: Question[] = [];
  private questionInfo: Questions | null = null;

  private nv: Navigator | null = null;
  private renderFn = () => {};
  private db: StorageEngine;

  constructor(nv: Navigator, db: StorageEngine, renderFn: () => void) {
    this.nv = nv;
    this.db = db;
    this.renderFn = renderFn;
  }

  async init(): Promise<void> {
    this.loadProblemInfo();
    const { redirectsEnabled } = await this.db.get();
    if (redirectsEnabled) {
      this.setRedirectsEnabled(true);
    }
    this.renderFn();
  }

  private async loadProblemInfo(): Promise<void> {
    this.questionInfo = await (await fetch("../data/leetcode.json")).json();
  }

  async getProblemSet(): Promise<QuestionBankEnum> {
    return (await this.db.get()).problemSet as QuestionBankEnum;
  }

  openTab(url: string): void {
    this.nv?.openTab(url);
  }

  async setRedirectOnSuccess(value: boolean): Promise<void> {
    await this.db.set({
      redirectOnSuccess: value,
    });
  }

  async getRedirectOnSuccess(): Promise<boolean> {
    return (await this.db.get()).redirectOnSuccess as boolean;
  }

  async setShowDailyQuote(value: boolean): Promise<void> {
    await this.db.set({
      showDailyQuote: value,
    });
  }

  async getShowDailyQuote(): Promise<boolean> {
    return (await this.db.get()).showDailyQuote as boolean;
  }

  async getRedirectsEnabled (): Promise<boolean> {
    const { redirectsEnabled } = await this.db.get();
    return !!redirectsEnabled
  }

  private render() {
    this.renderFn();
  }

  async getIncludePremiumProblems() {
    return (await this.db.get()).includePremiumProblems as boolean;
  }

  async setWhitelistedUrls(value: string): Promise<void> {
    await this.db.set({
      whitelistedUrls: value,
    });
  }

  async getWhitelistedUrls(): Promise<string> {
    return (await this.db.get()).whitelistedUrls as string;
  }

  async setSnoozeInterval(value: string) {
    const interval = Number(value);
    if (interval < 0) {
      throw new Error("Invalid interval");
    }
    const snoozeInterval = Number(value);
    await this.db.set({
      snoozeInterval: snoozeInterval,
    });
  }

  async getSnoozeInterval() {
    return (await this.db.get()).snoozeInterval?.toString() as string;
  }

  async setRestInterval(value: string) {
    const interval = Number(value);
    if (interval < 0) {
      throw new Error("Invalid interval");
    }
    const restInterval = Number(value);
    await this.db.set({
      restInterval: restInterval,
    });
  }

  async getRestInterval() {
    return (await this.db.get()).restInterval?.toString() as string;
  }

  async setIncludePremiumProblems(value: boolean) {
    await this.db.set({
      includePremiumProblems: value,
    });
    await this.chooseProblems();
  }

  async setProblemsPerDay(value: string) {
    if (Number(value) < 1) {
      throw new Error("Invalid value");
    }
    const problemsPerDay = Number(value);
    await this.db.set({
      problemsPerDay: problemsPerDay,
    });
    this.chooseProblems();
    this.render();
  }

  async getProblemsPerDay() {
    return (await this.db.get()).problemsPerDay?.toString() as string;
  }

  async setProblemDifficulty(difficulty: string) {
    if (
      difficulty === "easy" ||
      difficulty === "medium" ||
      difficulty === "hard"
    ) {
      await this.db.set({
        problemDifficulty: difficulty,
      });
      await this.chooseProblems();
    } else {
      throw new Error("Invalid difficulty");
    }
  }

  async getProblemTopic(): Promise<string> {
    return (await this.db.get()).problemTopic as string;
  }

  private async chooseProblems() {
    if (!this.questionInfo) {
      throw new Error("No question info");
    }
    const problemSet = await this.getProblemSet();
    const questionInfo = this.questionInfo as Questions;
    const questionsInSet = questions[problemSet];
    this.allProblems = questionsInSet.map(
      (problemSlug) => questionInfo[problemSlug].data.question,
    );

    function capitalizeFirstCharacter(s: string) {
      if (!s) return ""; // Check if the string is empty
      return s.charAt(0).toUpperCase() + s.slice(1);
    }

    const problemDifficulty = await this.getProblemDifficulty();
    if (problemDifficulty) {
      const difficulty = capitalizeFirstCharacter(problemDifficulty);
      this.allProblems = this.allProblems.filter(
        (problem) => problem.difficulty === difficulty,
      );
    }

    const includePremiumProblems = await this.getIncludePremiumProblems();
    if (!includePremiumProblems) {
      this.allProblems = this.allProblems.filter(
        (problem) => problem.isPaidOnly === false,
      );
    }

    const problemTopic = await this.getProblemTopic();
    if (problemTopic) {
      this.allProblems = this.allProblems.filter((problem) =>
        problem.topicTags
          .map((tag) => tag.name)
          .includes(problemTopic as string),
      );
    }

    const problemsPerDay = (await this.db.get()).problemsPerDay as number;
    let randomIndex = Math.floor(Math.random() * this.allProblems.length);
    const problems = [];
    for (let i = 0; i < problemsPerDay; i++) {
      problems.push(this.allProblems[randomIndex]);
      randomIndex = Math.floor(Math.random() * this.allProblems.length);
    }
    await this.db.set({
      problems: problems,
    });
    this.render();
  }

  async setProblemSet(problemSet: QuestionBankEnum) {
    await this.db.set({
      problemSet,
    });
    await this.chooseProblems();
    const topicSet = new Set<string>();
    this.allProblems.forEach((problem) => {
      problem.topicTags.forEach((tag) => {
        topicSet.add(tag.name);
      });
    });
    this.problemTopics = Array.from(topicSet);
  }

  async getProblemTopics() {
    if (!this.problemTopics) return ["All topics"];
    return this.problemTopics;
  }

  async setProblemTopic(value: string) {
    await this.db.set({
      problemTopic: value,
    });
  }

  async skip() {
    await this.chooseProblems();
  }

  snooze() {
    console.log("Snoozed");
  }

  async getDailyQuote() {
    return "A leetcode a day keeps the doctor away";
  }

  async getCurrQuestionNumber() {
    const { problemsSolved = 0 } = await this.db.get();
    return (problemsSolved + 1).toString();
  }

  async getTotalQuestionCount() {
    const { problems = [] } = await this.db.get();
    return problems.length.toString();
  }

  async getStreakCount() {
    return "122";
  }

  async getCompletionPercentage() {
    const percentage = (
      (Number(await this.getCurrQuestionNumber()) /
        Number(await this.getTotalQuestionCount())) *
      100
    ).toString();
    return percentage;
  }

  async getProblemUrl() {
    const { problems = [] } = await this.db.get();
    const { problemsSolved = 0 } = await this.db.get();
    return Promise.resolve(
      "https://leetcode.com/problems/" + problems[problemsSolved].titleSlug,
    );
  }

  async setRedirectsEnabled(value: boolean) {
    const problem = await this.getProblemUrl();
    this.nv?.setRedirectsEnabled(value, problem)
  }

  async getProblemTitle() {
    const { problems = [] } = await this.db.get();
    const { problemsSolved = 0 } = await this.db.get();
    return problems[problemsSolved].title;
  }

  async getProblemDifficulty() {
    const { problems = [] } = await this.db.get();
    const { problemsSolved = 0 } = await this.db.get();
    const problem = problems[problemsSolved];
    return problem.difficulty.toLowerCase();
  }
}
