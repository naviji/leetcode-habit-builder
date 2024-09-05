// let tablId: number | null = null
let savedUrl: string | null = null;
let savedTabId: number | null = null;

let redirectHandler: (
  details: chrome.webNavigation.WebNavigationParentedCallbackDetails,
) => void;

export async function setRedirectRule(
  redirectUrl: string,
  whiteListedUrls: string[],
) {
  // Clean up in case setRedirectRule is called multiple times
  if (
    redirectHandler &&
    chrome.webNavigation.onBeforeNavigate.hasListener(redirectHandler)
  ) {
    chrome.webNavigation.onBeforeNavigate.removeListener(redirectHandler);
  }
  await chrome.scripting.unregisterContentScripts();
  // Add new tab page to whitelist by default
  whiteListedUrls.push("chrome://new-tab-page/");

  // Function to check if the URL is whitelisted
  function isUrlWhitelisted(currentUrl: string) {
    return (
      currentUrl.startsWith(redirectUrl) ||
      whiteListedUrls.some((whitelistedUrl) =>
        currentUrl.startsWith(whitelistedUrl),
      )
    );
  }

  redirectHandler = (
    details: chrome.webNavigation.WebNavigationParentedCallbackDetails,
  ) => {
    const currentUrl = details.url;
    if (details.frameId !== 0 && details.parentFrameId != -1) {
      return;
    }

    // If the current URL is not whitelisted, redirect the user
    if (!isUrlWhitelisted(currentUrl)) {
      savedUrl = currentUrl;
      savedTabId = details.tabId;
      chrome.tabs.update(details.tabId, { url: redirectUrl });
    }
  };
  // Listen for when a user navigates to a new page
  chrome.webNavigation.onBeforeNavigate.addListener(redirectHandler);
  await chrome.scripting.registerContentScripts([
    {
      id: "1",
      js: ["scripts/content.js"],
      matches: [`${redirectUrl}*`],
    },
  ]);
}

export async function unsetRedirectRule() {
  await chrome.scripting.unregisterContentScripts();
  if (chrome.webNavigation.onBeforeNavigate.hasListener(redirectHandler)) {
    chrome.webNavigation.onBeforeNavigate.removeListener(redirectHandler);
    if (savedUrl && savedTabId) {
      chrome.tabs.update(savedTabId, { url: savedUrl });
    }
  }
}
