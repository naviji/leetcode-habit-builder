import { Problem } from "./problems.js";


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

// if (settingsButton) {
//   const storedState = localStorage.getItem("settingsPageVisible");
//   const settingsPage = document.getElementById("settings-page");
//   if (storedState === "true" && settingsPage) {
//     settingsPage.classList.add("visible");
//   }

//   settingsButton.addEventListener("click", function () {
//     localStorage.setItem("settingsPageVisible", "true");
//     const settingsPage = document.getElementById("settings-page");
//     if (settingsPage) {
//       settingsPage.classList.toggle("visible");
//     }
//   });
// }

// const backArrow = document.getElementById("arrow-icon");
// if (backArrow) {
//   backArrow.addEventListener("click", function () {
//     localStorage.setItem("settingsPageVisible", "false");
//     const settingsPage = document.getElementById("settings-page");
//     if (settingsPage) {
//       settingsPage.classList.toggle("visible");
//     }
//   });
// }

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

// const solveBtn = document.getElementById("solve-btn") as HTMLDivElement | null;
// if (solveBtn) {
//   solveBtn.addEventListener("click", async function () {
//     const { problem }: { problem?: Problem } =
//       await chrome.storage.sync.get("problem");
//     if (problem) {
//       chrome.tabs.create({ url: problem.href });
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
