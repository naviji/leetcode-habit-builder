import { setRedirectRule, unsetRedirectRule } from "./redirect.js";
import StorageEngine from "./chromeStorageEngine.js";
import { QuestionBankEnum } from "../types/questions.js";

const db = new StorageEngine();

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    console.log("Installing");
    // Setup initial state with a problem and not disabled  by default
    await db.set({
      problems: [
        {
          acRate: 58.26094394474123,
          difficulty: "Easy",
          freqBar: null,
          questionFrontendId: "704",
          isFavor: false,
          isPaidOnly: false,
          status: null,
          title: "Binary Search",
          titleSlug: "binary-search",
          topicTags: [
            {
              name: "Array",
              id: "VG9waWNUYWdOb2RlOjU=",
              slug: "array",
            },
            {
              name: "Binary Search",
              id: "VG9waWNUYWdOb2RlOjEx",
              slug: "binary-search",
            },
          ],
          hasSolution: true,
          hasVideoSolution: false,
        },
      ],
      problemSet: QuestionBankEnum.NeetCodeAll,
      problemsPerDay: 1,
      problemsSolved: 0,
      problemDifficulty: null,
      problemTopic: null,
      includePremiumProblems: false,
      snoozeInterval: 12,
      restInterval: 24,
      whitelistedUrls: "https://google.com\nhttps://leetcode.com",
      redirectOnSuccess: true,
      showDailyQuote: true,
      redirectsEnabled: true,
    });
    await setRedirectionWithWhiteListing("https://leetcode.com/problems/binary-search/");
  } else {
    console.log("Updating");
  }
});

chrome.runtime.onMessage.addListener(async (message) => {
  console.log("Message received:", message);
  if (message.action === "stopRedirect") {
    await db.set({
      redirectsEnabled: false,
    });
    await unsetRedirectRule();
  } else if (message.action === "startRedirect") {
    await db.set({
      redirectsEnabled: true,
    });
    const { url }: { url : string | undefined } = message.data;
    if (!url) {
      console.log("Error: No url provided, ignoring request to start redirection");
      return;
    }
    await setRedirectionWithWhiteListing(url);
  } else {
    // Handle other messages or errors if necessary
    console.log("Unknown message received:", message);
  }
});

async function setRedirectionWithWhiteListing(url: string) {
  const whiteListedUrls = (await db.get()).whitelistedUrls?.split("\n") || [];
  await setRedirectRule(url, whiteListedUrls);
}

