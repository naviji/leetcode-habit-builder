import { Navigator } from "../types/navigator.js";

const browserNavigator: Navigator = {
  openTab: (url: string) => {
    window.open(url, "_blank");
  }
};

export default browserNavigator;
