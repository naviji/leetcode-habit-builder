import { questions, questionInfo } from "./data.js";
import { Question, QuestionBankEnum } from "../types/questions.js";

const browser = {
  openTab: (url: string) => {
    window.open(url, "_blank");
  },
};

// const browserReal = {
//   openTab: (url: string) => {
//     chrome.tabs.create({ url: url });
//   }
// }

interface MyApi {
  // problem: Question | null,
  skip(): void;
  snooze(): void;
  chooseProblemList(list: QuestionBankEnum): Promise<void>;
  setProblemsPerDay(value: string): void;
  setIncludePremiumProblems(value: boolean): Promise<void>;
  setSnoozeInterval(value: string): Promise<void>;
  setRestInterval(value: string): Promise<void>;
  setWhitelistedUrls(value: string): Promise<void>;
  setRedirectOnSuccess(value: boolean): Promise<void>;
  setShowDailyQuote(value: boolean): Promise<void>;

  enableRedirects(): void;
  disableRedirects(): void;
  getDailyQuote(): Promise<string>;
  getCurrQuestionNumber(): Promise<string>;
  getTotalQuestionCount(): Promise<string>;
  getStreakCount(): Promise<string>;
  getCompletionPercentage(): Promise<string>;
  getProblemUrl(): Promise<string>;
  getQuestionTitle(): Promise<string>;
  getQuestionDifficulty(): Promise<string>;
  getProblemTopics(): Promise<string[]>;
  getIncludePremiumProblems(): Promise<boolean>;
  getSnoozeInterval(): Promise<string>;
  getRestInterval(): Promise<string>;
  getWhitelistedUrls(): Promise<string>;
  getRedirectOnSuccess(): Promise<boolean>;
  getShowDailyQuote(): Promise<boolean>;

  render(): void;
}

class myApi implements MyApi {
  private problem: Question | null = null;
  private problemsPerDay = 1;
  private problemDifficulty: "easy" | "medium" | "hard" | null = null;
  private problemTopics: string[] | null = null;
  private allProblems: Question[] = [];
  private problemSet: QuestionBankEnum = QuestionBankEnum.NeetCode150;
  private includePremiumProblems: boolean = false;
  private snoozeInterval: number = 38;
  private restInterval: number = 29;
  private whitelistedUrls: string = "";
  private redirectOnSuccess: boolean = false;
  private showDailyQuote: boolean = true;

  async setRedirectOnSuccess(value: boolean): Promise<void> {
    this.redirectOnSuccess = value;
  }

  async getRedirectOnSuccess(): Promise<boolean> {
    return this.redirectOnSuccess;
  }

  async setShowDailyQuote(value: boolean): Promise<void> {
    this.showDailyQuote = value;
  }

  async getShowDailyQuote(): Promise<boolean> {
    return this.showDailyQuote;
  }

  render() {
    render();
  }

  async getIncludePremiumProblems() {
    return this.includePremiumProblems;
  }

  async setWhitelistedUrls(value: string): Promise<void> {
    this.whitelistedUrls = value;
  }

  async getWhitelistedUrls(): Promise<string> {
    return this.whitelistedUrls;
  }

  async setSnoozeInterval(value: string) {
    const interval = Number(value);
    if (interval < 0) {
      console.log("Error: Invalid interval");
    } else {
      this.snoozeInterval = Number(value);
    }
  }

  async getSnoozeInterval() {
    return this.snoozeInterval.toString();
  }

  async setRestInterval(value: string) {
    const interval = Number(value);
    if (interval < 0) {
      console.log("Error: Invalid interval");
    } else {
      this.restInterval = Number(value);
    }
  }

  async getRestInterval() {
    return this.restInterval.toString();
  }

  async setIncludePremiumProblems(value: boolean) {
    this.includePremiumProblems = value;
    await this.chooseProblems();
  }

  async setProblemsPerDay(value: string) {
    this.problemsPerDay = Number(value);
    this.render();
  }

  async setProblemDifficulty(difficulty: string) {
    if (
      difficulty === "easy" ||
      difficulty === "medium" ||
      difficulty === "hard"
    ) {
      this.problemDifficulty = difficulty;
      await this.chooseProblems();
    } else {
      throw new Error("Invalid difficulty");
    }
    // Add render
  }

