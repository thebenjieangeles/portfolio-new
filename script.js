/* =========================================================
   PORTFOLIO HORIZONTAL NAVIGATION
   Vanilla JavaScript only
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("horizontalWrapper");
  const sections = Array.from(document.querySelectorAll(".portfolio-section"));

  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  const mobileLinks = Array.from(
    document.querySelectorAll(".mobile-nav-links a"),
  );

  /* =====================================================
       STATE
    ====================================================== */

  let currentSection = 0;

  let isScrolling = false;

  let scrollUnlockTimer = null;

  /*
        Duration should roughly match the CSS transition.

        This prevents rapid wheel movement from skipping
        multiple sections.
    */
  const TRANSITION_DURATION = 900;

  /*
        Desktop breakpoint.

        Below this width the website becomes a normal
        vertical page and the wheel navigation is disabled.
    */
  const DESKTOP_BREAKPOINT = 1024;

  /* =====================================================
       CHECK DESKTOP MODE
    ====================================================== */

  function isDesktop() {
    return window.innerWidth > DESKTOP_BREAKPOINT;
  }

  /* =====================================================
       UPDATE ACTIVE NAVIGATION
    ====================================================== */

  function updateNavigation() {
    navLinks.forEach((link, index) => {
      const isActive = index === currentSection;

      link.classList.toggle("active", isActive);

      link.setAttribute("aria-current", isActive ? "page" : "false");
    });
  }

  /* =====================================================
       MOVE TO SECTION
    ====================================================== */

  function goToSection(index, useLock = true) {
    if (!isDesktop()) {
      return;
    }

    /*
            Keep the section index within valid bounds.
        */
    const nextIndex = Math.max(0, Math.min(index, sections.length - 1));

    /*
            Do nothing if we are already there.
        */
    if (nextIndex === currentSection) {
      return;
    }

    /*
            Prevent additional navigation while
            the previous transition is still running.
        */
    if (isScrolling) {
      return;
    }

    currentSection = nextIndex;

    /*
            Each section is exactly 100vw.

            Moving by one viewport width means:
            0 -> Home
            -100vw -> About
            -200vw -> Works
            etc.
        */
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

  /* =====================================================
       WHEEL NAVIGATION
    ====================================================== */

  function handleWheel(event) {
    /*
            Do not interfere with normal mobile/tablet
            scrolling.
        */
    if (!isDesktop()) {
      return;
    }

    /*
            If a transition is already happening,
            completely ignore the wheel gesture.
        */
    if (isScrolling) {
      event.preventDefault();
      return;
    }

    /*
            Ignore extremely tiny trackpad movement.
            This helps prevent accidental navigation.
        */
    if (Math.abs(event.deltaY) < 8) {
      return;
    }

    /*
            Prevent browser's normal vertical scrolling.
        */
    event.preventDefault();

    if (event.deltaY > 0) {
      /*
                Scroll down:
                move one section RIGHT.
            */
      if (currentSection < sections.length - 1) {
        goToSection(currentSection + 1);
      }
    } else {
      /*
                Scroll up:
                move one section LEFT.
            */
      if (currentSection > 0) {
        goToSection(currentSection - 1);
      }
    }
  }

  /*
        Use a non-passive listener so preventDefault()
        can stop normal vertical scrolling on desktop.
    */
  window.addEventListener("wheel", handleWheel, {
    passive: false,
  });

  /* =====================================================
       DESKTOP NAV BUTTONS
    ====================================================== */

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetIndex = Number(link.dataset.section);

      if (!isDesktop()) {
        return;
      }

      /*
                Navigation clicks are intentionally allowed
                even when wheel navigation is locked.

                Clicking the sidebar is an explicit user action.
            */
      clearTimeout(scrollUnlockTimer);

      isScrolling = false;

      /*
                If clicking the current section,
                simply update the UI.
            */
      if (targetIndex === currentSection) {
        updateNavigation();
        return;
      }

      currentSection = Math.max(0, Math.min(targetIndex, sections.length - 1));

      wrapper.style.transform = `translateX(-${currentSection * 100}vw)`;

      updateNavigation();

      /*
                Briefly lock wheel input after a click.
            */
      isScrolling = true;

      scrollUnlockTimer = setTimeout(() => {
        isScrolling = false;
      }, TRANSITION_DURATION);
    });
  });

  /* =====================================================
       MOBILE NAVIGATION
    ====================================================== */

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      /*
                Mobile uses normal anchor scrolling.
                No custom wheel behavior is applied.
            */

      if (!isDesktop()) {
        return;
      }

      /*
                If somehow activated on desktop,
                prevent normal anchor behavior and use
                the horizontal navigation.
            */
      event.preventDefault();
    });
  });

  /* =====================================================
       KEYBOARD NAVIGATION
    ====================================================== */

  window.addEventListener("keydown", (event) => {
    if (!isDesktop()) {
      return;
    }

    /*
            Allow users to navigate with keyboard while
            keeping the main interaction wheel-based.
        */

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

  /* =====================================================
       RESIZE HANDLING
    ====================================================== */

  let resizeTimer;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      /*
                When entering mobile/tablet mode,
                remove the desktop transform.
            */
      if (!isDesktop()) {
        wrapper.style.transform = "none";

        clearTimeout(scrollUnlockTimer);

        isScrolling = false;
      } else {
        /*
                    When returning to desktop,
                    restore the current horizontal section.
                */
        wrapper.style.transform = `translateX(-${currentSection * 100}vw)`;
      }
    }, 150);
  });

  /* =====================================================
       INITIALIZE
    ====================================================== */

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
