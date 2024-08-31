import { questions, questionInfo } from "./data.js";
const browser = {
  openTab: (url: string) => {
    window.open(url, "_blank");
  },
};


enum QuestionBankEnum {
  NeetCodeAll = "neetcodeAll",
  NeetCode150 = "neetcode150",
  Blind75 = "blind75",
  StriverSDESheet = "striverSDESheet",
  StriverAtoZ = "striverAtoZ",
  Striver79 = "striver79",
}
interface QuestionBank {
  [QuestionBankEnum.NeetCodeAll]: string[],
  [QuestionBankEnum.NeetCode150]: string[],
  [QuestionBankEnum.Blind75]: string[],
  [QuestionBankEnum.StriverSDESheet]: string[],
  [QuestionBankEnum.StriverAtoZ]: string[],
  [QuestionBankEnum.Striver79]: string[],
}


interface TopicTag {
  name: string;
  id: string;
  slug: string;
}

interface Question {
  acRate: number;
  difficulty: string;
  freqBar: number | null;
  questionFrontendId: string;
  isFavor: boolean;
  isPaidOnly: boolean;
  status: string | null;
  title: string;
  titleSlug: string;
  topicTags: TopicTag[];
  hasSolution: boolean;
  hasVideoSolution: boolean;
}

interface QuestionData {
  question: Question;
}

interface Questions {
  [key: string]: {
    data: QuestionData;
  };
}


// const browserReal = {
//   openTab: (url: string) => {
//     chrome.tabs.create({ url: url });
//   }
// }

interface MyApi {
  problem: Question | null,
  skip(): void;
  snooze(): void;
  chooseProblemList(list: QuestionBankEnum): void;

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

  render(): void;
  
}

class myApi implements MyApi {

  problem: Question| null = null
  render() {
    render()
  }

  chooseProblemList (problemSet: QuestionBankEnum) {
    const questionsInSet = questions[problemSet];
    const randomIndex = Math.floor(Math.random() * questionsInSet.length);
    const problemSlug = questionsInSet[randomIndex];
    console.log("Selected question data:", questionInfo[problemSlug]);
    this.problem = questionInfo[problemSlug].data.question;
    this.render()
  }

  skip () {
    // chrome.runtime.sendMessage({ action: "skipQuestion" });
    console.log("Skipped");
  }


  snooze () {
    // chrome.runtime.sendMessage({ action: "snoozeQuestion" });
    console.log("Snoozed");
  }

  async getDailyQuote () {
    // const response = await fetch("https://zenquotes.io/api/random");
    // const data = await response.json();
    // return data[0].q;
    return "A leetcode a day keeps the doctor away"
  }

  async getCurrQuestionNumber () {
    // const { problem }: { problem?: Problem } = await chrome.storage.sync.get("problem");
    return "3";
   }

  async getTotalQuestionCount () {
    // const { problem }: { problem?: Problem } = await chrome.storage.sync.get("problem");
    return "4";
  }

  async getStreakCount () {
    // const { streak }: { streak?: number } = await chrome.storage.sync.get("streak");
    return "122"
  }

  async getCompletionPercentage () {
    const percentage = (
      (Number(await this.getCurrQuestionNumber()) /
        Number(await this.getTotalQuestionCount())) *
      100
    ).toString();
    return percentage;
  }

  async getProblemUrl () {
    // const { problem }: { problem?: Problem } = await chrome.storage.sync.get("problem");

    return Promise.resolve("https://leetcode.com/problems/" + this.problem?.titleSlug)
  }

  enableRedirects () {
    console.log("Enabling Redirects");
    // chrome.runtime.sendMessage({ action: "startRedirect" });
    // chrome.runtime.sendMessage({ action: "pauseTheGrind" });
    //
  }

  disableRedirects () {
    console.log("Disabling Redirects");
    // chrome.runtime.sendMessage({ action: "stopRedirect" });
    // chrome.runtime.sendMessage({ action: "resumeTheGrind" });
  }

  async getQuestionTitle () {
    return this.problem?.title || ""
  }

