/**
 * FALCON CONTRACTING CO. LLC - Global Script
 * Mobile Navigation, Hero Slider, Lightbox, and Micro-interactions
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --- 1. Mobile Navigation Drawer ---
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const mobileClose = document.getElementById('mobileClose');

  function openMobileNav() {
    if (mobileDrawer && mobileBackdrop) {
      mobileDrawer.classList.add('active');
      mobileBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    }
  }

  function closeMobileNav() {
    if (mobileDrawer && mobileBackdrop) {
      mobileDrawer.classList.remove('active');
      mobileBackdrop.classList.remove('active');
      document.body.style.overflow = '';
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileNav);

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMobileNav();
      closeLightbox();
    }
  });

  // --- 2. Hero Slider (for index.html) ---
  const slider = document.getElementById('heroSlider');
  if (slider) {
    const slides = slider.querySelectorAll('.slide-item');
    const dots = slider.querySelectorAll('.slider-dot');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    let currentIndex = 0;
    let slideInterval = null;
    const intervalTime = 4500;

    function showSlide(index) {
      if (!slides.length) return;
      if (index >= slides.length) index = 0;
      if (index < 0) index = slides.length - 1;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      currentIndex = index;
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }

    function startAutoSlide() {
      stopAutoSlide();
      slideInterval = setInterval(nextSlide, intervalTime);
    }

    function stopAutoSlide() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        startAutoSlide();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', function () {
        const slideIdx = parseInt(this.getAttribute('data-slide'), 10);
        if (!isNaN(slideIdx)) {
          showSlide(slideIdx);
          startAutoSlide();
        }
      });
    });

    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // Touch Swipe for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoSlide();
    }, { passive: true });

    slider.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoSlide();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 40;
      if (touchEndX < touchStartX - threshold) {
        nextSlide();
      } else if (touchEndX > touchStartX + threshold) {
        prevSlide();
      }
    }

    // Initialize
    showSlide(0);
    startAutoSlide();
  }

  // --- 3. Lightbox Gallery (for projects.html) ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  let currentImageIndex = 0;
  const imageSources = [];

  if (galleryItems.length && lightbox) {
    const lightboxImg = lightbox.querySelector('#lightboxImage');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    // Collect all full photos
    galleryItems.forEach((item, index) => {
      const fullUrl = item.getAttribute('data-full');
      if (fullUrl) {
        imageSources.push(fullUrl);
      }
      item.addEventListener('click', function () {
        openLightbox(index);
      });
    });

    function openLightbox(index) {
      currentImageIndex = index;
      if (lightboxImg && imageSources[index]) {
        lightboxImg.src = imageSources[index];
      }
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function showLightboxImage(index) {
      if (index >= imageSources.length) index = 0;
      if (index < 0) index = imageSources.length - 1;
      currentImageIndex = index;
      if (lightboxImg) {
        lightboxImg.src = imageSources[index];
      }
    }

    function closeLightbox() {
      if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) {
      lightboxNext.addEventListener('click', function (e) {
        e.stopPropagation();
        showLightboxImage(currentImageIndex + 1);
      });
    }
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        showLightboxImage(currentImageIndex - 1);
      });
    }

    // Close when clicking backdrop
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'ArrowRight') showLightboxImage(currentImageIndex + 1);
      if (e.key === 'ArrowLeft') showLightboxImage(currentImageIndex - 1);
    });
  } else {
    window.closeLightbox = function () {};
  }

  // --- 4. Back To Top Button ---
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
