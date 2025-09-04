export function playCardAnimation(resultsEl, count = 1) {
  // simple CSS transform-based entrance for cards; returns promise that resolves when done
  const cards = Array.from(resultsEl.querySelectorAll('.card'));
  if (!cards.length) return Promise.resolve();
  // reset transforms
  cards.forEach(c => {
    c.style.transition = 'none';
    c.style.opacity = '0';
    c.style.transform = 'translateY(-40px) scale(0.96)';
  });
  // layout for 10x: prepare two rows (5 + 5) horizontally
  if (count === 10) {
    resultsEl.style.display = 'grid';
    resultsEl.style.gridTemplateColumns = 'repeat(5, 1fr)';
    resultsEl.style.gridAutoRows = 'min-content';
    resultsEl.style.rowGap = '12px';
    // split into two rows manually: put first 5 in top row, next 5 in bottom row by assigning order
    cards.forEach((c, i) => {
      c.style.order = i < 5 ? i : (10 + (i - 5)); // ensure second row appears after first visually
      // start positions: first row from left, second row from right
      if (i < 5) {
        c.style.transform = 'translateX(-160px) translateY(-20px) scale(0.96)';
      } else {
        c.style.transform = 'translateX(160px) translateY(20px) scale(0.96)';
      }
      c.style.opacity = '0';
    });
  } else {
    // 1x single column centered
    resultsEl.style.display = 'flex';
    resultsEl.style.flexDirection = 'column';
    resultsEl.style.alignItems = 'center';
    cards.forEach(c => {
      c.style.transform = 'translateY(-220px) scale(0.9)';
      c.style.opacity = '0';
    });
  }

  // force style flush
  void resultsEl.offsetWidth;

  return new Promise(resolve => {
    const total = cards.length;
    let done = 0;
    cards.forEach((c, i) => {
      // stagger timing
      const delay = Math.min(600, i * (count === 10 ? 80 : 120));
      c.style.transition = `transform 520ms cubic-bezier(.2,.9,.2,1) ${delay}ms, opacity 320ms ease ${delay}ms`;
      // target final
      requestAnimationFrame(() => {
        c.style.transform = 'translateX(0px) translateY(0px) scale(1)';
        c.style.opacity = '1';
      });
      c.addEventListener('transitionend', function cb(e) {
        if (e.propertyName !== 'transform') return;
        c.removeEventListener('transitionend', cb);
        done++;
        if (done === total) {
          // cleanup inline styles but keep layout
          cards.forEach(x => {
            x.style.transition = '';
            x.style.transform = '';
            x.style.opacity = '';
            x.style.order = '';
          });
          // ensure final results layout: 1x centered column or 10x two horizontal rows
          if (count === 10) {
            resultsEl.style.gridTemplateColumns = 'repeat(5, auto)';
            resultsEl.style.display = 'grid';
          } else {
            resultsEl.style.display = 'grid';
            resultsEl.style.gridTemplateColumns = 'repeat(auto-fill, minmax(84px,1fr))';
          }
          resolve();
        }
      });
    });
  });
}