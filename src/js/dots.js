// Interactive dots background (blue→teal family), JUST THE DOTS
(function(){
  const canvas = document.getElementById('dots');
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let nodes = [], last = performance.now();
  let COUNT = 120;

  function resize(){
    const W = window.innerWidth, H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    COUNT = Math.max(60, Math.min(180, Math.floor((W*H)/9000)));
    const need = COUNT - nodes.length;
    if (need > 0){ for (let i=0;i<need;i++) nodes.push({x:Math.random()*W,y:Math.random()*H,a:Math.random()*Math.PI*2}); }
    else if (need < 0){ nodes.length = COUNT; }
  }
  resize(); addEventListener('resize', resize);

  let mouse = {x:-9999,y:-9999};
  addEventListener('mousemove', e => { mouse.x=e.clientX; mouse.y=e.clientY; });
  addEventListener('mouseleave', () => { mouse.x=mouse.y=-9999; });

  const BG = getComputedStyle(document.documentElement).getPropertyValue('--bg-fallback').trim() || '#e6f3f6';
  const DOT = 'rgba(13, 41, 52, 0.92)';
  const LINK = 'rgba(13, 41, 52, 0.28)';

  function frame(now){
    const dt = Math.min(50, now - last); last = now;

    // background
    ctx.fillStyle = BG;
    ctx.fillRect(0,0,canvas.width/dpr,canvas.height/dpr);

    // style
    ctx.fillStyle = DOT;
    ctx.strokeStyle = LINK;
    ctx.lineWidth = 1;

    // move & draw nodes
    for (const n of nodes){
      n.x += Math.cos(n.a) * 0.09 * dt;
      n.y += Math.sin(n.a) * 0.09 * dt;

      // soft mouse repel
      const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx,dy);
      if (d < 120){
        const ang = Math.atan2(dy,dx);
        n.x += Math.cos(ang) * (120 - d) * 0.07;
        n.y += Math.sin(ang) * (120 - d) * 0.07;
      }

      // wrap
      const W = canvas.width/dpr, H = canvas.height/dpr;
      if (n.x < 0) n.x += W; if (n.x > W) n.x -= W;
      if (n.y < 0) n.y += H; if (n.y > H) n.y -= H;

      ctx.beginPath(); ctx.arc(n.x, n.y, 2, 0, Math.PI*2); ctx.fill();
    }

    // links (bounded pair checks)
    for (let i=0;i<nodes.length;i++){
      for (let j=i+1;j<i+16 && j<nodes.length;j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx,dy);
        if (d < 140){
          ctx.globalAlpha = 1 - d/140;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    if (!document.hidden) requestAnimationFrame(frame);
    else setTimeout(()=>requestAnimationFrame(frame), 200);
  }
  requestAnimationFrame(frame);

  if (matchMedia('(prefers-reduced-motion: reduce)').matches){
    nodes = []; ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  document.addEventListener('visibilitychange', ()=>{ if (!document.hidden) last = performance.now(); });
})();
