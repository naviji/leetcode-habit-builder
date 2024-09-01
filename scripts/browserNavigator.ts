import { Navigator } from "../types/navigator.js";

const browserNavigator: Navigator = {
  openTab: (url: string) => {
    window.open(url, "_blank");
  },
  setRedirectsEnabled: (enabled: boolean, url?: string) => {
    if (enabled) {
      document.body.style.background = 'red'
      console.log("Enabling Redirects", enabled, url);
    } else {
      document.body.style.background = 'white'
      console.log("Disabling Redirects", enabled, url);
    }
  }
};

export default browserNavigator;
