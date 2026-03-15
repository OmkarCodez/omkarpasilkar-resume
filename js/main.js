/**
 * main.js — Interactivity, Particles, Scroll Reveal, Counters
 * GitHub Pages Compatible · No dependencies
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════
     1. PARTICLE HERO CANVAS
  ══════════════════════════════════════════════ */
  (function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
    }

    class Particle {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x     = Math.random() * W;
        this.y     = initial ? Math.random() * H : H + 10;
        this.size  = 0.5 + Math.random() * 2;
        this.speed = 0.2 + Math.random() * 0.6;
        this.vx    = (Math.random() - 0.5) * 0.3;
        this.alpha = 0.1 + Math.random() * 0.5;
        this.hue   = 260 + Math.random() * 60;   // purple range
        this.life  = 0;
        this.maxLife = 200 + Math.random() * 400;
      }
      update() {
        this.life++;
        this.x += this.vx;
        this.y -= this.speed;
        if (this.y < -10 || this.life > this.maxLife) this.reset();
      }
      draw() {
        const progress = this.life / this.maxLife;
        const a = this.alpha * (1 - progress * 0.8);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${a})`;
        ctx.fill();
      }
    }

    // Connection lines between nearby particles
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const a = (1 - d / 100) * 0.08;
            ctx.strokeStyle = `rgba(155, 93, 229, ${a})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      drawConnections();
      for (const p of particles) { p.update(); p.draw(); }
      requestAnimationFrame(loop);
    }

    resize();
    for (let i = 0; i < 80; i++) particles.push(new Particle());
    loop();
    window.addEventListener('resize', resize);
  })();


  /* ══════════════════════════════════════════════
     2. CUSTOM CURSOR
  ══════════════════════════════════════════════ */
  (function initCursor() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    let cx = -999, cy = -999;
    let tx = -999, ty = -999;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      document.body.style.cursor = 'none';
    });

    // Smooth lag follow
    function followCursor() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      requestAnimationFrame(followCursor);
    }
    followCursor();
  })();


  /* ══════════════════════════════════════════════
     3. NAVBAR SCROLL EFFECT
  ══════════════════════════════════════════════ */
  (function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(a => a.classList.remove('active'));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));
  })();


  /* ══════════════════════════════════════════════
     4. SCROLL REVEAL
  ══════════════════════════════════════════════ */
  (function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger children reveals within same parent
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
            // Animate skill bars inside
            entry.target.querySelectorAll('.skill-fill').forEach(bar => {
              bar.style.width = bar.dataset.pct + '%';
            });
          }, Math.min(idx * 80, 400));
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    items.forEach(el => io.observe(el));
  })();


  /* ══════════════════════════════════════════════
     5. SKILL BAR TRIGGER (standalone)
  ══════════════════════════════════════════════ */
  (function initSkillBars() {
    document.querySelectorAll('.skill-fill').forEach(bar => {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setTimeout(() => { bar.style.width = bar.dataset.pct + '%'; }, 200);
            io.unobserve(bar);
          }
        });
      }, { threshold: 0.5 });
      io.observe(bar);
    });
  })();


  /* ══════════════════════════════════════════════
     6. COUNTER ANIMATION
  ══════════════════════════════════════════════ */
  (function initCounters() {
    const counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1200;
        const start  = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }

        requestAnimationFrame(update);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => io.observe(el));
  })();


  /* ══════════════════════════════════════════════
     7. HERO NAME GLITCH ON HOVER
  ══════════════════════════════════════════════ */
  (function initGlitch() {
    const accent = document.querySelector('.hero-name .accent');
    if (!accent) return;

    const original = accent.textContent;
    const chars    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    let   interval = null;
    let   frame    = 0;

    accent.addEventListener('mouseenter', () => {
      if (interval) return;
      interval = setInterval(() => {
        frame++;
        accent.textContent = original
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            return i < frame / 3 ? ch : chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        if (frame > original.length * 3) {
          accent.textContent = original;
          clearInterval(interval);
          interval = null;
          frame = 0;
        }
      }, 40);
    });
  })();


  /* ══════════════════════════════════════════════
     8. EXPERIENCE CARD TILT (subtle 3-D on hover)
  ══════════════════════════════════════════════ */
  (function initTilt() {
    document.querySelectorAll('.exp-body, .cert-card, .skill-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x    = (e.clientX - rect.left) / rect.width  - 0.5;
        const y    = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `translateX(${card.classList.contains('exp-body') ? 4 : 0}px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  })();


  /* ══════════════════════════════════════════════
     9. SMOOTH ANCHOR SCROLLING (offset for navbar)
  ══════════════════════════════════════════════ */
  (function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 65;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  })();


  /* ══════════════════════════════════════════════
     10. TYPING EASTER EGG — KONAMI CODE STYLE
  ══════════════════════════════════════════════ */
  (function initEasterEgg() {
    const sequence = ['q', 'a'];
    let   pos      = 0;

    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === sequence[pos]) {
        pos++;
        if (pos === sequence.length) {
          pos = 0;
          // spawn 10 extra bugs!
          const bugCanvas = document.getElementById('bug-canvas');
          if (bugCanvas) {
            for (let i = 0; i < 10; i++) {
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('spawnExtraBug'));
              }, i * 200);
            }
          }
          // Flash message
          const msg = document.createElement('div');
          msg.textContent = '🐛 BUG INVASION! +10 BUGS DEPLOYED';
          msg.style.cssText = `
            position:fixed; top:50%; left:50%;
            transform:translate(-50%,-50%);
            font-family:'JetBrains Mono',monospace;
            font-size:1rem; letter-spacing:3px;
            color:#c77dff; background:#120f20;
            border:1px solid #6c3fc5; padding:1rem 2rem;
            z-index:99999; animation:fadeIn 0.2s ease;
            box-shadow:0 0 40px rgba(155,93,229,0.5);
          `;
          document.body.appendChild(msg);
          setTimeout(() => msg.remove(), 2000);
        }
      } else {
        pos = 0;
      }
    });
  })();

})();
