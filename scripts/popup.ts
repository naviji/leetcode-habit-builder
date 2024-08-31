import { QuestionBankEnum } from "../types/questions.js";
import browserNavigator from "./browserNavigator.js";
import localStorageEngine from "./localStorageEngine.js";
import { Application } from "./app.js";


document.addEventListener("DOMContentLoaded", async () => {
  await app.init()
  addNavigationEventHandlers();
  addSettingsEventHandlers();
});

function addSettingsEventHandlers() {
  // Toggle ON / OFF
  const pauseToggleInput = document.getElementById(
    "pause-toggle",
  ) as HTMLInputElement;
  pauseToggleInput.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Pause toggle changed:", target.checked);
    if (target.checked) {
      app.enableRedirects();
    } else {
      app.disableRedirects();
    }
  });

  // Problem sets
  const problemSetSelect = document.getElementById(
    "problem-set-select",
  ) as HTMLSelectElement;

  problemSetSelect.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    const problemSet = target.value as QuestionBankEnum;
    app.chooseProblemFromList(problemSet);
  });

  // Problems per day
  const problemsPerDayInput = document.getElementById(
    "problems-per-day-input",
  ) as HTMLInputElement;
  problemsPerDayInput.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    app.setProblemsPerDay(target.value);
    console.log("Problems per day input changed:", target.value);
  });

  // Problem difficulty
  const problemDifficultySelect = document.getElementById(
    "problem-difficulty-select",
  ) as HTMLSelectElement;
  problemDifficultySelect.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    app.setProblemDifficulty(target.value);
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
    app.setIncludePremiumProblems(target.checked);
    console.log("Include premium problems toggle changed:", target.checked);
  });

  // Snooze interval
  const snoozeIntervalInput = document.getElementById(
    "snooze-interval-input",
  ) as HTMLInputElement;
  snoozeIntervalInput.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    app.setSnoozeInterval(target.value);
    console.log("Snooze interval input changed:", target.value);
  });

  // Rest interval
  const restIntervalInput = document.getElementById(
    "rest-interval-input",
  ) as HTMLInputElement;
  restIntervalInput.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    app.setRestInterval(target.value);
    console.log("Rest interval input changed:", target.value);
  });

  // Whitelisted URLs
  const whitelistedUrlsTextarea = document.getElementById(
    "whitelisted-urls-textarea",
  ) as HTMLTextAreaElement;
  whitelistedUrlsTextarea.addEventListener("input", (event) => {
    const target = event.target as HTMLTextAreaElement;
    app.setWhitelistedUrls(target.value);
    console.log("Whitelisted URLs textarea input:", target.value);
  });

  // Redirect on success
  const redirectOnSuccessToggle = document.getElementById(
    "redirect-on-success-toggle",
  ) as HTMLInputElement;
  redirectOnSuccessToggle.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    app.setRedirectOnSuccess(target.checked);
    console.log("Redirect on success toggle changed:", target.checked);
  });

  // Show daily quote
  const showDailyQuoteToggle = document.getElementById(
    "show-daily-quote-toggle",
  ) as HTMLInputElement;
  showDailyQuoteToggle.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    app.setShowDailyQuote(target.checked);
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
    const problemUrl = await app.getProblemUrl();
    app.openTab(problemUrl);
  });

  const skipButton = document.querySelector(".buttons__button--left");
  skipButton?.addEventListener("click", app.skip);

  const snoozeButton = document.querySelector(".buttons__button--right");
  snoozeButton?.addEventListener("click", app.snooze);
}

export async function render(): Promise<void> {
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
    quoted.innerText = await app.getDailyQuote();
  }

  // Set current question number
  const questionCount: HTMLSpanElement | null = document.querySelector(
    ".question__count-current",
  );
  if (questionCount) {
    questionCount.innerText = await app.getCurrQuestionNumber();
  }

  // Set total question count
  const questionTotal: HTMLSpanElement | null = document.querySelector(
    ".question__count-total",
  );
  if (questionTotal) {
    questionTotal.innerText = await app.getTotalQuestionCount();
  }

  const question = document.querySelector(".question") as HTMLDivElement;
  if (question) {
    question.classList.remove(`question--easy`);
    question.classList.remove(`question--medium`);
    question.classList.remove(`question--hard`);
    question.classList.add(`question--${await app.getQuestionDifficulty()}`);
  }

  // Set streak count
  const streakCount: HTMLSpanElement | null =
    document.querySelector(".streak__count");
  if (streakCount) {
    streakCount.innerText = await app.getStreakCount();
  }

  // Set progress bar width
  const progressBar: HTMLDivElement | null = document.querySelector(
    ".progressBar__progress",
  );
  if (progressBar) {
    progressBar.style.width = `${await app.getCompletionPercentage()}%`;
  }

  // Get question name
  const questionName: HTMLAnchorElement | null =
    document.querySelector(".question__link");
  if (questionName) {
    questionName.innerText = await app.getQuestionTitle();
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

    const problemTopics = await app.getProblemTopics();
    for (const topic of problemTopics) {
      const option = document.createElement("option");
      option.value = topic;
      option.text = topic;
      problemTopicsSelect.appendChild(option);
    }
  }


  const problemSetSelect = document.getElementById(
    "problem-set-select",
  ) as HTMLSelectElement;
  if (problemSetSelect) {
    const problemSet = await app.getProblemSet();
    for (const option of problemSetSelect.options) {
      if (option.value === problemSet) {
        option.selected = true;
        break;
      }
    }
  }

  const includePremiumProblemsToggle = document.getElementById(
    "include-premium-problems-toggle",
  ) as HTMLInputElement;
  if (includePremiumProblemsToggle) {
    includePremiumProblemsToggle.checked =
      await app.getIncludePremiumProblems();
  }

  const snoozeIntervalInput = document.getElementById(
    "snooze-interval-input",
  ) as HTMLInputElement;
  if (snoozeIntervalInput) {
    snoozeIntervalInput.value = await app.getSnoozeInterval();
  }

  const restIntervalInput = document.getElementById(
    "rest-interval-input",
  ) as HTMLInputElement;
  if (restIntervalInput) {
    restIntervalInput.value = await app.getRestInterval();
  }

  const whitelistedUrlsTextarea = document.getElementById(
    "whitelisted-urls-textarea",
  ) as HTMLTextAreaElement;
  if (whitelistedUrlsTextarea) {
    whitelistedUrlsTextarea.value = await app.getWhitelistedUrls();
  }

  const redirectOnSuccessToggle = document.getElementById(
    "redirect-on-success-toggle",
  ) as HTMLInputElement;
  if (redirectOnSuccessToggle) {
    redirectOnSuccessToggle.checked = await app.getRedirectOnSuccess();
  }

  const showDailyQuoteToggle = document.getElementById(
    "show-daily-quote-toggle",
  ) as HTMLInputElement;
  if (showDailyQuoteToggle) {
    const showQuote = await app.getShowDailyQuote();
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


  // Problems per day
  const problemsPerDayInput = document.getElementById(
    "problems-per-day-input",
  ) as HTMLInputElement;
  if (problemsPerDayInput) {
    problemsPerDayInput.value = await app.getProblemsPerDay();
  }

}

export const app = new Application(browserNavigator, localStorageEngine, render);
window.myApi = app;