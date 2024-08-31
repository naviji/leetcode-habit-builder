import { QuestionBankEnum, Question } from "../types/questions.js";
import { StorageEngine } from "../types/storageEngine.js";
import { questions, questionInfo } from "./data.js";
import { app, render } from "./popup.js";
import { Navigator } from "../types/navigator.js";
import { App } from "../types/app.js";


export class Application implements App {
  private problems: Question[] | null = null;
  private problemsPerDay: number;
  private problemDifficulty: "easy" | "medium" | "hard" | null = null;
  private problemTopics: string[] | null = null;
  private allProblems: Question[] = [];
  private problemSet: QuestionBankEnum = QuestionBankEnum.NeetCode150;
  private includePremiumProblems: boolean;
  private snoozeInterval: number;
  private restInterval: number;
  private problemsSolved: number;
  private whitelistedUrls: string;
  private redirectOnSuccess: boolean;
  private showDailyQuote: boolean;

  private nv: Navigator | null = null;
  private renderFn = () => { };
  private db: StorageEngine;

  constructor(nv: Navigator, db: StorageEngine, renderFn: () => void) {
    this.nv = nv;
    this.db = db;
    this.renderFn = renderFn;

    // Set defaults
    this.problemsPerDay = 2;
    this.problemsSolved = 0;
    this.includePremiumProblems = false;
    this.snoozeInterval = 38;
    this.restInterval = 29;
    this.whitelistedUrls = "";
    this.redirectOnSuccess = true;
    this.showDailyQuote = true;
  }

  async init(): Promise<void> {

    console.log("Initializing...");
    const currentState = await this.db.get();
    this.problems = currentState.problems || null;
    this.problemSet = currentState.problemSet || QuestionBankEnum.NeetCode150;
    this.problemsPerDay = currentState.problemsPerDay || this.problemsPerDay;
    this.problemsSolved = currentState.problemsSolved || this.problemsSolved;
    this.problemDifficulty = currentState.problemDifficulty || this.problemDifficulty;
    this.includePremiumProblems = currentState.includePremiumProblems || this.includePremiumProblems;
    this.snoozeInterval = currentState.snoozeInterval || this.snoozeInterval;
    this.restInterval = currentState.restInterval || this.restInterval;
    this.whitelistedUrls = currentState.whitelistedUrls || this.whitelistedUrls;
    this.redirectOnSuccess = currentState.redirectOnSuccess || this.redirectOnSuccess;
    this.showDailyQuote = currentState.showDailyQuote || this.showDailyQuote;

    await this.db.set({
      problemsPerDay: this.problemsPerDay,
      problemsSolved: this.problemsSolved,
      problemDifficulty: this.problemDifficulty,
      includePremiumProblems: this.includePremiumProblems,
      snoozeInterval: this.snoozeInterval,
      restInterval: this.restInterval,
      whitelistedUrls: this.whitelistedUrls,
      redirectOnSuccess: this.redirectOnSuccess,
      showDailyQuote: this.showDailyQuote
    });

    if (!this.problems) { // This will set problems and problemSet in db
      app.chooseProblemFromList(this.problemSet);
    }

    this.renderFn();
  }

  async getProblemSet(): Promise<QuestionBankEnum> {
    return this.problemSet;
  }

  openTab(url: string): void {
    this.nv?.openTab(url);
  }

  async setRedirectOnSuccess(value: boolean): Promise<void> {
    this.redirectOnSuccess = value;
    await this.db.set({
      redirectOnSuccess: this.redirectOnSuccess
    });
  }

  async getRedirectOnSuccess(): Promise<boolean> {
    return this.redirectOnSuccess;
  }

  async setShowDailyQuote(value: boolean): Promise<void> {
    this.showDailyQuote = value;
    await this.db.set({
      showDailyQuote: this.showDailyQuote
    });
  }

  async getShowDailyQuote(): Promise<boolean> {
    return this.showDailyQuote;
  }

  private render() {
    render();
  }

  async getIncludePremiumProblems() {
    return this.includePremiumProblems;
  }

  async setWhitelistedUrls(value: string): Promise<void> {
    this.whitelistedUrls = value;
    await this.db.set({
      whitelistedUrls: this.whitelistedUrls
    });
  }

  async getWhitelistedUrls(): Promise<string> {
    return this.whitelistedUrls;
  }

  async setSnoozeInterval(value: string) {
    const interval = Number(value);
    if (interval < 0) {
      throw new Error("Invalid interval");
    }
    this.snoozeInterval = Number(value);
    await this.db.set({
      snoozeInterval: this.snoozeInterval
    });
  }

