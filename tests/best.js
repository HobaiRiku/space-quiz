// Best-score persistence tests for space-quiz/index.html (issue #1).
// A shared in-memory Storage is injected into each JSDOM instance so that
// creating a second instance faithfully simulates a page reload on the same origin.
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

// question text -> correct answer text (identical to smoke.js)
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

function makeStore(initial) {
  const map = new Map(Object.entries(initial || {}));
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => void map.set(k, String(v)),
    removeItem: k => void map.delete(k),
    clear: () => map.clear(),
    key: i => [...map.keys()][i] ?? null,
    get length() { return map.size; },
    _dump: () => Object.fromEntries(map)
  };
}

// broken=true simulates blocked storage (private mode / file:// restrictions)
function makeBrokenStore() {
  const boom = () => { throw new Error("SecurityError: storage is not available"); };
  return { getItem: boom, setItem: boom, removeItem: boom, clear: boom, key: boom, length: 0 };
}

function load(store) {
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: "https://space-quiz.test/",
    beforeParse(window) {
      Object.defineProperty(window, "localStorage", { value: store, configurable: true });
    }
  });
  return dom;
}

const checks = [];
const check = (name, ok, detail) => checks.push({ name, ok: !!ok, detail });

function bind(dom) {
  const { document } = dom.window;
  const $ = id => document.getElementById(id);
  const answers = () => [...document.querySelectorAll(".answer")];
  const qText = () => $("question-text").textContent.trim();
  const click = el => el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  const correctBtn = () => answers().find(b => b.textContent.trim() === KEY[qText()]);
  const wrongBtn = () => { const c = correctBtn(); return answers().find(b => b !== c); };
  return { document, $, answers, qText, click, correctBtn, wrongBtn };
}

// Play a full round; `miss` is how many questions to answer incorrectly.
function playRound(dom, miss = 0) {
  const u = bind(dom);
  if (!u.$("results").hidden) u.click(u.$("restart-btn")); // start a fresh round
  for (let guard = 0; guard < 60; guard++) {
    if (!u.$("results").hidden) break;
    if (u.answers().length && !u.answers()[0].disabled) {
      u.click(miss > 0 ? u.wrongBtn() : u.correctBtn());
      if (miss > 0 && u.answers()[0].disabled) miss--;
    }
    u.click(u.$("next-btn"));
  }
  return u;
}

// --- 1. Fresh profile ----------------------------------------------------
{
  const store = makeStore();
  const dom = load(store);
  const u = bind(dom);
  check("Fresh profile shows the Best placeholder", u.$("best-counter").textContent === "Best: —",
    u.$("best-counter").textContent);
  check("Fresh profile has no stored key", store.getItem("spacequiz.best") === null);

  playRound(dom, 1); // 9 of 10
  check("Results reports a new personal best",
    /New personal best: 9/.test(u.$("result-best").textContent), u.$("result-best").textContent);
  check("Best score written to localStorage", store.getItem("spacequiz.best") === "9",
    String(store.getItem("spacequiz.best")));
  check("HUD shows the best score", u.$("best-counter").textContent === "Best: 9", u.$("best-counter").textContent);

  // --- 2. Reload on the same origin ------------------------------------
  const dom2 = load(store);
  const u2 = bind(dom2);
  check("Best score survives a page reload", u2.$("best-counter").textContent === "Best: 9",
    u2.$("best-counter").textContent);

  // --- 3. Worse round keeps the best -----------------------------------
  playRound(dom2, 5); // 5 of 10
  check("Worse round does not overwrite the best", store.getItem("spacequiz.best") === "9",
    String(store.getItem("spacequiz.best")));
  check("Worse round reports the standing best",
    /Personal best to beat: 9/.test(u2.$("result-best").textContent), u2.$("result-best").textContent);

  // --- 4. Better round raises the best ---------------------------------
  playRound(dom2, 0); // 10 of 10
  check("Perfect round raises the best to 10", store.getItem("spacequiz.best") === "10",
    String(store.getItem("spacequiz.best")));
  check("Better round is announced as a new best",
    /New personal best: 10/.test(u2.$("result-best").textContent), u2.$("result-best").textContent);
}

// --- 5. Corrupt / out-of-range stored values ------------------------------
for (const bad of ["not-a-number", "-3", "999", ""]) {
  const store = makeStore({ "spacequiz.best": bad });
  const dom = load(store);
  const u = bind(dom);
  check(`Corrupt value ${JSON.stringify(bad)} is ignored`, u.$("best-counter").textContent === "Best: —",
    u.$("best-counter").textContent);
  playRound(dom, 1);
  check(`Corrupt value ${JSON.stringify(bad)} repaired after a round`, store.getItem("spacequiz.best") === "9",
    String(store.getItem("spacequiz.best")));
}

// --- 6. Blocked storage must never break the quiz ------------------------
{
  const dom = load(makeBrokenStore());
  const u = bind(dom);
  check("Blocked storage degrades to the placeholder", u.$("best-counter").textContent === "Best: —",
    u.$("best-counter").textContent);
  playRound(dom, 1);
  check("Round completes with blocked storage", u.$("results").hidden === false);
  check("Results still render without persistence",
    /9 out of 10/.test(u.$("result-text").textContent), u.$("result-text").textContent);
  check("New-best line still renders in memory",
    /New personal best: 9/.test(u.$("result-best").textContent), u.$("result-best").textContent);
}

// --- Report --------------------------------------------------------------
let failed = 0;
for (const c of checks) {
  console.log(`${c.ok ? "PASS" : "FAIL"}  ${c.name}${c.ok ? "" : `  -> ${c.detail ?? ""}`}`);
  if (!c.ok) failed++;
}
console.log(`\n${checks.length - failed}/${checks.length} checks passed`);
process.exit(failed ? 1 : 0);