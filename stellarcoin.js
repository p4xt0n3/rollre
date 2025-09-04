let coins = 100;
let infinite = false;
// ...existing code...
export function getCoins() { return infinite ? Infinity : coins; }
export function isEasyMode() { return infinite; }
export function toggleEasyMode() { infinite = !infinite; return infinite; }
export function canAfford(cost) { return infinite || coins >= cost; }
export function spend(cost) { if (infinite) return true; if (coins >= cost) { coins -= cost; return true; } return false; }
export function add(amount) { if (!infinite) coins += amount; return coins; }

