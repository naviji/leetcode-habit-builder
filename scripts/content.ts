
console.log("Content script loaded")

async function checkForAcceptedSubmission() {
  const spanElement = document.querySelector(
    'span[data-e2e-locator="submission-result"]',
  );
  if (spanElement && spanElement.textContent === "Accepted") {
    console.log("Successful submission detected")
    chrome.runtime.sendMessage({ action: "problemSolved" });
  }
}

window.addEventListener("replacestate", checkForAcceptedSubmission);

