// Dots background: always roaming + hard cursor avoidance.
// Optional: click -> corners for a short burst (like original behavior).
// Uses CSS vars: --bg-fallback, --dots, --dots-link

(function () {
  const canvas = document.getElementById("dots");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function readVars() {
    const styles = getComputedStyle(document.documentElement);
    return {
      BG: styles.getPropertyValue("--bg-fallback").trim() || "#faf9f5",
      DOT: styles.getPropertyValue("--dots").trim() || "rgba(20, 20, 19, 0.52)",
      LINK:
        styles.getPropertyValue("--dots-link").trim() ||
        "rgba(217, 119, 87, 0.28)",
    };
  }

  let { BG, DOT, LINK } = readVars();

  // ---- Tunables ----
  const BASE_SPEED = 0.09;
  const LINK_DIST = 140;

  // Cursor exclusion zone (hard "no touch")
  const MOUSE_RADIUS = 90; // adjust: 70-120 feels good
  const MOUSE_PAD = 2; // extra px so dots never graze cursor

  // Optional click -> corners burst (original vibe)
  const ENABLE_CLICK_TO_CORNERS = false;
  const CORNERS_MS = 5000;

  // Corner behavior
  const CORNER_PULL = 0.12;
  const FRICTION = 0.55;
  const MARGIN = 15;

  let nodes = [],
    last = performance.now();
  let COUNT = 120,
    W = 0,
    H = 0;

  // modes: 'free' (roaming) or 'corners' (parked)
  let mode = "free";
  let cornersUntil = 0;

  let mouse = { x: -9999, y: -9999 };

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    COUNT = Math.max(60, Math.min(180, Math.floor((W * H) / 9000)));
    const need = COUNT - nodes.length;
    if (need > 0) {
      for (let i = 0; i < need; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          a: Math.random() * Math.PI * 2,
          vx: 0,
          vy: 0,
          tx: 0,
          ty: 0,
        });
      }
    } else if (need < 0) {
      nodes.length = COUNT;
    }

    if (mode === "corners") setCornerTargets();
  }

  function setCornerTargets() {
    for (const n of nodes) {
      const left = n.x < W / 2;
      const top = n.y < H / 2;
      n.tx = left ? MARGIN : W - MARGIN;
      n.ty = top ? MARGIN : H - MARGIN;
    }
  }

  function enterCornersMode(now) {
    mode = "corners";
    cornersUntil = now + CORNERS_MS;
    setCornerTargets();
    for (const n of nodes) {
      n.vx *= 0.5;
      n.vy *= 0.5;
    }
  }

  function enterFreeMode() {
    mode = "free";
  }

  addEventListener("resize", resize);

  addEventListener(
    "mousemove",
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    },
    { passive: true }
  );

  addEventListener(
    "mouseleave",
    () => {
      mouse.x = mouse.y = -9999;
    },
    { passive: true }
  );

  // Keep CSS vars live if you ever toggle themes later
  addEventListener(
    "focus",
    () => {
      ({ BG, DOT, LINK } = readVars());
    },
    { passive: true }
  );

  if (ENABLE_CLICK_TO_CORNERS) {
    window.addEventListener("click", (e) => {
      // If you want to keep the original gating by section, re-add:
      // if (window.DOTS_MODE !== 'free') return;
      enterCornersMode(performance.now());
    });

    window.addEventListener(
      "touchstart",
      () => {
        enterCornersMode(performance.now());
      },
      { passive: true }
    );
  }

  resize();

  // --- hard cursor exclusion: project point out of circle if inside ---
  function enforceMouseExclusion(n) {
    const dx = n.x - mouse.x;
    const dy = n.y - mouse.y;
    const dist = Math.hypot(dx, dy);

    if (dist <= 0.0001) {
      // edge case: exactly on cursor
      n.x += MOUSE_RADIUS + MOUSE_PAD;
      return;
    }

    if (dist < MOUSE_RADIUS) {
      const ang = Math.atan2(dy, dx);
      const target = MOUSE_RADIUS + MOUSE_PAD;
      // Move directly to the boundary (no "touch")
      n.x = mouse.x + Math.cos(ang) * target;
      n.y = mouse.y + Math.sin(ang) * target;

      // Make its future direction head away (reduces jitter at boundary)
      n.a = ang;
    }
  }

  function frame(now) {
    const dt = Math.min(50, now - last);
    last = now;

    // Expire corner burst
    if (mode === "corners" && now >= cornersUntil) {
      enterFreeMode();
    }

    // Background
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = DOT;
    ctx.strokeStyle = LINK;
    ctx.lineWidth = 1;

    const inCorners = mode === "corners";

    for (const n of nodes) {
      if (inCorners) {
        const ax = (n.tx - n.x) * CORNER_PULL * (dt / 16);
        const ay = (n.ty - n.y) * CORNER_PULL * (dt / 16);
        n.vx = (n.vx || 0) * FRICTION + ax;
        n.vy = (n.vy || 0) * FRICTION + ay;
        n.x += n.vx;
        n.y += n.vy;

        // clamp
        if (n.x < 0) n.x = 0;
        if (n.x > W) n.x = W;
        if (n.y < 0) n.y = 0;
        if (n.y > H) n.y = H;
      } else {
        // roam
        n.x += Math.cos(n.a) * BASE_SPEED * dt;
        n.y += Math.sin(n.a) * BASE_SPEED * dt;

        // wrap
        if (n.x < 0) n.x += W;
        if (n.x > W) n.x -= W;
        if (n.y < 0) n.y += H;
        if (n.y > H) n.y -= H;
      }

      // Always enforce exclusion (both modes)
      enforceMouseExclusion(n);

      // Draw dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // links
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < i + 16 && j < nodes.length; j++) {
        const a = nodes[i],
          b = nodes[j];
        const dx = a.x - b.x,
          dy = a.y - b.y,
          d = Math.hypot(dx, dy);
        if (d < LINK_DIST) {
          ctx.globalAlpha = 1 - d / LINK_DIST;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    if (!document.hidden) requestAnimationFrame(frame);
    else setTimeout(() => requestAnimationFrame(frame), 200);
  }

  // Reduced motion support
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  requestAnimationFrame(frame);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) last = performance.now();
  });
})();
