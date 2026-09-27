/**
 * BUCIN — Main Entry Script (GitHub Pages version)
 */

// ─── DOM BUILDER ──────────────────────────────────────────────
const DOMBuilder = {
  buildTimeline() {
    const container = document.querySelector('.timeline__items');
    if (!container || typeof CONFIG === 'undefined' || !CONFIG.timeline) return;

    CONFIG.timeline.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = `timeline__item timeline__item--${i % 2 === 0 ? 'left' : 'right'}`;
      el.innerHTML = `
        <div class="timeline__icon">${item.icon}</div>
        <div class="timeline__card glass-card">
          <span class="timeline__date">${item.date}</span>
          <h3 class="timeline__title">${item.title}</h3>
          <p class="timeline__quote">${item.quote}</p>
        </div>
      `;
      container.appendChild(el);
    });
  },
  // Gallery sudah static di HTML — tidak perlu build dari config
  buildGallery() {}
};

// ─── AMBIENT 2D PARTICLE CANVAS ───────────────────────────────
class AmbientParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas?.getContext('2d');
    this.particles = [];
    this._raf = null;
  }

  init() {
    if (!this.canvas || !this.ctx) return;
    this._resize();
    this._spawn();
    this._render();
    window.addEventListener('resize', () => this._resize(), { passive: true });
  }

  _resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  _spawn() {
    const count = State.get('isMobile') ? 30 : 70;
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.5,
        size: 1 + Math.random() * 2.5,
        opacity: 0.1 + Math.random() * 0.5,
        hue: 300 + Math.random() * 80,
        life: Math.random(),
        maxLife: 0.3 + Math.random() * 0.7,
      });
    }
  }

  _render() {
    const animate = () => {
      this._raf = requestAnimationFrame(animate);
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life += 0.003;
        const lifeFrac = (p.life % p.maxLife) / p.maxLife;
        const alpha = lifeFrac < 0.5 ? p.opacity * (lifeFrac / 0.5) : p.opacity * (1 - (lifeFrac - 0.5) / 0.5);
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${alpha})`;
        this.ctx.fill();
        if (p.y < -10) p.y = this.canvas.height + 10;
        if (p.x < -10) p.x = this.canvas.width + 10;
        if (p.x > this.canvas.width + 10) p.x = -10;
      });
    };
    animate();
  }

  destroy() { cancelAnimationFrame(this._raf); }
}

// ─── SCROLL PROGRESS BAR ──────────────────────────────────────
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${window.scrollY / max})`;
  }, { passive: true });
}

// ─── HEART FLOAT DECORATIONS ──────────────────────────────────
function initHeartFloaters() {
  const container = document.querySelector('.hero__particles');
  if (!container || State.get('isMobile')) return;
  const symbols = ['♡', '✦', '◈', '✧', '˚', '⋆'];
  for (let i = 0; i < 15; i++) {
    const el = document.createElement('span');
    el.className = 'hero-float-symbol';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      font-size: ${10 + Math.random() * 18}px;
      opacity: ${0.05 + Math.random() * 0.2};
      color: hsl(${310 + Math.random() * 70}, 80%, 80%);
      pointer-events: none;
      user-select: none;
    `;
    container.appendChild(el);
    gsap.to(el, {
      y: -(30 + Math.random() * 60),
      x: (Math.random() - 0.5) * 40,
      opacity: el.style.opacity,
      duration: 6 + Math.random() * 6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: Math.random() * 6,
    });
  }
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  DOMBuilder.buildTimeline();

  const ambientParticles = new AmbientParticles('particle-canvas');
  ambientParticles.init();

  initScrollProgress();
  initHeartFloaters();

  if (window.App && typeof window.App.init === 'function') {
    window.App.init();
  }
});