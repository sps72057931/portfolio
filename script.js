// ═══════════════════════════════════════════════
//   PORTFOLIO JAVASCRIPT — Shivendra Pratap Singh
//   Fixed: Hero visibility, scroll reveal, all animations
// ═══════════════════════════════════════════════

/* CRITICAL: Ensure js-ready is set so reveal CSS is active */
document.body.classList.add('js-ready');

/* ══════════════════════════════════════
   CRITICAL FIX: Make hero visible immediately
   Don't wait for scroll — hero is already in viewport
══════════════════════════════════════ */
function initHeroReveal() {
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el, i) => {
    // Stagger each hero element with delay
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 + i * 160);
  });
}

// Run as soon as DOM is ready — use both paths to be safe
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroReveal);
} else {
  // DOM already loaded (script is deferred or at bottom)
  initHeroReveal();
}

/* ── 1. THEME TOGGLE ── */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme preference
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});

/* ── 2. NAVBAR ── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
  updateActiveNav();
});

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks?.classList.toggle('open');
});

navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
    if (scrollPos >= top && scrollPos < top + height) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      navLink?.classList.add('active');
    }
  });
}

/* ── 3. TYPING ANIMATION ── */
const typingEl = document.getElementById('typingText');
const roles = [
  'Full Stack Developer',
  'MERN Stack Engineer',
  'Competitive Programmer',
  'CS Student @ IIIT Sonepat',
  'Problem Solver'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isPaused = false;

function typeText() {
  if (!typingEl) return;
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    typingEl.textContent = currentRole.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      isPaused = true;
      setTimeout(() => { isPaused = false; isDeleting = true; }, 2200);
    }
  } else {
    typingEl.textContent = currentRole.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  if (!isPaused) {
    setTimeout(typeText, isDeleting ? 50 : 90);
  }
}

setTimeout(typeText, 1200);

/* ── 4. SCROLL REVEAL (non-hero sections only) ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  }
);

// Only observe non-hero reveal elements (hero handled separately above)
document.querySelectorAll('.section .reveal, .blog-hero .reveal, .blog-grid .reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ── 5. CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    contactForm.reset();
    formSuccess?.classList.add('show');
    setTimeout(() => formSuccess?.classList.remove('show'), 4000);
  }, 1200);
});

/* ── 6. SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = 70;
      window.scrollTo({ top: target.offsetTop - navHeight, behavior: 'smooth' });
    }
  });
});

/* ── 7. BLOG — Search & Filter ── */
function initBlog() {
  const searchInput = document.getElementById('blogSearch');
  const blogCards = document.querySelectorAll('.blog-card');
  const blogTags = document.querySelectorAll('.blog-tag');
  if (!searchInput) return;

  let activeTag = 'all';

  searchInput.addEventListener('input', filterCards);

  blogTags.forEach(tag => {
    tag.addEventListener('click', () => {
      blogTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      activeTag = tag.dataset.tag;
      filterCards();
    });
  });

  function filterCards() {
    const query = searchInput.value.toLowerCase();
    blogCards.forEach(card => {
      const title = card.querySelector('.blog-card-title')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.blog-card-excerpt')?.textContent.toLowerCase() || '';
      const cardTag = card.dataset.tag || '';
      const matchesSearch = title.includes(query) || excerpt.includes(query);
      const matchesTag = activeTag === 'all' || cardTag === activeTag;
      card.style.display = (matchesSearch && matchesTag) ? '' : 'none';
    });
  }
}

initBlog();

/* ── 8. Rating bar animation ── */
const ratingObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.rating-fill').forEach(el => {
  el.style.animationPlayState = 'paused';
  ratingObserver.observe(el);
});
