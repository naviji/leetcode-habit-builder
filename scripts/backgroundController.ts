import { Controller } from "../types/controller.js";
import { setRedirectRule, unsetRedirectRule } from "./redirect.js";

class BackgroundController implements Controller {
    async startRedirect({ url, redirectOnSuccess, whiteListedUrls }: { url: string, redirectOnSuccess: boolean, whiteListedUrls: string[] }) {
        setRedirectRule(url, whiteListedUrls, redirectOnSuccess);
    }

    async stopRedirect({ redirectOnSuccess }: { redirectOnSuccess: boolean }) {
        unsetRedirectRule(redirectOnSuccess);
    }
}

export default BackgroundController