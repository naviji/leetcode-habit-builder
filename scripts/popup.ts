

document.addEventListener('DOMContentLoaded', () => {
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


const browser = {
  openTab: (url: string) => {
    window.open(url, "_blank");
  }
}

const problem = {
  skip: () => {
    // chrome.runtime.sendMessage({ action: "skipQuestion" });
    console.log("Skipped")
  },
  snooze: () => {
    // chrome.runtime.sendMessage({ action: "snoozeQuestion" });
    console.log("Snoozed")
  }
}

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
skipButton?.addEventListener('click', problem.skip)

const snoozeButton = document.querySelector('.buttons__button--right')
snoozeButton?.addEventListener('click', problem.snooze)


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
