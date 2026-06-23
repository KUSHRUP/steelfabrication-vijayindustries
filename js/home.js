/**
 * VIJAY INDUSTRIES - HOME PAGE JAVASCRIPT
 * Handles animated counters, vertical timeline progress drawing, and parallax image scroll effects.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initTimelineProgress();
  initParallaxScroll();
});

/* ==========================================================================
   1. Animated Stats Counters
   ========================================================================== */
function initCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  if (!statNums.length) return;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, stepTime);
  };

  // Observe counters to trigger when visible
  const statsSection = document.getElementById('company-statistics');
  if (statsSection) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNums.forEach(num => countUp(num));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }
}

/* ==========================================================================
   2. Timeline Scroll Progress Drawing
   ========================================================================== */
function initTimelineProgress() {
  const progressLine = document.getElementById('timeline-progress-bar');
  const timelineContainer = document.querySelector('.timeline-container');
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (!progressLine || !timelineContainer) return;

  const updateTimeline = () => {
    const rect = timelineContainer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calculate trigger offset (center of the viewport)
    const triggerPoint = viewportHeight * 0.65;
    
    // How much of the timeline has passed the trigger point
    const scrolledAmount = triggerPoint - rect.top;
    const totalHeight = rect.height;
    
    // Calculate percentage
    let percentage = (scrolledAmount / totalHeight) * 100;
    
    // Clamp between 0% and 100%
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    
    progressLine.style.height = `${percentage}%`;

    // Also toggle the active/reveal state on timeline items as the progress line hits them
    timelineItems.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      if (itemRect.top < triggerPoint) {
        item.classList.add('revealed');
      } else {
        item.classList.remove('revealed');
      }
    });
  };

  window.addEventListener('scroll', updateTimeline);
  // Initial check
  updateTimeline();
}

/* ==========================================================================
   3. Parallax Image Scroll Effect
   ========================================================================== */
function initParallaxScroll() {
  const parallaxWrappers = document.querySelectorAll('.project-parallax-wrapper');
  
  if (!parallaxWrappers.length) return;

  const handleParallax = () => {
    parallaxWrappers.forEach(wrapper => {
      const img = wrapper.querySelector('.parallax-image');
      if (!img) return;

      const rect = wrapper.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      // Check if wrapper is in viewport
      if (rect.top < viewHeight && rect.bottom > 0) {
        // Calculate relative position inside viewport (0 = enters bottom, 1 = exits top)
        const scrollPercent = (viewHeight - rect.top) / (viewHeight + rect.height);
        
        // Move image vertically within its bounds (-15% to +15% range)
        const yOffset = (scrollPercent * 30) - 15; // Shift from -15% to 15%
        img.style.transform = `translateY(${yOffset}%)`;
      }
    });
  };

  window.addEventListener('scroll', handleParallax);
  // Initial check
  handleParallax();
}


