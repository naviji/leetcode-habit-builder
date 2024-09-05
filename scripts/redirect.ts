// let tablId: number | null = null
let savedUrl: string | null = null;
let savedTabId: number | null = null;

let redirectHandler: (
  details: chrome.webNavigation.WebNavigationParentedCallbackDetails,
) => void;

export async function setRedirectRule(
  redirectUrl: string,
  whiteListedUrls: string[],
  redirectOnSuccess = true
) {
  console.log("Setting Redirect Rule", redirectUrl, whiteListedUrls);
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
    try {
      return compareHostNames(currentUrl);
    } catch {
      // If there's an error, try doing a text compare
      // const currentUrl without http https or www
      function normalizeUrl(url: string) {
        // Remove http://, https://, and www. from the URL
        return url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
      }
      
      return whiteListedUrls.some((url) => normalizeUrl(currentUrl).startsWith(normalizeUrl(url)));
    }
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
      console.log("Not whitelisted", currentUrl);
      savedUrl = currentUrl;
      savedTabId = details.tabId;
      chrome.tabs.update(details.tabId, { url: redirectUrl });
    } else {
      console.log("Whitelisted", currentUrl);
    }
  };
  // Listen for when a user navigates to a new page
  chrome.webNavigation.onBeforeNavigate.addListener(redirectHandler);
  if (redirectOnSuccess) {
    await chrome.scripting.registerContentScripts([
      {
        id: "1",
        js: ["scripts/content.js"],
        matches: [`${redirectUrl}*`],
      },
    ]);
  }

  function compareHostNames(currentUrl: string) {
    const currentUrlObj = new URL(currentUrl);
    const redirectUrlObj = new URL(redirectUrl);

    return (
      currentUrlObj.hostname === redirectUrlObj.hostname ||
      whiteListedUrls.some((whitelistedUrl) => {
        const whitelistedUrlObj = new URL(whitelistedUrl);
        return currentUrlObj.hostname === whitelistedUrlObj.hostname;
      })
    );
  }
}

export async function unsetRedirectRule(redirectOnSuccess = true) {
  await chrome.scripting.unregisterContentScripts();
  if (chrome.webNavigation.onBeforeNavigate.hasListener(redirectHandler)) {
    chrome.webNavigation.onBeforeNavigate.removeListener(redirectHandler);
    if (savedUrl && savedTabId && redirectOnSuccess) {
      chrome.tabs.update(savedTabId, { url: savedUrl });
    }
  }
}
