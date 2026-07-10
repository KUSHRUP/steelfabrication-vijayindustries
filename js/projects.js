/**
 * VIJAY INDUSTRIES - PROJECTS PAGE JAVASCRIPT
 * Handles category filtering, fullscreen Lightbox operations, deep linking, and sharing.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolio();
});

// Helper to convert text to clean URL-friendly slugs
const getSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

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
  const shareBtn = document.getElementById('lightbox-share-btn');

  let activeCards = [];
  let currentIndex = 0;
  let isHashUpdating = false;

  // Set initial active cards and assign dynamic IDs based on slugs
  const updateActiveCards = () => {
    activeCards = Array.from(projectCards).filter(card => !card.classList.contains('hide'));
  };

  // Pre-process all project cards to set their IDs to slugs
  projectCards.forEach(card => {
    const titleEl = card.querySelector('.project-meta h3');
    const titleText = titleEl ? titleEl.textContent : 'Project';
    const slug = getSlug(titleText);
    
    // Dynamically assign card ID based on project name slug
    card.id = slug;
  });

  updateActiveCards();

  // Inject action links ("See More", "Link" & "Video") dynamically into project cards
  projectCards.forEach(card => {
    const titleEl = card.querySelector('.project-meta h3');
    const titleText = titleEl ? titleEl.textContent : 'Project';
    const videoUrl = card.getAttribute('data-video-url');

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'project-card-actions';

    // "See More" button
    const seeMoreBtn = document.createElement('button');
    seeMoreBtn.className = 'card-action-btn btn-see-more';
    seeMoreBtn.innerHTML = 'See More';
    seeMoreBtn.setAttribute('aria-label', `View details of ${titleText}`);
    seeMoreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = activeCards.indexOf(card);
      if (index !== -1) {
        openLightbox(index);
      }
    });
    actionsDiv.appendChild(seeMoreBtn);

    // "Link" (Copy Link with removed .html extension)
    const copyLinkBtn = document.createElement('button');
    copyLinkBtn.className = 'card-action-btn btn-copy-link';
    copyLinkBtn.innerHTML = `
      <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor; vertical-align: middle;"><path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/></svg>
      Link
    `;
    copyLinkBtn.setAttribute('aria-label', `Copy link to ${titleText}`);
    copyLinkBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let cleanUrl = window.location.href.split('#')[0];
      if (!cleanUrl.includes('.html')) {
        const queryIndex = cleanUrl.indexOf('?');
        if (queryIndex !== -1) {
          cleanUrl = cleanUrl.substring(0, queryIndex) + '.html' + cleanUrl.substring(queryIndex);
        } else {
          cleanUrl += '.html';
        }
      }
      const projectUrl = `${cleanUrl}#${card.id}`;
      navigator.clipboard.writeText(projectUrl).then(() => {
        showToast('Project link copied!');
      }).catch(err => {
        console.error('Failed to copy link: ', err);
      });
    });
    actionsDiv.appendChild(copyLinkBtn);

    // "Video" link
    const finalCardVideoUrl = videoUrl || 'https://www.youtube.com/watch?v=y881t8ilMyc';
    const watchVideoLink = document.createElement('a');
    watchVideoLink.className = 'card-action-btn btn-watch-video';
    watchVideoLink.href = finalCardVideoUrl;
    watchVideoLink.target = '_blank';
    watchVideoLink.rel = 'noopener noreferrer';
    watchVideoLink.innerHTML = `
      <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor; vertical-align: middle;"><path d="M10,16.5L16,12L10,7.5V16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z"/></svg>
      Video
    `;
    watchVideoLink.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    actionsDiv.appendChild(watchVideoLink);

    const metaDiv = card.querySelector('.project-meta');
    if (metaDiv) {
      metaDiv.appendChild(actionsDiv);
    }
  });

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
     2. Lightbox Modal Logic (E-commerce Details Viewer)
     ========================================================================== */
  const openLightbox = (index) => {
    currentIndex = index;
    const card = activeCards[currentIndex];
    if (!card) return;

    // Extract content
    const imgEl = card.querySelector('.project-img-box img');
    const tagEl = card.querySelector('.proj-card-tag');
    const titleEl = card.querySelector('.project-meta h3');
    const shortDescEl = card.querySelector('.project-short-desc') || card.querySelector('.project-meta p');
    const videoUrl = card.getAttribute('data-video-url');

    // Parse description overrides
    const fullDescEl = card.querySelector('.project-full-desc');
    let fullDescText = '';
    if (fullDescEl) {
      fullDescText = fullDescEl.innerHTML.trim();
    } else {
      fullDescText = generateFallbackDescription(titleEl.textContent, tagEl.textContent, shortDescEl.textContent);
    }

    // Load static data
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt;
    lightboxTag.textContent = tagEl.textContent;
    lightboxTitle.textContent = titleEl.textContent;
    lightboxDesc.innerHTML = fullDescText;

    // Load specs
    let specsData = {};
    const rawSpecs = card.getAttribute('data-specs');
    if (rawSpecs) {
      try {
        specsData = JSON.parse(rawSpecs);
      } catch (e) {
        console.error("Failed to parse specifications JSON", e);
      }
    } else {
      specsData = generateFallbackSpecs(titleEl.textContent, tagEl.textContent);
    }

    // Populate specs grid
    const specsContainer = document.getElementById('modal-specs-container');
    if (specsContainer) {
      specsContainer.innerHTML = '';
      for (const [key, value] of Object.entries(specsData)) {
        const specItem = document.createElement('div');
        specItem.className = 'modal-spec-item';
        specItem.innerHTML = `
          <span class="spec-label">${key}</span>
          <span class="spec-value">${value}</span>
        `;
        specsContainer.appendChild(specItem);
      }
    }

    // Dynamic inquiry parameter binding
    const inquireBtn = document.getElementById('modal-inquire-btn');
    if (inquireBtn) {
      inquireBtn.href = `contact.html?project=${encodeURIComponent(titleEl.textContent)}`;
    }

    // Set video link actions (always show, use fallback if not defined)
    const lightboxVideoLink = document.getElementById('lightbox-video-link');
    if (lightboxVideoLink) {
      lightboxVideoLink.href = videoUrl || 'https://www.youtube.com/watch?v=y881t8ilMyc';
      lightboxVideoLink.style.display = 'inline-flex';
    }

    // Update URL hash state
    isHashUpdating = true;
    window.location.hash = card.id;
    setTimeout(() => { isHashUpdating = false; }, 100);

    // Show modal
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scroll

    // Clear URL hash cleanly without scroll jump
    isHashUpdating = true;
    history.replaceState(null, null, window.location.pathname + window.location.search);
    setTimeout(() => { isHashUpdating = false; }, 100);
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

  // Lightbox copy link button listener
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const activeCard = activeCards[currentIndex];
      if (activeCard) {
        let cleanUrl = window.location.href.split('#')[0];
        if (!cleanUrl.includes('.html')) {
          const queryIndex = cleanUrl.indexOf('?');
          if (queryIndex !== -1) {
            cleanUrl = cleanUrl.substring(0, queryIndex) + '.html' + cleanUrl.substring(queryIndex);
          } else {
            cleanUrl += '.html';
          }
        }
        const shareUrl = `${cleanUrl}#${activeCard.id}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
          showToast('Project link copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy link: ', err);
        });
      }
    });
  }

  // Handle URL hash routing
  const handleHashRouting = () => {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const cardId = decodeURIComponent(hash.substring(1));
      const card = document.getElementById(cardId);
      if (card) {
        // Switch to the correct filter category first so card is visible
        const category = card.getAttribute('data-category');
        if (category) {
          const filterBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
          if (filterBtn && !filterBtn.classList.contains('active')) {
            isHashUpdating = true;
            filterBtn.click();
            isHashUpdating = false;
          }
        }
        updateActiveCards();
        const index = activeCards.indexOf(card);
        if (index !== -1 && currentIndex !== index) {
          openLightbox(index);
        } else if (index !== -1 && !lightbox.classList.contains('active')) {
          openLightbox(index);
        }
      }
    } else {
      if (lightbox.classList.contains('active')) {
        closeLightbox();
      }
    }
  };

  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    if (!isHashUpdating) {
      handleHashRouting();
    }
  });

  // Initialize deep linking on page load
  setTimeout(handleHashRouting, 600);
}

/**
 * Dynamic fallback generators for clean technical specifications.
 */
function generateFallbackSpecs(title, category) {
  const normCategory = category.trim().toLowerCase();
  
  if (normCategory.includes('infrastructure')) {
    return {
      "Material": "High-Strength Structural Steel (IS 2062)",
      "Dimensions": "Custom Fabricated",
      "Surface Finish": "Anti-Corrosive Red Oxide Primer",
      "Application": "Bridge, Highway & Public Works"
    };
  } else if (normCategory.includes('industrial')) {
    return {
      "Material": "Heavy-Gauge Structural Carbon Steel",
      "Dimensions": "Custom Fabricated",
      "Surface Finish": "Anti-Rust Epoxy Primer + Polyurethane Paint",
      "Application": "Industrial Equipment & Platform Support"
    };
  } else if (normCategory.includes('commercial')) {
    return {
      "Material": "Architectural Grade Steel (IS 2062)",
      "Dimensions": "Custom Fabricated",
      "Surface Finish": "High Corrosion Resistance Paint/Powder Coating",
      "Application": "Retail, Office & Commercial framing"
    };
  } else { // Custom Fabrication
    return {
      "Material": "Specified Carbon Steel / Mild Steel Plate",
      "Dimensions": "Custom Fabricated to Drawings",
      "Surface Finish": "Hot-Dip Galvanized / Powder Coated",
      "Application": "Custom Metal Fabrication Solutions"
    };
  }
}

/**
 * Dynamic fallback generators for long product overview.
 */
function generateFallbackDescription(title, category, shortDesc) {
  return `This professional-grade <strong>${title}</strong> is custom-engineered and fabricated to support heavy-duty operations in the <strong>${category}</strong> sector. Built utilizing high-strength structural steel, advanced welding technologies, and rigorous quality inspection processes, it ensures unmatched durability under extreme loading. <br><br>${shortDesc}<br><br>The design is fully optimized for structural efficiency, featuring standardized bolt patterns for swift on-site installation and a premium protective coating to withstand aggressive environmental exposure.`;
}

/**
 * Lightweight Toast Notification helper for copy updates
 */
function showToast(message) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '30px';
    toastContainer.style.left = '50%';
    toastContainer.style.transform = 'translateX(-50%)';
    toastContainer.style.zIndex = '3000';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '10px';
    toastContainer.style.pointerEvents = 'none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.innerHTML = `
    <svg style="width:16px; height:16px; fill:currentColor; vertical-align: middle; margin-right: 6px;" viewBox="0 0 24 24"><path d="M9,16.17L4.83,12L3.41,13.41L9,19L21,7L19.59,5.58L9,16.17Z"/></svg>
    <span style="vertical-align: middle;">${message}</span>
  `;
  
  toast.style.background = 'rgba(17, 24, 39, 0.95)';
  toast.style.color = '#FFFFFF';
  toast.style.padding = '12px 24px';
  toast.style.fontSize = '0.85rem';
  toast.style.fontWeight = '600';
  toast.style.fontFamily = "var(--font-heading)";
  toast.style.textTransform = 'uppercase';
  toast.style.letterSpacing = '0.05em';
  toast.style.display = 'inline-block';
  toast.style.boxShadow = 'var(--shadow-md)';
  toast.style.border = '1px solid var(--border-color)';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(20px)';
  toast.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  
  if (document.body.classList.contains('dark-theme')) {
    toast.style.background = 'rgba(255, 255, 255, 0.98)';
    toast.style.color = 'var(--color-iron-black)';
    toast.style.border = '1px solid rgba(0,0,0,0.1)';
  }

  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 2500);
}
