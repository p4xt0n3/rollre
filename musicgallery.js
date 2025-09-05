const btn = document.getElementById('music-btn');

function el(t,c,txt){ const e=document.createElement(t); if(c) e.className=c; if(txt!=null) e.textContent=txt; return e; }

const overlay = el('div','music-overlay');
const panel = el('div','music-panel');
const top = el('div','music-top','Music Gallery');
const closeBtn = el('button','music-close','✕');
closeBtn.addEventListener('click', ()=> overlay.classList.remove('show'));
const body = el('div','music-body');

panel.append(closeBtn, top, body);
overlay.appendChild(panel);
document.body.appendChild(overlay);

const ENTRIES = [
  {
    character: 'Geneti Phulst',
    mainName: 'Incoercibilis',
    tracks: [
      { label: 'Whole Music • Incoercibilis', src: 'Incoercibilis.mp3' },
      { label: 'Stage 1', src: 'gstg1.mp3' },
      { label: 'Stage 2', src: 'gstg2.mp3' }
    ]
  },
  {
    character: 'Nathan Redshed',
    mainName: 'Eos Trucidavit',
    tracks: [
      { label: 'Whole Music • Eos Trucidavit', src: 'Eos Trucidavit.mp3' },
      { label: 'Stage 1', src: 'nstg1.mp3' },
      { label: 'Stage 2', src: 'nstg2.mp3' }
    ]
  }
];

function makePlayer(track){
  const card = el('div','music-card player-card');
  const header = el('div','music-row');
  const title = el('div','music-title', track.label);
  const controls = el('div','player-controls');
  const btnPlay = el('button','play-btn','▶');
  const progWrap = el('div','player-progress-wrap');
  const prog = el('div','player-progress');
  progWrap.appendChild(prog);
  controls.append(btnPlay, progWrap);
  header.append(title, controls);
  card.append(header);

  const audio = new Audio(track.src);
  audio.preload = 'none';
  let raf = null;
  let playing = false;

  function update(){
    if(!audio.duration || isNaN(audio.duration)) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    prog.style.width = pct + '%';
    if(!audio.paused) raf = requestAnimationFrame(update);
  }
  btnPlay.addEventListener('click', ()=>{
    if(playing){
      audio.pause();
      btnPlay.textContent = '▶';
      playing = false;
      if(raf) cancelAnimationFrame(raf);
    } else {
      // pause other players
      document.querySelectorAll('.music-card.audio-playing').forEach(n=>{
        n.classList.remove('audio-playing');
        const a = n._audioRef;
        if(a && !a.paused) a.pause();
        const b = n.querySelector('.play-btn');
        if(b) b.textContent = '▶';
      });
      audio.play().catch(()=>{});
      btnPlay.textContent = '⏸';
      playing = true;
      card.classList.add('audio-playing');
      card._audioRef = audio;
      raf = requestAnimationFrame(update);
    }
  });

  // allow click on progress to seek
  progWrap.addEventListener('click', (e)=>{
    if(!audio.duration) return;
    const r = progWrap.getBoundingClientRect();
    const x = e.clientX - r.left;
    const pct = Math.max(0, Math.min(1, x / r.width));
    audio.currentTime = pct * audio.duration;
    prog.style.width = (pct*100)+'%';
  });

  audio.addEventListener('ended', ()=> {
    btnPlay.textContent = '▶';
    playing = false;
    card.classList.remove('audio-playing');
    prog.style.width = '100%';
    if(raf) cancelAnimationFrame(raf);
  });
  audio.addEventListener('pause', ()=>{
    playing = false;
    btnPlay.textContent = '▶';
    card.classList.remove('audio-playing');
    if(raf) cancelAnimationFrame(raf);
  });
  audio.addEventListener('play', ()=>{
    playing = true;
    btnPlay.textContent = '⏸';
    card.classList.add('audio-playing');
    raf = requestAnimationFrame(update);
  });

  return card;
}

function build(){
  body.innerHTML = '';
  ENTRIES.forEach(entry=>{
    const section = el('div','music-card');
    const title = el('div','music-title', entry.character);
    const sub = el('div','music-sub', `Main Theme: ${entry.mainName}`);
    const rows = el('div','music-row');
    entry.tracks.forEach(t=>{
      rows.appendChild(makePlayer(t));
    });
    section.append(title, sub, rows);
    body.appendChild(section);
  });
}

function open(){ build(); overlay.classList.add('show'); }
if(btn){ btn.addEventListener('click', open); }