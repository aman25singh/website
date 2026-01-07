// Dots background with "rush to corners" on click/tap.
// Uses CSS variable --bg-fallback for background color.

(function(){
  const canvas = document.getElementById('dots');
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio||1, 2);

  // ---- Colors from CSS ----
  const BG   = getComputedStyle(document.documentElement)
                 .getPropertyValue('--bg-fallback').trim() || '#fff7b0ff';
  const DOT  = 'rgba(222, 237, 243, 0.92)';
  const LINK = 'rgba(93, 201, 240, 0.28)';

  // ---- Tunables ----
  const BASE_SPEED = 0.09;
  const LINK_DIST  = 140;
  const CORNER_MS  = 5000;
  const CORNER_PULL = 0.1;
  const FRICTION    = 0.5;
  const MARGIN      = 15;

  let nodes = [], last = performance.now();
  let COUNT = 120, W = 0, H = 0;
  let mode = 'free';
  let modeUntil = 0;
  let mouse = {x:-9999, y:-9999};

  function resize(){
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);

    COUNT = Math.max(60, Math.min(180, Math.floor((W*H)/9000)));
    const need = COUNT - nodes.length;
    if (need > 0){
      for (let i=0;i<need;i++){
        nodes.push({
          x: Math.random()*W, y: Math.random()*H,
          a: Math.random()*Math.PI*2,
          vx: 0, vy: 0, tx: 0, ty: 0
        });
      }
    } else if (need < 0){
      nodes.length = COUNT;
    }

    if (mode === 'corners') setCornerTargets();
  }

  function setCornerTargets(){
    for (const n of nodes){
      const left  = n.x < W/2;
      const top   = n.y < H/2;
      n.tx = left ? MARGIN : W - MARGIN;
      n.ty = top  ? MARGIN : H - MARGIN;
    }
  }

  function enterCornersMode(){
    mode = 'corners';
    modeUntil = performance.now() + CORNER_MS;
    setCornerTargets();
  }

  addEventListener('resize', resize);
  addEventListener('mousemove', e => { mouse.x=e.clientX; mouse.y=e.clientY; });
  addEventListener('mouseleave', () => { mouse.x=mouse.y=-9999; });

  window.addEventListener('click', ()=>{
    if (window.DOTS_MODE === 'free') enterCornersMode();
  });
  window.addEventListener('touchstart', ()=>{
    if (window.DOTS_MODE === 'free') enterCornersMode();
  }, {passive:true});

  resize();

  function frame(now){
    const dt = Math.min(50, now - last); last = now;

    // Fill background with CSS var color (not transparent)
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = DOT;
    ctx.strokeStyle = LINK;
    ctx.lineWidth = 1;

    const inCorners = (mode === 'corners');
    if (inCorners && now >= modeUntil) {
      mode = 'free';
      for (const n of nodes){ n.vx *= 0.5; n.vy *= 0.5; }
    }

    for (const n of nodes){
      if (inCorners){
        const ax = (n.tx - n.x) * CORNER_PULL * (dt/16);
        const ay = (n.ty - n.y) * CORNER_PULL * (dt/16);
        n.vx = (n.vx || 0) * FRICTION + ax;
        n.vy = (n.vy || 0) * FRICTION + ay;
        n.x += n.vx;
        n.y += n.vy;
      } else {
        n.x += Math.cos(n.a) * BASE_SPEED * dt;
        n.y += Math.sin(n.a) * BASE_SPEED * dt;

        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const d = Math.hypot(dx,dy);
        if (d < 120){
          const ang = Math.atan2(dy,dx);
          n.x += Math.cos(ang) * (120 - d) * 0.07;
          n.y += Math.sin(ang) * (120 - d) * 0.07;
        }
      }

      if (inCorners){
        if (n.x < 0) n.x = 0; if (n.x > W) n.x = W;
        if (n.y < 0) n.y = 0; if (n.y > H) n.y = H;
      } else {
        if (n.x < 0) n.x += W; if (n.x > W) n.x -= W;
        if (n.y < 0) n.y += H; if (n.y > H) n.y -= H;
      }

      ctx.beginPath(); ctx.arc(n.x, n.y, 2, 0, Math.PI*2); ctx.fill();
    }

    for (let i=0;i<nodes.length;i++){
      for (let j=i+1;j<i+16 && j<nodes.length;j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx,dy);
        if (d < LINK_DIST){
          ctx.globalAlpha = 1 - d/LINK_DIST;
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
