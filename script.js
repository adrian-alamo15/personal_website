document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll for internal links
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

  // Populate home slider with cards from projects.html
  const sliderTrack = document.getElementById('projects-slider');
  if (sliderTrack) {
    // Basic placeholder so the section doesn't collapse while loading
    sliderTrack.innerHTML = '<div class="slide"><div class="card"><p>Loading projects…</p></div></div>';

    fetch('projects.html', { cache: 'no-cache' })
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch projects.html');
        return r.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // Try preferred selector; fallback to any .card
        let cards = Array.from(doc.querySelectorAll('.card-grid .card'));
        if (!cards.length) cards = Array.from(doc.querySelectorAll('.card'));

        sliderTrack.innerHTML = '';

        if (!cards.length) {
          // Fallback UI if no cards found
          const empty = document.createElement('div');
          empty.className = 'slide';
          empty.innerHTML = '<div class="card"><p>No projects found. See all on the <a href="projects.html">Projects page</a>.</p></div>';
          sliderTrack.appendChild(empty);
          console.warn('No project cards found in projects.html');
          return;
        }

        cards.forEach(card => {
          const wrapper = document.createElement('div');
          wrapper.className = 'slide';
          wrapper.appendChild(card.cloneNode(true));
          sliderTrack.appendChild(wrapper);
        });
      })
      .catch(err => {
        console.error(err);
        sliderTrack.innerHTML = '<div class="slide"><div class="card"><p>Unable to load projects. Visit the <a href="projects.html">Projects page</a>.</p></div></div>';
      });

    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const scrollByAmount = () => Math.min(500, sliderTrack.clientWidth * 0.9);
    if (prevBtn) prevBtn.addEventListener('click', () => sliderTrack.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' }));
    if (nextBtn) nextBtn.addEventListener('click', () => sliderTrack.scrollBy({ left: scrollByAmount(), behavior: 'smooth' }));
  }

  // Project modal functionality
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalClose = document.querySelector('.modal-close');
  const modalOverlay = document.querySelector('.modal-overlay');
  const projectCards = document.querySelectorAll('.project-card');

  function openModal(card) {
    const title = card.getAttribute('data-title');
    const description = card.getAttribute('data-description');

    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling
  }

  // Open modal on card click
  projectCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  // Close modal on close button, overlay, or Escape key
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
});


