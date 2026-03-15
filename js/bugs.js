/**
 * bugs.js — Advanced Bug Crawling Engine
 * Renders SVG-animated bugs that walk along walls and surfaces
 * Purple palette · GitHub Pages Compatible
 */

(function () {
  'use strict';

  /* ── CONFIG ── */
  const CFG = {
    maxBugs:       22,
    spawnInterval: 1800,
    walkSpeed:     { min: 0.4, max: 1.6 },
    sizes:         { min: 14, max: 44 },
    killRespawn:   3500,
  };

  /* ── BUG SPRITES (SVG paths drawn on canvas) ── */
  const SPRITES = [
    {
      name: 'cockroach',
      draw(ctx, size, t) {
        const s = size;
        ctx.save();
        // body
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.22, s * 0.48, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#3b1f6b';
        ctx.fill();
        // wing sheen
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.05, s * 0.18, s * 0.35, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#6c3fc5';
        ctx.fill();
        // head
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.46, s * 0.14, s * 0.1, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#200d40';
        ctx.fill();
        // antennae
        const wave = Math.sin(t * 0.05) * 0.3;
        ctx.strokeStyle = '#9b5de5';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-s * 0.08, -s * 0.5);
        ctx.quadraticCurveTo(-s * 0.3, -s * 0.8 + wave * s * 0.1, -s * 0.45, -s * 0.65 + wave * s * 0.15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(s * 0.08, -s * 0.5);
        ctx.quadraticCurveTo(s * 0.3, -s * 0.8 - wave * s * 0.1, s * 0.45, -s * 0.65 - wave * s * 0.15);
        ctx.stroke();
        // legs (3 per side, animated)
        const legWave = Math.sin(t * 0.08);
        ctx.lineWidth = 1;
        const legY = [-0.2, 0, 0.2];
        legY.forEach((ly, i) => {
          const phase = (i / 3) * Math.PI;
          const lw = Math.sin(t * 0.08 + phase) * 0.12;
          // left
          ctx.beginPath();
          ctx.moveTo(-s * 0.2, ly * s);
          ctx.lineTo(-s * 0.45, (ly + 0.18 + lw) * s);
          ctx.strokeStyle = '#7b2fff';
          ctx.stroke();
          // right
          ctx.beginPath();
          ctx.moveTo(s * 0.2, ly * s);
          ctx.lineTo(s * 0.45, (ly + 0.18 - lw) * s);
          ctx.stroke();
        });
        ctx.restore();
      },
    },
    {
      name: 'spider',
      draw(ctx, size, t) {
        const s = size;
        ctx.save();
        // abdomen
        ctx.beginPath();
        ctx.ellipse(0, s * 0.28, s * 0.22, s * 0.28, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1a0835';
        ctx.fill();
        // abdomen markings
        ctx.beginPath();
        ctx.ellipse(0, s * 0.28, s * 0.1, s * 0.14, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#9b5de5';
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;
        // thorax
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.14, 0, Math.PI * 2);
        ctx.fillStyle = '#2d1254';
        ctx.fill();
        // head
        ctx.beginPath();
        ctx.arc(0, -s * 0.2, s * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#1a0835';
        ctx.fill();
        // eyes
        ctx.fillStyle = '#c77dff';
        [-0.04, 0.04].forEach(ex => {
          ctx.beginPath();
          ctx.arc(ex * s, -s * 0.21, s * 0.025, 0, Math.PI * 2);
          ctx.fill();
        });
        // 8 legs
        for (let i = 0; i < 4; i++) {
          const phase = (i / 4) * Math.PI;
          const legWave = Math.sin(t * 0.07 + phase) * s * 0.1;
          const xDir = i < 2 ? -1 : 1;
          const yOff = (i % 2 === 0 ? -0.08 : 0.08) * s;
          ctx.strokeStyle = '#6c3fc5';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(xDir * s * 0.12, yOff);
          ctx.quadraticCurveTo(
            xDir * s * 0.38,
            yOff - s * 0.2 + legWave,
            xDir * s * 0.55,
            yOff + s * 0.1 + legWave * 0.5
          );
          ctx.stroke();
        }
        ctx.restore();
      },
    },
    {
      name: 'ant',
      draw(ctx, size, t) {
        const s = size;
        ctx.save();
        ctx.strokeStyle = '#9b5de5';
        ctx.lineWidth = 1.2;
        // abdomen
        ctx.beginPath();
        ctx.ellipse(0, s * 0.35, s * 0.14, s * 0.2, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#4a1880';
        ctx.fill();
        // thorax (tiny)
        ctx.beginPath();
        ctx.arc(0, s * 0.1, s * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = '#3b1f6b';
        ctx.fill();
        // head
        ctx.beginPath();
        ctx.arc(0, -s * 0.1, s * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#4a1880';
        ctx.fill();
        // antennae
        const w = Math.sin(t * 0.09) * 0.08 * s;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-s * 0.04, -s * 0.18);
        ctx.lineTo(-s * 0.22, -s * 0.4 + w);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(s * 0.04, -s * 0.18);
        ctx.lineTo(s * 0.22, -s * 0.4 - w);
        ctx.stroke();
        // legs
        const ly = [0.05, 0.12, 0.2];
        ly.forEach((y, i) => {
          const phase = i * (Math.PI / 3);
          const lw = Math.sin(t * 0.1 + phase) * 0.1 * s;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-s * 0.08, y * s);
          ctx.lineTo(-s * 0.32, (y + 0.15) * s + lw);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(s * 0.08, y * s);
          ctx.lineTo(s * 0.32, (y + 0.15) * s - lw);
          ctx.stroke();
        });
        ctx.restore();
      },
    },
    {
      name: 'beetle',
      draw(ctx, size, t) {
        const s = size;
        ctx.save();
        // elytra (shell halves)
        ctx.beginPath();
        ctx.ellipse(-s * 0.1, 0, s * 0.14, s * 0.38, -0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#5b21b6';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(s * 0.1, 0, s * 0.14, s * 0.38, 0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#6d28d9';
        ctx.fill();
        // center line
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.35);
        ctx.lineTo(0, s * 0.35);
        ctx.strokeStyle = '#200d40';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // sheen
        ctx.beginPath();
        ctx.ellipse(-s * 0.05, -s * 0.1, s * 0.08, s * 0.2, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(199,125,255,0.25)';
        ctx.fill();
        // head
        ctx.beginPath();
        ctx.arc(0, -s * 0.44, s * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#2d1254';
        ctx.fill();
        // horns
        ctx.strokeStyle = '#7b2fff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-s * 0.06, -s * 0.52);
        ctx.lineTo(-s * 0.12, -s * 0.7);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(s * 0.06, -s * 0.52);
        ctx.lineTo(s * 0.12, -s * 0.7);
        ctx.stroke();
        // legs
        const legX = [0.18, 0.2, 0.18];
        legX.forEach((lx, i) => {
          const yBase = (i - 1) * 0.2 * s;
          const phase = i * (Math.PI / 3);
          const lw = Math.sin(t * 0.07 + phase) * 0.08 * s;
          ctx.strokeStyle = '#4c1d95';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(-lx * s, yBase);
          ctx.lineTo(-lx * s * 1.8, yBase + 0.2 * s + lw);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(lx * s, yBase);
          ctx.lineTo(lx * s * 1.8, yBase + 0.2 * s - lw);
          ctx.stroke();
        });
        ctx.restore();
      },
    },
    {
      name: 'fly',
      draw(ctx, size, t) {
        const s = size;
        ctx.save();
        // body
        ctx.beginPath();
        ctx.ellipse(0, s * 0.06, s * 0.12, s * 0.28, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#2d1254';
        ctx.fill();
        // wing flap
        const flap = Math.sin(t * 0.25) * 0.15;
        // left wing
        ctx.beginPath();
        ctx.ellipse(-s * 0.28, -s * 0.1 + flap * s, s * 0.24, s * 0.12, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(155, 93, 229, 0.35)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(199, 125, 255, 0.5)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // right wing
        ctx.beginPath();
        ctx.ellipse(s * 0.28, -s * 0.1 - flap * s, s * 0.24, s * 0.12, 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(123, 47, 255, 0.35)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(199, 125, 255, 0.5)';
        ctx.stroke();
        // head
        ctx.beginPath();
        ctx.arc(0, -s * 0.32, s * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#1a0835';
        ctx.fill();
        // compound eyes
        ctx.fillStyle = '#c77dff';
        ctx.globalAlpha = 0.9;
        [-0.07, 0.07].forEach(ex => {
          ctx.beginPath();
          ctx.arc(ex * s, -s * 0.34, s * 0.04, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        // proboscis
        ctx.strokeStyle = '#9b5de5';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.42);
        ctx.lineTo(0, -s * 0.55);
        ctx.stroke();
        // legs
        ctx.strokeStyle = '#6c3fc5';
        ctx.lineWidth = 0.9;
        [[-0.1, 0.05], [0.1, 0.05], [-0.1, 0.18], [0.1, 0.18]].forEach(([lx, ly], i) => {
          const lw = Math.sin(t * 0.1 + i) * 0.04 * s;
          ctx.beginPath();
          ctx.moveTo(lx * s, ly * s);
          ctx.lineTo((lx * 2.2) * s, (ly + 0.22) * s + lw);
          ctx.stroke();
        });
        ctx.restore();
      },
    },
  ];

  /* ── STATE ── */
  const canvas = document.getElementById('bug-canvas');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;
  let bugs = [];
  let killCount = 0;
  let tick = 0;
  let mouseX = -999, mouseY = -999;

  /* ── RESIZE ── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  /* ── BUG CLASS ── */
  class Bug {
    constructor(fromKill = false) {
      this.sprite = SPRITES[Math.floor(Math.random() * SPRITES.length)];
      this.size   = CFG.sizes.min + Math.random() * (CFG.sizes.max - CFG.sizes.min);
      this.speed  = CFG.walkSpeed.min + Math.random() * (CFG.walkSpeed.max - CFG.walkSpeed.min);
      this.alive  = true;
      this.alpha  = 0;            // fade in
      this.squashed = false;

      // pick a random wall to crawl on
      this._spawnOnWall(fromKill);
    }

    _spawnOnWall(fromKill) {
      // walls: 0=top, 1=right, 2=bottom, 3=left
      // Also allow open-field wanderers
      const mode = Math.random();
      if (mode < 0.3) {
        // Wall crawler
        this.wall = Math.floor(Math.random() * 4);
        const pad = this.size;
        switch (this.wall) {
          case 0: // top edge
            this.x = Math.random() * W;
            this.y = pad;
            this.angle = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
            break;
          case 1: // right edge
            this.x = W - pad;
            this.y = Math.random() * H;
            this.angle = Math.PI + (Math.random() - 0.5) * 0.4;
            break;
          case 2: // bottom edge
            this.x = Math.random() * W;
            this.y = H - pad;
            this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.4;
            break;
          case 3: // left edge
            this.x = pad;
            this.y = Math.random() * H;
            this.angle = (Math.random() - 0.5) * 0.4;
            break;
        }
      } else {
        // Free roamer — enter from a random edge
        this.wall = -1;
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
          case 0: this.x = Math.random() * W; this.y = -this.size; break;
          case 1: this.x = W + this.size;     this.y = Math.random() * H; break;
          case 2: this.x = Math.random() * W; this.y = H + this.size; break;
          case 3: this.x = -this.size;         this.y = Math.random() * H; break;
        }
        // Aim toward screen center with some randomness
        const dx = W / 2 - this.x + (Math.random() - 0.5) * W * 0.5;
        const dy = H / 2 - this.y + (Math.random() - 0.5) * H * 0.5;
        this.angle = Math.atan2(dy, dx) - Math.PI / 2;
      }

      this.targetAngle = this.angle;
      this.wobble      = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.008 + Math.random() * 0.012;
      this.wobbleAmp   = 0.06 + Math.random() * 0.1;
      this.turnTimer   = 60 + Math.floor(Math.random() * 180);
      this.t           = Math.random() * 1000;
    }

    update() {
      if (!this.alive) return;

      // Fade in
      if (this.alpha < 1) this.alpha = Math.min(1, this.alpha + 0.03);

      this.t += 1;
      this.wobble += this.wobbleSpeed;

      // Smooth turn toward target
      let da = this.targetAngle - this.angle;
      while (da >  Math.PI) da -= Math.PI * 2;
      while (da < -Math.PI) da += Math.PI * 2;
      this.angle += da * 0.04;

      // Move
      this.x += Math.sin(this.angle) * this.speed + Math.sin(this.wobble) * this.wobbleAmp;
      this.y -= Math.cos(this.angle) * this.speed;

      // Random turn
      this.turnTimer--;
      if (this.turnTimer <= 0) {
        this.targetAngle += (Math.random() - 0.5) * 1.8;
        this.turnTimer = 60 + Math.floor(Math.random() * 200);
      }

      // Wall bouncing / edge awareness
      const pad = this.size * 0.8;
      if (this.x < pad)  { this.targetAngle = this.angle + Math.PI * 0.5 + Math.random() * 0.5; }
      if (this.x > W - pad) { this.targetAngle = this.angle - Math.PI * 0.5 - Math.random() * 0.5; }
      if (this.y < pad)  { this.targetAngle = this.angle + Math.PI * 0.5 + Math.random() * 0.5; }
      if (this.y > H - pad) { this.targetAngle = this.angle - Math.PI * 0.5 - Math.random() * 0.5; }

      // Mouse avoidance
      const mdx = this.x - mouseX;
      const mdy = this.y - mouseY;
      const md  = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 120) {
        const flee = Math.atan2(-mdy, -mdx) - Math.PI / 2;
        this.targetAngle = flee;
        this.speed = Math.min(this.speed + 0.15, CFG.walkSpeed.max * 3);
      } else {
        this.speed = Math.max(this.speed - 0.05, CFG.walkSpeed.min + Math.random() * (CFG.walkSpeed.max - CFG.walkSpeed.min));
      }
    }

    draw() {
      if (!this.alive) return;
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      this.sprite.draw(ctx, this.size, this.t);
      ctx.restore();
    }

    isHit(mx, my) {
      const dx = mx - this.x;
      const dy = my - this.y;
      return Math.sqrt(dx * dx + dy * dy) < this.size * 0.9;
    }

    kill() {
      this.alive = false;
      killCount++;
      document.getElementById('kill-count').textContent = String(killCount).padStart(3, '0');
    }
  }

  /* ── SPAWN ── */
  function spawnBug(fromKill = false) {
    if (bugs.filter(b => b.alive).length < CFG.maxBugs) {
      bugs.push(new Bug(fromKill));
    }
  }

  // Initial spawn stagger
  for (let i = 0; i < CFG.maxBugs; i++) {
    setTimeout(() => spawnBug(), i * 150);
  }

  // Ongoing spawn
  setInterval(() => spawnBug(), CFG.spawnInterval);

  /* ── SQUASH EFFECT ── */
  function spawnSquash(x, y) {
    const el = document.createElement('div');
    el.className = 'squash-fx';
    el.style.cssText = `left:${x}px; top:${y}px; width:60px; height:60px;`;
    document.body.appendChild(el);
    // Particle splat
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div');
      const angle = (i / 8) * Math.PI * 2;
      const dist  = 20 + Math.random() * 30;
      p.style.cssText = `
        position:fixed;
        left:${x}px; top:${y}px;
        width:${4 + Math.random() * 5}px;
        height:${4 + Math.random() * 5}px;
        border-radius:50%;
        background:${['#9b5de5','#c77dff','#7b2fff','#f72585'][Math.floor(Math.random() * 4)]};
        pointer-events:none;
        z-index:9600;
        transform:translate(-50%,-50%);
        animation: splatP 0.5s ease-out forwards;
        --tx:${Math.cos(angle) * dist}px;
        --ty:${Math.sin(angle) * dist}px;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 600);
    }
    setTimeout(() => el.remove(), 600);
  }

  // inject splat keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes splatP {
      0%   { transform: translate(-50%,-50%) scale(1); opacity:1; }
      100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); opacity:0; }
    }
  `;
  document.head.appendChild(style);

  /* ── CLICK TO KILL ── */
  window.addEventListener('click', (e) => {
    const mx = e.clientX, my = e.clientY;
    for (const bug of bugs) {
      if (bug.alive && bug.isHit(mx, my)) {
        bug.kill();
        spawnSquash(mx, my);
        setTimeout(() => spawnBug(true), CFG.killRespawn);
        break;
      }
    }
  });

  /* ── CURSOR TRACKING ── */
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const glow = document.getElementById('cursor-glow');
    if (glow) {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }
  });

  /* ── RENDER LOOP ── */
  function loop() {
    ctx.clearRect(0, 0, W, H);
    tick++;
    for (const bug of bugs) {
      bug.update();
      bug.draw();
    }
    requestAnimationFrame(loop);
  }

  loop();

})();
