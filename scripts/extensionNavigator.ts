import { Navigator } from "../types/navigator.js";

const extensionNavigator: Navigator = {
  openTab: (url: string) => {
    chrome.tabs.create({ url: url });
  },
  setRedirectsEnabled: (enabled: boolean, url?: string) => {
    console.log("Enabling Redirects", enabled, url);
    // if (enabled) {
    //   document.body.style.border = '1px solid red'
    //   console.log("Enabling Redirects", enabled, url);
    // } else {
    //   document.body.style.border = '1px solid green'
    //   console.log("Disabling Redirects", enabled, url);
    // }
  }
};

export default extensionNavigator;
