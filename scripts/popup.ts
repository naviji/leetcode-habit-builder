
const browser = {
  openTab: (url: string) => {
    window.open(url, "_blank");
  }
}
interface MyApi {
  skip(): void;
  snooze(): void;
  getDailyQuote(): Promise<string>;
  getCurrQuestionNumber(): Promise<string>;
  getTotalQuestionCount(): Promise<string>;
  getStreakCount(): Promise<string>;
  getCompletionPercentage(): Promise<string>;
}

const myApi : MyApi= {
  skip: () => {
    // chrome.runtime.sendMessage({ action: "skipQuestion" });
    console.log("Skipped")
  },
  snooze: () => {
    // chrome.runtime.sendMessage({ action: "snoozeQuestion" });
    console.log("Snoozed")
  },
  getDailyQuote: async () => {
    // const response = await fetch("https://zenquotes.io/api/random");
    // const data = await response.json();
    // return data[0].q;
    return "A leetcode a day keeps the doctor away"
  },
  getCurrQuestionNumber: async () => {
    // const { problem }: { problem?: Problem } = await chrome.storage.sync.get("problem");
    return "3"
  },
  getTotalQuestionCount: async () => {
    // const { problem }: { problem?: Problem } = await chrome.storage.sync.get("problem");
    return "4"
  },
  getStreakCount: async () => {
    // const { streak }: { streak?: number } = await chrome.storage.sync.get("streak");
    return "122"
  },
  getCompletionPercentage: async () => {
    const percentage = ((Number(await myApi.getCurrQuestionNumber()) / Number(await myApi.getTotalQuestionCount()))*100).toString()
    return percentage
  }
}

console.log("Script loaded and myApi defined:", myApi);


window.myApi = myApi;


document.addEventListener('DOMContentLoaded', async () => {
  // Retrieve the last visible page
  const settingsPage = document.querySelector(".page__settings");
  if (settingsPage) {
    // Retrieve the state from localStorage
    const isOpen = localStorage.getItem("settingsPageOpen") === 'true';

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
    quoted.innerText = await myApi.getDailyQuote();
  }

  // Set current question number
  const questionCount: HTMLSpanElement | null = document.querySelector(".question__count-current");
  if (questionCount) {
    questionCount.innerText = await myApi.getCurrQuestionNumber()
  }

  // Set total question count
  const questionTotal: HTMLSpanElement | null = document.querySelector(".question__count-total");
  if (questionTotal) {
    questionTotal.innerText = await myApi.getTotalQuestionCount()
  }

  // Set streak count
  const streakCount: HTMLSpanElement | null = document.querySelector(".streak__count");
  if (streakCount) {
    streakCount.innerText = await myApi.getStreakCount()
  }

  // Set progress bar width
  const progressBar: HTMLDivElement | null = document.querySelector(".progressBar__progress");
  if (progressBar) {
    progressBar.style.width = `${await myApi.getCompletionPercentage()}%`
  }

})

const toggleSettings = () => {
  const settingsPage = document.querySelector(".page__settings");
  if (settingsPage) {
    // Toggle the class
    settingsPage.classList.toggle("isOpen");

    // Save the state in localStorage
    const isOpen = settingsPage.classList.contains("isOpen");
    localStorage.setItem("settingsPageOpen", isOpen.toString());
  }
}

const settingsButton = document.querySelector(".header__icon_right");
settingsButton?.addEventListener("click", toggleSettings)

const backButton = document.querySelector(".header__icon_left");
backButton?.addEventListener("click", toggleSettings)


// const browserReal = {
//   openTab: (url: string) => {
//     chrome.tabs.create({ url: url });
//   }
// }

const questionLink = document.querySelector(".question__link");
questionLink?.addEventListener("click", async () => {
  console.log("Clicked")
  // const { problem }: { problem?: Problem } = await chrome.storage.sync.get("problem");
  const problemUrl ="https://leetcode.com/problems/two-sum/"
  browser.openTab(problemUrl);
})

const skipButton = document.querySelector('.buttons__button--left')
skipButton?.addEventListener('click', myApi.skip)

const snoozeButton = document.querySelector('.buttons__button--right')
snoozeButton?.addEventListener('click', myApi.snooze)



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

export { myApi }