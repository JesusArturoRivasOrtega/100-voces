/* Motion enhances visible content; it never gates access or reading. */
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const animate = (element, frames, options = {}) => {
    if (!motion.matches && element?.animate) element.animate(frames, {duration: 420, easing: 'cubic-bezier(.2,.7,.3,1)', ...options});
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        animate(entry.target, [{opacity: .65, transform: 'translateY(12px)'}, {opacity: 1, transform: 'none'}]);
        observer.unobserve(entry.target);
      }
    }, {threshold: .12});
    document.querySelectorAll('.section-head,.feature-panel,.resource-card').forEach(el => observer.observe(el));
  }
  for (const id of ['lensResult','liveEvidence']) {
    const panel = document.getElementById(id);
    if (!panel) continue;
    new MutationObserver(() => {if (!panel.hidden) animate(panel, [{opacity: .4, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}]);}).observe(panel, {attributes: true, attributeFilter: ['hidden']});
  }
  motion.addEventListener('change', () => {if (motion.matches) document.getAnimations().forEach(animation => animation.finish());});
})();
