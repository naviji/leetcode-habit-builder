export async function setRedirectRule(redirectUrl: string) {
  console.log("Calling set redirect");
  const hostname = new URL(redirectUrl).hostname;
  const redirectRule: chrome.declarativeNetRequest.Rule = {
    id: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
      redirect: { url: redirectUrl },
    },
    condition: {
      urlFilter: "*://*/*",
      excludedInitiatorDomains: [
        "developer.chrome.com", // To ease development
        hostname,
      ],
      resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
    },
  };
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [redirectRule],
  });
  await chrome.scripting.unregisterContentScripts()
  await chrome.scripting.registerContentScripts([
    {
      id: "1",
      js: ["content.js"],
      matches: [`${redirectUrl}*`],
    }
  ])
}

export async function unsetRedirectRule() {
  await chrome.scripting.unregisterContentScripts()
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
  });
}
