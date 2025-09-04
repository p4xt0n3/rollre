export const ITEMS = {
  blue: [
    { id: "bi1", name: "blue_1" }
  ],
  purple: [
    { id: "pi1", name: "purple_1" }
  ],
  gold: [
    { id: "gi1", name: "gold_1" }
  ],
  red: [
    { id: "ri1", name: "red_1", image: "red1.jpg" }
  ]
};
export function randomItemByRarity(rarity) {
  const pool = ITEMS[rarity] || ITEMS.blue;
  return pool[Math.floor(Math.random() * pool.length)];
}

