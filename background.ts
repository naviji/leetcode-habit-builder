import { setRedirectRule, unsetRedirectRule } from "./redirect.js";
import { getProblem, Problem } from "./problems.js";

const state = {
    problem: null as Problem | null,
    enabled: true,
};

export type State = typeof state;

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
        if ("problem" in changes) {
            state.problem = changes.problem.newValue;
        }
        if ("enabled" in changes) {
            state.enabled = changes.enabled.newValue;
            if (state.enabled) {
              const problem = state.problem;
              if (problem) {
                setRedirectRule(problem.href);
              } else {
                console.log("No problem found");
              }
            } else {
              unsetRedirectRule();
            }
        }
    }
});

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    console.log("ON INSTALLED", reason);
    if (reason === 'install') {
      await syncProblem();
      await synEnabledState();
    }
  });

async function syncProblem() {
    const { problem }: { problem?: Problem; } = await chrome.storage.sync.get("problem");
    if (!problem) {
        const problem = await getProblem();
        await chrome.storage.sync.set({ problem });
    } else {
        state.problem = problem;
    }
}

async function synEnabledState() {
    const { enabled }: { enabled?: boolean } = await chrome.storage.sync.get("enabled");
    if (enabled === undefined) {
        await chrome.storage.sync.set({ enabled: true });
    } else {
        state.enabled = enabled;
    }
}


// Example: Sending data to popup
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action === "getState") {
      sendResponse({ state });
    }
  });

