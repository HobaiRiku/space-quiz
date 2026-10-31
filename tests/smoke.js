// Browser-level smoke test for space-quiz/index.html using jsdom.
// Answer keys are matched by TEXT (not index) so the test survives answer/question
// shuffling once that feature lands.
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const htmlPath = path.join(__dirname, "..", "space-quiz", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true });
const { document } = dom.window;

// question text -> correct answer text
const KEY = {
  "Which planet is known as the Red Planet?": "Mars",
  "Who was the first human to walk on the Moon?": "Neil Armstrong",
  "Which is the largest planet in our solar system?": "Jupiter",
  "What galaxy do we live in?": "The Milky Way",
  "Which spacecraft was the first to fly past Pluto (2015)?": "New Horizons",
  "What is the closest star to Earth?": "The Sun",
  "Which rover landed on Mars in Jezero Crater in 2021?": "Perseverance",
  "What are Saturn's rings mainly made of?": "Ice",
  "Which was the first artificial satellite in orbit?": "Sputnik 1",
  "How long does sunlight take to reach Earth?": "About 8 minutes"
};

const checks = [];
function check(name, condition, detail) {
  checks.push({ name, ok: !!condition, detail });
}

const answers = () => [...document.querySelectorAll(".answer")];
const qText = () => document.getElementById("question-text").textContent.trim();
const scoreText = () => document.getElementById("score-counter").textContent;
const counterText = () => document.getElementById("q-counter").textContent;
const progressNow = () => Number(document.getElementById("progress").getAttribute("aria-valuenow"));
const progressWidth = () => document.getElementById("progress-fill").style.width;
const feedback = () => document.getElementById("feedback");
const nextBtn = () => document.getElementById("next-btn");
const results = () => document.getElementById("results");
const click = el => el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
const byText = t => answers().find(b => b.textContent.trim() === t);
const correctBtn = () => byText(KEY[qText()]);
const wrongBtn = () => { const c = correctBtn(); return answers().find(b => b !== c); };

const total = () => Number((counterText().match(/of (\d+)/) || [])[1]);

// --- Initial state -------------------------------------------------------
check("Renders 4 answers for question 1", answers().length === 4, `got ${answers().length}`);
check("Starts at question 1", /^Question 1 of \d+$/.test(counterText()), counterText());
check("Started with score 0", scoreText() === "Score: 0", scoreText());
check("Progress starts at 0%", progressWidth() === "0%" && progressNow() === 0, `width=${progressWidth()} now=${progressNow()}`);
check("Next button hidden before answering", !nextBtn().classList.contains("visible"));
check("Results screen hidden", results().hidden === true);
check("Every question in the pool has a known answer key", total() <= Object.keys(KEY).length, `${total()} questions`);

// --- Answer correctly ----------------------------------------------------
click(correctBtn());
check("Correct pick marks .correct", correctBtn().classList.contains("correct"));
check("Correct pick shows green feedback", feedback().classList.contains("good"), feedback().textContent);
check("Score increments to 1", scoreText() === "Score: 1", scoreText());
check("Progress advances by one step", progressNow() === 1, String(progressNow()));
check("Answers lock after picking", answers().every(b => b.disabled));
check("Next button appears", nextBtn().classList.contains("visible"));
click(wrongBtn());
check("Locked answers ignore extra clicks", scoreText() === "Score: 1", scoreText());

// --- Answer incorrectly on the next question ----------------------------
click(nextBtn());
check("Advances to question 2", /^Question 2 of \d+$/.test(counterText()), counterText());
const w = wrongBtn();
click(w);
check("Wrong pick marks .wrong (red shake)", w.classList.contains("wrong"));
check("Wrong pick still reveals correct answer", correctBtn().classList.contains("correct"));
check("Wrong pick shows red feedback", feedback().classList.contains("bad"), feedback().textContent);
check("Score unchanged after wrong pick", scoreText() === "Score: 1", scoreText());

// --- Play to the end -----------------------------------------------------
for (let guard = 0; guard < 40; guard++) {
  if (!results().hidden) break;
  if (answers().length && !answers()[0].disabled) click(correctBtn());
  click(nextBtn());
}
const resultText = document.getElementById("result-text").textContent;
check("Results screen appears after last question", results().hidden === false);
check("Results score totals 9 of 10 (one deliberate wrong answer)",
  /9 out of 10/.test(resultText), resultText);
check("Final progress anchored at the end", progressNow() === total(), `${progressNow()}/${total()}`);
check("Results shows an emoji reaction", document.getElementById("result-emoji").textContent.length > 0);

// --- Restart -------------------------------------------------------------
click(document.getElementById("restart-btn"));
check("Restart returns to question 1 with score 0",
  /^Question 1 of \d+$/.test(counterText()) && scoreText() === "Score: 0",
  `${counterText()} / ${scoreText()}`);

// --- Keyboard + accessibility -------------------------------------------
const allButtons = [...document.querySelectorAll("button")];
check("All interactive controls are native <button>s (keyboard operable)",
  allButtons.length > 0 && allButtons.every(b => b.tagName === "BUTTON"), `${allButtons.length} buttons`);
check("Answers are in DOM order for Tab navigation",
  answers().length === 4 && answers().every((b, i, arr) => i === 0 || (arr[i - 1].compareDocumentPosition(b) & 4) !== 0));
const progress = document.getElementById("progress");
check("Progress bar exposes ARIA progressbar semantics",
  progress.getAttribute("role") === "progressbar" && progress.hasAttribute("aria-valuenow") &&
  progress.hasAttribute("aria-valuemin") && progress.hasAttribute("aria-valuemax"));
check("Feedback + results regions are announced", feedback().getAttribute("role") === "status" &&
  document.querySelector("main").getAttribute("aria-live") === "polite");

// --- Theme + motion preferences -----------------------------------------
check("CSS defines a prefers-color-scheme: dark palette", html.includes("prefers-color-scheme: dark"));
check("CSS defines a prefers-reduced-motion fallback", html.includes("prefers-reduced-motion: reduce"));
check("Shake + pop animations exist", html.includes("@keyframes shake") && html.includes("@keyframes pop"));

// --- Report --------------------------------------------------------------
let failed = 0;
for (const c of checks) {
  console.log(`${c.ok ? "PASS" : "FAIL"}  ${c.name}${c.ok ? "" : `  -> ${c.detail ?? ""}`}`);
  if (!c.ok) failed++;
}
console.log(`\n${checks.length - failed}/${checks.length} checks passed`);
process.exit(failed ? 1 : 0);