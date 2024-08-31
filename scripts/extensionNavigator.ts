import { Navigator } from "../types/navigator.js";

const extensionNavigator: Navigator = {
  openTab: (url: string) => {
    chrome.tabs.create({ url: url });
  }
};

export default extensionNavigator;
