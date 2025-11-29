// CalmMind OCD – script.js
// Handles interactivity: navbar, smooth scroll, FAQ, chatbot, scroll reveal

// ========== Navbar Hamburger Menu ==========
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinkEls = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ========== Smooth Scroll ==========
navLinkEls.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ========== Self-Assessment Modal ==========
const assessmentBtn = document.getElementById('start-assessment');
const modal = document.getElementById('assessment-modal');
const closeModal = document.getElementById('close-modal');

assessmentBtn.addEventListener('click', () => {
  modal.classList.add('open');
});
closeModal.addEventListener('click', () => {
  modal.classList.remove('open');
});
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('open');
});

// ========== Coping Strategies Accordion ==========
const pillCards = document.querySelectorAll('.pill-card');
pillCards.forEach(card => {
  card.addEventListener('click', function() {
    this.classList.toggle('open');
  });
  card.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.classList.toggle('open');
    }
  });
});

// ========== FAQ Accordion ==========
const faqItems = document.querySelectorAll('.faq-item');
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach((btn, idx) => {
  btn.addEventListener('click', function() {
    faqItems.forEach((item, i) => {
      if (i === idx) {
        item.classList.toggle('open');
      } else {
        item.classList.remove('open');
      }
    });
  });
});


// ========== Botpress Chatbot Integration ==========
function openBotpressWidget() {
  if (window.botpressWebChat) {
    window.botpressWebChat.sendEvent({ type: 'show' });
  }
}
// Navbar link
const openBotpressNav = document.getElementById('open-botpress');
if (openBotpressNav) {
  openBotpressNav.addEventListener('click', function(e) {
    e.preventDefault();
    openBotpressWidget();
  });
}
// Section button
const openBotpressBtn = document.getElementById('open-botpress-btn');
if (openBotpressBtn) {
  openBotpressBtn.addEventListener('click', function() {
    openBotpressWidget();
  });
}

// ========== Scroll Reveal Animations ==========
const revealEls = document.querySelectorAll('section, .symptom-card, .resource-card, .faq-item');
const revealOnScroll = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
};
const observer = new IntersectionObserver(revealOnScroll, {
  threshold: 0.15
});
revealEls.forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ========== Accessibility: Keyboard Nav for Hamburger ==========
hamburger.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    navLinks.classList.toggle('open');
  }
});

// ========== End of script.js ==========

// ========== Botpress float helper ==========
(function() {
  const candidateSelectors = [
    '.bpw-widget',
    '.botpress-widget',
    '#bp-web-widget',
    '#bpw-webchat',
    '.bpw__container',
    '[id*="botpress"]',
    'iframe[src*="botpress"]'
  ];

  function applyFloatingStyle(el) {
    if (!el || el.dataset.cmFloating) return;
    el.style.position = 'fixed';
    el.style.bottom = '20px';
    el.style.right = '20px';
    el.style.zIndex = '99999';
    el.style.borderRadius = '12px';
    el.style.boxShadow = '0 8px 24px rgba(15,23,42,0.25)';
    el.style.maxWidth = '420px';
    el.style.maxHeight = '80vh';
    el.style.overflow = 'hidden';
    el.style.transform = 'none';
    el.dataset.cmFloating = '1';
  }

  function findAndFloat() {
    candidateSelectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) applyFloatingStyle(el);
    });
  }

  document.addEventListener('DOMContentLoaded', findAndFloat);
  window.addEventListener('load', findAndFloat);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        findAndFloat();
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // If Botpress API initializes later, ensure widget is visible and floated
  const checkInterval = setInterval(() => {
    if (window.botpressWebChat) {
      try { window.botpressWebChat.sendEvent({ type: 'show' }); } catch (e) {}
      findAndFloat();
      clearInterval(checkInterval);
    }
  }, 500);
  setTimeout(() => clearInterval(checkInterval), 10000);
})();