  async getQuestionDifficulty () {
    console.log("Difficulty: ", this.problem?.difficulty.toLowerCase());
    return this.problem?.difficulty.toLowerCase() || ""
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
  const pauseToggleInput = document.getElementById(
    "pause-toggle",
  ) as HTMLInputElement;

  const problemSetSelect = document.getElementById(
    "problem-set-select",
  ) as HTMLSelectElement;

  const problemsPerDayInput = document.getElementById(
    "problems-per-day-input",
  ) as HTMLInputElement;

  const problemDifficultySelect = document.getElementById(
    "problem-difficulty-select",
  ) as HTMLSelectElement;

  const problemTopicsSelect = document.getElementById(
    "problem-topics-select",
  ) as HTMLSelectElement;
  const problemTopicsTextarea = document.getElementById(
    "problem-topics-textarea",
  ) as HTMLTextAreaElement;

  const includeSolvedProblemsDiv = document.getElementById(
    "include-solved-problems",
  ) as HTMLElement;
  const includeSolvedProblemsToggle = document.getElementById(
    "include-solved-problems-toggle",
  ) as HTMLInputElement;

  const includePremiumProblemsDiv = document.getElementById(
    "include-premium-problems",
  ) as HTMLElement;
  const includePremiumProblemsToggle = document.getElementById(
    "include-premium-problems-toggle",
  ) as HTMLInputElement;

  const snoozeIntervalInput = document.getElementById(
    "snooze-interval-input",
  ) as HTMLInputElement;

  const restIntervalInput = document.getElementById(
    "rest-interval-input",
  ) as HTMLInputElement;

  const whitelistedUrlsTextarea = document.getElementById(
    "whitelisted-urls-textarea",
  ) as HTMLTextAreaElement;

  const redirectOnSuccessDiv = document.getElementById(
    "redirect-on-success",
  ) as HTMLElement;
  const redirectOnSuccessToggle = document.getElementById(
    "redirect-on-success-toggle",
  ) as HTMLInputElement;

  const showDailyQuoteDiv = document.getElementById(
    "show-daily-quote",
  ) as HTMLElement;
  const showDailyQuoteToggle = document.getElementById(
    "show-daily-quote-toggle",
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
  problemSetSelect.addEventListener("change", (event) => {
  const target = event.target as HTMLSelectElement;
  const problemSet = target.value as QuestionBankEnum;
    api.chooseProblemList(problemSet)
  });

  // Problems per day
  problemsPerDayInput.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Problems per day input changed:", target.value);
  });

  // Problem difficulty
  problemDifficultySelect.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    console.log("Problem difficulty selected:", target.value);
  });

  // Problem topics
  problemTopicsSelect.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    console.log("Problem topics selected:", target.value);
  });
  problemTopicsTextarea.addEventListener("input", (event) => {
    const target = event.target as HTMLTextAreaElement;
    console.log("Problem topics textarea input:", target.value);
  });

  // Include solved problems
  includeSolvedProblemsDiv.addEventListener("click", () => {
    console.log("Include solved problems clicked");
  });
  includeSolvedProblemsToggle.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Include solved problems toggle changed:", target.checked);
  });

  // Include premium problems
  includePremiumProblemsDiv.addEventListener("click", () => {
    console.log("Include premium problems clicked");
  });
  includePremiumProblemsToggle.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Include premium problems toggle changed:", target.checked);
  });

  // Snooze interval
  snoozeIntervalInput.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Snooze interval input changed:", target.value);
  });

  // Rest interval
  restIntervalInput.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Rest interval input changed:", target.value);
  });

  // Whitelisted URLs
  whitelistedUrlsTextarea.addEventListener("input", (event) => {
    const target = event.target as HTMLTextAreaElement;
    console.log("Whitelisted URLs textarea input:", target.value);
  });

  // Redirect on success
  redirectOnSuccessDiv.addEventListener("click", () => {
    console.log("Redirect on success clicked");
  });
  redirectOnSuccessToggle.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Redirect on success toggle changed:", target.checked);
  });

  // Show daily quote
  showDailyQuoteDiv.addEventListener("click", () => {
    console.log("Show daily quote clicked");
  });
  showDailyQuoteToggle.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
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
    question.classList.remove(`question--easy`)
    question.classList.remove(`question--medium`)
    question.classList.remove(`question--hard`)
    question.classList.add(`question--${await api.getQuestionDifficulty()}`)
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
  const questionName: HTMLAnchorElement | null = document.querySelector(
    ".question__link",
  );
  if (questionName) {
    questionName.innerText = await api.getQuestionTitle();
  }

}
