// Общее: мобильное меню
document.addEventListener("DOMContentLoaded", () => {
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
    if (
      !mainNav.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      mainNav.classList.remove("is-open");
    }
  });

  // --- Cookie Banner ---
const cookieBanner = document.getElementById("cookieBanner");
const acceptBtn = document.querySelector(".cookie-accept");
const declineBtn = document.querySelector(".cookie-decline");

if (cookieBanner) {
  const cookieChoice = localStorage.getItem("cookieConsent");

  if (!cookieChoice) {
    cookieBanner.style.display = "block";
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "accepted");
    cookieBanner.style.display = "none";
  });

  declineBtn.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "declined");
    cookieBanner.style.display = "none";
  });
}

}


  // Scroll-gallery fullscreen
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


  // Страница товара: галерея, зум и полноэкранный просмотр
  const gallery = document.querySelector("[data-product-gallery]");
  if (gallery) {
    const mainImageWrapper = gallery.querySelector(
      "[data-product-main-image]"
    );
    const mainImage = gallery.querySelector("[data-product-main-image] img");
    const thumbs = Array.from(
      gallery.querySelectorAll("[data-product-thumb]")
    );
    
    const prevBtn = gallery.querySelector("[data-product-prev]");
    const nextBtn = gallery.querySelector("[data-product-next]");
    const nextPreview = gallery.querySelector("[data-gallery-next-preview] img");
    const lightbox = document.querySelector("[data-lightbox]");
    const lightboxImage = lightbox?.querySelector("img");
    const lightboxClose = lightbox?.querySelector("[data-lightbox-close]");

    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 40;

    const updatePreview = () => {
      if (!nextPreview || thumbs.length < 2) return;
    
      const nextIndex = (currentIndex + 1) % thumbs.length;
      const nextSrc = thumbs[nextIndex].getAttribute("data-image-src");
    
      if (nextSrc) {
        nextPreview.src = nextSrc;
      }
    };
    

    const setActive = (index) => {
      currentIndex = index;
      const targetThumb = thumbs[index];
      if (!targetThumb) return;

      const src = targetThumb.getAttribute("data-image-src");
      if (src && mainImage) {
        mainImage.src = src;
      }

      thumbs.forEach((t, i) =>
        t.classList.toggle("is-active", i === currentIndex)
      );
      updatePreview();
      
    };

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("click", () => setActive(index));
      thumb.addEventListener("dblclick", (event) => {
        event.stopPropagation();
        setActive(index);
        openLightbox();
      });
    });

    const goPrev = () => {
      const nextIndex =
        (currentIndex - 1 + thumbs.length) % Math.max(thumbs.length, 1);
      setActive(nextIndex);
    };

    const goNext = () => {
      const nextIndex = (currentIndex + 1) % Math.max(thumbs.length, 1);
      setActive(nextIndex);
    };

    prevBtn?.addEventListener("click", () => {
      goPrev();
    });

    nextBtn?.addEventListener("click", () => {
      goNext();
    });


    // Полноэкранный просмотр
    const openLightbox = () => {
      if (!lightbox || !lightboxImage || !mainImage) return;
      lightboxImage.src = mainImage.src;
      lightbox.classList.add("is-visible");
    };

    const closeLightbox = () => {
      if (!lightbox) return;
      lightbox.classList.remove("is-visible");
    };

    mainImageWrapper?.addEventListener("dblclick", (event) => {
      event.stopPropagation();
      openLightbox();
    });

    lightboxClose?.addEventListener("click", () => {
      closeLightbox();
    });

    lightbox?.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox?.classList.contains("is-visible")) {
        closeLightbox();
        return;
      }
      if (event.key === "ArrowLeft") {
        goPrev();
      }
      if (event.key === "ArrowRight") {
        goNext();
      }
    });

    // Свайп для мобильных
    const handleTouchStart = (event) => {
      touchStartX = event.changedTouches[0].clientX;
    };

    const handleTouchEnd = (event) => {
      touchEndX = event.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff < 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    };

    mainImageWrapper?.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    mainImageWrapper?.addEventListener("touchend", handleTouchEnd);

    // Инициализация первого слайда
    setActive(0);
    updatePreview();
  }

  document.querySelectorAll("[data-accordion]").forEach(accordion => {
    const items = accordion.querySelectorAll(".product-details-item");
  
    items.forEach(item => {
      const trigger = item.querySelector(".product-details-trigger");
  
      trigger.addEventListener("click", () => {
        item.classList.toggle("is-open");
      });
    });
  });

  document.querySelectorAll(".fabrics-trigger").forEach(trigger => {
    trigger.addEventListener("click", () => {
      const category = trigger.closest(".fabrics-category");
      category.classList.toggle("is-open");
    });
  });


  document.addEventListener("DOMContentLoaded", function () {
    const consent = document.getElementById("consent");
    const contactBtn = document.getElementById("contactBtn");
  
    if (!consent || !contactBtn) return;
  
    function updateButtonState() {
      if (consent.checked) {
        contactBtn.classList.remove("is-disabled");
      } else {
        contactBtn.classList.add("is-disabled");
      }
    }
  
    updateButtonState();
  
    consent.addEventListener("change", updateButtonState);
  });
  
  (function () {
    const consent = document.getElementById("consent");
    const contactBtn = document.getElementById("contactBtn");
  
    if (!consent || !contactBtn) return;
  
    function updateState() {
      if (consent.checked) {
        contactBtn.classList.remove("is-disabled");
        contactBtn.removeAttribute("aria-disabled");
      } else {
        contactBtn.classList.add("is-disabled");
        contactBtn.setAttribute("aria-disabled", "true");
      }
    }
  
    // начальное состояние
    updateState();
  
    // изменение чекбокса
    consent.addEventListener("change", updateState);
  
    // защита от клика даже если что-то сломается
    contactBtn.addEventListener("click", function (e) {
      if (!consent.checked) {
        e.preventDefault();
      }
    });
  })(); 

  // --- Mobile Back Button ---
(function () {
  const isMobile = window.matchMedia("(max-width: 900px)").matches;

  // не мобильная версия — ничего не делаем
  if (!isMobile) return;

  // если это главная страница — не показываем
  const isHome =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === "";

  if (isHome) return;

  // создаем кнопку
  const backBtn = document.createElement("button");
  backBtn.className = "mobile-back-button";
  backBtn.textContent = "←";

  backBtn.addEventListener("click", () => {
    window.history.back();
  });

  document.body.appendChild(backBtn);
})();

  
});




