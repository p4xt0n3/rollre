const PASSWORD_SYMBOLS = ["☟︎","♏︎","♓︎","●︎","🗏︎"];
const TARGET = "☟︎♏︎♓︎●︎🗏︎🗏︎🗏︎";

import { getItemRates, getCharRates, setItemRates, setCharRates } from "rarity";

function el(tag, cls, text){ const e=document.createElement(tag); if(cls) e.className=cls; if(text!=null) e.textContent=text; return e; }

const overlay = el('div','debug-overlay');
const panel = el('div','debug-panel');
overlay.appendChild(panel);
document.body.appendChild(overlay);

function openOverlay(){ overlay.classList.add('show'); }
function closeOverlay(){ overlay.classList.remove('show'); panel.innerHTML=''; }

function buildPasswordPanel(){
  panel.innerHTML = '';
  const title = el('div','debug-title',"Welcome, Mr. Geneti Phulst, The Leader of our G Foundation");
  const passbox = el('div','passbox');
  const display = el('div','pass-display');
  const msg = el('div','pass-msg','Enter the sequence using the keypad.');
  let input = '';
  let attempts = 0;

  const keypad = el('div','keypad');
  PASSWORD_SYMBOLS.forEach(sym=>{
    const b = el('button','',sym);
    b.addEventListener('click',()=>{
      input += sym;
      display.textContent = input;
      // auto-check when reaches target length
      if(input.length >= TARGET.length){
        if(input === TARGET){
          display.textContent = 'Heil 333';
          display.classList.add('heil');
          setTimeout(()=>{ buildDebugMenu(); }, 600); // after shine sequence
        } else {
          attempts++;
          msg.textContent = 'Wrong Password, Retry...';
          input = '';
          setTimeout(()=>{ display.textContent = ''; }, 300);
          if(attempts >= 3){
            closeOverlay();
            setTimeout(()=>alert('You are not him.'), 50);
          }
        }
      }
    });
    keypad.appendChild(b);
  });

  passbox.append(display);
  panel.append(title, passbox, msg, keypad);
}

function buildDebugMenu(){
  panel.innerHTML = '';
  const title = el('div','debug-title','Debug Menu • Chance Rates');
  const sub = el('div','pass-msg','Edit drop chances (percent). Values can be any non-negative numbers.');
  const grid = el('div','debug-grid');

  const items = getItemRates();
  const chars = getCharRates();

  const fields = {};
  function makeField(label, value){
    const f = el('div','debug-field');
    const l = el('label','',label);
    const i = document.createElement('input'); i.type='number'; i.step='0.1'; i.min='0'; i.value=String(value);
    f.append(l,i); grid.appendChild(f);
    fields[label]=i;
  }

  // Items
  makeField('Items • Blue', findP(items,'blue'));
  makeField('Items • Purple', findP(items,'purple'));
  makeField('Items • Gold', findP(items,'gold'));
  makeField('Items • Red', findP(items,'red'));
  // Characters
  makeField('Chars • Red', findP(chars,'red'));
  makeField('Chars • Black', findP(chars,'black'));

  const actions = el('div','debug-actions');
  const cancel = el('button','', 'Close');
  const apply = el('button','', 'Apply');

  cancel.addEventListener('click', closeOverlay);
  apply.addEventListener('click', ()=>{
    const blue = num(fields['Items • Blue'].value);
    const purple = num(fields['Items • Purple'].value);
    const gold = num(fields['Items • Gold'].value);
    const red = num(fields['Items • Red'].value);
    // allow any non-negative values (freeform)
    if([blue,purple,gold,red].some(v=> !isFinite(v) || v < 0)){
      alert('Item rates must be non-negative numbers.');
      return;
    }
    const cred = num(fields['Chars • Red'].value);
    const cblk = num(fields['Chars • Black'].value);
    if([cred,cblk].some(v=> !isFinite(v) || v < 0)){
      alert('Character rates must be non-negative numbers.');
      return;
    }
    const newItems = [
      {key:'red', p:red},{key:'gold', p:gold},{key:'purple', p:purple},{key:'blue', p:blue}
    ];
    const newChars = [
      {key:'black', p:cblk},{key:'red', p:cred}
    ];
    setItemRates(newItems);
    setCharRates(newChars);
    alert('Rates updated.');
  });

  actions.append(cancel, apply);
  panel.append(title, sub, grid, actions);
}

function findP(list, key){
  const x = list.find(r=>r.key===key);
  return x ? x.p : 0;
}
function num(v){ const n = parseFloat(v); return isNaN(n)?0:n; }

// FAB
const fab = document.getElementById('debug-fab');
fab.addEventListener('click', ()=>{
  buildPasswordPanel();
  openOverlay();
});
// Close when clicking outside panel
overlay.addEventListener('click',(e)=>{
  if(e.target === overlay) closeOverlay();
});