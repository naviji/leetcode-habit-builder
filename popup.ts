// https://github.com/microsoft/TypeScript/issues/49083#issuecomment-1435399267
import { setRedirectRule, unsetRedirectRule } from "./redirect.js";
import { getProblem } from "./problems.js";
import { Problem } from "./types.js";


const solveBtn = document.getElementById("solve-btn") as HTMLDivElement | null;
if (solveBtn) {
  solveBtn.addEventListener("click", async function () {
    const problem = await getProblem();
    if (!problem) {
      console.log("No problem found");
      return;
    }
    chrome.tabs.create({ url: problem.href });
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
  const storedState = localStorage.getItem("disableTorture");
  if (storedState) {
    disableTorture.checked = storedState === "true";
  }

  disableTorture.addEventListener("change", async function () {
    const newState = disableTorture.checked;
    localStorage.setItem("disableTorture", newState.toString());
    if (newState) {
      const problem = await getProblem();
      if (problem) {
        await setRedirectRule(problem.href);
      } else {
        console.log("No problem found");
      }
    } else {
      await unsetRedirectRule();
    }
  });
}

async function setProblem() {
  const problem = await getProblem();
  setProblemText(problem);
}

function setProblemText(problem: Problem) {
  const problemTitle = document.getElementById("question");
  if (problemTitle) {
    problemTitle.textContent = problem.text;
  }
}

async function initUI() {
  await setProblem();
}

initUI();
