let audio;
export function playGTheme(){
  stopTheme();
  audio = new Audio('Incoercibilis.mp3');
  audio.loop = true;
  audio.volume = 0.5;
  audio.play().catch(()=>{});
}
export function stopTheme(){
  if(audio){ audio.pause(); audio.currentTime = 0; audio = null; }
}

