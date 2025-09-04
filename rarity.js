// Rarity logic: Characters first (tiny chance), else Items by provided distribution.
export const RARITY_ORDER = ["blue","purple","gold","red","black"];
export const RARITY_COLOR_PATH = {
  blue: [], purple: ["purple"], gold: ["purple","gold"], red: ["purple","gold","red"], black: ["purple","gold","red","black"]
};
// Item distribution (given)
export let ITEM_RATES = [
  { key: "red",    p: 1.0 },
  { key: "gold",   p: 3.0 },
  { key: "purple", p: 5.0 },
  { key: "blue",   p: 91.0 }
];
// Character rates (given)
export let CHAR_RATES = [
  { key: "black",  p: 0.3 },
  { key: "red",    p: 1.0 }
];
function pickByRates(rates, roll = Math.random() * 100) {
  let acc = 0;
  for (const r of rates) {
    acc += r.p;
    if (roll <= acc) return r.key;
  }
  return rates[rates.length - 1].key;
}
export function rollEntry() {
  // First check characters
  const charRoll = Math.random() * 100;
  if (charRoll <= (CHAR_RATES[0].p + CHAR_RATES[1].p)) {
    const rarity = pickByRates(CHAR_RATES, charRoll);
    return { type: "character", rarity };
  }
  // Else, items with given distribution
  const rarity = pickByRates(ITEM_RATES);
  return { type: "item", rarity };
}
export function setItemRates(r){ ITEM_RATES = r; }
export function setCharRates(r){ CHAR_RATES = r; }
export function getItemRates(){ return ITEM_RATES.slice(); }
export function getCharRates(){ return CHAR_RATES.slice(); }
export function colorForRarity(r) {
  return {
    blue:"#3da9fc", purple:"#9b5de5", gold:"#f4c430", red:"#ef233c", black:"#000000"
  }[r] || "#3da9fc";
}