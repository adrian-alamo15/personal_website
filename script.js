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
    fetch('projects.html', { cache: 'no-store' })
      .then(r => r.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const cards = Array.from(doc.querySelectorAll('.card-grid .card'));
        cards.forEach(card => {
          const wrapper = document.createElement('div');
          wrapper.className = 'slide';
          // clone the card so we don't import live nodes from the other document
          wrapper.appendChild(card.cloneNode(true));
          sliderTrack.appendChild(wrapper);
        });
      })
      .catch(() => {});

    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const scrollByAmount = () => Math.min(500, sliderTrack.clientWidth * 0.9);
    if (prevBtn) prevBtn.addEventListener('click', () => sliderTrack.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' }));
    if (nextBtn) nextBtn.addEventListener('click', () => sliderTrack.scrollBy({ left: scrollByAmount(), behavior: 'smooth' }));
  }
});


