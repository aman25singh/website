// Future app logic (nav, widgets). Intentionally empty for MVP.
// app.js — sets window.DOTS_MODE based on the section in view
(function () {
  const sections = Array.from(document.querySelectorAll('.stage[data-mode]'));

  function setMode(m){
    window.DOTS_MODE = m;
    // sanity log so you can see it working
    console.log('[MODE]', m);
  }
  setMode('free');

  const io = new IntersectionObserver((entries)=>{
    // pick the entry with the largest intersection
    const top = entries.sort((a,b)=>b.intersectionRatio - a.intersectionRatio)[0];
    if (!top || !top.isIntersecting) return;
    const m = top.target.getAttribute('data-mode');
    if (m && m !== window.DOTS_MODE) setMode(m);
  }, { rootMargin: '-40% 0% -40% 0%', threshold: [0, .25, .5, .75, 1] });

  sections.forEach(s => io.observe(s));
})();
