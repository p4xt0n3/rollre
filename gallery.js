import { CHARACTERS } from "characters";
import { i18n, currentLang, onLangChange, charNameFor } from "language";

const btn = document.getElementById('gallery-btn');
function setBtnLabel(){ btn.textContent = i18n('gallery'); }
setBtnLabel(); onLangChange(setBtnLabel);

// Build overlays
const overlay = document.createElement('div'); overlay.className = 'gallery-overlay';
const panel = document.createElement('div'); panel.className = 'gallery-panel';
const topbar = document.createElement('div'); topbar.className = 'gallery-topbar';
const tabItem = document.createElement('button'); tabItem.className='gallery-tab'; tabItem.textContent='Item';
const tabChar = document.createElement('button'); tabChar.className='gallery-tab active'; tabChar.textContent='Character';
const grid = document.createElement('div'); grid.className='gallery-grid';
topbar.append(tabItem, tabChar); panel.append(topbar, grid); overlay.appendChild(panel);
document.body.appendChild(overlay);

// Mini modal for character details
const mini = document.createElement('div'); mini.className='mini-modal';
const miniPanel = document.createElement('div'); miniPanel.className='mini-panel';
const miniClose = document.createElement('button'); miniClose.textContent='Close';
miniClose.style.marginTop='10px'; miniClose.addEventListener('click', ()=> mini.classList.remove('show'));
mini.appendChild(miniPanel); overlay.appendChild(mini);
mini.addEventListener('click', (e)=>{ if(e.target===mini) mini.classList.remove('show'); });

