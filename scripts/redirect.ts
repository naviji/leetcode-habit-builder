let problemUrl = ""
// let tablId: number | null = null

const RULE_ID = 1

export async function setRedirectRule(redirectUrl: string) {
  console.log("Setting Redirect", redirectUrl);
  problemUrl = redirectUrl
  console.log("problemUrl", problemUrl)
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
      js: ["scripts/content.js"],
      matches: [`${redirectUrl}*`],
    }
  ])
  chrome.webNavigation.onBeforeNavigate.addListener(handleBeforeNavigation);
  chrome.webNavigation.onCommitted.addListener(handleOnCommitted);
}

export async function unsetRedirectRule() {
  // chrome.webNavigation.onCommitted.removeListener(handleOnCommitted);
  // chrome.webNavigation.onBeforeNavigate.removeListener(handleBeforeNavigation);

  await chrome.scripting.unregisterContentScripts()
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
  });
  // problemUrl = ""
  // const { urlTracker } = await chrome.storage.local.get("urlTracker")
  // if (urlTracker) {
  //   // Go throught each key value of object urlTracker
  //   for (const [tabId, url] of Object.entries(urlTracker)) {
  //     // If the value is not the same as the problem url then delete it
  //     chrome.tabs.update(Number(tabId), { url: url as string })
  //   }
  //   await chrome.storage.local.remove("urlTracker")
  // }
  // console.log("urlTracker", urlTracker)
}

const handleBeforeNavigation = async (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
  if (details.frameId === 0) {
    // const { urlTracker = {} } = await chrome.storage.local.get("urlTracker")
    // This is a main fram event navigation which could turn out to be redirected because of our ruleset
    // Maintain this history on a per tab level for future redirect back
    // urlTracker[details.tabId] = details.url
    // chrome.storage.local.set({ urlTracker })

    console.log("Going to url ", details.url, " from ", details.tabId)
    // tablId = details.tabId
  }
}

const handleOnCommitted = async (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
  if (details.frameId === 0) {
    // This is a main fram event
      // if (tablId === details.tabId && details.url === problemUrl) {
      //   console.log("Committed to url ", details.url, " from ", details.tabId)
      //   tablId = null
      // }

    // const { urlTracker = {} } = await chrome.storage.local.get("urlTracker")

    // if (urlTracker[details.tabId] && 
    //   urlTracker[details.tabId] !== details.url) {
    //     if (details.url !== problemUrl) {
    //       // Some other redirection we don't care about; delete from our tracker
    //       delete urlTracker[details.tabId]
    //       await chrome.storage.local.set({ urlTracker })
    //     }
    // }
  }
}
