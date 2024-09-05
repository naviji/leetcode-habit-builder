// let tablId: number | null = null
let savedUrl: string | null = null
let savedTabId: number | null = null

const RULE_ID = 1

const whitelistedUrls = [
  'https://google.com',
  'https://developer.chrome.com',
  'https://leetcode.com',
  // 'about:blank',
  // 'about:srcdoc',
  // 'https://www.recaptcha.net',
  'chrome://new-tab-page/'
];

let redirectHandler: (details: chrome.webNavigation.WebNavigationParentedCallbackDetails) => void;

export async function setRedirectRule(redirectUrl: string) {
  console.log("Setting Redirect", redirectUrl);
  // Function to check if the URL is whitelisted
  function isUrlWhitelisted(currentUrl: string) {
    return currentUrl.startsWith(redirectUrl) || whitelistedUrls.some(whitelistedUrl => currentUrl.startsWith(whitelistedUrl));
  }

  redirectHandler = ((details: chrome.webNavigation.WebNavigationParentedCallbackDetails) => {
    console.log("details", details)
    const currentUrl = details.url;

    if (details.frameId !== 0 && details.parentFrameId != -1) {
      return;
    }

    // If the current URL is not whitelisted, redirect the user
    if (!isUrlWhitelisted(currentUrl)) {
      console.log("Not whitelisted", currentUrl);
      savedUrl = currentUrl;
      savedTabId = details.tabId;
      chrome.tabs.update(details.tabId, { url: redirectUrl });
    } else {
      console.log("Whitelisted", currentUrl);
    }
  })
  // Listen for when a user navigates to a new page
  chrome.webNavigation.onBeforeNavigate.addListener(redirectHandler);


  await chrome.scripting.unregisterContentScripts()
  await chrome.scripting.registerContentScripts([
    {
      id: "1",
      js: ["scripts/content.js"],
      matches: [`${redirectUrl}*`],
    }
  ])
}

export async function unsetRedirectRule() {
  await chrome.scripting.unregisterContentScripts()
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
  });
  chrome.webNavigation.onBeforeNavigate.removeListener(redirectHandler)
  console.log("Saved url and tablId", savedUrl, savedTabId);
  if (savedUrl && savedTabId) {
    chrome.tabs.update(savedTabId, { url: savedUrl });
  }
}