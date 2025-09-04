export const CHARACTERS = {
  red: [
    //project moon
{ id: "ys", name: "#1 Sinner, Yi Sang", image: "ys.png" },
{ id: "fa", name: "#2 Sinner, Faust", image: "fa.png" },
{ id: "dqx", name: "#3 Sinner, Don Quixote", image: "dqx.png" },
{ id: "ry", name: "#4 Sinner, Ryōshū", image: "ry.png" },
{ id: "me", name: "#5 Sinner, Meursault", image: "me.png" },
{ id: "hl", name: "#6 Sinner, Hong Lu", image: "hl.png" },
{ id: "hc", name: "#7 Sinner, Heathcliff", image: "hc.png" },
{ id: "is", name: "#8 Sinner, Ishmael", image: "is.png" },
{ id: "ro", name: "#9 Sinner, Rodion", image: "ro.png" },
{ id: "da", name: "#10 Sinner, Dante", image: "da.png" },
{ id: "es", name: "#11 Sinner, Emil Sinclair", image: "es.png" },
{ id: "ou", name: "#12 Sinner, Outis", image: "ou.png" },
{ id: "gr", name: "#13 Sinner, Gregor", image: "gr.png" },
{ id: "gw", name: "Floor of General Works, Roland", image: "gw.png" },
{ id: "hi", name: "Floor of History, Malkuth", image: "hi.png" },
{ id: "ts", name: "Floor of Technological Sciences, Yesod", image: "ts.png" },
{ id: "li", name: "Floor of Literature, Hod", image: "li.png" },
{ id: "ar", name: "Floor of Art, Netzach", image: "ar.png" },
{ id: "ns", name: "Floor of Natural Sciences, Tiphereth", image: "ns.png" },
{ id: "la", name: "Floor of Language, Gebura", image: "la.png" },
{ id: "ss", name: "Floor of Social Sciences, Chesed", image: "ss.png" },
{ id: "ph", name: "Floor of Philosophy, Binah", image: "ph.png" },
{ id: "re", name: "Floor of Religion, Hokma", image: "re.png" }, 
        //ttou
    { id: "g", name: "The Alternate Scientist, G", image: "g.png" },
       { id: "nathan", name: "The Red Dust Prodigy, Nathan Redshed", image: "nathan.png" },
       { id: "paxton", name: "The Elemental Master, Paxton", image: "paxton.png" },
       { id: "karos", name: "The Universe Emperor, Karos Lethon", image: "karos.png" }
  ],
  black: [
    { id: "333", name: "Void LordGod, The 333", image: "333.png" },

  ]
};
export function randomCharacterByRarity(rarity) {
  const pool = CHARACTERS[rarity] || [];
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

