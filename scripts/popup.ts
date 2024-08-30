const browser = {
  openTab: (url: string) => {
    window.open(url, "_blank");
  },
};

// const browserReal = {
//   openTab: (url: string) => {
//     chrome.tabs.create({ url: url });
//   }
// }

interface MyApi {
  question: string,
  skip(): void;
  snooze(): void;
  setQuestion(question: string): void;
  enableRedirects(): void;
  disableRedirects(): void;
  getDailyQuote(): Promise<string>;
  getCurrQuestionNumber(): Promise<string>;
  getTotalQuestionCount(): Promise<string>;
  getStreakCount(): Promise<string>;
  getCompletionPercentage(): Promise<string>;
  getProblemUrl(): Promise<string>;
}

const myApi: MyApi = {
  question: "https://leetcode.com/problems/two-sum/",
  setQuestion: (question: string) => {
    myApi.question = question;
    render()
  },
  skip: () => {
    // chrome.runtime.sendMessage({ action: "skipQuestion" });
    console.log("Skipped");
  },

  snooze: () => {
    // chrome.runtime.sendMessage({ action: "snoozeQuestion" });
    console.log("Snoozed");
  },
  getDailyQuote: async () => {
    // const response = await fetch("https://zenquotes.io/api/random");
    // const data = await response.json();
    // return data[0].q;
    return "A leetcode a day keeps the doctor away";
  },
  getCurrQuestionNumber: async () => {
    // const { problem }: { problem?: Problem } = await chrome.storage.sync.get("problem");
    return "3";
  },
  getTotalQuestionCount: async () => {
    // const { problem }: { problem?: Problem } = await chrome.storage.sync.get("problem");
    return "4";
  },
  getStreakCount: async () => {
    // const { streak }: { streak?: number } = await chrome.storage.sync.get("streak");
    return "122";
  },
  getCompletionPercentage: async () => {
    const percentage = (
      (Number(await myApi.getCurrQuestionNumber()) /
        Number(await myApi.getTotalQuestionCount())) *
      100
    ).toString();
    return percentage;
  },
  getProblemUrl: async () => {
    // const { problem }: { problem?: Problem } = await chrome.storage.sync.get("problem");

    return myApi.question
  },

  enableRedirects: () => {
    console.log("Enabling Redirects");
    // chrome.runtime.sendMessage({ action: "startRedirect" });
    // chrome.runtime.sendMessage({ action: "pauseTheGrind" });
    //
  },

  disableRedirects: () => {
    console.log("Disabling Redirects");
    // chrome.runtime.sendMessage({ action: "stopRedirect" });
    // chrome.runtime.sendMessage({ action: "resumeTheGrind" });
  },
};

window.myApi = myApi;

document.addEventListener("DOMContentLoaded", () => {
  addNavigationEventHandlers();
  addSettingsEventHandlers();
  render();
});

// const disableTorture = document.getElementById(
//   "disable-torture-checkbox",
// ) as HTMLInputElement | null;
// if (disableTorture) {
//   const { disabled }: { disabled?: boolean } =
//     await chrome.storage.sync.get("disabled");
//   if (disabled) {
//     disableTorture.checked = disabled;
//   }

//   disableTorture.addEventListener("change", async function () {
//     await chrome.storage.sync.set({ disabled: !!disableTorture.checked });
//     if (disableTorture.checked) {
//       chrome.runtime.sendMessage({ action: "stopRedirect" });
//     } else {
//       chrome.runtime.sendMessage({ action: "startRedirect" });
//     }
//   });
// }

// const problemTitle = document.getElementById("question");
// if (problemTitle) {
//   const { problem }: { problem?: Problem } =
//     await chrome.storage.sync.get("problem");
//   if (problem) {
//     problemTitle.textContent = problem.text;
//   }
// }

function addSettingsEventHandlers() {
  const pauseTheGrindDiv = document.getElementById(
    "pause-the-grind",
  ) as HTMLElement;
  const pauseToggleInput = document.getElementById(
    "pause-toggle",
  ) as HTMLInputElement;

  const problemSetSelect = document.getElementById(
    "problem-set-select",
  ) as HTMLSelectElement;

  const problemsPerDayInput = document.getElementById(
    "problems-per-day-input",
  ) as HTMLInputElement;

  const problemDifficultySelect = document.getElementById(
    "problem-difficulty-select",
  ) as HTMLSelectElement;

  const problemTopicsSelect = document.getElementById(
    "problem-topics-select",
  ) as HTMLSelectElement;
  const problemTopicsTextarea = document.getElementById(
    "problem-topics-textarea",
  ) as HTMLTextAreaElement;

  const includeSolvedProblemsDiv = document.getElementById(
    "include-solved-problems",
  ) as HTMLElement;
  const includeSolvedProblemsToggle = document.getElementById(
    "include-solved-problems-toggle",
  ) as HTMLInputElement;

  const includePremiumProblemsDiv = document.getElementById(
    "include-premium-problems",
  ) as HTMLElement;
  const includePremiumProblemsToggle = document.getElementById(
    "include-premium-problems-toggle",
  ) as HTMLInputElement;

  const snoozeIntervalInput = document.getElementById(
    "snooze-interval-input",
  ) as HTMLInputElement;

  const restIntervalInput = document.getElementById(
    "rest-interval-input",
  ) as HTMLInputElement;

  const whitelistedUrlsTextarea = document.getElementById(
    "whitelisted-urls-textarea",
  ) as HTMLTextAreaElement;

  const redirectOnSuccessDiv = document.getElementById(
    "redirect-on-success",
  ) as HTMLElement;
  const redirectOnSuccessToggle = document.getElementById(
    "redirect-on-success-toggle",
  ) as HTMLInputElement;

  const showDailyQuoteDiv = document.getElementById(
    "show-daily-quote",
  ) as HTMLElement;
  const showDailyQuoteToggle = document.getElementById(
    "show-daily-quote-toggle",
  ) as HTMLInputElement;

  pauseToggleInput.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Pause toggle changed:", target.checked);
    if (target.checked) {
      myApi.enableRedirects();
    } else {
      myApi.disableRedirects();
    }
  });

  // Problem sets
  problemSetSelect.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    const problemSet = target.value as QuestionBankEnum;
    const questionsInSet = questions[problemSet];
    const randomIndex = Math.floor(Math.random() * questionsInSet.length);
    myApi.question = questionsInSet[randomIndex];
    console.log("Problem set selected:", target.value);
    console.log("Selected question:", myApi.question);
  });

  // Problems per day
  problemsPerDayInput.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Problems per day input changed:", target.value);
  });

  // Problem difficulty
  problemDifficultySelect.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    console.log("Problem difficulty selected:", target.value);
  });

  // Problem topics
  problemTopicsSelect.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    console.log("Problem topics selected:", target.value);
  });
  problemTopicsTextarea.addEventListener("input", (event) => {
    const target = event.target as HTMLTextAreaElement;
    console.log("Problem topics textarea input:", target.value);
  });

  // Include solved problems
  includeSolvedProblemsDiv.addEventListener("click", () => {
    console.log("Include solved problems clicked");
  });
  includeSolvedProblemsToggle.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Include solved problems toggle changed:", target.checked);
  });

  // Include premium problems
  includePremiumProblemsDiv.addEventListener("click", () => {
    console.log("Include premium problems clicked");
  });
  includePremiumProblemsToggle.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Include premium problems toggle changed:", target.checked);
  });

  // Snooze interval
  snoozeIntervalInput.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Snooze interval input changed:", target.value);
  });

  // Rest interval
  restIntervalInput.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Rest interval input changed:", target.value);
  });

  // Whitelisted URLs
  whitelistedUrlsTextarea.addEventListener("input", (event) => {
    const target = event.target as HTMLTextAreaElement;
    console.log("Whitelisted URLs textarea input:", target.value);
  });

  // Redirect on success
  redirectOnSuccessDiv.addEventListener("click", () => {
    console.log("Redirect on success clicked");
  });
  redirectOnSuccessToggle.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Redirect on success toggle changed:", target.checked);
  });

  // Show daily quote
  showDailyQuoteDiv.addEventListener("click", () => {
    console.log("Show daily quote clicked");
  });
  showDailyQuoteToggle.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    console.log("Show daily quote toggle changed:", target.checked);
  });
}

function addNavigationEventHandlers() {
  const toggleSettings = () => {
    const settingsPage = document.querySelector(".page__settings");
    if (settingsPage) {
      // Toggle the class
      settingsPage.classList.toggle("isOpen");

      // Save the state in localStorage
      const isOpen = settingsPage.classList.contains("isOpen");
      localStorage.setItem("settingsPageOpen", isOpen.toString());

      // Settings page has been close; so render the home UI again to show changes
      if (!isOpen) {
        render();
      }
    }
  };

  const settingsButton = document.querySelector(".header__icon_right");
  settingsButton?.addEventListener("click", toggleSettings);

  const backButton = document.querySelector(".header__icon_left");
  backButton?.addEventListener("click", toggleSettings);

  const questionLink = document.querySelector(".question__link");
  questionLink?.addEventListener("click", async () => {
    const problemUrl = await myApi.getProblemUrl();
    browser.openTab(problemUrl);
  });

  const skipButton = document.querySelector(".buttons__button--left");
  skipButton?.addEventListener("click", myApi.skip);

  const snoozeButton = document.querySelector(".buttons__button--right");
  snoozeButton?.addEventListener("click", myApi.snooze);
}

async function render(): Promise<void> {
  console.log("Calling Render");
  // Retrieve the last visible page
  const settingsPage = document.querySelector(".page__settings");
  if (settingsPage) {
    // Retrieve the state from localStorage
    const isOpen = localStorage.getItem("settingsPageOpen") === "true";

    // Set the initial state based on localStorage
    if (isOpen) {
      settingsPage.classList.add("isOpen");
    } else {
      settingsPage.classList.remove("isOpen");
    }
  }

  // Set the daily quote
  const quoted: HTMLDivElement | null = document.querySelector(".quoted");
  if (quoted) {
    quoted.innerText = await myApi.getDailyQuote();
  }

  // Set current question number
  const questionCount: HTMLSpanElement | null = document.querySelector(
    ".question__count-current",
  );
  if (questionCount) {
    questionCount.innerText = await myApi.getCurrQuestionNumber();
  }

  // Set total question count
  const questionTotal: HTMLSpanElement | null = document.querySelector(
    ".question__count-total",
  );
  if (questionTotal) {
    questionTotal.innerText = await myApi.getTotalQuestionCount();
  }

  // Set streak count
  const streakCount: HTMLSpanElement | null =
    document.querySelector(".streak__count");
  if (streakCount) {
    streakCount.innerText = await myApi.getStreakCount();
  }

  // Set progress bar width
  const progressBar: HTMLDivElement | null = document.querySelector(
    ".progressBar__progress",
  );
  if (progressBar) {
    progressBar.style.width = `${await myApi.getCompletionPercentage()}%`;
  }
}

