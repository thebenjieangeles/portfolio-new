document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("horizontalWrapper");
  const sections = Array.from(document.querySelectorAll(".portfolio-section"));

  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  const mobileLinks = Array.from(
    document.querySelectorAll(".mobile-nav-links a"),
  );

  let currentSection = 0;

  let isScrolling = false;

  let scrollUnlockTimer = null;

  const TRANSITION_DURATION = 900;

  const DESKTOP_BREAKPOINT = 1024;

  function isDesktop() {
    return window.innerWidth > DESKTOP_BREAKPOINT;
  }

  function updateNavigation() {
    navLinks.forEach((link, index) => {
      const isActive = index === currentSection;

      link.classList.toggle("active", isActive);

      link.setAttribute("aria-current", isActive ? "page" : "false");
    });
  }

  function goToSection(index, useLock = true) {
    if (!isDesktop()) {
      return;
    }

    const nextIndex = Math.max(0, Math.min(index, sections.length - 1));

    if (nextIndex === currentSection) {
      return;
    }

    if (isScrolling) {
      return;
    }

    currentSection = nextIndex;

    wrapper.style.transform = `translateX(-${currentSection * 100}vw)`;

    updateNavigation();

    if (useLock) {
      isScrolling = true;

      clearTimeout(scrollUnlockTimer);

      scrollUnlockTimer = setTimeout(() => {
        isScrolling = false;
      }, TRANSITION_DURATION);
    }
  }

  function handleWheel(event) {
    if (!isDesktop()) {
      return;
    }

    if (isScrolling) {
      event.preventDefault();
      return;
    }

    if (Math.abs(event.deltaY) < 8) {
      return;
    }

    event.preventDefault();

    if (event.deltaY > 0) {
      if (currentSection < sections.length - 1) {
        goToSection(currentSection + 1);
      }
    } else {
      if (currentSection > 0) {
        goToSection(currentSection - 1);
      }
    }
  }

  window.addEventListener("wheel", handleWheel, {
    passive: false,
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetIndex = Number(link.dataset.section);

      if (!isDesktop()) {
        return;
      }

      clearTimeout(scrollUnlockTimer);

      isScrolling = false;

      if (targetIndex === currentSection) {
        updateNavigation();
        return;
      }

      currentSection = Math.max(0, Math.min(targetIndex, sections.length - 1));

      wrapper.style.transform = `translateX(-${currentSection * 100}vw)`;

      updateNavigation();

      isScrolling = true;

      scrollUnlockTimer = setTimeout(() => {
        isScrolling = false;
      }, TRANSITION_DURATION);
    });
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!isDesktop()) {
        return;
      }

      event.preventDefault();
    });
  });

  window.addEventListener("keydown", (event) => {
    if (!isDesktop()) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "PageDown") {
      event.preventDefault();

      if (currentSection < sections.length - 1) {
        goToSection(currentSection + 1);
      }
    }

    if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();

      if (currentSection > 0) {
        goToSection(currentSection - 1);
      }
    }

    if (event.key === "Home") {
      event.preventDefault();

      clearTimeout(scrollUnlockTimer);

      isScrolling = false;

      currentSection = 0;

      wrapper.style.transform = "translateX(0)";

      updateNavigation();
    }

    if (event.key === "End") {
      event.preventDefault();

      clearTimeout(scrollUnlockTimer);

      isScrolling = false;

      currentSection = sections.length - 1;

      wrapper.style.transform = `translateX(-${currentSection * 100}vw)`;

      updateNavigation();
    }
  });

  let resizeTimer;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      if (!isDesktop()) {
        wrapper.style.transform = "none";

        clearTimeout(scrollUnlockTimer);

        isScrolling = false;
      } else {
        wrapper.style.transform = `translateX(-${currentSection * 100}vw)`;
      }
    }, 150);
  });

  function initialize() {
    updateNavigation();

    if (isDesktop()) {
      wrapper.style.transform = "translateX(0)";
    } else {
      wrapper.style.transform = "none";
    }
  }

  initialize();
});
