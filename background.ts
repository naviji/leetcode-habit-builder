

async function setRedirectRule(redirectUrl: string) {
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
    }
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
        addRules: [redirectRule]
    })
}

async function unsetRedirectRule() {
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1]
    })
}

setTimeout(async () => {
    await setRedirectRule("https://leetcode.com/problems/valid-anagram/")
    console.log("Enabling redirect rule")
}, 0)

// setTimeout(async () => {
//     await unsetRedirectRule()
//     console.log("Disabling redirect rule")
// }, 20000)