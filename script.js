/* =============================================
   ALOK GUPTA PORTFOLIO — script.js
   ============================================= */

/* --- CUSTOM CURSOR --- */
const cursor = document.getElementById('cursor');
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  cursor.style.left = cursorX + 'px';
  cursor.style.top  = cursorY + 'px';
});

document.querySelectorAll('a, button, .btn, .skill-card, .achieve-card, .stat').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '6px';
    cursor.style.height = '6px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '12px';
    cursor.style.height = '12px';
  });
});


/* --- BACKGROUND CANVAS — Particle Constellation --- */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function Particle() {
  this.x     = Math.random() * W;
  this.y     = Math.random() * H;
  this.vx    = (Math.random() - 0.5) * 0.3;
  this.vy    = (Math.random() - 0.5) * 0.3;
  this.r     = Math.random() * 1.5 + 0.3;
  this.alpha = Math.random() * 0.4 + 0.1;
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawBackground() {
  ctx.clearRect(0, 0, W, H);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Draw connecting lines
    for (let j = i + 1; j < particles.length; j++) {
      const q    = particles[j];
      const dx   = p.x - q.x;
      const dy   = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(201,169,110,${0.08 * (1 - dist / 140)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }

    // Draw particle dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,169,110,${p.alpha})`;
    ctx.fill();

    // Move particle
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
  }

  requestAnimationFrame(drawBackground);
}
drawBackground();

// Mouse parallax on particles
document.addEventListener('mousemove', (e) => {
  const mx = (e.clientX / W - 0.5) * 2;
  const my = (e.clientY / H - 0.5) * 2;
  particles.forEach((p) => {
    p.vx += (mx * 0.002 - p.vx) * 0.02;
    p.vy += (my * 0.002 - p.vy) * 0.02;
  });
});


/* --- SCROLL-TRIGGERED FADE IN --- */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.timeline-item, .achieve-card').forEach((el) => {
  fadeObserver.observe(el);
});


/* --- COUNTER ANIMATION --- */
function animateCount(el, target) {
  let current  = 0;
  const duration  = 1500;
  const step      = 16;
  const increment = target / (duration / step);

  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.childNodes[0].textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, step);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      document.querySelectorAll('[data-count]').forEach((el) => {
        animateCount(el, parseInt(el.dataset.count, 10));
      });
      countObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) countObserver.observe(statsSection);


/* --- 3D TILT — Photo Frame --- */
const photoFrame = document.getElementById('photoFrame');
if (photoFrame) {
  const wrap = photoFrame.parentElement;

  wrap.addEventListener('mousemove', (e) => {
    const rect = photoFrame.getBoundingClientRect();
    const cx   = (rect.left + rect.right) / 2;
    const cy   = (rect.top  + rect.bottom) / 2;
    const rx   =  (e.clientY - cy) / 20;
    const ry   = -(e.clientX - cx) / 20;
    photoFrame.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  wrap.addEventListener('mouseleave', () => {
    photoFrame.style.transform = 'rotateX(0) rotateY(0)';
  });
}


/* --- 3D TILT — Skill Cards --- */
document.querySelectorAll('.card-3d').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx   = (rect.left + rect.right) / 2;
    const cy   = (rect.top  + rect.bottom) / 2;
    const rx   =  (e.clientY - cy) / 15;
    const ry   = -(e.clientX - cx) / 15;
    card.style.transform = `translateY(-10px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* --- NAVIGATION SCROLL DOTS --- */
const sectionIds = ['hero', 'about', 'experience', 'skills', 'education', 'contact'];
const navDots    = document.querySelectorAll('.hb-dot');

const dotObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navDots.forEach((d) => d.classList.remove('active'));
      const idx = sectionIds.indexOf(entry.target.id);
      if (idx >= 0) navDots[idx].classList.add('active');
    }
  });
}, { threshold: 0.4 });

sectionIds.forEach((id) => {
  const el = document.getElementById(id);
  if (el) dotObserver.observe(el);
});

navDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    document.getElementById(sectionIds[i])?.scrollIntoView({ behavior: 'smooth' });
  });
});


/* --- NAVBAR SCROLL EFFECT --- */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
});