  private async chooseProblems() {
    console.log(
      "Choosing problems",
      this.problemSet,
      this.problemsPerDay,
      this.problemDifficulty,
    );
    const questionsInSet = questions[this.problemSet];
    this.allProblems = questionsInSet.map(
      (problemSlug) => questionInfo[problemSlug].data.question,
    );

    function capitalizeFirstCharacter(s: string) {
      if (!s) return ""; // Check if the string is empty
      return s.charAt(0).toUpperCase() + s.slice(1);
    }

    if (this.problemDifficulty) {
      const difficulty = capitalizeFirstCharacter(this.problemDifficulty);
      this.allProblems = this.allProblems.filter(
        (problem) => problem.difficulty === difficulty,
      );
    }

    if (!this.includePremiumProblems) {
      this.allProblems = this.allProblems.filter(
        (problem) => problem.isPaidOnly === false,
      );
    }

    const randomIndex = Math.floor(Math.random() * this.allProblems.length);
    this.problem = this.allProblems[randomIndex];
    console.log("Selected question data:", this.problem);
    this.render();
  }

  async chooseProblemList(problemSet: QuestionBankEnum) {
    this.problemSet = problemSet;
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

  skip() {
    // chrome.runtime.sendMessage({ action: "skipQuestion" });
    console.log("Skipped");
  }

  snooze() {
    // chrome.runtime.sendMessage({ action: "snoozeQuestion" });
    console.log("Snoozed");
  }

  async getDailyQuote() {
    // const response = await fetch("https://zenquotes.io/api/random");
    // const data = await response.json();
    // return data[0].q;
    return "A leetcode a day keeps the doctor away";
  }

  async getCurrQuestionNumber() {
    // const { problem }: { problem?: Problem } = await chrome.storage.sync.get("problem");
    return "3";
  }

  async getTotalQuestionCount() {
    // const { problem }: { problem?: Problem } = await chrome.storage.sync.get("problem");
    return "4";
  }

  async getStreakCount() {
    // const { streak }: { streak?: number } = await chrome.storage.sync.get("streak");
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
    // const { problem }: { problem?: Problem } = await chrome.storage.sync.get("problem");

    return Promise.resolve(
      "https://leetcode.com/problems/" + this.problem?.titleSlug,
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
    return this.problem?.title || "";
  }

  async getQuestionDifficulty() {
    console.log("Difficulty: ", this.problem?.difficulty.toLowerCase());
    return this.problem?.difficulty.toLowerCase() || "";
  }
}

const api = new myApi();
window.myApi = api;

document.addEventListener("DOMContentLoaded", () => {
  api.chooseProblemList(QuestionBankEnum.NeetCode150);
  addNavigationEventHandlers();
  addSettingsEventHandlers();
  render();
});

// const disableTorture = document.getElementById(
//   "disable-torture-checkbox",
// ) as HTMLInputElement | null;
// if (disableTorture) {
//   const { disabled }: { disabled?: boolean } =
//     await chrome.storage.sync.get("disabled");
//   if (disabled) {
//     disableTorture.checked = disabled;
//   }

//   disableTorture.addEventListener("change", async function () {
//     await chrome.storage.sync.set({ disabled: !!disableTorture.checked });
//     if (disableTorture.checked) {
//       chrome.runtime.sendMessage({ action: "stopRedirect" });
//     } else {
//       chrome.runtime.sendMessage({ action: "startRedirect" });
//     }
//   });
// }

// const problemTitle = document.getElementById("question");
// if (problemTitle) {
//   const { problem }: { problem?: Problem } =
//     await chrome.storage.sync.get("problem");
//   if (problem) {
//     problemTitle.textContent = problem.text;
//   }
// }

function addSettingsEventHandlers() {
  // Toggle ON / OFF
  const pauseToggleInput = document.getElementById(
    "pause-toggle",
  ) as HTMLInputElement;
  pauseToggleInput.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Pause toggle changed:", target.checked);
    if (target.checked) {
      api.enableRedirects();
    } else {
      api.disableRedirects();
    }
  });

  // Problem sets
  const problemSetSelect = document.getElementById(
    "problem-set-select",
  ) as HTMLSelectElement;