// Character data with quotes and descriptions
const CHARACTER_DATA = {
  ys: {
    quote: "박제가 되어버린 천재'를 아시오?",
    engDesc: "Yi Sang is a cryptic and mellow man with a lot of thoughtfulness to him. He was a researcher and architect previously affiliated with the League of Nine Littérateurs, having invented the Mirror as a T Corp. researcher prior to joining Limbus Company.",
    cnDesc: "该罪人曾是[已编辑]翼中最年轻的首席研究员，相较于其他罪人，其拥有更为出众的智力。对于我们所选择的经理而言，与之进行日常交流或略显困难，尽管如此，过于明显地规避交流也会留下不稳定因素。该罪人偶尔会保持长时间的沉默，这是因为他正在脑海中进行一系列的思考；在这种情况下，我们建议您耐心等待。"
  },
  fa: {
    quote: "Es irrt der Mensch, solang er strebt.",
    engDesc: "Faust is an observant and intelligent woman with a slight know-it-all attitude. She was the first Sinner to be affiliated with Limbus Company, having spent the time leading up to it recruiting the members of the LCB and developing Mephistopheles.",
    cnDesc: "该罪人开发了边狱公司的巴士——梅菲斯托费勒斯[1]的引擎。她声称在都市中，没有人能在智慧层面上与她相媲美[2]，这话未必就是错的。也许在和经理您交谈的时候，您会发现她的态度高高在上，而这样的态度也许会败坏您的心情。由于该罪人举止傲慢，仿佛不在乎任何人，让她有所改善的可能性几乎为零。我们建议您只要应付一下，点点头就行。虽然她才智异禀，但我们尚不清楚如何利用她的才能。说不定，经理您能找到方法？"
  },
  dqx: {
    quote: "¡Por alcanzar la estrella inalcanzable!",
    engDesc: "Don Quixote is a rambunctious and steadfast woman with a strong sense of justice. She never parts with her shoes Rocinante, on her quest to become a valorous Fixer of the City, and was previously associated with the amusement park of La Manchaland prior to joining Limbus Company.",
    cnDesc: "如果只以热情作为评判罪人资质的标准，该罪人无疑会拔得头筹。身为收尾人的狂热粉丝，她热衷于收集各种收尾人的相关纪念品，并将其装饰在全身上下。鉴于这种行为并不会对战斗产生实质性影响，因此无需特别对其采取措施。她对自身是正义的收尾人（真的有这样的存在吗？）一事深信不疑，并会做出像三流演员一般夸张的举止。为了使任务能够顺利进行，建议您配合她的节奏行动。"
  },
  ry: {
    quote: "かいなでの絵師には総じて醜いものの美しさなどと申すことは、わかろうはずがございませぬ。",
    engDesc: "Ryōshū is an ungovernable woman with a fascination in art that she uniquely defines, with little tolerance for what disinterests or offends her. Her ventures prior to Limbus Company are unknown, an implied affiliation with the Fingers of the Backstreets notwithstanding.",
    cnDesc: "虽说每一位罪人都有其独特的信条，而尊重这些信条是经理应尽的义务。但……某些信条实在是令人费解。虽然该罪人平日里只是在一边默默抽着烟，唯有战斗时，她的眼中才会迸发出愉悦的神采。她认为只是在战斗中无谋地打碎对方的脑袋，是粗俗的行为，更是对艺术的亵渎。\n[警告] - 由于该罪人有着我司也难以应对的背景，请尽量不要和她结下私仇。"
  },
  me: {
    quote: "Aujourd'hui, j'ai tué maman. Ou peut-être était-ce hier.",
    engDesc: "Meursault is a reserved and complacent man with a desire to be clearly communicated with. He was previously affiliated with N Corp., having tried and failed to form an opinion on their ideals prior to joining Limbus Company.",
    cnDesc: "倾向于明确且简洁的指令，即不留下个人判断余地的命令。"
  },
  hl: {
    quote: "美中不足、 好事多魔。",
    engDesc: "Hong Lu is a lighthearted and naive man with a tendency for unintentionally insensitive words. He is one of several children of the large and wealthy Jia family, having lived a life of sheltered affluence prior to joining Limbus Company.",
    cnDesc: "该罪人在成为我司的资产前过着富足的生活。因此，虽然他对自由有所向往，但也偶尔会在见到其他罪人制作的食物时显露出对底层文化的无知，并提出触碰其他罪人雷区的冒犯性问题。不过，由于其提问并非出于讽刺，而仅仅是纯粹的好奇使然，让罪人们为此大动干戈并非合适的解决方法。"
  },
  hc: {
    quote: "I have not broken your heart - YOU have; and in breaking it, you have broken mine.",
    engDesc: "Heathcliff is a brash and action-oriented man with a strong, dedicated spirit. He was previously affiliated with Wuthering Heights, having grown up alongside the Earnshaws and later working for the Dead Rabbits Syndicate prior to joining Limbus Company.",
    cnDesc: "该罪人比起理论思考更偏爱实际行动。由于他丝毫不去掩饰自己的想法和感情，而是全部通过表情与话语加以表达，经理在与其建立联系的过程中可能会引发头痛（或是受到物理意义上会引发头痛的外伤……）希望您谨记在该罪人的思维模式中并不存在深入思考这一项。以防万一，如果出现长时间无法平息其愤怒的情况，请您联系人事部。正因为该罪人的思维模式愚钝且单纯，一旦您掌握其性格，处理起来就会变得十分简单。"
  },
  is: {
    quote: "If you please, call me Ishmael.",
    engDesc: "Ishmael is a straight-laced and dependable woman with a tendency for blunt words. She was previously affiliated with the Pequod and its crew, and subsequently spent a number of years working as a Fixer prior to joining Limbus Company.",
    cnDesc: "身为经理，面对大多各有缺点的罪人，您或许会感到困惑和无力。然而请放心，该罪人是能够不加抱怨地执行各种命令的少数罪人之一。由于该罪人能做出合理的判断，因此若您想要寻求建议，看向她并予以提问应当是一个好办法。但请记住，她是从那片深远且广阔的水域中历经艰难旅途得以生还的罪人，故而其忍耐力可以说是深不见底，然而，一旦与她的关系开始走向歧途，要恢复可能就十分困难了。"
  },
  ro: {
    quote: "Если бы она могла совсем забыться и начать всё сызнова.",
    engDesc: "More frequently known as Rodya, she is a lively and nonchalant woman with a preference for informal conversation. She was previously affiliated with Yurodiviye, having worked to overturn the injustices of the District 25 Backstreets prior to joining Limbus Company.",
    cnDesc: "该罪人明显展现出后巷出身所特有的缺陷。她拜金且嗜赌，建议经理对其密切关注。她很擅长用笑话或眨眼睛来应付您的指示，建议时常向其展现经理的威严。该罪人会可能不定期地情绪低落，在经理的立场上并不能为其提供帮助，因此静静等候才最有效率。"
  },
  da: {
    quote: "Lasciate ogne speranza, voi ch'intrate.",
    engDesc: "Dante is a relatively grounded and attentive manager with a tendency to make quips. The game opens with them purposefully wiping their memory and replacing their head with a prosthetic clock, only to be approached and recruited by Limbus Company minutes later.",
    cnDesc: "LCB的执行经理"
  },
  es: {
    quote: "Die böse Welt indessen begann schon mitten in unserem eigenen Hause.",
    engDesc: "More frequently known as just Sinclair, he is an anxious and self-conscious man with a blatantly empathetic nature. He was previously affiliated with the prosthetic-famous town of Calw, having lived and attended school there prior to joining Limbus Company.",
    cnDesc: "即使考虑到该罪人处于不稳定的成长阶段，其与人交谈时仍常常紧皱眉头或表现出过度的惊讶。由于其尚不习惯战斗，因此最初可能甚至连内脏都不敢直视。鉴于罪人中不乏具有暴力倾向的人，因此我们建议经理在对待他时以鼓励为主，而不是惩罚。该罪人有时会释放杀气，尽管其本人并不自觉，但我司认为这表明其在我司业务范围内很有潜力。只要给予适当的刺激，我们相信他会有长足的成长。"
  },
  ou: {
    quote: "Είμαι... ου τις απολύτως.",
    engDesc: "Outis is a brusque and assertive woman with a poorly-disguised inclination to look down on those around her. Previously affiliated with the Smoke War, she has a tendency to judge others based on her experiences there prior to joining Limbus Company.",
    cnDesc: "该罪人或许能够成为优秀的顾问，但这取决于经理的能力。然而，考虑到其多管闲事的性格，建议您适当地简短附和。由于她在包括战术在内的多个领域均是专家，因此寻求她的建议非常有效。此外，该罪人还对工坊技术有深入了解，因此您也可以放心地委任她对巴士进行简单的维护工作。\n[注意] - 与其他罪人不同，禁止阅览该罪人的过往记录。\n[注意] - 请密切关注该罪人，以防止其在任务之外另起心思。"
  },
  gw: {
    quote: "That's that, and this is this.",
    engDesc: "Roland (롤랑, Lollang) is one of the main protagonists, a playable character in Library Of Ruina and the servant of Angela, following his story in the Library across the game. He used to be a Grade 9 Fixer of a one-man Office before he wandered into the Library. He is the first Librarian that the player can use, and becomes the Patron Librarian of the first Floor to be unlocked: the Keter Floor of General Works.",
    cnDesc: "罗兰是一名1阶收尾人，图书馆的总类层指定司书，安吉拉的侍从，也是游戏的两位主角之一。作为一名经验丰富的收尾人，罗兰对于都市有着较为深入的了解，常向安吉拉介绍都市中的情况。"
  },
  hi: {
    quote: "Malkuth wanted others to know, about how diverse and brilliant colors are... About how colors are ever-changing and free-form, like how the mix of two colors can bring a brand new color! That's what she thought, at least.",
    engDesc: "Malkuth (말쿠트, Malkuteu) is the Patron Librarian of the Library's Floor of History, and the former Sephirah of the Control Team of Lobotomy Corporation's headquarters. She is met upon unlocking her Floor, after finishing all three episodes of Yun's Office.",
    cnDesc: "Malkuth是图书馆的历史层指定司书，前身名叫伊莉亚。在第一次人生中，她是卡门研究所的一名研究员。脑叶公司时期，Malkuth担任控制部Sephirah。Malkuth乐于承担大量工作，工作时总是充满干劲，但她缺乏耐心，较为急躁，常常犯下一些小错误。"
  },
  ts: {
    quote: "We live in a world where everything changes constantly. It is not necessarily rational or wise to blindly follow a goal determined in the past. To keep up with the rapid changes this world goes through, we must maintain discretion at all times.",
    engDesc: "Yesod (예소드, Yesodeu) is the Patron Librarian of the Floor of Technological Sciences in the Library, and former Sephirah of the Information Team of Lobotomy Corporation. He is met after unlocking his Floor, after completing the episode Hook Office.",
    cnDesc: "Yesod是图书馆的科技层指定司书，前身名叫加百利。在第一次人生中，他是卡门研究所的一名研究员。脑叶公司时期，Yesod担任情报部Sephirah。Yesod拥有理性的思维方式，他注重仪容仪表，喜欢整洁的环境。"
  },
  li: {
    quote: "The story of one's life is written out like a book of its own. And in that story, comedy and tragedy intertwine in a complex way. It's hard to define anyone as pure evil, or pure good for that matter.",
    engDesc: "Hod (호드, Hodeu) is the Patron Librarian of the Floor of Literature in the Library, and former Sephirot of the Training Team in Lobotomy Corporation. She is met after unlocking her Floor, after completing Episode 1 of Streetlight Office.",
    cnDesc: "Hod是图书馆的文学层指定司书，前身名叫米歇尔。在第一次人生中，她是卡门研究所的一名研究员。脑叶公司时期，Hod担任培训部Sephirah。Hod天性温柔善良，总是对他人保持着友善的态度，但她过于内向胆怯，难以承受心理上的负担。"
  },
  ar: {
    quote: "I tried so hard building a sand castle, and it got swept away by the waves...",
    engDesc: "Netzach (네짜흐, Nejjaheu) is the Patron Librarian of the Floor of Art in the Library, and former Sephirah of the Safety Team in Lobotomy Corporation. He is met after unlocking his Floor, after the Library is promoted to Urban Legend.",
    cnDesc: "Netzach是图书馆的艺术层指定司书，前身名叫乔凡尼。\n\nNetzach在第一次人生中很早就认识了卡门，后来成为她的心灵治疗病人之一。在卡门死后，他被艾因欺骗去参加实验，误以为这个实验能够让卡门复活，最终在痛苦中死去。\n\n正如他在脑叶公司的工作一样，Netzach非常不喜欢自己在图书馆的身份。他厌恶夺取他人性命，经常对收到的书籍不加分类，并选择滥用书籍的力量来换取啤酒等物品。他在与罗兰的谈话中透露出悲观的态度，但随着故事的发展，似乎逐渐对罗兰产生了一些好感。\n\n与其他与安吉拉意见相左的指定司书一样，Netzach对安吉拉在脑叶公司发生的事心怀不满。在所有司书中，他自认为最有发言权，主动将自己的痛苦归咎于她。"
  },
  ns: {
    quote: "The same book can show different things each time you read it. Understanding a book completely is a repetitive process, you know? ...and I don't want to stay ignorant forever. That's annoying.",
    engDesc: "Tiphereth (티페리트, Tipeliteu) is the Patron Librarian of the Floor of Natural Sciences in the Library, and former Sephirah of the Central Command Team in Lobotomy Corporation. She is met after unlocking her Floor, after leveling up all lower floors to Level 4.",
    cnDesc: "Tiphereth是图书馆的自然层指定司书，前身名叫丽莎。在第一次人生中，她是被卡门收养的孩子之一，与伊诺克一起由艾因照顾。脑叶公司时期，Tiphereth与另一位Tiphereth（二人通常被称为Tiphereth A与Tiphereth B）共同担任中央本部的Sephirah，分别管理中央一区和二区。她负责整理与都市自然科学有关的书籍，是游戏流程中出现的第六位指定司书。"
  },
  la: {
    quote: "You know what's funny, though? Even if one were to have power, that power would only strike down, not up...",
    engDesc: "Gebura (게부라, Gebula) is the Patron Librarian of the Floor of Language in the Library, and formerly the Sephirot of Lobotomy Corporation's Disciplinary Team. In her original human life, her name was Kali, a legendary Color Fixer under the title of The Red Mist. She is met after unlocking her Floor, after completing the Reception of Shi Association.",
    cnDesc: "Gebura是图书馆的语言层指定司书，前身名叫卡莉。在第一次人生中，她是被赋予称号“殷红迷雾”的1阶收尾人，主要在都市西部活动。脑叶公司时期，Gebura担任惩戒部Sephirah。Gebura的文化水平不高，有抽烟的嗜好。在游戏中，Gebura的前身卡莉也会作为安吉拉模拟的来宾出场。"
  },
  ss: {
    quote: "Here, why don't you take a comfy seat and drink some coffee~",
    engDesc: "Chesed (헤세드, Hesedeu) is the Patron Librarian of the Floor of Social Sciences in the Library, and former Sephirah of the Welfare Team in Lobotomy Corporation. He is met after unlocking his Floor, after finishing the first episode of Puppets.",
    cnDesc: "Chesed是图书馆的社会层指定司书，前身名叫丹尼尔。在第一次人生中，他是卡门研究所的一名研究员。脑叶公司时期，Chesed担任福利部Sephirah。他负责收集和整理与都市社会科学有关的书籍，是游戏流程中出现的第八位指定司书。Chesed性格温和，富有礼节和社交技巧，乐于与人交往，但有时也会显得有些夸张，喜欢打趣。"
  },
  ph: {
    quote: "You bear a poison, heavy and slow... yet deadly. I know you well, even though you know nothing about me.",
    engDesc: "Binah (비나, Bina) is the Patron Librarian of the Library's Floor of Philosophy, formerly the Sephirah of Lobotomy Corporation's Extraction Team, and a former Arbiter of the Head. She is met after promoting the Library to Star of the City and subsequently unlocking her Floor.",
    cnDesc: "Binah是图书馆的哲学层指定司书，前身名叫加里翁。在第一次人生中，她是首脑的调律者。脑叶公司时期，Binah担任研发部Sephirah。她是游戏流程中出现的第九位指定司书。"
  },
  re: {
    quote: "I have no obligation to treat you ilk with any courtesy or greeting. Any faith I would have has long been crushed.",
    engDesc: "Hokma (호크마, Hokeuma) is the Patron Librarian of the Floor of Religion in the Library, and former Sephirah of the Record Team in Lobotomy Corporation. He is met after unlocking his Floor, after completing any Star of the City level reception.",
    cnDesc: "Hokma是图书馆的宗教层指定司书，前身名叫本杰明。在第一次人生中，他是卡门研究所的一名研究员。脑叶公司时期，Hokma担任记录部Sephirah。他是游戏流程中出现的第十位指定司书，同时也是最后一位登场的司书。Hokma看起来非常严肃，已经失去了他曾经拥有的信仰。他对安吉拉表现出强烈的厌恶，甚至延伸到罗兰。但他仍然忠于艾因，视其为自己极为敬仰的同事，并相信艾因的目标是正确的，终有一天会实现他所梦想的世界。"
  },
  g: {
    quote: "All Alternates, Including me, Speaks in Base64, But I can speak normal with you.",
    engDesc: "G, full name Geneti Phulst, is the Founder and Supreme Tier Scientist of the G Foundation. Usually, he is far from normal, often speaking in Base64 with strangers, since Base64 is the native language of the Alternate Race. However, G himself is not ordinary—he is a vessel, the strongest vessel containing a Void LordGod. He is the Void itself.",
    cnDesc: "G，全名杰尼提·法斯特，G基金会的会长和至高科学家。他并不正常，经常用Base64语言与陌生人交流，而伪人的母语正是Base64。但G本人并非普通人，而是一个载体，一个极其强大的载体，体内收容着一位虚空主神……他就是虚空的化身。"
  },
  nathan: {
    quote: "O Natz Yuary, O Hxotmy znks hgiq zu cnkxk znke yzge...",
    engDesc: "Nathan Redshed, the Lord of Underworld, also the Red Dust Prodigy, the being who makes every soulborne stay in fear every minute every second; for them, Nathan is the most lethal being.",
    cnDesc: "内森·雷德谢德，冥界之主，也是血尘天骄，是一个让所有魂系生物畏惧的存在，对他们来说，听到内森的名字就会被吓得到处逃逸。"
  }
};

