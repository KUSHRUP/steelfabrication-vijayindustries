/**
 * VIJAY INDUSTRIES (DRIVEON DIVISION) - JAVASCRIPT
 * Handles product slider carousel, touches, clicks and scroll interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductSlider();
});

function initProductSlider() {
  const track = document.getElementById('slider-track-element');
  const slides = document.querySelectorAll('.product-slide');
  const prevBtn = document.getElementById('slider-prev-btn');
  const nextBtn = document.getElementById('slider-next-btn');
  const dotsWrapper = document.getElementById('slider-dots-wrapper');
  
  if (!track || !slides.length) return;

  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoPlayTimer = null;

  // 1. Generate Pagination Dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('data-index', i);
    dotsWrapper.appendChild(dot);
  }

  const dots = document.querySelectorAll('.slider-dot');

  // 2. Main Slide Transition Function
  const moveToSlide = (index) => {
    // Wrap index around boundaries
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    // Move slide track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  // 3. Navigation Click Handlers
  nextBtn.addEventListener('click', () => {
    moveToSlide(currentIndex + 1);
    resetAutoPlay();
  });

  prevBtn.addEventListener('click', () => {
    moveToSlide(currentIndex - 1);
    resetAutoPlay();
  });

  // 4. Dots Click Handlers
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
      moveToSlide(targetIndex);
      resetAutoPlay();
    });
  });

  // 5. Autoplay Loop
  const startAutoPlay = () => {
    autoPlayTimer = setInterval(() => {
      moveToSlide(currentIndex + 1);
    }, 6000); // Auto-slide every 6 seconds
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
    }
  };

  const resetAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  // Pause autoplay on mouse hover
  const sliderSection = document.getElementById('featured-slider');
  if (sliderSection) {
    sliderSection.addEventListener('mouseenter', stopAutoPlay);
    sliderSection.addEventListener('mouseleave', startAutoPlay);
  }

  // 6. Mobile Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  const handleSwipe = () => {
    const swipeDistance = touchEndX - touchStartX;
    const minSwipeThreshold = 50; // Minimum drag pixels to register

    if (swipeDistance < -minSwipeThreshold) {
      // Swiped Left -> Next slide
      moveToSlide(currentIndex + 1);
      resetAutoPlay();
    } else if (swipeDistance > minSwipeThreshold) {
      // Swiped Right -> Prev slide
      moveToSlide(currentIndex - 1);
      resetAutoPlay();
    }
  };

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  // Initialize
  startAutoPlay();
}