  async getSnoozeInterval() {
    return this.snoozeInterval.toString();
  }

  async setRestInterval(value: string) {
    const interval = Number(value);
    if (interval < 0) {
      throw new Error("Invalid interval");
    }
    this.restInterval = Number(value);
    await this.db.set({
      restInterval: this.restInterval
    });
  }

  async getRestInterval() {
    return this.restInterval.toString();
  }

  async setIncludePremiumProblems(value: boolean) {
    this.includePremiumProblems = value;
    await this.db.set({
      includePremiumProblems: this.includePremiumProblems
    });
    await this.chooseProblems();
  }

  async setProblemsPerDay(value: string) {
    if (Number(value) < 1) {
      throw new Error("Invalid value");
    }
    this.problemsPerDay = Number(value);
    await this.db.set({
      problemsPerDay: this.problemsPerDay
    });
    this.chooseProblems();
    this.render();
  }

  async getProblemsPerDay() {
    return this.problemsPerDay.toString();
  }

  async setProblemDifficulty(difficulty: string) {
    if (difficulty === "easy" ||
      difficulty === "medium" ||
      difficulty === "hard") {
      this.problemDifficulty = difficulty;
      await this.chooseProblems();
      await this.db.set({
        problemDifficulty: this.problemDifficulty
      });
    } else {
      throw new Error("Invalid difficulty");
    }
    // Add render
  }

  private async chooseProblems() {
    const questionsInSet = questions[this.problemSet];
    this.allProblems = questionsInSet.map(
      (problemSlug) => questionInfo[problemSlug].data.question
    );

    function capitalizeFirstCharacter(s: string) {
      if (!s) return ""; // Check if the string is empty
      return s.charAt(0).toUpperCase() + s.slice(1);
    }

    if (this.problemDifficulty) {
      const difficulty = capitalizeFirstCharacter(this.problemDifficulty);
      this.allProblems = this.allProblems.filter(
        (problem) => problem.difficulty === difficulty
      );
    }

    if (!this.includePremiumProblems) {
      this.allProblems = this.allProblems.filter(
        (problem) => problem.isPaidOnly === false
      );
    }

    let randomIndex = Math.floor(Math.random() * this.allProblems.length);
    this.problems = [];
    for (let i = 0; i < this.problemsPerDay; i++) {
      this.problems.push(this.allProblems[randomIndex]);
      randomIndex = Math.floor(Math.random() * this.allProblems.length);
    }
    await this.db.set({
      problems: this.problems
    });
    this.render();
  }

  async chooseProblemFromList(problemSet: QuestionBankEnum) {
    this.problemSet = problemSet;
    await this.db.set({
      problemSet
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

  // Using an arrow function to capture `this`
  skip = async () => {
    await this.chooseProblems();
  };

  snooze() {
    // chrome.runtime.sendMessage({ action: "snoozeQuestion" });
    console.log("Snoozed");
  }

  async getDailyQuote() {
    return "A leetcode a day keeps the doctor away";
  }

  async getCurrQuestionNumber() {
    return (this.problemsSolved + 1).toString();
  }

  async getTotalQuestionCount() {
    if (!this.problems?.length) {
      throw new Error("No problems found");
    }
    return this.problems.length.toString();
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
    if (!this.problems?.length) {
      throw new Error("No problems found");
    }
    return Promise.resolve(
      "https://leetcode.com/problems/" + this.problems[this.problemsSolved].titleSlug
    );
  }

  enableRedirects() {
    console.log("Enabling Redirects");
    // chrome.runtime.sendMessage({ action: "startRedirect" });
    // chrome.runtime.sendMessage({ action: "pauseTheGrind" });
    //
  }

  disableRedirects() {
    console.log("Disabling Redirects");
    // chrome.runtime.sendMessage({ action: "stopRedirect" });
    // chrome.runtime.sendMessage({ action: "resumeTheGrind" });
  }

  async getQuestionTitle() {
    if (!this.problems?.length) {
      throw new Error("No problems found");
    }
    return this.problems[this.problemsSolved].title || "";
  }

  async getQuestionDifficulty() {
    if (!this.problems?.length) {
      throw new Error("No problems found");
    }
    const problem = this.problems[this.problemsSolved];
    console.log("Difficulty: ", problem.difficulty.toLowerCase());
    return problem.difficulty.toLowerCase() || "";
  }
}