enum QuestionBankEnum {
  NeetCodeAll = "neetcodeAll",
  NeetCode150 = "neetcode150",
  Blind75 = "blind75",
  StriverSDESheet = "striverSDESheet",
  StriverAtoZ = "striverAtoZ",
  Striver79 = "striver79",
}
interface QuestionBank {
  [QuestionBankEnum.NeetCodeAll]: string[],
  [QuestionBankEnum.NeetCode150]: string[],
  [QuestionBankEnum.Blind75]: string[],
  [QuestionBankEnum.StriverSDESheet]: string[],
  [QuestionBankEnum.StriverAtoZ]: string[],
  [QuestionBankEnum.Striver79]: string[],
}

const questions = {
  neetcodeAll: [
    "https://leetcode.com/problems/contains-duplicate/",
    "https://leetcode.com/problems/valid-anagram/",
    "https://leetcode.com/problems/concatenation-of-array/",
    "https://leetcode.com/problems/replace-elements-with-greatest-element-on-right-side/",
    "https://leetcode.com/problems/is-subsequence/",
    "https://leetcode.com/problems/length-of-last-word/",
    "https://leetcode.com/problems/two-sum/",
    "https://leetcode.com/problems/longest-common-prefix/",
    "https://leetcode.com/problems/group-anagrams/",
    "https://leetcode.com/problems/pascals-triangle/",
    "https://leetcode.com/problems/remove-element/",
    "https://leetcode.com/problems/unique-email-addresses/",
    "https://leetcode.com/problems/isomorphic-strings/",
    "https://leetcode.com/problems/can-place-flowers/",
    "https://leetcode.com/problems/majority-element/",
    "https://leetcode.com/problems/next-greater-element-i/",
    "https://leetcode.com/problems/find-pivot-index/",
    "https://leetcode.com/problems/range-sum-query-immutable/",
    "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/",
    "https://leetcode.com/problems/maximum-number-of-balloons/",
    "https://leetcode.com/problems/word-pattern/",
    "https://leetcode.com/problems/design-hashset/",
    "https://leetcode.com/problems/design-hashmap/",
    "https://leetcode.com/problems/monotonic-array",
    "https://leetcode.com/problems/number-of-good-pairs",
    "https://leetcode.com/problems/pascals-triangle-ii",
    "https://leetcode.com/problems/find-words-that-can-be-formed-by-characters",
    "https://leetcode.com/problems/largest-3-same-digit-number-in-string",
    "https://leetcode.com/problems/destination-city",
    "https://leetcode.com/problems/maximum-product-difference-between-two-pairs",
    "https://leetcode.com/problems/maximum-score-after-splitting-a-string",
    "https://leetcode.com/problems/path-crossing",
    "https://leetcode.com/problems/minimum-changes-to-make-alternating-binary-string",
    "https://leetcode.com/problems/redistribute-characters-to-make-all-strings-equal",
    "https://leetcode.com/problems/largest-substring-between-two-equal-characters",
    "https://leetcode.com/problems/set-mismatch",
    "https://leetcode.com/problems/first-unique-character-in-a-string",
    "https://leetcode.com/problems/intersection-of-two-arrays",
    "https://leetcode.com/problems/number-of-students-unable-to-eat-lunch/",
    "https://leetcode.com/problems/time-needed-to-buy-tickets",
    "https://leetcode.com/problems/special-array-with-x-elements-greater-than-or-equal-x",
    "https://leetcode.com/problems/sort-an-array/",
    "https://leetcode.com/problems/top-k-frequent-elements/",
    "https://leetcode.com/problems/encode-and-decode-strings/",
    "https://leetcode.com/problems/product-of-array-except-self/",
    "https://leetcode.com/problems/valid-sudoku/",
    "https://leetcode.com/problems/longest-consecutive-sequence/",
    "https://leetcode.com/problems/sort-colors/",
    "https://leetcode.com/problems/encode-and-decode-tinyurl/",
    "https://leetcode.com/problems/brick-wall/",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
    "https://leetcode.com/problems/subarray-sum-equals-k/",
    "https://leetcode.com/problems/unique-length-3-palindromic-subsequences/",
    "https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced/",
    "https://leetcode.com/problems/number-of-pairs-of-interchangeable-rectangles/",
    "https://leetcode.com/problems/maximum-product-of-the-length-of-two-palindromic-subsequences/",
    "https://leetcode.com/problems/grid-game/",
    "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
    "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",
    "https://leetcode.com/problems/wiggle-sort/",
    "https://leetcode.com/problems/largest-number/",
    "https://leetcode.com/problems/continuous-subarray-sum/",
    "https://leetcode.com/problems/push-dominoes/",
    "https://leetcode.com/problems/repeated-dna-sequences/",
    "https://leetcode.com/problems/insert-delete-getrandom-o1/",
    "https://leetcode.com/problems/check-if-a-string-contains-all-binary-codes-of-size-k/",
    "https://leetcode.com/problems/range-sum-query-2d-immutable/",
    "https://leetcode.com/problems/non-decreasing-array/",
    "https://leetcode.com/problems/first-missing-positive/",
    "https://leetcode.com/problems/sign-of-the-product-of-an-array/",
    "https://leetcode.com/problems/find-the-difference-of-two-arrays/",
    "https://leetcode.com/problems/design-parking-system/",
    "https://leetcode.com/problems/number-of-zero-filled-subarrays/",
    "https://leetcode.com/problems/optimal-partition-of-string/",
    "https://leetcode.com/problems/design-underground-system/",
    "https://leetcode.com/problems/minimum-penalty-for-a-shop/",
    "https://leetcode.com/problems/champagne-tower",
    "https://leetcode.com/problems/majority-element-ii",
    "https://leetcode.com/problems/sum-of-absolute-differences-in-a-sorted-array",
    "https://leetcode.com/problems/design-a-food-rating-system",
    "https://leetcode.com/problems/convert-an-array-into-a-2d-array-with-conditions",
    "https://leetcode.com/problems/minimum-number-of-operations-to-make-array-empty",
    "https://leetcode.com/problems/divide-array-into-arrays-with-max-difference",
    "https://leetcode.com/problems/sequential-digits",
    "https://leetcode.com/problems/sort-characters-by-frequency",
    "https://leetcode.com/problems/find-polygon-with-the-largest-perimeter",
    "https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses",
    "https://leetcode.com/problems/contiguous-array",
    "https://leetcode.com/problems/find-all-duplicates-in-an-array",
    "https://leetcode.com/problems/text-justification/",
    "https://leetcode.com/problems/naming-a-company/",
    "https://leetcode.com/problems/number-of-submatrices-that-sum-to-target",
    "https://leetcode.com/problems/valid-palindrome/",
    "https://leetcode.com/problems/valid-palindrome-ii/",
    "https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores/",
    "https://leetcode.com/problems/merge-strings-alternately/",
    "https://leetcode.com/problems/reverse-string/",
    "https://leetcode.com/problems/merge-sorted-array/",
    "https://leetcode.com/problems/move-zeroes/",
    "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
    "https://leetcode.com/problems/assign-cookies",
    "https://leetcode.com/problems/find-first-palindromic-string-in-the-array",
    "https://leetcode.com/problems/sort-array-by-parity",
    "https://leetcode.com/problems/reverse-words-in-a-string-iii",
    "https://leetcode.com/problems/backspace-string-compare",
    "https://leetcode.com/problems/check-if-two-string-arrays-are-equivalent",
    "https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/",
    "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    "https://leetcode.com/problems/3sum/",
    "https://leetcode.com/problems/4sum/",
    "https://leetcode.com/problems/container-with-most-water/",
    "https://leetcode.com/problems/number-of-subsequences-that-satisfy-the-given-sum-condition/",
    "https://leetcode.com/problems/rotate-array/",
    "https://leetcode.com/problems/array-with-elements-not-equal-to-average-of-neighbors/",
    "https://leetcode.com/problems/boats-to-save-people/",
    "https://leetcode.com/problems/k-th-symbol-in-grammar",
    "https://leetcode.com/problems/minimum-time-to-make-rope-colorful",
    "https://leetcode.com/problems/rearrange-array-elements-by-sign",
    "https://leetcode.com/problems/bag-of-tokens",
    "https://leetcode.com/problems/minimum-length-of-string-after-deleting-similar-ends",
    "https://leetcode.com/problems/trapping-rain-water/",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "https://leetcode.com/problems/contains-duplicate-ii/",
    "https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/",
    "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "https://leetcode.com/problems/longest-repeating-character-replacement/",
    "https://leetcode.com/problems/permutation-in-string/",
    "https://leetcode.com/problems/frequency-of-the-most-frequent-element/",
    "https://leetcode.com/problems/fruit-into-baskets/",
    "https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/",
    "https://leetcode.com/problems/minimum-number-of-flips-to-make-the-binary-string-alternating/",
    "https://leetcode.com/problems/minimum-size-subarray-sum/",
    "https://leetcode.com/problems/find-k-closest-elements/",
    "https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/",
    "https://leetcode.com/problems/get-equal-substrings-within-budget",
    "https://leetcode.com/problems/binary-subarrays-with-sum",
    "https://leetcode.com/problems/subarray-product-less-than-k",
    "https://leetcode.com/problems/length-of-longest-subarray-with-at-most-k-frequency",
    "https://leetcode.com/problems/count-subarrays-where-max-element-appears-at-least-k-times",
    "https://leetcode.com/problems/minimum-window-substring/",
    "https://leetcode.com/problems/sliding-window-maximum/",
    "https://leetcode.com/problems/subarrays-with-k-different-integers",
    "https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous",
    "https://leetcode.com/problems/valid-parentheses/",
    "https://leetcode.com/problems/baseball-game/",
    "https://leetcode.com/problems/implement-stack-using-queues/",
    "https://leetcode.com/problems/implement-queue-using-stacks",
    "https://leetcode.com/problems/make-the-string-great",
    "https://leetcode.com/problems/min-stack/",
    "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    "https://leetcode.com/problems/removing-stars-from-a-string/",
    "https://leetcode.com/problems/validate-stack-sequences/",
    "https://leetcode.com/problems/generate-parentheses/",
    "https://leetcode.com/problems/asteroid-collision/",
    "https://leetcode.com/problems/daily-temperatures/",
    "https://leetcode.com/problems/online-stock-span/",
    "https://leetcode.com/problems/car-fleet/",
    "https://leetcode.com/problems/simplify-path/",
    "https://leetcode.com/problems/decode-string/",
    "https://leetcode.com/problems/remove-k-digits/",
    "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/",
    "https://leetcode.com/problems/132-pattern/",
    "https://leetcode.com/problems/flatten-nested-list-iterator",
    "https://leetcode.com/problems/sum-of-subarray-minimums",
    "https://leetcode.com/problems/maximum-frequency-stack/",
    "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    "https://leetcode.com/problems/binary-search/",
    "https://leetcode.com/problems/search-insert-position/",
    "https://leetcode.com/problems/guess-number-higher-or-lower/",
    "https://leetcode.com/problems/arranging-coins/",
    "https://leetcode.com/problems/squares-of-a-sorted-array/",
    "https://leetcode.com/problems/valid-perfect-square/",
    "https://leetcode.com/problems/sqrtx/",
    "https://leetcode.com/problems/single-element-in-a-sorted-array/",
    "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
    "https://leetcode.com/problems/find-peak-element/",
    "https://leetcode.com/problems/successful-pairs-of-spells-and-potions/",
    "https://leetcode.com/problems/search-a-2d-matrix/",
    "https://leetcode.com/problems/koko-eating-bananas/",
    "https://leetcode.com/problems/minimize-the-maximum-difference-of-pairs/",
    "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",
    "https://leetcode.com/problems/time-based-key-value-store/",
    "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
    "https://leetcode.com/problems/maximum-number-of-removable-characters/",
    "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/",
    "https://leetcode.com/problems/search-suggestions-system/",
    "https://leetcode.com/problems/split-array-largest-sum/",
    "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    "https://leetcode.com/problems/find-in-mountain-array",
    "https://leetcode.com/problems/reverse-linked-list/",
    "https://leetcode.com/problems/merge-two-sorted-lists/",
    "https://leetcode.com/problems/palindrome-linked-list/",
    "https://leetcode.com/problems/remove-linked-list-elements/",
    "https://leetcode.com/problems/remove-duplicates-from-sorted-list/",
    "https://leetcode.com/problems/middle-of-the-linked-list/",
    "https://leetcode.com/problems/intersection-of-two-linked-lists/",
    "https://leetcode.com/problems/merge-in-between-linked-lists",
    "https://leetcode.com/problems/remove-nodes-from-linked-list",
    "https://leetcode.com/problems/reorder-list/",
    "https://leetcode.com/problems/maximum-twin-sum-of-a-linked-list/",
    "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    "https://leetcode.com/problems/swapping-nodes-in-a-linked-list/",
    "https://leetcode.com/problems/lfu-cache/",
    "https://leetcode.com/problems/copy-list-with-random-pointer/",
    "https://leetcode.com/problems/design-linked-list/",
    "https://leetcode.com/problems/design-browser-history/",
    "https://leetcode.com/problems/add-two-numbers/",
    "https://leetcode.com/problems/linked-list-cycle/",
    "https://leetcode.com/problems/find-the-duplicate-number/",
    "https://leetcode.com/problems/swap-nodes-in-pairs/",
    "https://leetcode.com/problems/sort-list/",
    "https://leetcode.com/problems/partition-list/",
    "https://leetcode.com/problems/rotate-list/",
    "https://leetcode.com/problems/reverse-linked-list-ii/",
    "https://leetcode.com/problems/design-circular-queue/",
    "https://leetcode.com/problems/insertion-sort-list/",
    "https://leetcode.com/problems/split-linked-list-in-parts/",
    "https://leetcode.com/problems/lru-cache/",
    "https://leetcode.com/problems/merge-k-sorted-lists/",
    "https://leetcode.com/problems/reverse-nodes-in-k-group/",
    "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    "https://leetcode.com/problems/binary-tree-preorder-traversal/",
    "https://leetcode.com/problems/binary-tree-postorder-traversal/",
    "https://leetcode.com/problems/invert-binary-tree/",
    "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    "https://leetcode.com/problems/diameter-of-binary-tree/",
    "https://leetcode.com/problems/balanced-binary-tree/",
    "https://leetcode.com/problems/same-tree/",
    "https://leetcode.com/problems/subtree-of-another-tree/",
    "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/",
    "https://leetcode.com/problems/merge-two-binary-trees/",
    "https://leetcode.com/problems/path-sum/",
    "https://leetcode.com/problems/range-sum-of-bst",
    "https://leetcode.com/problems/leaf-similar-trees",
    "https://leetcode.com/problems/evaluate-boolean-binary-tree",
    "https://leetcode.com/problems/construct-string-from-binary-tree/",
    "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
    "https://leetcode.com/problems/delete-node-in-a-bst/",
    "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    "https://leetcode.com/problems/binary-tree-right-side-view/",
    "https://leetcode.com/problems/minimum-distance-between-bst-nodes/",
    "https://leetcode.com/problems/symmetric-tree/",
    "https://leetcode.com/problems/minimum-time-to-collect-all-apples-in-a-tree/",
    "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
    "https://leetcode.com/problems/construct-quad-tree/",
    "https://leetcode.com/problems/find-duplicate-subtrees/",
    "https://leetcode.com/problems/check-completeness-of-a-binary-tree/",
    "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",
    "https://leetcode.com/problems/maximum-width-of-binary-tree/",
    "https://leetcode.com/problems/time-needed-to-inform-all-employees/",
    "https://leetcode.com/problems/count-good-nodes-in-binary-tree/",
    "https://leetcode.com/problems/validate-binary-search-tree/",
    "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    "https://leetcode.com/problems/unique-binary-search-trees/",
    "https://leetcode.com/problems/unique-binary-search-trees-ii/",
    "https://leetcode.com/problems/sum-root-to-leaf-numbers/",
    "https://leetcode.com/problems/house-robber-iii/",
    "https://leetcode.com/problems/flip-equivalent-binary-trees/",
    "https://leetcode.com/problems/operations-on-tree/",
    "https://leetcode.com/problems/all-possible-full-binary-trees/",
    "https://leetcode.com/problems/find-bottom-left-tree-value/",
    "https://leetcode.com/problems/trim-a-binary-search-tree/",
    "https://leetcode.com/problems/binary-search-tree-iterator/",
    "https://leetcode.com/problems/validate-binary-tree-nodes",
    "https://leetcode.com/problems/find-largest-value-in-each-tree-row",
    "https://leetcode.com/problems/pseudo-palindromic-paths-in-a-binary-tree",
    "https://leetcode.com/problems/even-odd-tree",
    "https://leetcode.com/problems/smallest-string-starting-from-leaf",
    "https://leetcode.com/problems/delete-leaves-with-a-given-value",
    "https://leetcode.com/problems/distribute-coins-in-binary-tree",
    "https://leetcode.com/problems/convert-bst-to-greater-tree/",
    "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
    "https://leetcode.com/problems/last-stone-weight/",
    "https://leetcode.com/problems/k-closest-points-to-origin/",
    "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    "https://leetcode.com/problems/task-scheduler/",
    "https://leetcode.com/problems/design-twitter/",
    "https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals",
    "https://leetcode.com/problems/furthest-building-you-can-reach",
    "https://leetcode.com/problems/minimize-deviation-in-array/",
    "https://leetcode.com/problems/maximum-subsequence-score/",
    "https://leetcode.com/problems/single-threaded-cpu/",
    "https://leetcode.com/problems/seat-reservation-manager/",
    "https://leetcode.com/problems/process-tasks-using-servers/",
    "https://leetcode.com/problems/find-the-kth-largest-integer-in-the-array/",
    "https://leetcode.com/problems/reorganize-string/",
    "https://leetcode.com/problems/longest-happy-string/",
    "https://leetcode.com/problems/car-pooling/",
    "https://leetcode.com/problems/find-median-from-data-stream/",
    "https://leetcode.com/problems/maximum-performance-of-a-team/",
    "https://leetcode.com/problems/ipo/",
    "https://leetcode.com/problems/minimum-cost-to-hire-k-workers",
    "https://leetcode.com/problems/number-of-flowers-in-full-bloom",
    "https://leetcode.com/problems/constrained-subsequence-sum",
    "https://leetcode.com/problems/sum-of-all-subset-xor-totals",
    "https://leetcode.com/problems/subsets/",
    "https://leetcode.com/problems/combination-sum/",
    "https://leetcode.com/problems/combinations/",
    "https://leetcode.com/problems/permutations/",
    "https://leetcode.com/problems/subsets-ii/",
    "https://leetcode.com/problems/combination-sum-ii/",
    "https://leetcode.com/problems/permutations-ii/",
    "https://leetcode.com/problems/word-search/",
    "https://leetcode.com/problems/palindrome-partitioning/",
    "https://leetcode.com/problems/restore-ip-addresses/",
    "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
    "https://leetcode.com/problems/matchsticks-to-square/",
    "https://leetcode.com/problems/splitting-a-string-into-descending-consecutive-values/",
    "https://leetcode.com/problems/find-unique-binary-string/",
    "https://leetcode.com/problems/maximum-length-of-a-concatenated-string-with-unique-characters/",
    "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/",
    "https://leetcode.com/problems/the-number-of-beautiful-subsets",
    "https://leetcode.com/problems/n-queens/",
    "https://leetcode.com/problems/n-queens-ii/",
    "https://leetcode.com/problems/maximum-score-words-formed-by-letters",
    "https://leetcode.com/problems/word-break-ii",
    "https://leetcode.com/problems/implement-trie-prefix-tree/",
    "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
    "https://leetcode.com/problems/extra-characters-in-a-string/",
    "https://leetcode.com/problems/word-search-ii/",
    "https://leetcode.com/problems/island-perimeter/",
    "https://leetcode.com/problems/verifying-an-alien-dictionary/",
    "https://leetcode.com/problems/find-the-town-judge",
    "https://leetcode.com/problems/number-of-islands/",
    "https://leetcode.com/problems/max-area-of-island/",
    "https://leetcode.com/problems/clone-graph/",
    "https://leetcode.com/problems/walls-and-gates/",
    "https://leetcode.com/problems/rotting-oranges/",
    "https://leetcode.com/problems/count-sub-islands/",
    "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    "https://leetcode.com/problems/surrounded-regions/",
    "https://leetcode.com/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero/",
    "https://leetcode.com/problems/snakes-and-ladders/",
    "https://leetcode.com/problems/open-the-lock/",
    "https://leetcode.com/problems/find-eventual-safe-states/",
    "https://leetcode.com/problems/course-schedule/",
    "https://leetcode.com/problems/course-schedule-ii/",
    "https://leetcode.com/problems/graph-valid-tree/",
    "https://leetcode.com/problems/course-schedule-iv/",
    "https://leetcode.com/problems/check-if-move-is-legal/",
    "https://leetcode.com/problems/shortest-bridge/",
    "https://leetcode.com/problems/shortest-path-in-binary-matrix/",
    "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
    "https://leetcode.com/problems/redundant-connection/",
    "https://leetcode.com/problems/accounts-merge/",
    "https://leetcode.com/problems/find-closest-node-to-given-two-nodes/",
    "https://leetcode.com/problems/as-far-from-land-as-possible/",
    "https://leetcode.com/problems/shortest-path-with-alternating-colors/",
    "https://leetcode.com/problems/minimum-fuel-cost-to-report-to-the-capital/",
    "https://leetcode.com/problems/minimum-score-of-a-path-between-two-cities/",
    "https://leetcode.com/problems/number-of-closed-islands/",
    "https://leetcode.com/problems/number-of-enclaves/",
    "https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/",
    "https://leetcode.com/problems/is-graph-bipartite/",
    "https://leetcode.com/problems/evaluate-division/",
    "https://leetcode.com/problems/detonate-the-maximum-bombs/",
    "https://leetcode.com/problems/minimum-height-trees",
    "https://leetcode.com/problems/path-with-maximum-gold",
    "https://leetcode.com/problems/largest-color-value-in-a-directed-graph/",
    "https://leetcode.com/problems/minimum-number-of-days-to-eat-n-oranges/",
    "https://leetcode.com/problems/parallel-courses-iii",
    "https://leetcode.com/problems/find-all-people-with-secret",
    "https://leetcode.com/problems/word-ladder/",
    "https://leetcode.com/problems/path-with-minimum-effort/",
    "https://leetcode.com/problems/reconstruct-itinerary/",
    "https://leetcode.com/problems/min-cost-to-connect-all-points/",
    "https://leetcode.com/problems/network-delay-time/",
    "https://leetcode.com/problems/path-with-maximum-probability/",
    "https://leetcode.com/problems/find-the-safest-path-in-a-grid",
    "https://leetcode.com/problems/swim-in-rising-water/",
    "https://leetcode.com/problems/alien-dictionary/",
    "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
    "https://leetcode.com/problems/number-of-good-paths/",
    "https://leetcode.com/problems/remove-max-number-of-edges-to-keep-graph-fully-traversable/",
    "https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/",
    "https://leetcode.com/problems/greatest-common-divisor-traversal",
    "https://leetcode.com/problems/climbing-stairs/",
    "https://leetcode.com/problems/min-cost-climbing-stairs/",
    "https://leetcode.com/problems/house-robber/",
    "https://leetcode.com/problems/house-robber-ii/",
    "https://leetcode.com/problems/longest-palindromic-substring/",
    "https://leetcode.com/problems/palindromic-substrings/",
    "https://leetcode.com/problems/decode-ways/",
    "https://leetcode.com/problems/coin-change/",
    "https://leetcode.com/problems/maximum-product-subarray/",
    "https://leetcode.com/problems/word-break/",
    "https://leetcode.com/problems/longest-increasing-subsequence/",
    "https://leetcode.com/problems/partition-equal-subset-sum/",
    "https://leetcode.com/problems/triangle/",
    "https://leetcode.com/problems/delete-and-earn/",
    "https://leetcode.com/problems/paint-house/",
    "https://leetcode.com/problems/combination-sum-iv/",
    "https://leetcode.com/problems/perfect-squares/",
    "https://leetcode.com/problems/check-if-there-is-a-valid-partition-for-the-array/",
    "https://leetcode.com/problems/maximum-subarray-min-product/",
    "https://leetcode.com/problems/minimum-cost-for-tickets/",
    "https://leetcode.com/problems/integer-break/",
    "https://leetcode.com/problems/number-of-longest-increasing-subsequence/",
    "https://leetcode.com/problems/stickers-to-spell-word/",
    "https://leetcode.com/problems/n-th-tribonacci-number/",
    "https://leetcode.com/problems/uncrossed-lines/",
    "https://leetcode.com/problems/solving-questions-with-brainpower/",
    "https://leetcode.com/problems/count-ways-to-build-good-strings/",
    "https://leetcode.com/problems/new-21-game/",
    "https://leetcode.com/problems/best-team-with-no-conflicts/",
    "https://leetcode.com/problems/longest-string-chain",
    "https://leetcode.com/problems/knight-dialer",
    "https://leetcode.com/problems/partition-array-for-maximum-sum",
    "https://leetcode.com/problems/largest-divisible-subset",
    "https://leetcode.com/problems/stone-game-iii/",
    "https://leetcode.com/problems/concatenated-words/",
    "https://leetcode.com/problems/maximize-score-after-n-operations/",
    "https://leetcode.com/problems/find-the-longest-valid-obstacle-course-at-each-position/",
    "https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options/",
    "https://leetcode.com/problems/number-of-ways-to-divide-a-long-corridor",
    "https://leetcode.com/problems/maximum-profit-in-job-scheduling",
    "https://leetcode.com/problems/student-attendance-record-ii",
    "https://leetcode.com/problems/unique-paths/",
    "https://leetcode.com/problems/unique-paths-ii/",
    "https://leetcode.com/problems/longest-common-subsequence/",
    "https://leetcode.com/problems/longest-palindromic-subsequence/",
    "https://leetcode.com/problems/last-stone-weight-ii/",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
    "https://leetcode.com/problems/coin-change-ii/",
    "https://leetcode.com/problems/target-sum/",
    "https://leetcode.com/problems/interleaving-string/",
    "https://leetcode.com/problems/stone-game/",
    "https://leetcode.com/problems/minimum-path-sum/",
    "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",
    "https://leetcode.com/problems/maximal-square/",
    "https://leetcode.com/problems/ones-and-zeroes/",
    "https://leetcode.com/problems/maximum-alternating-subsequence-sum/",
    "https://leetcode.com/problems/distinct-subsequences/",
    "https://leetcode.com/problems/edit-distance/",
    "https://leetcode.com/problems/number-of-dice-rolls-with-target-sum",
    "https://leetcode.com/problems/minimum-falling-path-sum",
    "https://leetcode.com/problems/out-of-boundary-paths",
    "https://leetcode.com/problems/longest-ideal-subsequence",
    "https://leetcode.com/problems/count-vowels-permutation/",
    "https://leetcode.com/problems/burst-balloons/",
    "https://leetcode.com/problems/number-of-ways-to-rearrange-sticks-with-k-sticks-visible/",
    "https://leetcode.com/problems/regular-expression-matching/",
    "https://leetcode.com/problems/stone-game-ii/",
    "https://leetcode.com/problems/flip-string-to-monotone-increasing/",
    "https://leetcode.com/problems/maximum-value-of-k-coins-from-piles/",
    "https://leetcode.com/problems/number-of-music-playlists/",
    "https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/",
    "https://leetcode.com/problems/profitable-schemes/",
    "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/",
    "https://leetcode.com/problems/painting-the-walls",
    "https://leetcode.com/problems/number-of-ways-to-stay-in-the-same-place-after-some-steps",
    "https://leetcode.com/problems/string-compression-ii",
    "https://leetcode.com/problems/minimum-difficulty-of-a-job-schedule",
    "https://leetcode.com/problems/arithmetic-slices-ii-subsequence",
    "https://leetcode.com/problems/k-inverse-pairs-array",
    "https://leetcode.com/problems/cherry-pickup-ii",
    "https://leetcode.com/problems/minimum-falling-path-sum-ii",
    "https://leetcode.com/problems/freedom-trail",
    "https://leetcode.com/problems/buy-two-chocolates",
    "https://leetcode.com/problems/maximum-odd-binary-number",
    "https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses",
    "https://leetcode.com/problems/maximum-subarray/",
    "https://leetcode.com/problems/maximum-sum-circular-subarray/",
    "https://leetcode.com/problems/longest-turbulent-subarray/",
    "https://leetcode.com/problems/jump-game/",
    "https://leetcode.com/problems/jump-game-ii/",
    "https://leetcode.com/problems/jump-game-vii/",
    "https://leetcode.com/problems/gas-station/",
    "https://leetcode.com/problems/hand-of-straights/",
    "https://leetcode.com/problems/minimize-maximum-of-array/",
    "https://leetcode.com/problems/dota2-senate/",
    "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/",
    "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/",
    "https://leetcode.com/problems/partition-labels/",
    "https://leetcode.com/problems/valid-parenthesis-string/",
    "https://leetcode.com/problems/eliminate-maximum-number-of-monsters/",
    "https://leetcode.com/problems/two-city-scheduling/",
    "https://leetcode.com/problems/maximum-length-of-pair-chain/",
    "https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique/",
    "https://leetcode.com/problems/candy/",
    "https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color",
    "https://leetcode.com/problems/maximum-element-after-decreasing-and-rearranging",
    "https://leetcode.com/problems/number-of-laser-beams-in-a-bank",
    "https://leetcode.com/problems/reveal-cards-in-increasing-order",
    "https://leetcode.com/problems/score-after-flipping-matrix",
    "https://leetcode.com/problems/maximum-score-of-a-good-subarray",
    "https://leetcode.com/problems/find-the-maximum-sum-of-node-values",
    "https://leetcode.com/problems/insert-interval/",
    "https://leetcode.com/problems/merge-intervals/",
    "https://leetcode.com/problems/non-overlapping-intervals/",
    "https://leetcode.com/problems/meeting-rooms/",
    "https://leetcode.com/problems/meeting-rooms-ii/",
    "https://leetcode.com/problems/remove-covered-intervals/",
    "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons",
    "https://leetcode.com/problems/minimum-interval-to-include-each-query/",
    "https://leetcode.com/problems/data-stream-as-disjoint-intervals/",
    "https://leetcode.com/problems/meeting-rooms-iii",
    "https://leetcode.com/problems/excel-sheet-column-title/",
    "https://leetcode.com/problems/greatest-common-divisor-of-strings/",
    "https://leetcode.com/problems/count-odd-numbers-in-an-interval-range/",
    "https://leetcode.com/problems/matrix-diagonal-sum/",
    "https://leetcode.com/problems/calculate-money-in-leetcode-bank",
    "https://leetcode.com/problems/largest-odd-number-in-string",
    "https://leetcode.com/problems/transpose-matrix",
    "https://leetcode.com/problems/image-smoother",
    "https://leetcode.com/problems/count-of-matches-in-tournament",
    "https://leetcode.com/problems/largest-local-values-in-a-matrix",
    "https://leetcode.com/problems/power-of-four",
    "https://leetcode.com/problems/max-points-on-a-line/",
    "https://leetcode.com/problems/rotate-image/",
    "https://leetcode.com/problems/spiral-matrix/",
    "https://leetcode.com/problems/spiral-matrix-ii/",
    "https://leetcode.com/problems/set-matrix-zeroes/",
    "https://leetcode.com/problems/happy-number/",
    "https://leetcode.com/problems/plus-one/",
    "https://leetcode.com/problems/palindrome-number/",
    "https://leetcode.com/problems/ugly-number/",
    "https://leetcode.com/problems/shift-2d-grid/",
    "https://leetcode.com/problems/roman-to-integer/",
    "https://leetcode.com/problems/integer-to-roman/",
    "https://leetcode.com/problems/powx-n/",
    "https://leetcode.com/problems/multiply-strings/",
    "https://leetcode.com/problems/detect-squares/",
    "https://leetcode.com/problems/robot-bounded-in-circle/",
    "https://leetcode.com/problems/zigzag-conversion/",
    "https://leetcode.com/problems/find-missing-observations/",
    "https://leetcode.com/problems/largest-submatrix-with-rearrangements",
    "https://leetcode.com/problems/widest-vertical-area-between-two-points-containing-no-points",
    "https://leetcode.com/problems/minimum-one-bit-operations-to-make-integers-zero",
    "https://leetcode.com/problems/single-number/",
    "https://leetcode.com/problems/single-number-iii/",
    "https://leetcode.com/problems/number-of-1-bits/",
    "https://leetcode.com/problems/counting-bits/",
    "https://leetcode.com/problems/reverse-bits/",
    "https://leetcode.com/problems/missing-number/",
    "https://leetcode.com/problems/shuffle-the-array/",
    "https://leetcode.com/problems/add-to-array-form-of-integer/",
    "https://leetcode.com/problems/find-the-difference",
    "https://leetcode.com/problems/power-of-two",
    "https://leetcode.com/problems/sum-of-two-integers/",
    "https://leetcode.com/problems/reverse-integer/",
    "https://leetcode.com/problems/bitwise-and-of-numbers-range",
    "https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor",
    "https://leetcode.com/problems/add-binary/",
    "https://leetcode.com/problems/create-hello-world-function/",
    "https://leetcode.com/problems/counter/",
    "https://leetcode.com/problems/counter-ii/",
    "https://leetcode.com/problems/apply-transform-over-each-element-in-array/",
    "https://leetcode.com/problems/filter-elements-from-array/",
    "https://leetcode.com/problems/array-reduce-transformation/",
    "https://leetcode.com/problems/function-composition/",
    "https://leetcode.com/problems/allow-one-function-call/",
    "https://leetcode.com/problems/memoize/",
    "https://leetcode.com/problems/curry/",
    "https://leetcode.com/problems/sleep/",
    "https://leetcode.com/problems/promise-time-limit/",
    "https://leetcode.com/problems/promise-pool/",
    "https://leetcode.com/problems/cache-with-time-limit/",
    "https://leetcode.com/problems/debounce/",
    "https://leetcode.com/problems/throttle/",
    "https://leetcode.com/problems/json-deep-equal/",
    "https://leetcode.com/problems/convert-object-to-json-string/",
    "https://leetcode.com/problems/array-of-objects-to-matrix/",
    "https://leetcode.com/problems/differences-between-two-objects/",
    "https://leetcode.com/problems/chunk-array/",
    "https://leetcode.com/problems/flatten-deeply-nested-array/",
    "https://leetcode.com/problems/array-prototype-last/",
    "https://leetcode.com/problems/group-by/",
    "https://leetcode.com/problems/check-if-object-instance-of-class/",
    "https://leetcode.com/problems/call-function-with-custom-context/",
    "https://leetcode.com/problems/event-emitter/",
    "https://leetcode.com/problems/array-wrapper/",
    "https://leetcode.com/problems/generate-fibonacci-sequence/",
    "https://leetcode.com/problems/nested-array-generator/",
  ],
  neetcode150: [
    "https://leetcode.com/problems/contains-duplicate/",
    "https://leetcode.com/problems/valid-anagram/",
    "https://leetcode.com/problems/two-sum/",
    "https://leetcode.com/problems/group-anagrams/",
    "https://leetcode.com/problems/top-k-frequent-elements/",
    "https://leetcode.com/problems/encode-and-decode-strings/",
    "https://leetcode.com/problems/product-of-array-except-self/",
    "https://leetcode.com/problems/valid-sudoku/",
    "https://leetcode.com/problems/longest-consecutive-sequence/",
    "https://leetcode.com/problems/valid-palindrome/",
    "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    "https://leetcode.com/problems/3sum/",
    "https://leetcode.com/problems/container-with-most-water/",
    "https://leetcode.com/problems/trapping-rain-water/",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "https://leetcode.com/problems/longest-repeating-character-replacement/",
    "https://leetcode.com/problems/permutation-in-string/",
    "https://leetcode.com/problems/minimum-window-substring/",
    "https://leetcode.com/problems/sliding-window-maximum/",
    "https://leetcode.com/problems/valid-parentheses/",
    "https://leetcode.com/problems/min-stack/",
    "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    "https://leetcode.com/problems/generate-parentheses/",
    "https://leetcode.com/problems/daily-temperatures/",
    "https://leetcode.com/problems/car-fleet/",
    "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    "https://leetcode.com/problems/binary-search/",
    "https://leetcode.com/problems/search-a-2d-matrix/",
    "https://leetcode.com/problems/koko-eating-bananas/",
    "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    "https://leetcode.com/problems/time-based-key-value-store/",
    "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    "https://leetcode.com/problems/reverse-linked-list/",
    "https://leetcode.com/problems/merge-two-sorted-lists/",
    "https://leetcode.com/problems/reorder-list/",
    "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    "https://leetcode.com/problems/copy-list-with-random-pointer/",
    "https://leetcode.com/problems/add-two-numbers/",
    "https://leetcode.com/problems/linked-list-cycle/",
    "https://leetcode.com/problems/find-the-duplicate-number/",
    "https://leetcode.com/problems/lru-cache/",
    "https://leetcode.com/problems/merge-k-sorted-lists/",
    "https://leetcode.com/problems/reverse-nodes-in-k-group/",
    "https://leetcode.com/problems/invert-binary-tree/",
    "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    "https://leetcode.com/problems/diameter-of-binary-tree/",
    "https://leetcode.com/problems/balanced-binary-tree/",
    "https://leetcode.com/problems/same-tree/",
    "https://leetcode.com/problems/subtree-of-another-tree/",
    "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    "https://leetcode.com/problems/binary-tree-right-side-view/",
    "https://leetcode.com/problems/count-good-nodes-in-binary-tree/",
    "https://leetcode.com/problems/validate-binary-search-tree/",
    "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
    "https://leetcode.com/problems/last-stone-weight/",
    "https://leetcode.com/problems/k-closest-points-to-origin/",
    "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    "https://leetcode.com/problems/task-scheduler/",
    "https://leetcode.com/problems/design-twitter/",
    "https://leetcode.com/problems/find-median-from-data-stream/",
    "https://leetcode.com/problems/subsets/",
    "https://leetcode.com/problems/combination-sum/",
    "https://leetcode.com/problems/permutations/",
    "https://leetcode.com/problems/subsets-ii/",
    "https://leetcode.com/problems/combination-sum-ii/",
    "https://leetcode.com/problems/word-search/",
    "https://leetcode.com/problems/palindrome-partitioning/",
    "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
    "https://leetcode.com/problems/n-queens/",
    "https://leetcode.com/problems/implement-trie-prefix-tree/",
    "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
    "https://leetcode.com/problems/word-search-ii/",
    "https://leetcode.com/problems/number-of-islands/",
    "https://leetcode.com/problems/max-area-of-island/",
    "https://leetcode.com/problems/clone-graph/",
    "https://leetcode.com/problems/walls-and-gates/",
    "https://leetcode.com/problems/rotting-oranges/",
    "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    "https://leetcode.com/problems/surrounded-regions/",
    "https://leetcode.com/problems/course-schedule/",
    "https://leetcode.com/problems/course-schedule-ii/",
    "https://leetcode.com/problems/graph-valid-tree/",
    "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
    "https://leetcode.com/problems/redundant-connection/",
    "https://leetcode.com/problems/word-ladder/",
    "https://leetcode.com/problems/reconstruct-itinerary/",
    "https://leetcode.com/problems/min-cost-to-connect-all-points/",
    "https://leetcode.com/problems/network-delay-time/",
    "https://leetcode.com/problems/swim-in-rising-water/",
    "https://leetcode.com/problems/alien-dictionary/",
    "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
    "https://leetcode.com/problems/climbing-stairs/",
    "https://leetcode.com/problems/min-cost-climbing-stairs/",
    "https://leetcode.com/problems/house-robber/",
    "https://leetcode.com/problems/house-robber-ii/",
    "https://leetcode.com/problems/longest-palindromic-substring/",
    "https://leetcode.com/problems/palindromic-substrings/",
    "https://leetcode.com/problems/decode-ways/",
    "https://leetcode.com/problems/coin-change/",
    "https://leetcode.com/problems/maximum-product-subarray/",
    "https://leetcode.com/problems/word-break/",
    "https://leetcode.com/problems/longest-increasing-subsequence/",
    "https://leetcode.com/problems/partition-equal-subset-sum/",
    "https://leetcode.com/problems/unique-paths/",
    "https://leetcode.com/problems/longest-common-subsequence/",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
    "https://leetcode.com/problems/coin-change-ii/",
    "https://leetcode.com/problems/target-sum/",
    "https://leetcode.com/problems/interleaving-string/",
    "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",
    "https://leetcode.com/problems/distinct-subsequences/",
    "https://leetcode.com/problems/edit-distance/",
    "https://leetcode.com/problems/burst-balloons/",
    "https://leetcode.com/problems/regular-expression-matching/",
    "https://leetcode.com/problems/maximum-subarray/",
    "https://leetcode.com/problems/jump-game/",
    "https://leetcode.com/problems/jump-game-ii/",
    "https://leetcode.com/problems/gas-station/",
    "https://leetcode.com/problems/hand-of-straights/",
    "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/",
    "https://leetcode.com/problems/partition-labels/",
    "https://leetcode.com/problems/valid-parenthesis-string/",
    "https://leetcode.com/problems/insert-interval/",
    "https://leetcode.com/problems/merge-intervals/",
    "https://leetcode.com/problems/non-overlapping-intervals/",
    "https://leetcode.com/problems/meeting-rooms/",
    "https://leetcode.com/problems/meeting-rooms-ii/",
    "https://leetcode.com/problems/minimum-interval-to-include-each-query/",
    "https://leetcode.com/problems/rotate-image/",
    "https://leetcode.com/problems/spiral-matrix/",
    "https://leetcode.com/problems/set-matrix-zeroes/",
    "https://leetcode.com/problems/happy-number/",
    "https://leetcode.com/problems/plus-one/",
    "https://leetcode.com/problems/powx-n/",
    "https://leetcode.com/problems/multiply-strings/",
    "https://leetcode.com/problems/detect-squares/",
    "https://leetcode.com/problems/single-number/",
    "https://leetcode.com/problems/number-of-1-bits/",
    "https://leetcode.com/problems/counting-bits/",
    "https://leetcode.com/problems/reverse-bits/",
    "https://leetcode.com/problems/missing-number/",
    "https://leetcode.com/problems/sum-of-two-integers/",
    "https://leetcode.com/problems/reverse-integer/",
  ],
  blind75: [
    "https://leetcode.com/problems/contains-duplicate/",
    "https://leetcode.com/problems/valid-anagram/",
    "https://leetcode.com/problems/two-sum/",
    "https://leetcode.com/problems/group-anagrams/",
    "https://leetcode.com/problems/top-k-frequent-elements/",
    "https://leetcode.com/problems/encode-and-decode-strings/",
    "https://leetcode.com/problems/product-of-array-except-self/",
    "https://leetcode.com/problems/longest-consecutive-sequence/",
    "https://leetcode.com/problems/valid-palindrome/",
    "https://leetcode.com/problems/3sum/",
    "https://leetcode.com/problems/container-with-most-water/",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "https://leetcode.com/problems/longest-repeating-character-replacement/",
    "https://leetcode.com/problems/minimum-window-substring/",
    "https://leetcode.com/problems/valid-parentheses/",
    "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    "https://leetcode.com/problems/reverse-linked-list/",
    "https://leetcode.com/problems/merge-two-sorted-lists/",
    "https://leetcode.com/problems/reorder-list/",
    "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    "https://leetcode.com/problems/linked-list-cycle/",
    "https://leetcode.com/problems/merge-k-sorted-lists/",
    "https://leetcode.com/problems/invert-binary-tree/",
    "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    "https://leetcode.com/problems/same-tree/",
    "https://leetcode.com/problems/subtree-of-another-tree/",
    "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    "https://leetcode.com/problems/validate-binary-search-tree/",
    "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    "https://leetcode.com/problems/find-median-from-data-stream/",
    "https://leetcode.com/problems/combination-sum/",
    "https://leetcode.com/problems/word-search/",
    "https://leetcode.com/problems/implement-trie-prefix-tree/",
    "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
    "https://leetcode.com/problems/word-search-ii/",
    "https://leetcode.com/problems/number-of-islands/",
    "https://leetcode.com/problems/clone-graph/",
    "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    "https://leetcode.com/problems/course-schedule/",
    "https://leetcode.com/problems/graph-valid-tree/",
    "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
    "https://leetcode.com/problems/alien-dictionary/",
    "https://leetcode.com/problems/climbing-stairs/",
    "https://leetcode.com/problems/house-robber/",
    "https://leetcode.com/problems/house-robber-ii/",
    "https://leetcode.com/problems/longest-palindromic-substring/",
    "https://leetcode.com/problems/palindromic-substrings/",
    "https://leetcode.com/problems/decode-ways/",
    "https://leetcode.com/problems/coin-change/",
    "https://leetcode.com/problems/maximum-product-subarray/",
    "https://leetcode.com/problems/word-break/",
    "https://leetcode.com/problems/longest-increasing-subsequence/",
    "https://leetcode.com/problems/unique-paths/",
    "https://leetcode.com/problems/longest-common-subsequence/",
    "https://leetcode.com/problems/maximum-subarray/",
    "https://leetcode.com/problems/jump-game/",
    "https://leetcode.com/problems/insert-interval/",
    "https://leetcode.com/problems/merge-intervals/",
    "https://leetcode.com/problems/non-overlapping-intervals/",
    "https://leetcode.com/problems/meeting-rooms/",
    "https://leetcode.com/problems/meeting-rooms-ii/",
    "https://leetcode.com/problems/rotate-image/",
    "https://leetcode.com/problems/spiral-matrix/",
    "https://leetcode.com/problems/set-matrix-zeroes/",
    "https://leetcode.com/problems/number-of-1-bits/",
    "https://leetcode.com/problems/counting-bits/",
    "https://leetcode.com/problems/reverse-bits/",
    "https://leetcode.com/problems/missing-number/",
    "https://leetcode.com/problems/sum-of-two-integers/",
  ],
  striverSDESheet: [
    "https://leetcode.com/problems/set-matrix-zeroes/",
    "https://leetcode.com/problems/pascals-triangle/",
    "https://leetcode.com/problems/next-permutation/",
    "https://leetcode.com/problems/maximum-subarray/",
    "https://leetcode.com/problems/sort-colors/",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "https://leetcode.com/problems/rotate-image/",
    "https://leetcode.com/problems/merge-intervals/",
    "https://leetcode.com/problems/merge-sorted-array/",
    "https://leetcode.com/problems/find-the-duplicate-number/",
    "https://leetcode.com/problems/search-a-2d-matrix/",
    "https://leetcode.com/problems/powx-n/",
    "https://leetcode.com/problems/majority-element/",
    "https://leetcode.com/problems/majority-element-ii/",
    "https://leetcode.com/problems/unique-paths/",
    "https://leetcode.com/problems/reverse-pairs/",
    "https://leetcode.com/problems/two-sum/",
    "https://leetcode.com/problems/4sum/",
    "https://leetcode.com/problems/longest-consecutive-sequence/",
    "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "https://leetcode.com/problems/reverse-linked-list/",
    "https://leetcode.com/problems/middle-of-the-linked-list/",
    "https://leetcode.com/problems/merge-two-sorted-lists/",
    "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    "https://leetcode.com/problems/add-two-numbers/",
    "https://leetcode.com/problems/delete-node-in-a-linked-list/",
    "https://leetcode.com/problems/intersection-of-two-linked-lists/",
    "https://leetcode.com/problems/linked-list-cycle/",
    "https://leetcode.com/problems/reverse-nodes-in-k-group/",
    "https://leetcode.com/problems/palindrome-linked-list/",
    "https://leetcode.com/problems/linked-list-cycle-ii/",
    "https://leetcode.com/problems/rotate-list/description/",
    "https://leetcode.com/problems/copy-list-with-random-pointer/",
    "https://leetcode.com/problems/3sum/",
    "https://leetcode.com/problems/trapping-rain-water/",
    "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
    "https://leetcode.com/problems/max-consecutive-ones/",
    "https://leetcode.com/problems/assign-cookies/",
    "https://leetcode.com/problems/subsets-ii/",
    "https://leetcode.com/problems/combination-sum/",
    "https://leetcode.com/problems/combination-sum-ii/",
    "https://leetcode.com/problems/palindrome-partitioning/",
    "https://leetcode.com/problems/permutation-sequence/",
    "https://leetcode.com/problems/permutations/",
    "https://leetcode.com/problems/n-queens/",
    "https://leetcode.com/problems/sudoku-solver/",
    "https://leetcode.com/problems/single-element-in-a-sorted-array/",
    "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    "https://leetcode.com/problems/find-median-from-data-stream/",
    "https://leetcode.com/problems/top-k-frequent-elements/",
    "https://leetcode.com/problems/implement-stack-using-queues/",
    "https://leetcode.com/problems/implement-queue-using-stacks/",
    "https://leetcode.com/problems/valid-parentheses/",
    "https://leetcode.com/problems/next-greater-element-i/",
    "https://leetcode.com/problems/lru-cache/",
    "https://leetcode.com/problems/lfu-cache/",
    "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    "https://leetcode.com/problems/sliding-window-maximum/",
    "https://leetcode.com/problems/min-stack/",
    "https://leetcode.com/problems/rotting-oranges/",
    "https://leetcode.com/problems/online-stock-span/",
    "https://leetcode.com/problems/reverse-words-in-a-string/",
    "https://leetcode.com/problems/longest-palindromic-substring/",
    "https://leetcode.com/problems/roman-to-integer/",
    "https://leetcode.com/problems/string-to-integer-atoi/",
    "https://leetcode.com/problems/longest-common-prefix/",
    "https://leetcode.com/problems/repeated-string-match/discuss/416144/Rabin-Karp-algorithm-C%2B%2B-implementation",
    "https://leetcode.com/problems/implement-strstr/",
    "https://leetcode.com/problems/implement-strstr/",
    "https://leetcode.com/problems/valid-anagram/",
    "https://leetcode.com/problems/count-and-say/",
    "https://leetcode.com/problems/compare-version-numbers/",
    "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    "https://leetcode.com/problems/binary-tree-preorder-traversal/",
    "https://leetcode.com/problems/binary-tree-postorder-traversal/",
    "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/",
    "https://leetcode.com/problems/maximum-width-of-binary-tree/",
    "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    "https://leetcode.com/problems/diameter-of-binary-tree/",
    "https://leetcode.com/problems/balanced-binary-tree/",
    "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
    "https://leetcode.com/problems/same-tree/",
    "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
    "https://leetcode.com/problems/boundary-of-binary-tree/",
    "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",
    "https://leetcode.com/problems/symmetric-tree/",
    "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
    "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/",
    "https://leetcode.com/problems/search-in-a-binary-search-tree/",
    "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/",
    "https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/",
    "https://leetcode.com/problems/validate-binary-search-tree/",
    "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/",
    "https://leetcode.com/problems/binary-search-tree-iterator/",
    "https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/",
    "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
    "https://leetcode.com/problems/find-median-from-data-stream/",
    "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
    "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    "https://leetcode.com/problems/flood-fill/",
    "https://leetcode.com/problems/clone-graph/",
    "https://leetcode.com/problems/course-schedule/",
    "https://leetcode.com/problems/course-schedule/",
    "https://leetcode.com/problems/course-schedule/",
    "https://leetcode.com/problems/course-schedule/",
    "https://leetcode.com/problems/number-of-islands/",
    "https://leetcode.com/problems/is-graph-bipartite/",
    "https://leetcode.com/problems/is-graph-bipartite/",
    "https://leetcode.com/problems/maximum-number-of-non-overlapping-substrings/discuss/766485/kosaraju-algorithm-on",
    "https://leetcode.com/problems/maximum-product-subarray/",
    "https://leetcode.com/problems/longest-increasing-subsequence/",
    "https://leetcode.com/problems/longest-common-subsequence/",
    "https://leetcode.com/problems/edit-distance/",
    "https://leetcode.com/problems/minimum-path-sum/",
    "https://leetcode.com/problems/coin-change/",
    "https://leetcode.com/problems/partition-equal-subset-sum/",
    "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/",
    "https://leetcode.com/problems/word-break/",
    "https://leetcode.com/problems/implement-trie-prefix-tree/",
    "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
    "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/",
  ],
  striverAtoZ: [
    "https://leetcode.com/problems/reverse-integer/",
    "https://leetcode.com/problems/palindrome-number/",
    "https://leetcode.com/problems/armstrong-number/",
    "https://leetcode.com/problems/valid-palindrome/",
    "https://leetcode.com/problems/fibonacci-number/",
    "https://leetcode.com/problems/frequency-of-the-most-frequent-element/",
    "https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/#:~:text=Input%3A%20nums%20%3D%20%5B2%2C,no%20rotation)%20to%20make%20nums.",
    "https://leetcode.com/problems/remove-duplicates-from-sorted-array/#:~:text=Input%3A%20nums%20%3D%20%5B0%2C,%2C%203%2C%20and%204%20respectively.",
    "https://leetcode.com/problems/rotate-array/",
    "https://leetcode.com/problems/rotate-array/",
    "https://leetcode.com/problems/move-zeroes/",
    "https://leetcode.com/problems/missing-number/",
    "https://leetcode.com/problems/max-consecutive-ones/",
    "https://leetcode.com/problems/single-number/",
    "https://leetcode.com/problems/two-sum/",
    "https://leetcode.com/problems/sort-colors/",
    "https://leetcode.com/problems/majority-element/",
    "https://leetcode.com/problems/maximum-subarray/",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "https://leetcode.com/problems/rearrange-array-elements-by-sign/",
    "https://leetcode.com/problems/next-permutation/",
    "https://leetcode.com/problems/longest-consecutive-sequence/solution/",
    "https://leetcode.com/problems/set-matrix-zeroes/",
    "https://leetcode.com/problems/rotate-image/",
    "https://leetcode.com/problems/spiral-matrix/",
    "https://leetcode.com/problems/subarray-sum-equals-k/",
    "https://leetcode.com/problems/pascals-triangle/",
    "https://leetcode.com/problems/majority-element-ii/",
    "https://leetcode.com/problems/3sum/",
    "https://leetcode.com/problems/4sum/",
    "https://leetcode.com/problems/merge-intervals/",
    "https://leetcode.com/problems/merge-sorted-array/",
    "https://leetcode.com/problems/reverse-pairs/",
    "https://leetcode.com/problems/maximum-product-subarray/",
    "https://leetcode.com/problems/binary-search/",
    "https://leetcode.com/problems/search-insert-position/#:~:text=Search%20Insert%20Position%20%2D%20LeetCode&text=Given%20a%20sorted%20array%20of,(log%20n)%20runtime%20complexity.",
    "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
    "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",
    "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    "https://leetcode.com/problems/single-element-in-a-sorted-array/",
    "https://leetcode.com/problems/find-peak-element/#:~:text=Find%20Peak%20Element%20%2D%20LeetCode&text=A%20peak%20element%20is%20an,to%20any%20of%20the%20peaks.",
    "https://leetcode.com/problems/koko-eating-bananas/",
    "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/",
    "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/",
    "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
    "https://leetcode.com/problems/kth-missing-positive-number/#:~:text=Given%20an%20array%20arr%20of,13%2C...%5D.",
    "https://leetcode.com/problems/split-array-largest-sum/",
    "https://leetcode.com/problems/minimize-max-distance-to-gas-station/",
    "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    "https://leetcode.com/problems/search-a-2d-matrix/",
    "https://leetcode.com/problems/search-a-2d-matrix-ii/",
    "https://leetcode.com/problems/find-a-peak-element-ii/",
    "https://leetcode.com/problems/remove-outermost-parentheses/",
    "https://leetcode.com/problems/reverse-words-in-a-string/",
    "https://leetcode.com/problems/largest-odd-number-in-string/",
    "https://leetcode.com/problems/longest-common-prefix/",
    "https://leetcode.com/problems/isomorphic-strings/",
    "https://leetcode.com/problems/rotate-string/",
    "https://leetcode.com/problems/valid-anagram/#:~:text=Given%20two%20strings%20s%20and,the%20original%20letters%20exactly%20once.&text=Constraints%3A,.length%20%3C%3D%205%20*%2010",
    "https://leetcode.com/problems/sort-characters-by-frequency/",
    "https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/",
    "https://leetcode.com/problems/roman-to-integer/",
    "https://leetcode.com/problems/string-to-integer-atoi/",
    "https://leetcode.com/problems/longest-palindromic-substring/",
    "https://leetcode.com/problems/sum-of-beauty-of-all-substrings/",
    "https://leetcode.com/problems/reverse-words-in-a-string/",
    "https://leetcode.com/problems/delete-node-in-a-linked-list/",
    "https://leetcode.com/problems/middle-of-the-linked-list/",
    "https://leetcode.com/problems/reverse-linked-list/",
    "https://leetcode.com/problems/reverse-linked-list/",
    "https://leetcode.com/problems/linked-list-cycle/",
    "https://leetcode.com/problems/linked-list-cycle-ii/",
    "https://leetcode.com/problems/palindrome-linked-list/",
    "https://leetcode.com/problems/odd-even-linked-list/",
    "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    "https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/#:~:text=You%20are%20given%20the%20head,than%20or%20equal%20to%20x%20.",
    "https://leetcode.com/problems/sort-list/",
    "https://leetcode.com/problems/intersection-of-two-linked-lists/",
    "https://leetcode.com/problems/add-two-numbers/",
    "https://leetcode.com/problems/reverse-nodes-in-k-group/",
    "https://leetcode.com/problems/rotate-list/description/",
    "https://leetcode.com/problems/copy-list-with-random-pointer/",
    "https://leetcode.com/problems/string-to-integer-atoi/",
    "https://leetcode.com/problems/powx-n/",
    "https://leetcode.com/problems/count-good-numbers/",
    "https://leetcode.com/problems/generate-parentheses/",
    "https://leetcode.com/problems/subsets/",
    "https://leetcode.com/problems/combination-sum/",
    "https://leetcode.com/problems/combination-sum-ii/",
    "https://leetcode.com/problems/subsets-ii/",
    "https://leetcode.com/problems/combination-sum-iii/",
    "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
    "https://leetcode.com/problems/palindrome-partitioning/",
    "https://leetcode.com/problems/word-search/",
    "https://leetcode.com/problems/n-queens/",
    "https://leetcode.com/problems/word-break/",
    "https://leetcode.com/problems/sudoku-solver/",
    "https://leetcode.com/problems/expression-add-operators/",
    "https://leetcode.com/problems/power-of-two/",
    "https://leetcode.com/problems/divide-two-integers/",
    "https://leetcode.com/problems/minimum-bit-flips-to-convert-number/",
    "https://leetcode.com/problems/single-number/",
    "https://leetcode.com/problems/subsets/",
    "https://leetcode.com/problems/count-primes/",
    "https://leetcode.com/problems/powx-n/",
    "https://leetcode.com/problems/implement-stack-using-queues/",
    "https://leetcode.com/problems/implement-queue-using-stacks/",
    "https://leetcode.com/problems/valid-parentheses/",
    "https://leetcode.com/problems/min-stack/",
    "https://leetcode.com/problems/next-greater-element-i/",
    "https://leetcode.com/problems/next-greater-element-ii/",
    "https://leetcode.com/problems/trapping-rain-water/",
    "https://leetcode.com/problems/sum-of-subarray-minimums/",
    "https://leetcode.com/problems/asteroid-collision/",
    "https://leetcode.com/problems/sum-of-subarray-ranges/",
    "https://leetcode.com/problems/remove-k-digits/",
    "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    "https://leetcode.com/problems/maximal-rectangle/",
    "https://leetcode.com/problems/sliding-window-maximum/",
    "https://leetcode.com/problems/online-stock-span/",
    "https://leetcode.com/problems/lru-cache/",
    "https://leetcode.com/problems/lfu-cache/",
    "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "https://leetcode.com/problems/max-consecutive-ones-iii/",
    "https://leetcode.com/problems/longest-repeating-character-replacement/",
    "https://leetcode.com/problems/binary-subarrays-with-sum/",
    "https://leetcode.com/problems/count-number-of-nice-subarrays/",
    "https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/",
    "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/",
    "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/",
    "https://leetcode.com/problems/subarrays-with-k-different-integers/",
    "https://leetcode.com/problems/minimum-window-substring/",
    "https://leetcode.com/problems/minimum-window-subsequence/",
    "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    "https://leetcode.com/problems/merge-k-sorted-lists/",
    "https://leetcode.com/problems/task-scheduler/",
    "https://leetcode.com/problems/hand-of-straights/",
    "https://leetcode.com/problems/design-twitter/",
    "https://leetcode.com/problems/kth-largest-element-in-a-stream/#:~:text=Implement%20KthLargest%20class%3A,largest%20element%20in%20the%20stream.",
    "https://leetcode.com/problems/find-median-from-data-stream/",
    "https://leetcode.com/problems/top-k-frequent-elements/",
    "https://leetcode.com/problems/assign-cookies/",
    "https://leetcode.com/problems/lemonade-change/",
    "https://leetcode.com/problems/valid-parenthesis-string/",
    "https://leetcode.com/problems/jump-game/",
    "https://leetcode.com/problems/jump-game-ii/",
    "https://leetcode.com/problems/candy/",
    "https://leetcode.com/problems/insert-interval/",
    "https://leetcode.com/problems/merge-intervals/",
    "https://leetcode.com/problems/non-overlapping-intervals/",
    "https://leetcode.com/problems/binary-tree-preorder-traversal/",
    "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    "https://leetcode.com/problems/binary-tree-postorder-traversal/",
    "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    "https://leetcode.com/problems/binary-tree-preorder-traversal/",
    "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    "https://leetcode.com/problems/binary-tree-postorder-traversal/",
    "https://leetcode.com/problems/binary-tree-postorder-traversal/",
    "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    "https://leetcode.com/problems/balanced-binary-tree/",
    "https://leetcode.com/problems/diameter-of-binary-tree/",
    "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    "https://leetcode.com/problems/same-tree/",
    "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
    "https://leetcode.com/problems/boundary-of-binary-tree/",
    "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/",
    "https://leetcode.com/problems/binary-tree-right-side-view/",
    "https://leetcode.com/problems/symmetric-tree/",
    "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
    "https://leetcode.com/problems/maximum-width-of-binary-tree/",
    "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/",
    "https://leetcode.com/problems/count-complete-tree-nodes/",
    "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",
    "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
    "https://leetcode.com/problems/search-in-a-binary-search-tree/",
    "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
    "https://leetcode.com/problems/delete-node-in-a-bst/",
    "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    "https://leetcode.com/problems/validate-binary-search-tree/",
    "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    "https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/",
    "https://leetcode.com/problems/inorder-successor-in-bst/",
    "https://leetcode.com/problems/binary-search-tree-iterator/",
    "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/",
    "https://leetcode.com/problems/recover-binary-search-tree/",
    "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
    "https://leetcode.com/problems/number-of-provinces/#:~:text=A%20province%20is%20a%20group,the%20total%20number%20of%20provinces.",
    "https://leetcode.com/problems/rotting-oranges/",
    "https://leetcode.com/problems/flood-fill/",
    "https://leetcode.com/problems/01-matrix/",
    "https://leetcode.com/problems/surrounded-regions/",
    "https://leetcode.com/problems/number-of-enclaves/",
    "https://leetcode.com/problems/word-ladder/",
    "https://leetcode.com/problems/word-ladder-ii/",
    "https://leetcode.com/problems/number-of-distinct-islands-ii/",
    "https://leetcode.com/problems/is-graph-bipartite/",
    "https://leetcode.com/problems/course-schedule-ii/discuss/293048/detecting-cycle-in-directed-graph-problem",
    "https://leetcode.com/problems/course-schedule/",
    "https://leetcode.com/problems/course-schedule-ii/",
    "https://leetcode.com/problems/find-eventual-safe-states/",
    "https://leetcode.com/problems/alien-dictionary/solution/",
    "https://leetcode.com/problems/shortest-path-in-binary-matrix/",
    "https://leetcode.com/problems/path-with-minimum-effort/",
    "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
    "https://leetcode.com/problems/network-delay-time/",
    "https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/",
    "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/",
    "https://leetcode.com/problems/number-of-operations-to-make-network-connected/",
    "https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/",
    "https://leetcode.com/problems/accounts-merge/",
    "https://leetcode.com/problems/number-of-islands-ii/",
    "https://leetcode.com/problems/making-a-large-island/",
    "https://leetcode.com/problems/swim-in-rising-water/",
    "https://leetcode.com/problems/critical-connections-in-a-network/discuss/382385/find-bridges-in-a-graph",
    "https://leetcode.com/problems/climbing-stairs/",
    "https://leetcode.com/problems/house-robber/",
    "https://leetcode.com/problems/house-robber-ii/",
    "https://leetcode.com/problems/unique-paths/",
    "https://leetcode.com/problems/unique-paths-ii/",
    "https://leetcode.com/problems/minimum-path-sum/",
    "https://leetcode.com/problems/triangle/",
    "https://leetcode.com/problems/minimum-falling-path-sum/",
    "https://leetcode.com/problems/partition-equal-subset-sum/",
    "https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/",
    "https://leetcode.com/problems/assign-cookies/",
    "https://leetcode.com/problems/coin-change/",
    "https://leetcode.com/problems/target-sum/",
    "https://leetcode.com/problems/coin-change-2/",
    "https://leetcode.com/problems/longest-common-subsequence/",
    "https://leetcode.com/problems/longest-palindromic-subsequence/",
    "https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/",
    "https://leetcode.com/problems/delete-operation-for-two-strings/",
    "https://leetcode.com/problems/shortest-common-supersequence/",
    "https://leetcode.com/problems/distinct-subsequences/",
    "https://leetcode.com/problems/edit-distance/",
    "https://leetcode.com/problems/wildcard-matching/",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/description/",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/",
    "https://leetcode.com/problems/longest-increasing-subsequence/",
    "https://leetcode.com/problems/largest-divisible-subset/",
    "https://leetcode.com/problems/longest-string-chain/",
    "https://leetcode.com/problems/number-of-longest-increasing-subsequence/",
    "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/",
    "https://leetcode.com/problems/burst-balloons/",
    "https://leetcode.com/problems/parsing-a-boolean-expression/",
    "https://leetcode.com/problems/palindrome-partitioning-ii/",
    "https://leetcode.com/problems/partition-array-for-maximum-sum/",
    "https://leetcode.com/problems/maximal-rectangle/",
    "https://leetcode.com/problems/count-square-submatrices-with-all-ones/",
    "https://leetcode.com/problems/implement-trie-prefix-tree/",
    "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
    "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/",
    "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/",
    "https://leetcode.com/problems/count-and-say/",
    "https://leetcode.com/problems/repeated-string-match/discuss/416144/Rabin-Karp-algorithm-C%2B%2B-implementation",
    "https://leetcode.com/problems/implement-strstr/",
    "https://leetcode.com/problems/implement-strstr/",
    "https://leetcode.com/problems/shortest-palindrome/",
    "https://leetcode.com/problems/longest-happy-prefix/",
  ],
  striver79: [
    "https://leetcode.com/problems/next-permutation/",
    "https://leetcode.com/problems/3sum/",
    "https://leetcode.com/problems/maximum-subarray/",
    "https://leetcode.com/problems/majority-element-ii/",
    "https://leetcode.com/problems/maximum-product-subarray/",
    "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",
    "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    "https://leetcode.com/problems/find-peak-element/#:~:text=Find%20Peak%20Element%20%2D%20LeetCode&text=A%20peak%20element%20is%20an,to%20any%20of%20the%20peaks.",
    "https://leetcode.com/problems/koko-eating-bananas/",
    "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    "https://leetcode.com/problems/minimize-max-distance-to-gas-station/",
    "https://leetcode.com/problems/middle-of-the-linked-list/",
    "https://leetcode.com/problems/linked-list-cycle/",
    "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    "https://leetcode.com/problems/intersection-of-two-linked-lists/",
    "https://leetcode.com/problems/sort-list/",
    "https://leetcode.com/problems/odd-even-linked-list/",
    "https://leetcode.com/problems/subsets/",
    "https://leetcode.com/problems/combination-sum/",
    "https://leetcode.com/problems/n-queens/",
    "https://leetcode.com/problems/sudoku-solver/",
    "https://leetcode.com/problems/word-search/",
    "https://leetcode.com/problems/next-greater-element-i/",
    "https://leetcode.com/problems/trapping-rain-water/",
    "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    "https://leetcode.com/problems/asteroid-collision/",
    "https://leetcode.com/problems/sliding-window-maximum/",
    "https://leetcode.com/problems/lru-cache/",
    "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    "https://leetcode.com/problems/task-scheduler/",
    "https://leetcode.com/problems/diameter-of-binary-tree/",
    "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
    "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    "https://leetcode.com/problems/delete-node-in-a-bst/",
    "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/",
    "https://leetcode.com/problems/rotting-oranges/",
    "https://leetcode.com/problems/word-ladder/",
    "https://leetcode.com/problems/number-of-distinct-islands-ii/",
    "https://leetcode.com/problems/course-schedule-ii/",
    "https://leetcode.com/problems/alien-dictionary/solution/",
    "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
    "https://leetcode.com/problems/accounts-merge/",
    "https://leetcode.com/problems/critical-connections-in-a-network/discuss/382385/find-bridges-in-a-graph",
    "https://leetcode.com/problems/house-robber/",
    "https://leetcode.com/problems/minimum-path-sum/",
    "https://leetcode.com/problems/assign-cookies/",
    "https://leetcode.com/problems/longest-common-subsequence/",
    "https://leetcode.com/problems/longest-palindromic-subsequence/",
    "https://leetcode.com/problems/edit-distance/",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",
    "https://leetcode.com/problems/longest-increasing-subsequence/",
    "https://leetcode.com/problems/burst-balloons/",
    "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/",
    "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/",
    "https://leetcode.com/problems/repeated-string-match/discuss/416144/Rabin-Karp-algorithm-C%2B%2B-implementation",
    "https://leetcode.com/problems/implement-strstr/",
    "https://leetcode.com/problems/implement-strstr/",
  ],
};
