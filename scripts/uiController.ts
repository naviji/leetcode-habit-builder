import { Controller } from "../types/controller.js";

class UIController implements Controller {
    startRedirect({ url, redirectOnSuccess, whiteListedUrls }: { url: string, redirectOnSuccess: boolean, whiteListedUrls: string[] }) {
        chrome.runtime.sendMessage({ action: "startRedirect", data: { url, redirectOnSuccess, whiteListedUrls } });
    }

    stopRedirect({ redirectOnSuccess }: { redirectOnSuccess: boolean }) {
        chrome.runtime.sendMessage({ action: "stopRedirect", data: { redirectOnSuccess }});
    }
}

export default UIController