/**
 * VIJAY INDUSTRIES - PROJECTS PAGE JAVASCRIPT
 * Handles category filtering and fullscreen Lightbox operations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolio();
});

function initPortfolio() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTag = document.getElementById('lightbox-tag-span');
  const lightboxTitle = document.getElementById('lightbox-title-h3');
  const lightboxDesc = document.getElementById('lightbox-desc-p');
  
  const closeBtn = document.getElementById('lightbox-close-btn');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  let activeCards = [];
  let currentIndex = 0;

  // Set initial active cards
  const updateActiveCards = () => {
    activeCards = Array.from(projectCards).filter(card => !card.classList.contains('hide'));
  };
  updateActiveCards();

  /* ==========================================================================
     1. Portfolio Filtering
     ========================================================================== */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active filter button class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });

      // Update visible items list for lightbox navigation
      updateActiveCards();
    });
  });

  /* ==========================================================================
     2. Lightbox Modal Logic
     ========================================================================== */
  const openLightbox = (index) => {
    currentIndex = index;
    const card = activeCards[currentIndex];
    if (!card) return;

    // Extract content
    const imgEl = card.querySelector('.project-img-box img');
    const tagEl = card.querySelector('.proj-card-tag');
    const titleEl = card.querySelector('.project-meta h3');
    const descEl = card.querySelector('.project-meta p');
    const videoUrl = card.getAttribute('data-video-url');

    // Load into lightbox
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt;
    lightboxTag.textContent = tagEl.textContent;
    lightboxTitle.textContent = titleEl.textContent;
    lightboxDesc.textContent = descEl.textContent;

    const lightboxVideoLink = document.getElementById('lightbox-video-link');
    if (lightboxVideoLink) {
      if (videoUrl) {
        lightboxVideoLink.href = videoUrl;
        lightboxVideoLink.style.display = 'inline-flex';
      } else {
        lightboxVideoLink.style.display = 'none';
      }
    }

    // Show modal
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scroll
  };

  const showNext = () => {
    if (activeCards.length <= 1) return;
    currentIndex = (currentIndex + 1) % activeCards.length;
    openLightbox(currentIndex);
  };

  const showPrev = () => {
    if (activeCards.length <= 1) return;
    currentIndex = (currentIndex - 1 + activeCards.length) % activeCards.length;
    openLightbox(currentIndex);
  };

  // Attach card image click events
  projectCards.forEach(card => {
    const imgBox = card.querySelector('.project-img-box');
    imgBox.addEventListener('click', () => {
      // Find card index inside active cards array
      const index = activeCards.indexOf(card);
      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  // Lightbox Close Events
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Navigation Click Events
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
  });
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    }
  });
}


