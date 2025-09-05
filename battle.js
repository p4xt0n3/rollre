import { PLAYABLE } from "./battlechr.js";
import { ENEMIES } from "./battleenm.js";
import { computeDamage, applyDefenseFlag, botChooseAction, sequenceAttack, canAddUnit } from "./battlemech.js";
import { playGTheme, stopTheme } from "./battletheme.js";

/* UI scaffolding */
const btn = document.getElementById('battle-btn');
const overlay = el('div','b-overlay');
const panel = el('div','b-panel');
const closeBtn = el('button','b-close','✕');
closeBtn.addEventListener('click', close);

const top = el('div','b-top');
const title = el('div','b-title','Battle • Custom');
top.append(title);

const body = el('div','b-body');
const stage = el('div','b-stage');
const palette = el('div','b-palette');

panel.append(closeBtn, top, body);
body.append(stage, palette);
overlay.appendChild(panel);
document.body.appendChild(overlay);

function el(t,c,txt){ const e=document.createElement(t); if(c) e.className=c; if(txt!=null) e.textContent=txt; return e; }

/* Team selection */
const pickP = el('div'); const pickE = el('div');
const pTitle = el('div',null,'Your Team (max 4)');
const eTitle = el('div',null,'Enemy Team (max 4)');
const pGrid = el('div','pick-grid'); const eGrid = el('div','pick-grid');
const pTeamRow = el('div','team-row'); const eTeamRow = el('div','team-row');
const startBtn = el('button','start-btn','Start Battle');

pickP.append(pTitle, pGrid, el('div','badge','Available: Nathan Redshed'), el('div',null,'Selected:'), pTeamRow);
pickE.append(eTitle, eGrid, el('div','badge','Available: Geneti Phulst'), el('div',null,'Selected:'), eTeamRow);
palette.append(el('div',null,'Custom Mode'), pickP, pickE, startBtn);

function buildPickGrid(){
  pGrid.innerHTML=''; eGrid.innerHTML=''; pTeamRow.innerHTML=''; eTeamRow.innerHTML='';
  PLAYABLE.forEach(c=> pGrid.appendChild(card(c, 'player')));
  ENEMIES.forEach(c=> eGrid.appendChild(card(c, 'enemy')));
}
function card(data, side){
  const c = el('div','pick-card');
  const img=new Image(); img.src=data.image; c.append(img, el('div',null,data.name));
  c.addEventListener('click', ()=>{
    const list = side==='player'? selPlayers : selEnemies;
    if(list.length>=4){ flash(c); return; }
    // prevent selecting same character more than once
    if(!canAddUnit(list, data.id)){
      flash(c);
      return;
    }
    list.push(cloneUnit(data, side));
    refreshTeams();
  });
  return c;
}
function cloneUnit(d, kind){
  return { id:d.id, name:d.name, image:d.image, maxHp:d.maxHp, hp:d.maxHp, kind, defending:false, action:null, target:null, node:null, hpFill:null };
}
function refreshTeams(){
  pTeamRow.innerHTML=''; eTeamRow.innerHTML='';
  selPlayers.forEach((u,i)=>{
    const b = el('div','badge', `${u.name} ✕`);
    b.style.cursor='pointer'; b.onclick=()=>{ selPlayers.splice(i,1); refreshTeams(); };
    pTeamRow.appendChild(b);
  });
  selEnemies.forEach((u,i)=>{
    const b = el('div','badge', `${u.name} ✕`);
    b.style.cursor='pointer'; b.onclick=()=>{ selEnemies.splice(i,1); refreshTeams(); };
    eTeamRow.appendChild(b);
  });
}
function flash(node){ node.style.borderColor='#ef233c'; setTimeout(()=>node.style.borderColor='#1f2630', 300); }

let selPlayers = []; let selEnemies = [];
buildPickGrid();

/* Battle runtime */
let state = null;

startBtn.addEventListener('click', ()=>{
  if(!selPlayers.length || !selEnemies.length){ alert('Pick at least 1 unit for each side.'); return; }
  startBattle(selPlayers.map(u=>({...u})), selEnemies.map(u=>({...u})));
});

function startBattle(players, enemies){
  // stage setup
  stage.innerHTML='';
  const leftSide = el('div'); const rightSide = el('div');
  // arrange teams vertically so there's space in middle for actions/animations
  leftSide.style.display='flex'; leftSide.style.flexDirection='column'; leftSide.style.alignItems='center'; leftSide.style.gap='18px';
  rightSide.style.display='flex'; rightSide.style.flexDirection='column'; rightSide.style.alignItems='center'; rightSide.style.gap='18px';
  stage.append(leftSide, rightSide);

  // create unit nodes
  players.forEach(u=> leftSide.appendChild(makeUnitNode(u,true)));
  enemies.forEach(u=> rightSide.appendChild(makeUnitNode(u,false)));

  state = { turn:'player', players, enemies, queue:[], lock:false };

  // action selection UI for players
  players.forEach(u=> {
    u.node.addEventListener('click', ()=> {
      if(state.turn!=='player' || state.lock) return;
      showWheel(u);
    });
  });

  // theme if fighting G
  if(enemies.some(e=>e.id==='g')) playGTheme(); else stopTheme();
}

