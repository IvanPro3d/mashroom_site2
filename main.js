// ============================================
// LOADING SCREEN — Ромашка, 2 секунды
// ============================================

(function() {
  const loadingScreen = document.getElementById('loadingScreen');
  
  if (!loadingScreen) return;
  
  // Проверяем главную страницу
  const isHomePage = window.location.pathname === '/' || 
                     window.location.pathname === '/index.html' ||
                     window.location.pathname.endsWith('/index.html') ||
                     window.location.pathname === '';
  
  if (!isHomePage) {
    loadingScreen.style.display = 'none';
    return;
  }
  
  // Ровно 2 секунды
  setTimeout(() => {
    loadingScreen.classList.add('is-hidden');
    
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, 1500);
  
  // Форсированное скрытие
  setTimeout(() => {
    if (!loadingScreen.classList.contains('is-hidden')) {
      loadingScreen.classList.add('is-hidden');
    }
  }, 2500);
  
})();


// ============================================
// ОСНОВНОЙ КОД — DOMContentLoaded
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  
  // --- Мобильное меню ---
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("is-open");
    });

    // Закрытие при клике на ссылку
    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
      });
    });

    // Закрытие при клике вне меню
    document.addEventListener("click", (e) => {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        mainNav.classList.remove("is-open");
      }
    });
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById("cookieBanner");
  const acceptBtn = document.querySelector(".cookie-accept");
  const declineBtn = document.querySelector(".cookie-decline");

  if (cookieBanner) {
    const cookieChoice = localStorage.getItem("cookieConsent");

    if (!cookieChoice) {
      cookieBanner.style.display = "block";
    }

    acceptBtn?.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "accepted");
      cookieBanner.style.display = "none";
    });

    declineBtn?.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "declined");
      cookieBanner.style.display = "none";
    });
  }

  // --- Scroll-gallery fullscreen ---
  const scrollImages = document.querySelectorAll(".scroll-image-item img");
  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImage = lightbox?.querySelector("img");
  const lightboxClose = lightbox?.querySelector("[data-lightbox-close]");

  if (scrollImages.length && lightbox && lightboxImage) {
    scrollImages.forEach((img) => {
      img.addEventListener("click", () => {
        lightboxImage.src = img.src;
        lightbox.classList.add("is-visible");
      });
    });

    lightboxClose?.addEventListener("click", () => {
      lightbox.classList.remove("is-visible");
    });

    lightbox?.addEventListener("click", (event) => {
      if (!event.target.closest(".lightbox-image-wrapper")) {
        lightbox.classList.remove("is-visible");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        lightbox.classList.remove("is-visible");
      }
    });
  }

  // --- Страница товара: галерея ---
  const gallery = document.querySelector("[data-product-gallery]");
  if (gallery) {
    const mainImageWrapper = gallery.querySelector("[data-product-main-image]");
    const mainImage = gallery.querySelector("[data-product-main-image] img");
    const thumbs = Array.from(gallery.querySelectorAll("[data-product-thumb]"));
    const prevBtn = gallery.querySelector("[data-product-prev]");
    const nextBtn = gallery.querySelector("[data-product-next]");
    const nextPreview = gallery.querySelector("[data-gallery-next-preview] img");

    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 40;

    const updatePreview = () => {
      if (!nextPreview || thumbs.length < 2) return;
      const nextIndex = (currentIndex + 1) % thumbs.length;
      const nextSrc = thumbs[nextIndex]?.getAttribute("data-image-src");
      if (nextSrc) nextPreview.src = nextSrc;
    };

    const setActive = (index) => {
      currentIndex = index;
      const targetThumb = thumbs[index];
      if (!targetThumb) return;

      const src = targetThumb.getAttribute("data-image-src");
      if (src && mainImage) mainImage.src = src;

      thumbs.forEach((t, i) => t.classList.toggle("is-active", i === currentIndex));
      updatePreview();
    };

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("click", () => setActive(index));
    });

    const goPrev = () => setActive((currentIndex - 1 + thumbs.length) % thumbs.length);
    const goNext = () => setActive((currentIndex + 1) % thumbs.length);

    prevBtn?.addEventListener("click", goPrev);
    nextBtn?.addEventListener("click", goNext);

    // Свайп для мобильных
    mainImageWrapper?.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    mainImageWrapper?.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > swipeThreshold) {
        diff < 0 ? goNext() : goPrev();
      }
    });

    setActive(0);
  }

  // --- Аккордеоны ---
  document.querySelectorAll("[data-accordion]").forEach(accordion => {
    accordion.querySelectorAll(".product-details-item").forEach(item => {
      item.querySelector(".product-details-trigger")?.addEventListener("click", () => {
        item.classList.toggle("is-open");
      });
    });
  });

  document.querySelectorAll(".fabrics-trigger").forEach(trigger => {
    trigger.addEventListener("click", () => {
      trigger.closest(".fabrics-category")?.classList.toggle("is-open");
    });
  });

  

  // --- Чекбокс согласия ---
  (function() {
    const consent = document.getElementById("consent");
    const contactBtn = document.getElementById("contactBtn");
    if (!consent || !contactBtn) return;

    const updateState = () => {
      if (consent.checked) {
        contactBtn.classList.remove("is-disabled");
        contactBtn.removeAttribute("aria-disabled");
      } else {
        contactBtn.classList.add("is-disabled");
        contactBtn.setAttribute("aria-disabled", "true");
      }
    };

    updateState();
    consent.addEventListener("change", updateState);
    
    contactBtn.addEventListener("click", (e) => {
      if (!consent.checked) e.preventDefault();
    });
  })();

  // --- Mobile Back Button ---
  (function() {
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    if (!isMobile) return;

    const isHome = window.location.pathname.endsWith("index.html") ||
                   window.location.pathname === "/" ||
                   window.location.pathname === "";
    if (isHome) return;

    const backBtn = document.createElement("button");
    backBtn.className = "mobile-back-button";
    backBtn.textContent = "←";
    backBtn.addEventListener("click", () => window.history.back());
    document.body.appendChild(backBtn);
  })();

  // --- Универсальные анимации ---
  (function() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    const selectors = [
      '.featured-item', '.intro-column', '.about-brand-image', '.about-brand-content',
      '.product-card', '.scroll-image-item', '.product-info', '.fabric-card',
      '.fabric-item', '.fabrics-category', '.measurements-image', '.measurements-text',
      '.sizes-table-wrapper', '.delivery-card', '.delivery-list', '.footer-logo',
      '.footer-column', '.footer-bottom', '.footer-brand-text', '.btn:not(.is-disabled)'
    ].join(', ');

    document.querySelectorAll(selectors).forEach(el => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
      }
    });
  })();


  // Кнопка притягивает курсор
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});


}); // Конец DOMContentLoaded

