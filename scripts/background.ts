import StorageEngine from "./chromeStorageEngine.js";
import BackgroundController from "./backgroundController.js";
import { Application } from "./app.js";

const ctrl = new BackgroundController();
const app = new Application(new StorageEngine(), ctrl);


chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    console.log("Installing");
    await app.init(true)
  } else {
    console.log("Updating");
    await app.init(false)
  }
});


chrome.runtime.onMessage.addListener(async (message) => {
  console.log("Message received:", message);
  if (message.action === "stopRedirect") {
    const { redirectOnSuccess } = message.data;
    await ctrl.stopRedirect({ redirectOnSuccess });
  } else if (message.action === "startRedirect") {
    const { url, redirectOnSuccess, whiteListedUrls }: { url: string, redirectOnSuccess : boolean, whiteListedUrls: string[]} = message.data;
    await ctrl.startRedirect({ url, redirectOnSuccess, whiteListedUrls });
  } else if (message.action === "problemSolved") {
    await app.markProblemSolved()
  } else {
    console.log("Unknown message received:", message);
  }
});