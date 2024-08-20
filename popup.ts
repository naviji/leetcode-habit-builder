const settingsButton = document.getElementById("settings-icon");
if (settingsButton) {
  settingsButton.addEventListener("click", function () {
    // setRedirectRule('https://leetcode.com/problems/valid-anagram/');
    const settingsPage = document.getElementById("settings-page");
    if (settingsPage) {
      settingsPage.classList.toggle("visible");
    }
  });
}

const backArrow = document.getElementById("arrow-icon");
if (backArrow) {
  backArrow.addEventListener("click", function () {
    const settingsPage = document.getElementById("settings-page");
    if (settingsPage) {
      settingsPage.classList.toggle("visible");
    }
  });
}

function setRedirectRule(redirectUrl: string) {
  console.log("Calling setRedirectRule");
  const hostname = new URL(redirectUrl).hostname;
  const redirectRule: chrome.declarativeNetRequest.Rule = {
    id: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
      redirect: { url: redirectUrl }
    },
    condition: {
      urlFilter: "*://*/*",
      excludedInitiatorDomains: [
        "developer.chrome.com", // To ease development
        hostname
      ],
      resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
    }
  };
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [redirectRule]
  });
}

function unsetRedirectRule() {
  console.log("Calling unsetRedirectRule");
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1]
  });
}
