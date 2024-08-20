
export function setRedirectRule(redirectUrl: string) {
    console.log("Calling set redirect")
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
  
export function unsetRedirectRule() {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1]
    });
  }
  