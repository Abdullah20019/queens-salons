document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-ready");
  const header = document.querySelector(".site-header");
  const backTop = document.querySelector(".back-top");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onScroll = () => {
    if (window.scrollY > 12) {
      header?.classList.add("scrolled");
      backTop?.classList.add("show");
    } else {
      header?.classList.remove("scrolled");
      backTop?.classList.remove("show");
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (backTop) {
    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.classList.toggle("active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
      if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
        navMenu.classList.remove("open");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const revealEls = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".masonry-item[data-category]");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterButtons.forEach((button) => button.classList.remove("active"));
      btn.classList.add("active");

      galleryItems.forEach((item) => {
        const match = filter === "all" || item.dataset.category === filter;
        item.style.display = match ? "block" : "none";
      });
    });
  });

  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const lightboxClose = lightbox?.querySelector(".lightbox-close");
  const galleryTriggers = document.querySelectorAll("[data-lightbox-src]");

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  };

  galleryTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const src = trigger.dataset.lightboxSrc;
      const alt = trigger.dataset.lightboxAlt || "Gallery image";
      if (!lightbox || !lightboxImage || !src) return;
      lightboxImage.src = src;
      lightboxImage.alt = alt;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });

  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const feedback = form.querySelector(".form-feedback");
      if (feedback) {
        feedback.textContent = "Thank you. Our team will contact you shortly.";
      }
      form.reset();
    });
  });

  // Smooth page transition for internal navigation.
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || link.target === "_blank" || link.hasAttribute("download")) return;

    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const url = new URL(link.href, window.location.href);
      const isSameSite = url.origin === window.location.origin;
      const isHtmlNav = url.pathname.endsWith(".html") || url.pathname === "/";
      const isSamePageHash = url.pathname === window.location.pathname && url.hash;
      if (!isSameSite || !isHtmlNav || isSamePageHash) return;

      event.preventDefault();
      if (!reduceMotion) {
        document.body.classList.add("is-leaving");
        window.setTimeout(() => {
          window.location.href = url.href;
        }, 230);
      } else {
        window.location.href = url.href;
      }
    });
  });
});
