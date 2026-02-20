// ═══════════════════════════════════════════════
//   PORTFOLIO JAVASCRIPT — Shivendra Pratap Singh
//   Modules: Theme, Nav, Typing, ScrollReveal, Form
// ═══════════════════════════════════════════════

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

// Sticky navbar with scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
  updateActiveNav();
});

// Hamburger menu toggle
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks?.classList.toggle('open');
});

// Close menu when link clicked
navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Highlight active nav based on scroll position
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
    // Typing forward
    typingEl.textContent = currentRole.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentRole.length) {
      // Pause at end before deleting
      isPaused = true;
      setTimeout(() => {
        isPaused = false;
        isDeleting = true;
      }, 2200);
    }
  } else {
    // Deleting
    typingEl.textContent = currentRole.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  if (!isPaused) {
    const speed = isDeleting ? 50 : 90;
    setTimeout(typeText, speed);
  }
}

// Start typing after short delay
setTimeout(typeText, 800);

/* ── 4. SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after reveal for performance
        // revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  }
);

// Observe all elements with reveal class
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ── 5. CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  // Show loading state
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  // Simulate API call (replace with actual fetch to backend)
  setTimeout(() => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    contactForm.reset();
    formSuccess?.classList.add('show');

    // Hide success message after 4 seconds
    setTimeout(() => {
      formSuccess?.classList.remove('show');
    }, 4000);
  }, 1200);
});

/* ── 6. SMOOTH SCROLL for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offsetTop = target.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || 70);
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

/* ── 7. BLOG PAGE — Search & Filter ── */
function initBlog() {
  const searchInput = document.getElementById('blogSearch');
  const blogCards = document.querySelectorAll('.blog-card');
  const blogTags = document.querySelectorAll('.blog-tag');

  if (!searchInput) return; // Not on blog page

  let activeTag = 'all';

  // Search filter
  searchInput.addEventListener('input', () => {
    filterCards();
  });

  // Tag filter
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

/* ── 8. Rating bar animation on scroll ── */
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

/* ── 9. PAGE LOAD animation ── */
document.addEventListener('DOMContentLoaded', () => {
  // Trigger hero reveals on page load
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, i * 150);
    });
  }, 100);
});
