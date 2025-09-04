import { playStarAnimation } from "animation";
import { rollEntry, RARITY_COLOR_PATH, colorForRarity } from "rarity";
import { randomItemByRarity } from "items";
import { randomCharacterByRarity } from "characters";
import { getCoins, canAfford, spend, toggleEasyMode, isEasyMode } from "stellarcoin";
import { playCardAnimation } from "cardanm";
import { i18n, currentLang, toggleLang, onLangChange, charNameFor } from "language";

const coinEl = document.getElementById("coin-amount");
const rollBtn = document.getElementById("roll-btn");
const resultsEl = document.getElementById("results");
const canvas = document.getElementById("fx-canvas");
const toggleSkip = document.getElementById("toggle-skip");
const toggleEasy = document.getElementById("toggle-easy");
const langToggle = document.getElementById("lang-toggle");
let skipAnimation = true; 

// initialize UI language
function refreshUIText() {
  langToggle.textContent = `${i18n('language_label')}: ${currentLang() === 'zh' ? '中文' : 'English'}`;
  document.querySelectorAll('.group-label').forEach(n=>{
    if(n.textContent.includes('Roll Quantity') || n.textContent.includes('数量')) n.textContent = i18n('roll_quantity');
  });
  // toggles
  toggleSkip.querySelector('.t-label').textContent = i18n('skip_animation');
  toggleEasy.querySelector('.t-label').textContent = i18n('easy_mode');
  rollBtn.textContent = i18n('roll');
}
refreshUIText();
onLangChange(refreshUIText);

langToggle.addEventListener('click', ()=>{
  toggleLang();
});

function updateCoins() {
  const c = getCoins();
  coinEl.textContent = c === Infinity ? "∞" : String(c);
}
updateCoins();

toggleSkip.addEventListener("click", () => {
  skipAnimation = !skipAnimation;
  toggleSkip.classList.toggle("on", skipAnimation);
  toggleSkip.setAttribute("aria-pressed", String(skipAnimation));
  toggleSkip.querySelector(".t-state").textContent = skipAnimation ? "On" : "Off";
});
toggleEasy.addEventListener("click", () => {
  const on = toggleEasyMode();
  toggleEasy.classList.toggle("on", on);
  toggleEasy.setAttribute("aria-pressed", String(on));
  toggleEasy.querySelector(".t-state").textContent = on ? "On" : "Off";
  updateCoins();
});

function currentRollCount() {
  const sel = document.querySelector('input[name="roll-count"]:checked');
  return sel ? parseInt(sel.value, 10) : 1;
}
function rollOne() {
  const entry = rollEntry();
  const rarity = entry.rarity;
  if (entry.type === "character") {
    const char = randomCharacterByRarity(rarity);
    return { type: "character", rarity, name: char?.name || `Unknown ${rarity} Character`, image: char?.image };
  } else {
    const item = randomItemByRarity(rarity);
    return { type: "item", rarity, name: item.name, image: item.image };
  }
}
function renderResults(cards) {
  resultsEl.innerHTML = "";
  const frag = document.createDocumentFragment();
  for (const c of cards) {
    const card = document.createElement("div");
    card.className = `card r-${c.rarity} ${c.type === "character" ? "character" : "item"}`;
    if (c.type !== "character") card.style.background = colorForRarity(c.rarity);
    const meta = document.createElement("div"); meta.className = "meta";
    const name = document.createElement("div"); name.className = "name";
    // use language-specific character/item names when available
    if (currentLang() === 'zh' && c.type === 'character') {
      name.textContent = charNameFor(c.name) || c.name;
    } else {
      name.textContent = c.name;
    }
    const tag = document.createElement("div"); tag.className = "tag"; tag.textContent = (c.type === "character" ? "Character" : "Item") + " • " + c.rarity.toUpperCase();
    // translate tag
    if (currentLang() === 'zh') tag.textContent = (c.type === "character" ? "角色" : "物品") + " • " + c.rarity.toUpperCase();
    meta.append(name, tag);
    const media = document.createElement("div"); media.className = "media";
    if (c.image) { const img = document.createElement("img"); img.alt = c.name; img.src = c.image; media.appendChild(img); }
    card.append(meta, media); frag.appendChild(card);
  }
  resultsEl.appendChild(frag);
}
function highestRarity(cards) {
  const rank = { blue:1, purple:2, gold:3, red:4, black:5 };
  return cards.reduce((a,c)=> rank[c.rarity] > rank[a] ? c.rarity : a, "blue");
}

let rolling = false;
rollBtn.addEventListener("click", async () => {
  rollBtn.textContent = i18n('rolling') || "Rolling...";
  if (rolling) return;
  const count = currentRollCount();
  const cost = count === 10 ? 100 : 10;
  if (!canAfford(cost)) {
    rollBtn.disabled = true;
    rollBtn.textContent = i18n('not_enough') || "Not enough StellarCoin";
    setTimeout(()=>{ rollBtn.disabled=false; rollBtn.textContent="Roll"; }, 1200);
    return;
  }
  if (!spend(cost)) return;
  updateCoins();
  rolling = true; rollBtn.disabled = true; rollBtn.textContent = "Rolling...";
  const pulls = Array.from({ length: count }, rollOne);
  const maxR = highestRarity(pulls);
  const path = RARITY_COLOR_PATH[maxR] || [];
  const complete = async () => {
    renderResults(pulls);
    // animate cards into place
    await playCardAnimation(resultsEl, count);
    rolling = false; rollBtn.disabled = false; rollBtn.textContent = i18n('roll') || "Roll";
  };
  if (skipAnimation) {
    complete();
  } else {
    playStarAnimation(canvas, path, complete);
  }
});

window.addEventListener("resize", () => {
  // canvas auto scales via CSS; animation resizes itself at start of each run
});