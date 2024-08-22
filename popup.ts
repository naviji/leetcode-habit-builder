import { State } from "./background.js";

const solveBtn = document.getElementById("solve-btn") as HTMLDivElement | null;
if (solveBtn) {
  solveBtn.addEventListener("click", async function () {
    const { state }: { state: State } = await chrome.runtime.sendMessage({
      action: "getState",
    });
    if (!state.problem) {
      console.log("No problem found");
      return;
    }
    chrome.tabs.create({ url: state.problem.href });
  });
}

const settingsButton = document.getElementById("settings-icon");
if (settingsButton) {
  const storedState = localStorage.getItem("settingsPageVisible");
  const settingsPage = document.getElementById("settings-page");
  if (storedState === "true" && settingsPage) {
    settingsPage.classList.add("visible");
  }

  settingsButton.addEventListener("click", function () {
    localStorage.setItem("settingsPageVisible", "true");
    const settingsPage = document.getElementById("settings-page");
    if (settingsPage) {
      settingsPage.classList.toggle("visible");
    }
  });
}

const backArrow = document.getElementById("arrow-icon");
if (backArrow) {
  backArrow.addEventListener("click", function () {
    localStorage.setItem("settingsPageVisible", "false");
    const settingsPage = document.getElementById("settings-page");
    if (settingsPage) {
      settingsPage.classList.toggle("visible");
    }
  });
}

const disableTorture = document.getElementById(
  "disable-torture-checkbox",
) as HTMLInputElement | null;
if (disableTorture) {
  const { state }: { state: State } = await chrome.runtime.sendMessage({
    action: "getState",
  });
  if (state.enabled) {
    disableTorture.checked = state.enabled;
  }

  disableTorture.addEventListener("change", async function () {
    const newState = disableTorture.checked;
    await chrome.storage.sync.set({ enabled: !!newState });
  });
}


async function setProblemText() {
  const { state }: { state: State } = await chrome.runtime.sendMessage({
    action: "getState",
  })

  if (!state.problem) {
    console.log("No problem found");
    return;
  }
  const problemTitle = document.getElementById("question");
  if (problemTitle) {
    problemTitle.textContent = state.problem.text;
  }
}

async function initUI() {
  await setProblemText();
}

initUI();
