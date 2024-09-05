import { Navigator } from "../types/navigator.js";

const extensionNavigator: Navigator = {
  openTab: (url: string) => {
    chrome.tabs.create({ url: url });
  },
  setRedirectsEnabled: (enabled: boolean, url?: string) => {
    if (enabled) {
        chrome.runtime.sendMessage({ action: "startRedirect", data: { url } });
    } else {
        chrome.runtime.sendMessage({ action: "stopRedirect" });
    }
  }

};

export default extensionNavigator;
