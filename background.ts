import { setRedirectRule } from "./redirect.js";
import { Problem, getProblem } from "./problems.js";

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    console.log("Installing");
    // Setup initial state with a problem and not disabled  by default
    const { problem }: { problem?: Problem } = await chrome.storage.sync.get("problem");
    if (!problem) {
      const newProblem = await getProblem();
      await chrome.storage.sync.set({ problem: newProblem });
      await setRedirectRule(newProblem.href);
    }

    const { disabled }: { disabled?: boolean } = await chrome.storage.sync.get("disabled");
    if (disabled === undefined) {
        await chrome.storage.sync.set({ disabled: false });
    } else {
        console.log("Disabled Already set", disabled);
    }
  } else {
    console.log("Updating");
  }
});