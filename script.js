document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".portfolio-section");

  const desktopNavLinks = document.querySelectorAll(".nav-link");

  const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");

  const lightbox = document.getElementById("imageLightbox");

  const lightboxImage = document.getElementById("lightboxImage");

  const lightboxCaption = document.getElementById("lightboxCaption");

  const lightboxClose = document.querySelector(".lightbox-close");

  function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);

    if (!targetSection) return;

    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  desktopNavLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const sectionId = link.dataset.target;

      scrollToSection(sectionId);
    });
  });

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const sectionId = link.getAttribute("href").substring(1);

      scrollToSection(sectionId);
    });
  });

  const mobileLogo = document.querySelector(".mobile-logo");

  mobileLogo?.addEventListener("click", (event) => {
    event.preventDefault();

    scrollToSection("home");
  });

  function updateActiveNavigation() {
    let currentSection = "";

    const scrollPosition = window.scrollY + window.innerHeight * 0.5;
    const isAtBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;

    if (isAtBottom) {
      currentSection = sections[sections.length - 1].id;
    } else {
      sections.forEach((section) => {
        if (section.offsetTop <= scrollPosition) {
          currentSection = section.id;
        }
      });
    }

    desktopNavLinks.forEach((link) => {
      const isActive = link.dataset.target === currentSection;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    mobileNavLinks.forEach((link) => {
      const sectionId = link.getAttribute("href").substring(1);
      const isActive = sectionId === currentSection;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavigation);
  window.addEventListener("resize", updateActiveNavigation);

  updateActiveNavigation();

  const projectImages = document.querySelectorAll(".lightbox-trigger");

  function openLightbox(button) {
    if (!lightbox || !lightboxImage) return;

    if (typeof lightbox.showModal !== "function") return;

    const image = button.querySelector("img");

    if (!image) return;

    lightboxImage.src = image.currentSrc || image.src;

    lightboxImage.alt = image.alt;

    lightboxCaption.textContent = button.dataset.caption || image.alt;

    lightbox.showModal();

    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.open) return;

    lightbox.close();
  }

  projectImages.forEach((button) => {
    button.addEventListener("click", () => {
      openLightbox(button);
    });
  });

  lightboxClose?.addEventListener("click", () => {
    closeLightbox();
  });

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightbox?.addEventListener("close", () => {
    lightboxImage.removeAttribute("src");

    lightboxImage.alt = "";

    lightboxCaption.textContent = "";

    document.body.style.overflow = "";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox?.open) {
      closeLightbox();
    }
  });
});
