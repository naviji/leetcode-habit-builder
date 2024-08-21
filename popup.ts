// https://github.com/microsoft/TypeScript/issues/49083#issuecomment-1435399267
import { setRedirectRule, unsetRedirectRule } from './redirect.js'


interface Problem {
  category: string,
  href: string,
  text: string,
  difficulty: string,
  isPremium: boolean
}

let problems: Problem[] = []

fetch('./problems/neetcode150.json')
  .then(response => response.json())
  .then(data => {
    problems = data
  })
  .catch(error => console.error('Error loading JSON:', error));



function getQuestion() {
  const problemIdx = localStorage.getItem('problemIdx');
  if (problemIdx) {
    return problems[parseInt(problemIdx)]
  }
  const newProblemIdx = Math.floor(Math.random() * problems.length)
  localStorage.setItem('problemIdx', newProblemIdx.toString());
  return problems[newProblemIdx];
}

function setProblemText(problem: Problem) {
  const problemTitle = document.getElementById('question');
  if (problemTitle) {
    problemTitle.textContent = problem.text;
  }
}


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
      const question = getQuestion();
      setProblemText(question)
      setRedirectRule(question.href);
    } else {
      unsetRedirectRule();
    }
  });
}
