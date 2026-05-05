// ── GUEST NAME FROM URL ──
const params = new URLSearchParams(window.location.search);
const invitado = params.get('invitado') || params.get('nombre') || params.get('guest') || '';

if (invitado) {
  const cleanName = decodeURIComponent(invitado).trim();
  // Detect gender for salutation
  const femaleEndings = ['a', 'ia', 'ela', 'ina', 'ara', 'alia'];
  const isFemale = femaleEndings.some(e => cleanName.toLowerCase().endsWith(e));
  const salutation = isFemale ? 'Querida' : 'Querido';

  document.getElementById('guest-dear').textContent = `${salutation} ${cleanName}`;
  document.getElementById('guest-message').innerHTML = `
    Natalia y Pablo desean compartir contigo este día tan especial.<br><br>
    Con mucha alegría queremos invitarte a celebrar<br>
    el inicio de nuestra nueva historia juntos.<br><br>
    Tu presencia hará este día aún más especial<br>
    y lleno de amor.
  `;
  document.title = `Boda Natalia & Pablo — Invitación para ${cleanName}`;
}

// ── COUNTDOWN ──
function updateCountdown() {
  const wedding = new Date('2026-10-04T17:00:00');
  const now = new Date();
  const diff = wedding - now;

  if (diff <= 0) {
    document.querySelector('.countdown-grid').innerHTML = '<p style="color:var(--gold-light);font-family:Cormorant Garamond;font-size:2rem;text-align:center;width:100%">¡Hoy es el gran día! 🎉</p>';
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  document.getElementById('cd-dias').textContent = String(days).padStart(2,'0');
  document.getElementById('cd-horas').textContent = String(hours).padStart(2,'0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2,'0');
  document.getElementById('cd-segs').textContent = String(secs).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.12 });
reveals.forEach(r => observer.observe(r));

// ── RSVP ──
let asistencia = '';
function selectAsistencia(val) {
  asistencia = val;
  document.getElementById('rsvp-asistencia').value = val;
  document.getElementById('opt-si').classList.toggle('active', val === 'si');
  document.getElementById('opt-no').classList.toggle('active', val === 'no');
  document.getElementById('group-acomp').style.display = val === 'si' ? 'flex' : 'none';
}

function submitRSVP(e) {
  e.preventDefault();
  const nombre = document.getElementById('rsvp-nombre').value.trim();
  if (!nombre || !asistencia) { alert('Por favor completa tu nombre y confirmación'); return; }
  document.getElementById('rsvp-form').style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
  // Here you'd POST to Google Sheets or similar
}

// ── MUSIC ──
let playing = false;
function toggleMusic() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-btn');
  if (playing) {
    audio.pause();
    btn.textContent = '🎵';
    playing = false;
  } else {
    audio.play().catch(() => {});
    btn.textContent = '⏸';
    playing = true;
  }
}

// ── LIGHTBOX ──
const photoSrc = {
  foto1: 'img/77458a6b-f664-4470-b741-1483ad69df05.jpg',
  foto2: 'img/40b129fc-d255-4f40-9aa8-acf17918a377.jpg',
  foto3: 'img/7857d9a8-fd60-4b42-954f-406a7e2a0b30.jpg',
  foto4: 'img/60613a1c-09aa-47ad-a5d3-3cb8087cda33.jpg',
  foto5: 'img/d63a3142-ec73-419f-96d5-ecb3cb92233f.jpg',
};

function openLightbox(id) {
  // Get the img src from the masonry item directly
  const item = document.querySelector(`[onclick="openLightbox('${id}')"] img`);
  const src = (item && item.src && !item.src.includes('TU_FOTO')) ? item.src : photoSrc[id];
  document.getElementById('lb-img').src = src;
  document.getElementById('lightbox').classList.add('open');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ── PETALS ──
(function() {
  const canvas = document.getElementById('petals-canvas');
  const ctx = canvas.getContext('2d');
  let petals = [];
  const colors = ['#D8B7B0','#B5C47A','#E8D5CF','#C8A96B','#8A9A5B'];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 25; i++) {
    petals.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 0.8 + 0.3,
      drift: Math.random() * 0.5 - 0.25,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.15,
    });
  }

  function drawPetal(x, y, size, rotation, color, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.5, size, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      p.y += p.speed;
      p.x += p.drift;
      p.rotation += p.rotSpeed;
      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
      drawPetal(p.x, p.y, p.size, p.rotation, p.color, p.opacity);
    });
    requestAnimationFrame(animate);
  }
  animate();
})();