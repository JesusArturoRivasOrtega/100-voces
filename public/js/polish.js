/* Decorative effects never alter data, focus, control state or reading order. */
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const owned = new Set();
  function animate(element, frames, options = {}) {
    if (!element || motion.matches || document.hidden || !element.animate) return;
    const animation = element.animate(frames, {duration: 500, easing: 'cubic-bezier(.2,.75,.25,1)', ...options});
    owned.add(animation);
    const release = () => owned.delete(animation);
    animation.addEventListener('finish', release, {once: true});
    animation.addEventListener('cancel', release, {once: true});
    return animation;
  }
  function finishOwned() { for (const animation of [...owned]) animation.finish(); }
  const hero = document.querySelector('.hero-right');
  if (hero) {
    const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
    svg.classList.add('orbit-detail'); svg.setAttribute('viewBox', '0 0 500 390');
    svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    for (let i = 0; i < 60; i++) {
      const angle = i * Math.PI / 30, line = document.createElementNS(ns, 'line');
      const inner = i % 5 === 0 ? 174 : 179;
      line.setAttribute('x1', String(250 + Math.cos(angle) * inner)); line.setAttribute('y1', String(195 + Math.sin(angle) * inner));
      line.setAttribute('x2', String(250 + Math.cos(angle) * 184)); line.setAttribute('y2', String(195 + Math.sin(angle) * 184));
      line.setAttribute('stroke', i % 5 === 0 ? '#d9c4ff' : '#776886'); line.setAttribute('stroke-width', i % 5 === 0 ? '2' : '1');
      svg.append(line);
    }
    hero.querySelector('.hero-orbit').prepend(svg);
    animate(svg, [{opacity: .15, transform: 'rotate(-14deg) scale(.96)'}, {opacity: .65, transform: 'none'}], {duration: 800});
    animate(hero.querySelector('.orbit-core'), [{opacity: .7, transform: 'rotate(-13deg) scale(.94)'}, {opacity: 1, transform: 'rotate(-8deg) scale(1)'}], {duration: 750});
    let pointerFrame = 0, point;
    hero.addEventListener('pointermove', event => {
      if (!finePointer.matches || motion.matches || event.pointerType !== 'mouse') return;
      point = {x: event.clientX, y: event.clientY};
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0; const rect = hero.getBoundingClientRect();
        hero.style.setProperty('--light-x', (point.x - rect.left) + 'px');
        hero.style.setProperty('--light-y', (point.y - rect.top) + 'px');
      });
    }, {passive: true});
    const resetLight = () => { cancelAnimationFrame(pointerFrame); pointerFrame = 0; hero.style.removeProperty('--light-x'); hero.style.removeProperty('--light-y'); };
    hero.addEventListener('pointerleave', resetLight);
    motion.addEventListener('change', resetLight); finePointer.addEventListener('change', resetLight);
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      let delay = 0;
      for (const entry of entries) if (entry.isIntersecting) {
        animate(entry.target, [{opacity: .8, transform: 'translateY(14px)'}, {opacity: 1, transform: 'none'}], {delay: Math.min(delay++ * 55, 165)});
        observer.unobserve(entry.target);
      }
    }, {threshold: .12});
    document.querySelectorAll('.section-head,.resource-card,.live-lobby>.feature-panel,.lesson-grid article').forEach(el => observer.observe(el));
  }
  // The final published number is always present: no counting through false values.
  for (const id of ['participationValue','stateValue','ageValue','compareSummary','quizFeedback','scenarioDifference','shareStatus']) {
    const element = document.getElementById(id); if (!element) continue;
    let previous = element.textContent, currentAnimation;
    new MutationObserver(() => {
      if (element.textContent === previous) return;
      previous = element.textContent; currentAnimation?.cancel();
      if (previous.trim()) currentAnimation = animate(element, [{opacity: .55}, {opacity: 1}], {duration: 280});
    }).observe(element, {childList: true, characterData: true, subtree: true});
  }
  function observePanels() {
    for (const id of ['lensResult','liveEvidence','section-help-panel','quizResult','tour']) {
      const panel = document.getElementById(id); if (!panel) continue;
      new MutationObserver(() => {
        if (!panel.hidden) animate(panel, [{opacity: .5}, {opacity: 1}], {duration: 220});
      }).observe(panel, {attributes: true, attributeFilter: ['hidden']});
    }
  }
  if (document.readyState === 'loading' || document.readyState === 'interactive') document.addEventListener('DOMContentLoaded', observePanels, {once: true});
  else observePanels();
  const nav = document.querySelector('.nav-wrap'), progress = document.createElement('div'), fill = document.createElement('span');
  progress.className = 'reading-progress'; progress.setAttribute('aria-hidden', 'true'); progress.append(fill); nav?.append(progress);
  let scrollFrame = 0;
  function updateProgress() {
    scrollFrame = 0; const range = document.documentElement.scrollHeight - innerHeight;
    fill.style.transform = `scaleX(${range > 0 ? Math.max(0, Math.min(1, scrollY / range)) : 0})`;
  }
  function scheduleProgress() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress); }
  window.addEventListener('scroll', scheduleProgress, {passive: true}); window.addEventListener('resize', scheduleProgress, {passive: true});
  if ('ResizeObserver' in window) new ResizeObserver(scheduleProgress).observe(document.body);
  updateProgress();
  motion.addEventListener('change', () => { if (motion.matches) finishOwned(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) finishOwned(); });
})();
