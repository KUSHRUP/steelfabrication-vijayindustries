/**
 * VIJAY INDUSTRIES - GLOBAL JAVASCRIPT
 * Handles global interactions, loader, theme toggler, menus, scroll animations, and page transitions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initThemeToggle();
  initHeaderScroll();
  initMobileMenu();
  initPageTransitions();
  initScrollReveal();
  initBackToTop();
});

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
        // Only run transition if the destination is different or not current
        const currentLoc = window.location.pathname.split('/').pop() || 'index.html';
        const targetLoc = href.split('/').pop();
        
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
    threshold: 0.15 // Triggers when 15% of the element is visible
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
