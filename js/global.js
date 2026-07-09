/**
 * VIJAY INDUSTRIES - GLOBAL JAVASCRIPT
 * Handles global interactions, loader, theme toggler, menus, scroll animations, and page transitions.
 */

// Configuration for form notifications and third-party integrations
const VIJAY_CONFIG = {
  whatsappNumber: '919425157034',
  emailRecipient: 'vijayindustries@live.in',
  // Sign up for a free Access Key at https://web3forms.com to enable background email delivery.
  // Paste your access key below:
  web3FormsAccessKey: 'YOUR_WEB3FORMS_ACCESS_KEY_HERE'
};

document.addEventListener('DOMContentLoaded', () => {
  handleLocalFileFallback();
  initPreloader();
  initThemeToggle();
  initHeaderScroll();
  initMobileMenu();
  initPageTransitions();
  initScrollReveal();
  initBackToTop();
  initFooterModals();
  initContactForm();
});

// Helper to allow local filesystem (file://) browsing when clean URLs (.html removed) are used
function handleLocalFileFallback() {
  if (window.location.protocol === 'file:') {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (
        href && 
        !href.startsWith('http') && 
        !href.startsWith('https') && 
        !href.startsWith('mailto:') && 
        !href.startsWith('tel:') && 
        !href.startsWith('#') &&
        !href.includes('.')
      ) {
        const parts = href.split('#');
        if (parts[0]) {
          parts[0] = parts[0] + '.html';
          link.setAttribute('href', parts.join('#'));
        }
      }
    });
  }
}

/* ==========================================================================
   1. Preloader Screen
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const hideLoader = () => {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }, 600);
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
    // Safety fallback
    setTimeout(hideLoader, 2500);
  }
}

/* ==========================================================================
   2. Light / Dark Theme Toggle
   ========================================================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;

  // Check stored preference, default to light
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  });
}

/* ==========================================================================
   3. Header Scroll Behavior
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Call once in case page loads scrolled
  handleScroll();
}

/* ==========================================================================
   4. Mobile Menu & Mega Menu
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu-list');
  const megamenuLink = document.querySelector('.has-megamenu');
  
  if (!hamburger || !navMenu) return;

  // Toggle mobile menu
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Mobile Mega Menu toggle click
  if (megamenuLink) {
    const megamenuToggle = megamenuLink.querySelector('.megamenu-mobile-toggle');
    if (megamenuToggle) {
      megamenuToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          e.stopPropagation();
          megamenuLink.classList.toggle('mobile-megamenu-active');
        }
      });
    }
  }

  // Close menu on clicking outside or nav link
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && e.target !== hamburger) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });

  const navLinks = document.querySelectorAll('.nav-link:not(.megamenu-mobile-toggle)');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

/* ==========================================================================
   5. Page Transitions
   ========================================================================== */
function initPageTransitions() {
  const transitionOverlay = document.getElementById('page-transition-overlay');
  if (!transitionOverlay) return;

  // Find all internal links
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    
    // Check if internal, not a hash, and not opening in new tab
    if (
      href && 
      !href.startsWith('#') && 
      !href.startsWith('tel:') && 
      !href.startsWith('mailto:') && 
      !link.getAttribute('target')
    ) {
      link.addEventListener('click', (e) => {
        // Normalize location paths by stripping .html and resolving defaults
        const currentLoc = (window.location.pathname.split('/').pop() || 'index').replace('.html', '');
        
        // Extract base path for target page (ignoring hash links)
        const targetPage = href.split('#')[0].split('/').pop();
        const targetLoc = (targetPage || 'index').replace('.html', '');
        
        if (currentLoc !== targetLoc) {
          e.preventDefault();
          transitionOverlay.classList.add('active');
          
          setTimeout(() => {
            window.location.href = href;
          }, 500); // Match CSS transition duration
        }
      });
    }
  });
}

/* ==========================================================================
   6. Scroll Reveal Animations (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-container');
  
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.01 // Triggers when 1% of the element is visible
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, no need to track it anymore
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
}

/* ==========================================================================
   7. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.getElementById('back-to-top-btn');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backBtn.classList.add('show');
    } else {
      backBtn.classList.remove('show');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. Global Privacy Policy & Terms of Service Modals
   ========================================================================== */
function initFooterModals() {
  const privacyLink = document.getElementById('footer-privacy');
  const termsLink = document.getElementById('footer-terms');

  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('global-privacy-modal');
    });
  }

  if (termsLink) {
    termsLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('global-terms-modal');
    });
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Close on overlay click
    const overlayClick = (e) => {
      if (e.target === modal) {
        closeModal(modalId);
        modal.removeEventListener('click', overlayClick);
      }
    };
    modal.addEventListener('click', overlayClick);

    // Close on Escape key
    const escClose = (e) => {
      if (e.key === 'Escape') {
        closeModal(modalId);
        window.removeEventListener('keydown', escClose);
      }
    };
    window.addEventListener('keydown', escClose);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Expose closeModal globally for inline onclick handlers
window.closeModal = closeModal;

