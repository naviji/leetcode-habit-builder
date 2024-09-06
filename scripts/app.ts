import ProblemChooser, { Chooser } from "./problemChooser.js";

import { StorageEngine } from "../types/storageEngine.js";
import { QuestionBankEnum } from "../types/questions.js";
import { App } from "../types/app.js";
import { Controller } from "../types/controller.js";

const DEFAULTS = {
  problemsPerDay: 2,
  problemSet: QuestionBankEnum.NeetCodeAll,
  includePremiumProblems: false,
  snoozeInterval: 12,
  restInterval: 24,
  whitelistedUrls: "google.com\nleetcode.com",
  redirectOnSuccess: true,
  showDailyQuote: true,
  redirectsEnabled: true,
};

export class Application implements App {
  private renderFn = () => {};
  private db: StorageEngine;
  private pc: Chooser | null = null;
  private ctrl: Controller
  constructor(db: StorageEngine, ctrl: Controller, renderFn: () => void = () => {}) {
    this.db = db;
    this.ctrl = ctrl
    this.renderFn = renderFn;
  }

  async init(firstInstall = false): Promise<void> {
    if (firstInstall) {
      await this.db.set({
        problemSet: DEFAULTS.problemSet,
        problemsPerDay: DEFAULTS.problemsPerDay,
        problemDifficulty: null,
        problemTopic: null,
        includePremiumProblems: DEFAULTS.includePremiumProblems,
        snoozeInterval: DEFAULTS.snoozeInterval,
        restInterval: DEFAULTS.restInterval,
        whitelistedUrls: DEFAULTS.whitelistedUrls,
        redirectOnSuccess: DEFAULTS.redirectOnSuccess,
        showDailyQuote: DEFAULTS.showDailyQuote,
        redirectsEnabled: DEFAULTS.redirectsEnabled,
        streakCount: 0
      });
    }
    const { problemSet = DEFAULTS.problemSet } = await this.db.get();
    this.pc = new ProblemChooser(problemSet);
    await this.pc.init();
    if (firstInstall) {
      await this.chooseProblems();
    }
    this.renderFn();
  }

  async getProblemSet(): Promise<QuestionBankEnum> {
    return (await this.db.get()).problemSet as QuestionBankEnum;
  }

  async setRedirectOnSuccess(value: boolean): Promise<void> {
    await this.db.set({
      redirectOnSuccess: value,
    });
    const { redirectsEnabled } = await this.db.get();
    if (redirectsEnabled) {
      // To update the redirection ruleset
      await this.setRedirectsEnabled(false)
    }
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
    const { redirectsEnabled } = await this.db.get();

    if (redirectsEnabled) {
      // To update the redirection ruleset
      await this.setRedirectsEnabled(false)
    }
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

  async chooseProblems() {
    if (!this.pc) {
      throw new Error("Problem chooser not initialized");
    }
    const { problemsPerDay = 1 } = await this.db.get();
    const filters: { filterName: string; filterValue: string | boolean }[] = []

    const { includePremiumProblems } = await this.db.get();
    if (includePremiumProblems) {
      filters.push({ filterName: "premium", filterValue: true })
    }

    const { problemDifficulty } = await this.db.get();
    if (problemDifficulty) {
      filters.push({ filterName: "difficulty", filterValue: problemDifficulty })
    }

    const { problemTopic } = await this.db.get();
    if (problemTopic) {
      filters.push({ filterName: "topic", filterValue: problemTopic })
    }

    const problems = await this.pc.chooseProblems(problemsPerDay, filters)
    await this.db.set({
      problems: problems,
    });

    const { redirectsEnabled } = await this.db.get();
    if (redirectsEnabled) {
      await this.setRedirectsEnabled(!redirectsEnabled);
    }
    this.render();
  }

  async setProblemSet(problemSet: QuestionBankEnum) {
    await this.db.set({
      problemSet,
    });
    await this.pc?.setProblemSet(problemSet);
    await this.chooseProblems();
  }

  async getProblemTopics() {
    const problemTopics = this.pc?.getAllTopics();
    if (!problemTopics) return [];
    return problemTopics;
  }

  async setProblemTopic(value: string) {
    await this.db.set({
      problemTopic: value,
    });
    await this.chooseProblems();
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
    const { problemsPerDay = 1 } = await this.db.get();
    return (Math.min(problemsSolved + 1, problemsPerDay)).toString();
  }

  async getTotalQuestionCount() {
    const { problems = [] } = await this.db.get();
    return problems.length.toString();
  }

  async getStreakCount() {
    const { streakCount = 0 } = await this.db.get();
    return streakCount.toString();
  }

  async getCompletionPercentage(): Promise<string> {
    const percentage = (
      (Number(await this.getCurrQuestionNumber()) - 1) /
      Number(await this.getTotalQuestionCount())
    ) * 100;
    return percentage.toString();
  }

  async getProblemUrl() {
    const { problems = [] } = await this.db.get();
    const { problemsSolved = 0 } = await this.db.get();
    return Promise.resolve(
      "https://leetcode.com/problems/" + problems[problemsSolved].titleSlug,
    );
  }

  async setRedirectsEnabled(disabled: boolean) {
    const problemUrl = await this.getProblemUrl();
    await this.db.set({
      redirectsEnabled: !disabled
    })
    const { redirectOnSuccess = true, whitelistedUrls = "" } = await this.db.get();
    const whiteListedUrlsList = whitelistedUrls.split("\n");
    this._setRedirectsEnabled(!disabled, problemUrl, redirectOnSuccess, whiteListedUrlsList)
    this.render()
  }

  async _setRedirectsEnabled(enabled: boolean, problemUrl: string, redirectOnSuccess: boolean, whiteListedUrls: string[]) {
    if (enabled) {
      this.ctrl.startRedirect({ url: problemUrl, redirectOnSuccess, whiteListedUrls});
    }
    else {
      this.ctrl.stopRedirect({ redirectOnSuccess });
    }
  }

  async markProblemSolved () {
    const { problemsSolved = 0 } = await this.db.get();
    const total = problemsSolved + 1
    await this.db.set({
      problemsSolved: total,
    });
    const { problemsPerDay } = await this.db.get();
    if (total === problemsPerDay) {
      const { streakCount = 0 } = await this.db.get();
      await this.db.set({
        streakCount: streakCount + 1,
      });
      await this.setRedirectsEnabled(true); // FIX: Very confusing naming; true is disabled status
    } else {
      await this.setRedirectsEnabled(false);
    }
  }

  async getProblemTitle() {
    const { problems = [] } = await this.db.get();
    const { problemsSolved = 0 } = await this.db.get();
    return problems[problemsSolved].title;
  }

  async getProblemDifficulty() {
    return (await this.db.get()).problemDifficulty as string | null;
  }

  async getCurrentProblemDifficulty(): Promise<string> {
      const { problems = [] } = await this.db.get();
      const { problemsSolved = 0 } = await this.db.get();
      const problem = problems[problemsSolved];
      return problem.difficulty.toLowerCase();
  }
}
