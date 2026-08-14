const envelope = document.getElementById('envelope');
const waxSeal = document.getElementById('waxSeal');
const openingScreen = document.getElementById('openingScreen');
const mainContent = document.getElementById('mainContent');

let entering = false;

function enterInvitation() {
  if (entering) return;
  entering = true;

  // Keep the envelope visible briefly so the mobile sparkle animation is seen,
  // but skip the old intermediate invitation paper entirely.
  envelope.classList.add('direct-open');

  window.setTimeout(function () {
    mainContent.classList.add('ready');
    mainContent.setAttribute('aria-hidden', 'false');
    openingScreen.classList.add('done');
    document.body.classList.add('invitation-open');
    window.setTimeout(function () { window.scrollTo(0, 0); }, 60);
  }, 520);
}

function activateInvitation(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  enterInvitation();
}

waxSeal.addEventListener('click', activateInvitation);

// iPhone / Safari touch fallback.
if ('ontouchend' in window) {
  waxSeal.addEventListener('touchend', activateInvitation, { passive: false });
}

// Countdown — Cairo time (UTC+3 on 10 October 2026).
const weddingDate = new Date('2026-10-10T18:00:00+03:00').getTime();
const els = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds')
};

function pad(n) { return String(n).padStart(2, '0'); }
function updateCountdown() {
  const diff = weddingDate - Date.now();
  if (diff <= 0) {
    els.days.textContent = '00';
    els.hours.textContent = '00';
    els.minutes.textContent = '00';
    els.seconds.textContent = '00';
    return;
  }
  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  els.days.textContent = pad(days);
  els.hours.textContent = pad(hours);
  els.minutes.textContent = pad(minutes);
  els.seconds.textContent = pad(secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Reveal animation with fallback for older Safari versions.
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealEls.forEach(function (el) { observer.observe(el); });
} else {
  revealEls.forEach(function (el) { el.classList.add('visible'); });
}

// Decorative petals: light enough for phones, disabled for reduced-motion users.
(function createPetals() {
  const field = document.getElementById('petalField');
  if (!field || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;

  const total = window.innerWidth <= 640 ? 11 : 15;
  for (let i = 0; i < total; i += 1) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.setProperty('--x', (4 + Math.random() * 92).toFixed(1) + '%');
    petal.style.setProperty('--size', (7 + Math.random() * 7).toFixed(1) + 'px');
    petal.style.setProperty('--duration', (9 + Math.random() * 7).toFixed(1) + 's');
    petal.style.setProperty('--delay', (-Math.random() * 14).toFixed(1) + 's');
    petal.style.setProperty('--drift', (-42 + Math.random() * 84).toFixed(1) + 'px');
    petal.style.setProperty('--rotate', Math.floor(Math.random() * 180) + 'deg');
    field.appendChild(petal);
  }
})();

// Golden sparkle burst on the M&M seal.
// Run it on pointer/touch DOWN so iPhone/Android show it before touchend opens the envelope.
let sparkleTimer;
let sparkleLock = false;
function celebrateSeal() {
  if (!waxSeal || !envelope || sparkleLock) return;
  sparkleLock = true;
  envelope.classList.remove('seal-celebrate');
  // Force a reflow so the animation can replay reliably on mobile Safari.
  void envelope.offsetWidth;
  envelope.classList.add('seal-celebrate');
  clearTimeout(sparkleTimer);
  sparkleTimer = setTimeout(function () {
    envelope.classList.remove('seal-celebrate');
    sparkleLock = false;
  }, 950);
}

if (window.PointerEvent) {
  waxSeal.addEventListener('pointerdown', celebrateSeal, { passive: true });
} else {
  waxSeal.addEventListener('touchstart', celebrateSeal, { passive: true });
  waxSeal.addEventListener('mousedown', celebrateSeal);
}

// Keyboard/accessibility fallback.
waxSeal.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') celebrateSeal();
});
