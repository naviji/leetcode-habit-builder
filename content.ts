function checkForAcceptedSubmission() {
  const spanElement = document.querySelector(
    'span[data-e2e-locator="submission-result"]',
  );
  console.log("Span element:", spanElement);
  if (spanElement && spanElement.textContent === "Accepted") {
    chrome.runtime.sendMessage({ result: "Accepted" });
  }
}

function onUrlChange() {
  checkForAcceptedSubmission();
}
window.addEventListener("replacestate", onUrlChange);
checkForAcceptedSubmission();