function makeUnitNode(u, isPlayer){
  const n = el('div','unit ' + (isPlayer?'player-facing':'bot-facing'));
  const hp = el('div','hpbar'); const fill = el('div','fill'); hp.appendChild(fill);
  const nm = el('div','u-name', u.name);
  const img = new Image(); img.src = u.image; img.alt = u.name;
  img.className = isPlayer ? 'player' : 'enemy';
  n.append(hp, nm, img);
  u.node = n; u.hpFill = fill;
  updateHp(u);
  return n;
}
function updateHp(u){
  const pct = Math.max(0, u.hp) / u.maxHp * 100;
  u.hpFill.style.width = pct + '%';
}

function showWheel(u){
  // ensure only one wheel
  document.querySelectorAll('.action-wheel').forEach(x=>x.remove());
  const w = el('div','action-wheel');
  const a = btnAct('Attack', ()=> { u.action='attack'; pickTarget(u); });
  const d = btnAct('Defence', ()=> { u.action='defend'; u.defending=true; commitAndNext(u); });
  const s = btnAct('Special', ()=> { u.action='special'; pickTarget(u); });
  w.append(a,d,s);
  u.node.appendChild(w);
}
function btnAct(label,fn){ const b=el('button',null,label); b.onclick=(e)=>{e.stopPropagation(); fn();}; return b; }

function pickTarget(u){
  // highlight enemies for click
  state.enemies.filter(alive).forEach(t=>{
    t.node.style.outline='2px solid #2b7ab1';
    const handler = ()=>{
      t.node.style.outline='';
      t.node.removeEventListener('click', handler, true);
      u.target = t;
      commitAndNext(u);
    };
    t.node.addEventListener('click', handler, true);
  });
}

function commitAndNext(u){
  // remove wheel
  document.querySelectorAll('.action-wheel').forEach(x=>x.remove());
  state.queue.push(u);
  // next selection until queued all alive players
  const alivePlayers = state.players.filter(alive);
  if(state.queue.length < alivePlayers.length){
    // wait for user to pick others
    return;
  }
  // execute player phase
  runPhase('player', ()=>{
    // bot chooses
    botPlan();
    runPhase('enemy', ()=>{
      // clear for next round if both have alive
      if(state.players.some(alive) && state.enemies.some(alive)){
        state.turn='player'; state.queue=[];
      } else {
        endBattle();
      }
    });
  });
}

function runPhase(side, done){
  state.lock = true;
  const list = side==='player' ? state.queue.slice() : state.queue.slice();
  // if enemy, list was filled by botPlan
  function step(i){
    if(i>=list.length){ state.lock=false; state.queue=[]; return done(); }
    const actor = list[i];
    if(!alive(actor)){ return step(i+1); }
    const action = actor.action;
    if(action==='defend'){ // nothing to do
      step(i+1); return;
    }
    const target = actor.target && alive(actor.target) ? actor.target : pickRandomTarget(side==='player' ? state.enemies : state.players);
    if(!target){ step(i+1); return; }
    const dmg = computeDamage(actor, action);
    sequenceAttack(stage, actor.node, target.node, dmg, ()=>{
      const final = applyDefenseFlag(target, dmg);
      target.hp -= final;
      updateHp(target);
    }, ()=> step(i+1));
  }
  step(0);
}

function botPlan(){
  state.turn='enemy';
  state.queue=[];
  state.enemies.filter(alive).forEach(e=>{
    const act = botChooseAction();
    if(act==='defend'){ e.defending=true; e.action='defend'; e.target=null; }
    else { e.action = act; e.target = pickRandomTarget(state.players); }
    state.queue.push(e);
  });
}

function pickRandomTarget(arr){
  const aliveArr = arr.filter(alive);
  if(!aliveArr.length) return null;
  return aliveArr[Math.floor(Math.random()*aliveArr.length)];
}
function alive(u){ return u && u.hp>0; }

function endBattle(){
  state.lock=true;
  const pAlive = state.players.some(alive);
  // show in-panel result banner instead of alert
  let banner = panel.querySelector('.b-result');
  if(!banner){
    banner = el('div','b-result'); panel.appendChild(banner);
  }
  banner.textContent = pAlive ? 'Stage Clear' : 'Defeat';
  banner.classList.add('show');
  stopTheme();
  // hide after a short delay then close overlay
  setTimeout(()=>{ banner.classList.remove('show'); close(); }, 1400);
}

function open(){ overlay.classList.add('show'); }
function close(){ overlay.classList.remove('show'); stopTheme(); }
btn.addEventListener('click', ()=>{ open(); });

/* init */
closeBtn.addEventListener('click', close);
overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(); });