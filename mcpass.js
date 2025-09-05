const MORSE = {
  1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....",
  6: "-....", 7: "--...", 8: "---..", 9: "----.", 0: "-----"
};

function make(tag, cls, text){ 
  const e=document.createElement(tag); 
  if(cls) e.className=cls; 
  if(text!=null) e.textContent=text; 
  return e; 
}

const fab = document.getElementById('mcpass-fab');
const overlay = make('div','mcpass-overlay');
const panel = make('div','mcpass-panel');
const closeBtn = make('button','mcpass-close','✕');
closeBtn.addEventListener('click', ()=> overlay.classList.remove('show'));

const left = make('div','mcpass-left');
left.append(make('div','mcpass-title','Morse Code Dictionary (1–0)'));
const dict = make('div','mcpass-dict');
dict.innerHTML = `
1: .----<br>2: ..---<br>3: ...--<br>4: ....-<br>5: .....<br>
6: -....<br>7: --...<br>8: ---..<br>9: ----.<br>0: -----
`;
left.append(dict);

const right = make('div','mcpass-right');
const title = make('div','mcpass-title','Enter the 3-digit answer');
const question = make('div','mcpass-question','');
const boxes = make('div','mcpass-boxes');
const b1 = make('div','mcpass-box'); const b2 = make('div','mcpass-box'); const b3 = make('div','mcpass-box');
boxes.append(b1,b2,b3);

const keypad = make('div','mcpass-keypad');
[1,2,3,4,5,6,7,8,9,null,0,null].forEach(v=>{
  if(v===null){ const s=make('div'); keypad.appendChild(s); return; }
  const k = make('button','mcpass-key',String(v));
  if(v===0){ k.classList.add('wide'); }
  k.addEventListener('click',()=> press(v));
  keypad.appendChild(k);
});

right.append(title, question, boxes, keypad);
panel.append(left, right, closeBtn);
overlay.appendChild(panel);
document.body.appendChild(overlay);
overlay.addEventListener('click', (e)=>{ if(e.target===overlay) overlay.classList.remove('show'); });

let answer = [];
let input = [];
let boxEls = [b1,b2,b3];

function newPuzzle(){
  input = [];
  boxEls.forEach(b=>{ b.textContent=''; b.classList.remove('ok','err'); });
  answer = Array.from({length:3}, ()=> Math.floor(Math.random()*10));
  const morse = answer.map(n=> MORSE[n]).map(s=> `| ${s} |`).join(' ');
  question.textContent = morse;
}

function press(n){
  if(input.length>=3) return;
  const idx = input.length;
  input.push(n);
  boxEls[idx].textContent = String(n);
  if(input.length===3){
    const ok = input.every((v,i)=> v===answer[i]);
    if(ok){
      boxEls.forEach(b=>{ b.classList.add('ok'); });
      setTimeout(()=>{
        overlay.classList.remove('show');
        window.dispatchEvent(new CustomEvent('mcpass:success',{detail:{answer}}));
      }, 600);
    } else {
      boxEls.forEach(b=> b.classList.add('err'));
      setTimeout(()=>{ newPuzzle(); }, 650);
    }
  }
}

if (fab) {
  fab.addEventListener('click', ()=>{ overlay.classList.add('show'); newPuzzle(); });
}
// always expose opener for other modules (gallery)
window.mcpassOpen = ()=>{ overlay.classList.add('show'); newPuzzle(); };