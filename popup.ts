// https://github.com/microsoft/TypeScript/issues/49083#issuecomment-1435399267
import { setRedirectRule, unsetRedirectRule } from './redirect.js'

const settingsButton = document.getElementById("settings-icon");
if (settingsButton) {
  const storedState = localStorage.getItem('settingsPageVisible');
  const settingsPage = document.getElementById("settings-page");
  if (storedState === 'true' && settingsPage) {
    settingsPage.classList.add("visible");
  }

  settingsButton.addEventListener("click", function () {
    localStorage.setItem('settingsPageVisible', 'true');
    const settingsPage = document.getElementById("settings-page");
    if (settingsPage) {
      settingsPage.classList.toggle("visible");
    }
  });
}

const backArrow = document.getElementById("arrow-icon");
if (backArrow) {
  backArrow.addEventListener("click", function () {
    localStorage.setItem('settingsPageVisible', 'false');
    const settingsPage = document.getElementById("settings-page");
    if (settingsPage) {
      settingsPage.classList.toggle("visible");
    }
  });
}

const disableTorture = document.getElementById("disable-torture-checkbox")  as HTMLInputElement | null;
if (disableTorture) {
  const storedState = localStorage.getItem('disableTorture');
  if (storedState) {
    disableTorture.checked = (storedState === 'true');
  }

  disableTorture.addEventListener("change", function () {
    const newState = disableTorture.checked;
    localStorage.setItem('disableTorture', newState.toString());
    if (newState) {
      setRedirectRule('https://leetcode.com/problems/valid-anagram/');
    } else {
      unsetRedirectRule();
    }
  });
}

