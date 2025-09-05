function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
export function computeDamage(actor, action){
  if(action==='attack') return rand(40,50);
  if(action==='special'){
    if(actor.kind==='player') return rand(80,100); // Nathan
    return rand(100,130); // G
  }
  return 0;
}
export function applyDefenseFlag(target, incoming){
  if(!target.defending) return incoming;
  // 50% half, 50% zero
  const half = Math.random()<0.5;
  target.defending = false;
  return half ? Math.floor(incoming/2) : 0;
}
export function botChooseAction(){
  const r = Math.random();
  if(r<0.1) return 'defend';
  if(r<0.55) return 'attack';
  return 'special';
}
export function sequenceAttack(container, attackerEl, targetEl, amount, onHit, onDone){
  const aRect = attackerEl.getBoundingClientRect();
  const tRect = targetEl.getBoundingClientRect();
  const dx = (tRect.left + tRect.width/2) - (aRect.left + aRect.width/2);
  const dy = (tRect.top + tRect.height/2) - (aRect.top + aRect.height/2);
  attackerEl.classList.add('attacking');
  attackerEl.style.transform = `translate(${dx*0.6}px, ${dy*0.1}px)`;
  setTimeout(()=>{
    onHit?.();
    floatText(container, targetEl, `-${amount}`);
    attackerEl.style.transform = `translate(0,0)`;
    setTimeout(()=>{ attackerEl.classList.remove('attacking'); onDone?.(); }, 240);
  }, 260);
}
export function floatText(container, targetEl, text){
  const f = document.createElement('div');
  f.className = 'floater';
  f.textContent = text;
  container.appendChild(f);
  const r = targetEl.getBoundingClientRect();
  const c = container.getBoundingClientRect();
  f.style.left = (r.left - c.left + r.width/2 - 10) + 'px';
  f.style.top = (r.top - c.top - 6) + 'px';
  requestAnimationFrame(()=>{
    f.style.opacity = '1';
    f.style.transform = 'translateY(-20px)';
    setTimeout(()=>{ f.style.opacity='0'; f.style.transform='translateY(-40px)'; setTimeout(()=>f.remove(), 400); }, 600);
  });
}

// new helper: ensure only one of the same unit id can be selected
export function canAddUnit(list, id){
  return !list.some(u => u.id === id);
}