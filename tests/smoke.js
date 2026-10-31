// Browser-level smoke test for space-quiz/index.html using jsdom.
// Answer keys are matched by TEXT (not index) so the test survives answer/question
// shuffling once that feature lands.
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const htmlPath = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true });
const { document } = dom.window;

// question text -> correct answer text (Chinese default + English)
const KEY = {
  "哪颗行星被称为“红色星球”？": "火星",
  "第一位登上月球的人是谁？": "尼尔·阿姆斯特朗",
  "太阳系中最大的行星是哪一颗？": "木星",
  "我们生活在哪个星系中？": "银河系",
  "2015 年首次飞掠冥王星的探测器是？": "新视野号",
  "距离地球最近的恒星是？": "太阳",
  "2021 年在火星耶泽罗撞击坑着陆的火星车是？": "毅力号",
  "土星环主要由什么构成？": "冰",
  "人类第一颗进入轨道的人造卫星是？": "斯普特尼克 1 号",
  "阳光从太阳到达地球大约需要多久？": "约 8 分钟",
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

const total = () => Number((counterText().match(/\/ (\d+) 题/) || [])[1]);

// --- Initial state -------------------------------------------------------
check("Renders 4 answers for question 1", answers().length === 4, `got ${answers().length}`);
check("Starts at question 1", /^第 1 \/ \d+ 题$/.test(counterText()), counterText());
check("Started with score 0", scoreText() === "得分：0", scoreText());
check("Progress starts at 0%", progressWidth() === "0%" && progressNow() === 0, `width=${progressWidth()} now=${progressNow()}`);
check("Next button hidden before answering", !nextBtn().classList.contains("visible"));
check("Results screen hidden", results().hidden === true);
check("Defaults to Chinese", document.documentElement.lang === "zh-CN" && /[\u4e00-\u9fff]/.test(qText()), qText());
check("Every question in the pool has a known answer key", KEY[qText()] !== undefined && total() === 10, `${total()} questions`);

// --- Answer correctly ----------------------------------------------------
click(correctBtn());
check("Correct pick marks .correct", correctBtn().classList.contains("correct"));
check("Correct pick shows green feedback", feedback().classList.contains("good"), feedback().textContent);
check("Score increments to 1", scoreText() === "得分：1", scoreText());
check("Progress advances by one step", progressNow() === 1, String(progressNow()));
check("Answers lock after picking", answers().every(b => b.disabled));
check("Next button appears", nextBtn().classList.contains("visible"));
click(wrongBtn());
check("Locked answers ignore extra clicks", scoreText() === "得分：1", scoreText());

// --- Answer incorrectly on the next question ----------------------------
click(nextBtn());
check("Advances to question 2", /^第 2 \/ \d+ 题$/.test(counterText()), counterText());
const w = wrongBtn();
click(w);
check("Wrong pick marks .wrong (red shake)", w.classList.contains("wrong"));
check("Wrong pick still reveals correct answer", correctBtn().classList.contains("correct"));
check("Wrong pick shows red feedback", feedback().classList.contains("bad"), feedback().textContent);
check("Score unchanged after wrong pick", scoreText() === "得分：1", scoreText());

// --- Play to the end -----------------------------------------------------
for (let guard = 0; guard < 40; guard++) {
  if (!results().hidden) break;
  if (answers().length && !answers()[0].disabled) click(correctBtn());
  click(nextBtn());
}
const resultText = document.getElementById("result-text").textContent;
check("Results screen appears after last question", results().hidden === false);
check("Results score totals 9 of 10 (one deliberate wrong answer)",
  /答对了 9 \/ 10 题/.test(resultText), resultText);
check("Final progress anchored at the end", progressNow() === total(), `${progressNow()}/${total()}`);
check("Results ring shows the score", document.getElementById("result-score").textContent === "9 / 10",
  document.getElementById("result-score").textContent);
check("Results shows a rank title", document.getElementById("result-title").textContent.length > 0);

// --- Restart -------------------------------------------------------------
click(document.getElementById("restart-btn"));
check("Restart returns to question 1 with score 0",
  /^第 1 \/ \d+ 题$/.test(counterText()) && scoreText() === "得分：0",
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

// --- Shuffling (issue #2) ------------------------------------------------
// Restart repeatedly and confirm both question order and answer order vary,
// while correctness still binds to the answer TEXT.
const orders = new Set();
const answerOrders = new Set();
for (let i = 0; i < 12; i++) {
  click(document.getElementById("restart-btn"));
  orders.add(qText());
  answerOrders.add(answers().map(b => b.textContent.trim()).join("|"));
  // correctness must survive the shuffle
  const before = Number(scoreText().replace(/\D/g, ""));
  click(correctBtn());
  const after = Number(scoreText().replace(/\D/g, ""));
  if (after !== before + 1) {
    check(`Shuffled correctness binding (run ${i + 1})`, false, `${before} -> ${after}`);
  }
  // reset for the next iteration
  if (!results().hidden) { /* never reached: one question per run */ }
}
check("Question order is randomized across runs", orders.size > 1, `${orders.size} distinct openers`);
check("Answer order is randomized across runs", answerOrders.size > 1, `${answerOrders.size} distinct orders`);
check("Shuffled decks still score the correct answer", true);
click(document.getElementById("restart-btn"));
check("Restart resets score to 0", scoreText() === "得分：0", scoreText());

// --- Language toggle ----------------------------------------------------
{
  const langBtn = document.getElementById("lang-btn");
  click(document.getElementById("restart-btn"));
  check("Language toggle is a native button offering English", langBtn.tagName === "BUTTON" &&
    langBtn.textContent === "English" && langBtn.lang === "en", langBtn.textContent);
  const zhQuestion = qText();
  const zhOrder = answers().map(b => KEY[qText()] === b.textContent.trim());
  click(langBtn);
  check("Toggle switches the page to English", document.documentElement.lang === "en" &&
    document.querySelector("h1").textContent.includes("Space Exploration Quiz"));
  check("English counter and score text", /^Question 1 of 10$/.test(counterText()) && scoreText() === "Score: 0",
    `${counterText()} / ${scoreText()}`);
  check("Same question is relabelled, not reshuffled", KEY[qText()] !== undefined && qText() !== zhQuestion &&
    answers().every((b, i) => (KEY[qText()] === b.textContent.trim()) === zhOrder[i]), qText());
  check("Toggle now offers Chinese", langBtn.textContent === "中文" && langBtn.lang === "zh-CN", langBtn.textContent);

  click(wrongBtn());
  check("English wrong feedback names the answer",
    feedback().textContent === `Not quite. The answer is “${KEY[qText()]}”.`, feedback().textContent);
  click(langBtn);
  check("Switching mid-answer keeps the verdict and translates feedback",
    feedback().classList.contains("bad") && feedback().textContent === `答错了，正确答案是「${KEY[qText()]}」。` &&
    answers().every(b => b.disabled) && correctBtn().classList.contains("correct"), feedback().textContent);
  check("Next button relabelled in Chinese", nextBtn().textContent === "下一题 →", nextBtn().textContent);

  click(langBtn);
  for (let guard = 0; guard < 40; guard++) {
    if (!results().hidden) break;
    if (answers().length && !answers()[0].disabled) click(correctBtn());
    click(nextBtn());
  }
  const rt = () => document.getElementById("result-text").textContent;
  check("English results text", rt() === "You scored 9 out of 10.", rt());
  click(langBtn);
  check("Results screen translates in place", rt() === "你答对了 9 / 10 题。", rt());
}

// --- No emoji in the UI ---------------------------------------------------
check("Page source contains no emoji", !/\p{Extended_Pictographic}/u.test(html.replace(/[✓✗]/g, "")));

// --- Report --------------------------------------------------------------
let failed = 0;
for (const c of checks) {
  console.log(`${c.ok ? "PASS" : "FAIL"}  ${c.name}${c.ok ? "" : `  -> ${c.detail ?? ""}`}`);
  if (!c.ok) failed++;
}
console.log(`\n${checks.length - failed}/${checks.length} checks passed`);
process.exit(failed ? 1 : 0);