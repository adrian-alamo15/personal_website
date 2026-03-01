document.addEventListener('DOMContentLoaded', () => {

  // ── Year ──────────────────────────────────────────────────────────────────
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Smooth scroll ─────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId.length > 1) {
        const el = document.querySelector(targetId);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ── Hamburger menu ────────────────────────────────────────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav ul');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    // Close on nav link click
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });
  }

  // ── Slider scroll buttons ─────────────────────────────────────────────────
  const sliderTrack = document.getElementById('projects-slider');
  if (sliderTrack) {
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const scrollByAmount = () => Math.min(500, sliderTrack.clientWidth * 0.9);
    if (prevBtn) prevBtn.addEventListener('click', () => sliderTrack.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' }));
    if (nextBtn) nextBtn.addEventListener('click', () => sliderTrack.scrollBy({ left: scrollByAmount(), behavior: 'smooth' }));
  }

  // ── Project modal ─────────────────────────────────────────────────────────
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalClose = document.querySelector('.modal-close');
  const modalOverlay = document.querySelector('.modal-overlay');

  function openModal(card) {
    const title = card.getAttribute('data-title');
    const description = card.getAttribute('data-description');
    const github = card.getAttribute('data-github');
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    const existing = modal.querySelector('.modal-github');
    if (existing) existing.remove();
    if (github) {
      const btn = document.createElement('a');
      btn.className = 'btn btn-primary modal-github';
      btn.href = github;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      btn.textContent = 'View on GitHub';
      modalDescription.insertAdjacentElement('afterend', btn);
    }
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modal) {
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (card) openModal(card);
    });
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
    });
  }

  // ── Scroll fade-in (IntersectionObserver) ─────────────────────────────────
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything immediately
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // Auto-apply fade-in to sections and cards not already marked
  const autoFade = document.querySelectorAll(
    'section:not(.hero), .card-grid .card, .skill-group, .timeline-item, .stat'
  );
  if ('IntersectionObserver' in window) {
    const autoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          autoObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    autoFade.forEach(el => {
      el.classList.add('fade-in');
      autoObserver.observe(el);
    });
  }

  // ── Back to top ───────────────────────────────────────────────────────────
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

});