  problemSetSelect.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    const problemSet = target.value as QuestionBankEnum;
    api.chooseProblemList(problemSet);
  });

  // Problems per day
  const problemsPerDayInput = document.getElementById(
    "problems-per-day-input",
  ) as HTMLInputElement;
  problemsPerDayInput.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    api.setProblemsPerDay(target.value);
    console.log("Problems per day input changed:", target.value);
  });

  // Problem difficulty
  const problemDifficultySelect = document.getElementById(
    "problem-difficulty-select",
  ) as HTMLSelectElement;
  problemDifficultySelect.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    api.setProblemDifficulty(target.value);
    console.log("Problem difficulty selected:", target.value);
  });

  // Problem topics
  const problemTopicsSelect = document.getElementById(
    "problem-topics-select",
  ) as HTMLSelectElement;
  problemTopicsSelect.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    console.log("Problem topics selected:", target.value);
  });

  // Include premium problems
  const includePremiumProblemsToggle = document.getElementById(
    "include-premium-problems-toggle",
  ) as HTMLInputElement;
  includePremiumProblemsToggle.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    api.setIncludePremiumProblems(target.checked);
    console.log("Include premium problems toggle changed:", target.checked);
  });

  // Snooze interval
  const snoozeIntervalInput = document.getElementById(
    "snooze-interval-input",
  ) as HTMLInputElement;
  snoozeIntervalInput.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    api.setSnoozeInterval(target.value);
    console.log("Snooze interval input changed:", target.value);
  });

  // Rest interval
  const restIntervalInput = document.getElementById(
    "rest-interval-input",
  ) as HTMLInputElement;
  restIntervalInput.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    api.setRestInterval(target.value);
    console.log("Rest interval input changed:", target.value);
  });

  // Whitelisted URLs
  const whitelistedUrlsTextarea = document.getElementById(
    "whitelisted-urls-textarea",
  ) as HTMLTextAreaElement;
  whitelistedUrlsTextarea.addEventListener("input", (event) => {
    const target = event.target as HTMLTextAreaElement;
    api.setWhitelistedUrls(target.value);
    console.log("Whitelisted URLs textarea input:", target.value);
  });

  // Redirect on success
  const redirectOnSuccessToggle = document.getElementById(
    "redirect-on-success-toggle",
  ) as HTMLInputElement;
  redirectOnSuccessToggle.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    api.setRedirectOnSuccess(target.checked);
    console.log("Redirect on success toggle changed:", target.checked);
  });

  // Show daily quote
  const showDailyQuoteToggle = document.getElementById(
    "show-daily-quote-toggle",
  ) as HTMLInputElement;
  showDailyQuoteToggle.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    api.setShowDailyQuote(target.checked);
    const quoted: HTMLDivElement | null = document.querySelector(".quoted");
    if (quoted) {
      if (!target.checked) {
        quoted.style.display = "none";
      } else {
        quoted.style.display = "block";
      }
    }
    console.log("Show daily quote toggle changed:", target.checked);
  });
}

function addNavigationEventHandlers() {
  const toggleSettings = () => {
    const settingsPage = document.querySelector(".page__settings");
    if (settingsPage) {
      // Toggle the class
      settingsPage.classList.toggle("isOpen");

      // Save the state in localStorage
      const isOpen = settingsPage.classList.contains("isOpen");
      localStorage.setItem("settingsPageOpen", isOpen.toString());

      // Settings page has been close; so render the home UI again to show changes
      if (!isOpen) {
        render();
      }
    }
  };

  const settingsButton = document.querySelector(".header__icon_right");
  settingsButton?.addEventListener("click", toggleSettings);

  const backButton = document.querySelector(".header__icon_left");
  backButton?.addEventListener("click", toggleSettings);

  const questionLink = document.querySelector(".question__link");
  questionLink?.addEventListener("click", async () => {
    const problemUrl = await api.getProblemUrl();
    browser.openTab(problemUrl);
  });

  const skipButton = document.querySelector(".buttons__button--left");
  skipButton?.addEventListener("click", api.skip);

  const snoozeButton = document.querySelector(".buttons__button--right");
  snoozeButton?.addEventListener("click", api.snooze);
}

