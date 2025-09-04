export function playStarAnimation(canvas, targetColorPath, onComplete) {
  const ctx = canvas.getContext('2d');
  let w = canvas.clientWidth, h = canvas.clientHeight;
  // ...existing code...
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  // ...existing code...
  const start = { x: w * 0.15, y: h * 0.15 };
  const mid   = { x: w * 0.5,  y: h * 0.45 };
  const end   = { x: w * 0.85, y: h * 0.85 };
  const duration = 1400; // ms
  const spinSpeed = 2.2 * Math.PI;
  const colors = {
    blue: "#3da9fc", purple: "#9b5de5", gold: "#f4c430", red: "#ef233c", black: "#000000"
  };
  const path = ["blue", ...targetColorPath]; // always passes through
  let phaseIdx = 0;
  let t0 = performance.now();
  function starPath(r, spikes = 5) {
    const step = Math.PI / spikes;
    ctx.beginPath();
    for (let i = 0; i < 2 * spikes; i++) {
      const rad = i % 2 === 0 ? r : r * 0.45;
      const a = i * step;
      ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
  }
  function draw(now) {
    const t = now - t0;
    ctx.clearRect(0,0,w,h);
    // position & scale along two segments: start->mid (0-0.6), mid->end (0.6-1)
    const p = Math.min(1, t / duration);
    const seg = p < 0.6 ? p / 0.6 : (p - 0.6) / 0.4;
    const from = p < 0.6 ? start : mid;
    const to   = p < 0.6 ? mid   : end;
    const x = from.x + (to.x - from.x) * seg;
    const y = from.y + (to.y - from.y) * seg;
    const scale = p < 0.6 ? (0.4 + 0.6 * p/0.6) : (1.0 - 0.7 * (p-0.6)/0.4); // grow to mid, then shrink
    const angle = spinSpeed * p * 4;

    // color phase changes
    const phaseLen = duration / path.length;
    const currentPhase = Math.min(path.length - 1, Math.floor(t / phaseLen));
    if (currentPhase !== phaseIdx) phaseIdx = currentPhase;
    const col = colors[path[phaseIdx]] || colors.blue;

    // glow
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = col;
    ctx.shadowColor = col;
    ctx.shadowBlur = 28 * scale;
    starPath(40 * scale);
    ctx.fill();
    ctx.restore();

    if (p < 1) requestAnimationFrame(draw);
    else {
      ctx.clearRect(0,0,w,h);
      onComplete?.();
    }
  }
  requestAnimationFrame(draw);
}