/* ==========================================================================
   9. Contact Form & Quotation Form Notifications (WhatsApp + Email)
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-project-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get input values
    const name = document.getElementById('input-name').value.trim();
    const company = document.getElementById('input-company').value.trim();
    const phone = document.getElementById('input-phone').value.trim();
    const email = document.getElementById('input-email').value.trim();
    const requirement = document.getElementById('input-requirement').value.trim();

    const submitBtn = document.getElementById('form-submit-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    // Build the WhatsApp pre-filled text (properly formatted for WhatsApp Markdown)
    const waMessage = `*New Project Enquiry - Vijay Industries*\n\n` +
                      `*Name:* ${name}\n` +
                      `*Company:* ${company}\n` +
                      `*Phone:* ${phone}\n` +
                      `*Email:* ${email}\n\n` +
                      `*Project Requirement:*\n${requirement}`;
    
    const encodedWaMessage = encodeURIComponent(waMessage);
    const waUrl = `https://api.whatsapp.com/send?phone=${VIJAY_CONFIG.whatsappNumber}&text=${encodedWaMessage}`;

    // Helper to open WhatsApp in new tab
    const openWhatsApp = () => {
      window.open(waUrl, '_blank');
    };

    // If Web3Forms Access Key is set, submit via AJAX.
    // If not set (or equal to placeholder), use fallback modal.
    const key = VIJAY_CONFIG.web3FormsAccessKey;
    const isPlaceholder = !key || key === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE';

    if (!isPlaceholder) {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: key,
          name: name,
          email: email,
          subject: `New Project Enquiry from ${name} (${company})`,
          company: company,
          phone: phone,
          message: requirement
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          showSubmissionStatusModal({
            title: 'Enquiry Received!',
            status: 'success',
            message: 'Your project enquiry has been sent to our sales department via Email. To expedite your request, please click below to also send it directly via WhatsApp.',
            actionBtnText: 'Send on WhatsApp',
            actionCallback: () => {
              openWhatsApp();
            }
          });
          contactForm.reset();
        } else {
          console.warn('Web3Forms response unsuccessful:', data);
          triggerFallbackModal(name, company, phone, email, requirement, waUrl);
        }
      })
      .catch(err => {
        console.error('AJAX form submission failed:', err);
        triggerFallbackModal(name, company, phone, email, requirement, waUrl);
      })
      .finally(() => {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      });
    } else {
      // Fallback flow
      triggerFallbackModal(name, company, phone, email, requirement, waUrl);
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

function triggerFallbackModal(name, company, phone, email, requirement, waUrl) {
  // Construct mailto link
  const mailSubject = encodeURIComponent(`Project Enquiry - ${name} (${company})`);
  const mailBody = encodeURIComponent(
    `Name: ${name}\n` +
    `Company: ${company}\n` +
    `Phone: ${phone}\n` +
    `Email: ${email}\n\n` +
    `Project Requirement:\n${requirement}`
  );
  const mailtoUrl = `mailto:${VIJAY_CONFIG.emailRecipient}?subject=${mailSubject}&body=${mailBody}`;

  showSubmissionStatusModal({
    title: 'Complete Your Enquiry',
    status: 'fallback',
    message: 'To deliver your request to Vijay Industries, please choose one of the options below to dispatch your enquiry via Email and/or WhatsApp.',
    actions: [
      {
        text: '1. Send via Email',
        class: 'btn-outline-accent',
        callback: () => {
          window.location.href = mailtoUrl;
        }
      },
      {
        text: '2. Send via WhatsApp',
        class: 'btn-primary',
        callback: () => {
          window.open(waUrl, '_blank');
        }
      }
    ]
  });
}

function showSubmissionStatusModal(options) {
  // Check if a modal is already active or exists
  let statusModal = document.getElementById('submission-status-modal');
  if (statusModal) {
    statusModal.remove();
  }

  statusModal = document.createElement('div');
  statusModal.id = 'submission-status-modal';
  statusModal.className = 'custom-modal-overlay';
  
  let actionsHtml = '';
  if (options.actions) {
    actionsHtml = `<div class="modal-actions">` +
      options.actions.map((act, idx) => `<button id="status-modal-act-${idx}" class="btn ${act.class}">${act.text}</button>`).join('') +
      `<button id="status-modal-close-btn" class="btn btn-secondary">Close</button>` +
      `</div>`;
  } else {
    actionsHtml = `
      <div class="modal-actions">
        <button id="status-modal-action-btn" class="btn btn-primary">${options.actionBtnText || 'Proceed'}</button>
        <button id="status-modal-close-btn" class="btn btn-secondary">Close</button>
      </div>
    `;
  }

  statusModal.innerHTML = `
    <div class="custom-modal-container">
      <button class="custom-modal-close" id="status-modal-close-x" aria-label="Close modal">&times;</button>
      <div class="custom-modal-content">
        <h2>${options.title}</h2>
        <p>${options.message}</p>
        ${actionsHtml}
      </div>
    </div>
  `;

  document.body.appendChild(statusModal);
  
  // Trigger transition
  setTimeout(() => {
    statusModal.classList.add('active');
  }, 10);
  
  document.body.style.overflow = 'hidden';

  // Attach handlers
  const closeModal = () => {
    statusModal.classList.remove('active');
    setTimeout(() => {
      statusModal.remove();
      document.body.style.overflow = '';
    }, 400);
  };

  statusModal.querySelector('#status-modal-close-x').addEventListener('click', closeModal);
  statusModal.querySelector('#status-modal-close-btn').addEventListener('click', closeModal);
  statusModal.addEventListener('click', (e) => {
    if (e.target === statusModal) closeModal();
  });

  if (options.actions) {
    options.actions.forEach((act, idx) => {
      statusModal.querySelector(`#status-modal-act-${idx}`).addEventListener('click', () => {
        act.callback();
      });
    });
  } else if (options.actionCallback) {
    statusModal.querySelector('#status-modal-action-btn').addEventListener('click', () => {
      options.actionCallback();
      closeModal();
    });
  }
}