// Populate Characters
function allCharacters(){
  const arr = []; Object.values(CHARACTERS).forEach(list=> list.forEach(c=>arr.push(c))); return arr;
}
function cardFor(c){
  const card = document.createElement('div'); card.className='card character r-red';
  const meta = document.createElement('div'); meta.className='meta';
  const name = document.createElement('div'); name.className='name';
  name.textContent = currentLang()==='zh' ? (charNameFor(c.name) || c.name) : c.name;
  const tag = document.createElement('div'); tag.className='tag'; tag.textContent='Character';
  const media = document.createElement('div'); media.className='media';
  if (c.image){ const img = document.createElement('img'); img.alt=c.name; img.src=c.image; media.appendChild(img); }
  meta.append(name, tag); card.append(meta, media);
  card.style.cursor='pointer';
  card.addEventListener('click', ()=> showCharacterModal(c));
  return card;
}

function showCharacterModal(c) {
  // If this is Geneti, require mcpass unlock before showing info
  if (c.id === 'g') {
    // open morse lock and wait for success event once
    if (window.mcpassOpen) window.mcpassOpen();
    // mcpass.js dispatches 'mcpass:success' on success
    const onSucc = (ev) => {
      window.removeEventListener('mcpass:success', onSucc);
      // proceed to show normally after unlock
      actuallyShow();
    };
    window.addEventListener('mcpass:success', onSucc, { once: true });
    return;
  }

  // otherwise show immediately
  actuallyShow();

  function actuallyShow(){
    miniPanel.innerHTML = '';
    
    // Character image
    const img = document.createElement('img'); 
    img.src = c.image; 
    img.alt = c.name;
    img.style.width = '100%'; 
    img.style.borderRadius = '10px'; 
    img.style.marginBottom = '12px';
    
    // Character name
    const title = document.createElement('div'); 
    title.style.fontWeight='800'; 
    title.style.marginBottom='8px'; 
    title.textContent = currentLang()==='zh' ? (charNameFor(c.name) || c.name) : c.name;
    
    // Quote
    const quote = document.createElement('div');
    quote.style.fontStyle = 'italic';
    quote.style.fontSize = '14px';
    quote.style.marginBottom = '12px';
    quote.style.padding = '10px';
    quote.style.background = 'rgba(255,255,255,0.05)';
    quote.style.borderRadius = '8px';
    quote.style.borderLeft = '3px solid var(--accent)';
    
    // Description
    const desc = document.createElement('div'); 
    desc.style.fontSize = '13px';
    desc.style.lineHeight = '1.5';
    
    // Check if we have special data for this character
    const charId = c.id;
    if (CHARACTER_DATA[charId]) {
      quote.textContent = CHARACTER_DATA[charId].quote;
      desc.textContent = currentLang() === 'zh' ? 
        CHARACTER_DATA[charId].cnDesc : 
        CHARACTER_DATA[charId].engDesc;
    } else {
      // Default behavior for characters without special data
      quote.textContent = currentLang() === 'zh' ? '名言待添加...' : 'Quote coming soon...';
      desc.textContent = currentLang() === 'zh' ? 
        '该角色的详细描述将稍后添加。' : 
        'Detailed description coming soon.';
    }
    
    miniPanel.append(title, img, quote, desc, miniClose);
    mini.classList.add('show');
  }
}

function showCharacters(){
  grid.innerHTML=''; allCharacters().forEach(c=> grid.appendChild(cardFor(c)));
}

function openGallery(){ overlay.classList.add('show'); showCharacters(); }
function closeGallery(){ overlay.classList.remove('show'); }

btn.addEventListener('click', openGallery);
overlay.addEventListener('click', (e)=>{ if(e.target===overlay) closeGallery(); });
window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeGallery(); });

// Tabs (Item to be implemented later)
tabChar.addEventListener('click', ()=>{
  tabChar.classList.add('active'); tabItem.classList.remove('active'); showCharacters();
});
tabItem.addEventListener('click', ()=>{
  tabItem.classList.add('active'); tabChar.classList.remove('active');
  grid.innerHTML = '<div style="color:var(--muted)">Item gallery coming soon...</div>';
});