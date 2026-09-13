// ============================================
// Shared photo — flies from hero slot to about slot on scroll,
// flipping from grayscale (front face) to full color (back face)
// ============================================
(function setupSharedPhotoTransition() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroSlot = document.getElementById('heroPortraitSlot');
  const aboutSlot = document.getElementById('aboutPortraitSlot');
  const sharedPhoto = document.getElementById('sharedPhoto');
  const sharedPhotoInner = document.getElementById('sharedPhotoInner');
  const sharedPhotoFaces = sharedPhoto ? sharedPhoto.querySelectorAll('.shared-photo__face') : [];

  if (prefersReducedMotion || !heroSlot || !aboutSlot || !sharedPhoto || !sharedPhotoInner) return;

  let heroRect, aboutRect, transitionStart, transitionEnd;

  function getDocRect(el) {
    const r = el.getBoundingClientRect();
    return {
      top: r.top + window.scrollY,
      left: r.left + window.scrollX,
      width: r.width,
      height: r.height,
    };
  }

  function measure() {
    heroRect = getDocRect(heroSlot);
    aboutRect = getDocRect(aboutSlot);
    // Grab the photo shortly before it would scroll out of view past the hero,
    // and let it settle a little before the about slot reaches center-screen.
    transitionStart = heroRect.top + heroRect.height - window.innerHeight * 0.6;
    transitionEnd = aboutRect.top - window.innerHeight * 0.35;
    if (transitionEnd <= transitionStart) transitionEnd = transitionStart + 400;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  let ticking = false;
  function update() {
    ticking = false;
    const scrollY = window.scrollY;
    const progress = Math.min(1, Math.max(0, (scrollY - transitionStart) / (transitionEnd - transitionStart)));

    sharedPhoto.style.top = lerp(heroRect.top, aboutRect.top, progress) + 'px';
    sharedPhoto.style.left = lerp(heroRect.left, aboutRect.left, progress) + 'px';
    sharedPhoto.style.width = lerp(heroRect.width, aboutRect.width, progress) + 'px';
    sharedPhoto.style.height = lerp(heroRect.height, aboutRect.height, progress) + 'px';
    const radius = lerp(0, 16, progress) + 'px';
    sharedPhotoFaces.forEach(face => { face.style.borderRadius = radius; });
    // Flip in sync with the flight: grayscale front face rotates away,
    // full-color back face rotates into view, completing exactly on landing.
    sharedPhotoInner.style.transform = `rotateY(${progress * 180}deg)`;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  function init() {
    measure();
    update();
    // Only reveal the floating photo — and hide the static slots entirely
    // (not just their images, since the slots carry their own border/shadow) —
    // once we've measured successfully, so nothing is ever missing on load.
    sharedPhoto.classList.add('is-active');
    heroSlot.style.visibility = 'hidden';
    aboutSlot.style.visibility = 'hidden';
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); update(); });
})();

// ============================================
// Nav dropdown toggle
const navToggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');
const navDropdown = document.getElementById('navDropdown');

function closeNav() {
  navDropdown.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const isOpen = navDropdown.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navClose.addEventListener('click', closeNav);

navDropdown.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});

document.addEventListener('click', (e) => {
  if (!navDropdown.contains(e.target) && !navToggle.contains(e.target)) {
    closeNav();
  }
});

// ============================================
// Scroll-reveal — statement text (per-word fade), driven by the
// pinned-scroll section: progress is exactly how far we've scrolled
// through the section's extra (non-viewport) height, so the reveal
// completes precisely when the pin releases.
// ============================================
const statementSection = document.getElementById('statement');
const statementEl = document.querySelector('[data-reveal]');
if (statementSection && statementEl) {
  const words = statementEl.textContent.trim().split(/\s+/);
  statementEl.innerHTML = words
    .map(w => `<span class="word">${w}</span>`)
    .join(' ');

  const wordSpans = statementEl.querySelectorAll('.word');

  function updateStatementReveal() {
    const rect = statementSection.getBoundingClientRect();
    const scrollableDistance = statementSection.offsetHeight - window.innerHeight;
    let progress;
    if (scrollableDistance <= 0) {
      progress = 1;
    } else {
      const scrolledIntoSection = -rect.top;
      progress = Math.min(1, Math.max(0, scrolledIntoSection / scrollableDistance));
    }
    const activeCount = Math.round(progress * wordSpans.length);
    wordSpans.forEach((span, i) => {
      span.classList.toggle('word--active', i < activeCount);
    });
  }

  window.addEventListener('scroll', updateStatementReveal, { passive: true });
  window.addEventListener('resize', updateStatementReveal);
  updateStatementReveal();
}

// ============================================
// Scroll-reveal — block fade-ins (headings, service rows, cards, images)
// ============================================
const revealBlocks = document.querySelectorAll('[data-reveal-block], [data-reveal-img]');
if (revealBlocks.length) {
  const blockObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        blockObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  revealBlocks.forEach(el => blockObserver.observe(el));
}

// ============================================
// Contact form — Supabase-backed
// ============================================
// 1. Create a Supabase project → run supabase-schema.sql in its SQL Editor.
// 2. Project Settings → API → copy the "Project URL" and "anon public" key below.
const SUPABASE_URL = 'https://istqjjznyzviefltpkpn.supabase.co';   // e.g. https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzdHFqanpueXp2aWVmbHRwa3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyOTgyMzIsImV4cCI6MjEwNDg3NDIzMn0.JRq1RrzW-aK5zakGYvuKJGphq1Ul07TS6YDQlIjcfdQs';

const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');

const isConfigured =
  SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL' &&
  SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';

const supabaseClient = isConfigured && window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = data.get('name');
  const email = data.get('email');
  const message = data.get('message');
  const submitBtn = form.querySelector('button[type="submit"]');

  const fallbackToEmail = () => {
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:kundramanan14@gmail.com?subject=${subject}&body=${body}`;
  };

  if (!supabaseClient) {
    // Credentials not filled in yet — fall back to opening the mail client.
    note.textContent = "Opening your email client…";
    fallbackToEmail();
    form.reset();
    return;
  }

  submitBtn.disabled = true;
  note.textContent = "Sending…";

  const { error } = await supabaseClient
    .from('portfolio_inquiries')
    .insert([{ name, email, message }]);

  submitBtn.disabled = false;

  if (error) {
    console.error('Supabase insert failed:', error);
    note.textContent = "Something went wrong — opening your email client instead.";
    fallbackToEmail();
  } else {
    note.textContent = "Thanks — I'll get back to you soon.";
  }

  form.reset();
});
