const PROFILES = [
  { name:'Lauris Raruzy', img:'lr.png', text:'Welcome, Captain, You have made a lot of Effort on Protecting our G Foundation.', seq:['Alpha','Gamma','Epsilon'] },
  { name:'Mysterio', img:'mtr.png', text:'Welcome, The one who stays in shadow and The Border.', seq:['Beta','Delta','Zeta'] },
  { name:'Geneti Phulst', img:'gp.png', text:'Welcome, The Supreme Founder of us G Foundation, there will be no Foundation without your effortness.', seq:['Alpha','Gamma','Zeta'] },
  { name:'Genetina Phasty', img:'gnp.png', text:'Welcome, The Sister of The Founder, The supreme Swordart of the Foundation.', seq:['Alpha','Gamma','Zeta'] },
  { name:'Moriarty Zecto Crescent', img:'mzc.png', text:'Welcome, The Prodigy of Crescent Family, Crescent Star, Thank you for your effort on Quantum Energy in the Foundation.', seq:['Gamma','Epsilon','Zeta'] },
  { name:'Deep Abyss', img:'das.png', text:'Welcome, The one who exist, and does not exist, lies in void.', seq:['Alpha','Gamma','Epsilon'] }
];
const MAP = { Alpha:'α', Beta:'β', Gamma:'γ', Delta:'δ', Epsilon:'ε', Zeta:'ζ' };
const KEYS = ['α','β','γ','δ','ε','ζ'];

function el(t,c,txt){ const e=document.createElement(t); if(c) e.className=c; if(txt!=null) e.textContent=txt; return e; }

const fab = document.getElementById('scpass-fab');
const overlay = el('div','scpass-overlay');
const panel = el('div','scpass-panel');
const closeBtn = el('button','scpass-close','✕');
closeBtn.addEventListener('click', ()=> overlay.classList.remove('show'));

const left = el('div','sc-left'); const right = el('div','sc-right');
panel.append(closeBtn,left,right); overlay.appendChild(panel); document.body.appendChild(overlay);
overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.classList.remove('show'); });

const progWrap = el('div','sc-progress');
const bar = el('div','sc-bar'); const ptxt = el('div','sc-ptext','Identity Verifying...');
progWrap.append(bar, ptxt);
left.append(el('div','sc-title','Verification'), progWrap);

const uTitle = el('div','sc-title',''); const uText = el('div','sc-text','');
const img = new Image(); img.className='sc-photo';
const labels = el('div','sc-labels');
['Alpha','Beta','Gamma','Delta','Epsilon','Zeta'].forEach(n=>{
  const b=el('div','sc-lab', n); b.dataset.lab=n; labels.appendChild(b);
});
left.append(uTitle, uText, img, labels);

const entryTitle = el('div','sc-title','Enter Symbol Code');
const entry = el('div','sc-entry');
const b1=el('div','sc-box'); const b2=el('div','sc-box'); const b3=el('div','sc-box');
entry.append(b1,b2,b3);
const pad = el('div','sc-pad');
KEYS.forEach(k=>{ const b=el('button','sc-key',k); b.onclick=()=> press(k); pad.appendChild(b); });
right.append(entryTitle, entry, pad);

let current = null; let input=[]; const boxes=[b1,b2,b3];

function startProgress(next){
  bar.style.width='0%'; bar.style.background='#2bb673'; ptxt.textContent='Identity Verifying...'; progWrap.style.opacity='1';
  let p=0; const t=setInterval(()=>{
    p += Math.floor(Math.random()*7)+3; if(p>90) p=90;
    bar.style.width=p+'%';
    if(p>=90){ clearInterval(t); setTimeout(()=>{
      bar.style.background='#ef233c'; ptxt.textContent='Identity Verifying Failure'; setTimeout(()=>{
        progWrap.style.opacity='0'; setTimeout(next, 240);
      }, 700);
    }, 120); }
  }, 90);
}
function newProfile(){
  input=[]; boxes.forEach(b=>{ b.textContent=''; b.classList.remove('ok','err'); });
  Array.from(labels.children).forEach(n=> n.classList.remove('ok'))
  current = PROFILES[Math.floor(Math.random()*PROFILES.length)];
  uTitle.textContent = current.name;
  uText.textContent = current.text;
  img.src = current.img; img.alt = current.name;
  current.seq.forEach(n=>{
    const node = labels.querySelector(`[data-lab="${n}"]`);
    if(node) node.classList.add('ok');
  });
}
function press(sym){
  if(!current) return;
  if(input.length>=3) return;
  input.push(sym);
  boxes[input.length-1].textContent = sym;
  if(input.length===3){
    const goal = current.seq.map(s=> MAP[s]).join('');
    const got = input.join('');
    if(got===goal){
      boxes.forEach(b=> b.classList.add('ok'));
      setTimeout(()=>{
        overlay.classList.remove('show'); window.dispatchEvent(new CustomEvent('scpass:success',{detail:{user:current.name}}));
      }, 600);
    } else {
      boxes.forEach(b=> b.classList.add('err'));
      setTimeout(()=>{
        boxes.forEach(b=>{ b.classList.remove('err'); b.textContent=''; });
        input=[];
      }, 600);
    }
  }
}
function open(){
  overlay.classList.add('show');
  // clear previous profile immediately so user info is removed until newProfile runs after progress
  current = null;
  uTitle.textContent = '';
  uText.textContent = '';
  img.src = '';
  Array.from(labels.children).forEach(n=> n.classList.remove('ok'));
  boxes.forEach(b=>{ b.textContent=''; b.classList.remove('ok','err'); });
  startProgress(()=>{ newProfile(); });
}

if(fab){ fab.addEventListener('click', open); }
window.scpassOpen = open;