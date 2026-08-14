const envelope = document.getElementById('envelope');
const waxSeal = document.getElementById('waxSeal');
const openInviteBtn = document.getElementById('openInviteBtn');
const openingScreen = document.getElementById('openingScreen');
const mainContent = document.getElementById('mainContent');
const tapNote = document.getElementById('tapNote');
const invitePreview = document.getElementById('invitePreview');

let opened = false;
let entering = false;

function openEnvelope() {
  if (opened) return;
  opened = true;
  envelope.classList.add('open');
  tapNote.textContent = 'Tap the invitation to continue';
}

function enterInvitation() {
  if (entering) return;
  entering = true;
  if (!opened) openEnvelope();
  mainContent.classList.add('ready');
  mainContent.setAttribute('aria-hidden', 'false');
  openingScreen.classList.add('done');
  document.body.classList.add('invitation-open');
  // Compatible with older iPhone Safari versions.
  setTimeout(function () { window.scrollTo(0, 0); }, 80);
}

// Open the envelope ONLY when the M&M wax seal is tapped/clicked.
waxSeal.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  openEnvelope();
});

// After the envelope is open, tapping the revealed invitation continues inside.
invitePreview.addEventListener('click', function (e) {
  if (!opened) return;
  if (e.target === openInviteBtn) return;
  enterInvitation();
});

openInviteBtn.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  enterInvitation();
});

// iPhone / Safari touch fallback: only the M&M seal can open the closed envelope.
if ('ontouchend' in window) {
  waxSeal.addEventListener('touchend', function (e) {
    e.preventDefault();
    e.stopPropagation();
    openEnvelope();
  }, { passive: false });

  invitePreview.addEventListener('touchend', function (e) {
    if (!opened || e.target === openInviteBtn) return;
    e.preventDefault();
    enterInvitation();
  }, { passive: false });
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