async function render(): Promise<void> {
  console.log("Calling Render");
  // Retrieve the last visible page
  const settingsPage = document.querySelector(".page__settings");
  if (settingsPage) {
    // Retrieve the state from localStorage
    const isOpen = localStorage.getItem("settingsPageOpen") === "true";

    // Set the initial state based on localStorage
    if (isOpen) {
      settingsPage.classList.add("isOpen");
    } else {
      settingsPage.classList.remove("isOpen");
    }
  }

  // Set the daily quote
  const quoted: HTMLDivElement | null = document.querySelector(".quoted");
  if (quoted) {
    quoted.innerText = await api.getDailyQuote();
  }

  // Set current question number
  const questionCount: HTMLSpanElement | null = document.querySelector(
    ".question__count-current",
  );
  if (questionCount) {
    questionCount.innerText = await api.getCurrQuestionNumber();
  }

  // Set total question count
  const questionTotal: HTMLSpanElement | null = document.querySelector(
    ".question__count-total",
  );
  if (questionTotal) {
    questionTotal.innerText = await api.getTotalQuestionCount();
  }

  // const questionLink = document.querySelector(".question__link") as HTMLAnchorElement;
  // if (questionLink) {
  //   const problemUrl = await api.getProblemUrl();
  //   questionLink.href = problemUrl;
  // }

  const question = document.querySelector(".question") as HTMLDivElement;
  if (question) {
    question.classList.remove(`question--easy`);
    question.classList.remove(`question--medium`);
    question.classList.remove(`question--hard`);
    question.classList.add(`question--${await api.getQuestionDifficulty()}`);
  }

  // Set streak count
  const streakCount: HTMLSpanElement | null =
    document.querySelector(".streak__count");
  if (streakCount) {
    streakCount.innerText = await api.getStreakCount();
  }

  // Set progress bar width
  const progressBar: HTMLDivElement | null = document.querySelector(
    ".progressBar__progress",
  );
  if (progressBar) {
    progressBar.style.width = `${await api.getCompletionPercentage()}%`;
  }

  // Get question name
  const questionName: HTMLAnchorElement | null =
    document.querySelector(".question__link");
  if (questionName) {
    questionName.innerText = await api.getQuestionTitle();
  }

  const problemTopicsSelect = document.getElementById(
    "problem-topics-select",
  ) as HTMLSelectElement;
  if (problemTopicsSelect) {
    // Delete all exisitng options first
    while (problemTopicsSelect.options.length > 0) {
      problemTopicsSelect.remove(0);
    }

    const option = document.createElement("option");
    option.value = "all";
    option.text = "All topics";
    problemTopicsSelect.appendChild(option);

    const problemTopics = await api.getProblemTopics();
    for (const topic of problemTopics) {
      const option = document.createElement("option");
      option.value = topic;
      option.text = topic;
      problemTopicsSelect.appendChild(option);
    }
  }

  const includePremiumProblemsToggle = document.getElementById(
    "include-premium-problems-toggle",
  ) as HTMLInputElement;
  if (includePremiumProblemsToggle) {
    includePremiumProblemsToggle.checked =
      await api.getIncludePremiumProblems();
  }

  const snoozeIntervalInput = document.getElementById(
    "snooze-interval-input",
  ) as HTMLInputElement;
  if (snoozeIntervalInput) {
    snoozeIntervalInput.value = await api.getSnoozeInterval();
  }

  const restIntervalInput = document.getElementById(
    "rest-interval-input",
  ) as HTMLInputElement;
  if (restIntervalInput) {
    restIntervalInput.value = await api.getRestInterval();
  }

  const whitelistedUrlsTextarea = document.getElementById(
    "whitelisted-urls-textarea",
  ) as HTMLTextAreaElement;
  if (whitelistedUrlsTextarea) {
    whitelistedUrlsTextarea.value = await api.getWhitelistedUrls();
  }

  const redirectOnSuccessToggle = document.getElementById(
    "redirect-on-success-toggle",
  ) as HTMLInputElement;
  if (redirectOnSuccessToggle) {
    redirectOnSuccessToggle.checked = await api.getRedirectOnSuccess();
  }

  const showDailyQuoteToggle = document.getElementById(
    "show-daily-quote-toggle",
  ) as HTMLInputElement;
  if (showDailyQuoteToggle) {
    const showQuote = await api.getShowDailyQuote();
    showDailyQuoteToggle.checked = showQuote;
    const quoted: HTMLDivElement | null = document.querySelector(".quoted");
    if (quoted) {
      if (!showDailyQuoteToggle.checked) {
        quoted.style.display = "none";
      } else {
        quoted.style.display = "block";
      }
    }
  }
}
