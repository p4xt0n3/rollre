// new language module
let lang = 'en';
const listeners = [];

export function currentLang(){ return lang; }
export function onLangChange(cb){ listeners.push(cb); }
export function toggleLang(){
  lang = lang === 'en' ? 'zh' : 'en';
  listeners.forEach(fn=>fn(lang));
  return lang;
}
export function i18n(key){
  const dict = {
    en: {
      language_label: 'Language',
      roll_quantity: 'Roll Quantity',
      skip_animation: 'Skip Animation',
      easy_mode: 'Easy Mode',
      roll: 'Roll',
      rolling: 'Rolling...',
      not_enough: 'Not enough StellarCoin'
    },
    zh: {
      language_label: '语言',
      roll_quantity: '抽卡数量',
      skip_animation: '跳过动画',
      easy_mode: '简单模式',
      roll: '抽卡',
      rolling: '抽取中...',
      not_enough: '星币不足'
    }
  };
  return (dict[lang] && dict[lang][key]) || dict['en'][key] || key;
}

// mapping from character english name (as appears in characters.js) to Chinese
const CHAR_CN = {
  "#1 Sinner, Yi Sang": "第一位罪人，李箱",
  "#2 Sinner, Faust": "第二位罪人，浮士德",
  "#3 Sinner, Don Quixote": "第三位罪人，堂吉诃德",
  "#4 Sinner, Ryōshū": "第四位罪人，良秀",
  "#5 Sinner, Meursault": "第五位罪人，默尔索",
  "#6 Sinner, Hong Lu": "第六位罪人，鸿潞",
  "#7 Sinner, Heathcliff": "第七位罪人，希斯克里夫",
  "#8 Sinner, Ishmael": "第八位罪人，以实玛丽",
  "#9 Sinner, Rodion": "第九位罪人，罗佳",
  "#10 Sinner, Dante": "第十位罪人，但丁",
  "#11 Sinner, Sinclair": "第十一位罪人，辛克莱",
  "#12 Sinner, Outis": "第十二位罪人，奥提斯",
  "#13 Sinner, Gregor": "第十三位罪人，格里高尔",
  "Floor of Religion, Hokma": "宗教层，霍克马",
  "Floor of Philosophy, Binah": "哲学层，比娜",
  "Floor of Social Sciences, Chesed": "社会层，切塞德",
  "Floor of Language, Gebura": "语言层，歌布拉",
  "Floor of Natural Sciences, Tiphereth": "自然科学层，提菲勒斯",
  "Floor of Art, Netzach": "艺术层，内察克",
  "Floor of Literature, Hod": "文学层，霍娣",
  "Floor of Technological Sciences, Yesod": "科技层，耶索德",
  "Floor of History, Malkuth": "历史层，玛库特",
  "Floor of General Works, Roland": "总类层，罗兰"
};

export function charNameFor(engName){
  return lang === 'zh' ? (CHAR_CN[engName] || null) : null;
}