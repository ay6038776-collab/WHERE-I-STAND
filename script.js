/* =========================================================
   WHERE I STAND — INTERACTIVE EXPERIENCE
========================================================= */

(() => {
  "use strict";

  /* =======================================================
     DOM
  ======================================================= */

  const body = document.body;

  const navbar = document.querySelector(".navbar");
  const nav = document.querySelector(".navbar nav");
  const menuToggle = document.querySelector(".menu-toggle");

  const progress = document.querySelector(".progress span");

  const cursorGlow = document.querySelector(".cursor-glow");

  const hero = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");

  const heroGlows = document.querySelectorAll(".hero-glow");

  const pressure = document.querySelector(".pressure");
  const pressureGlow = document.querySelector(".pressure-glow");

  const revealElements =
    document.querySelectorAll(".reveal");

  const sections =
    document.querySelectorAll("section[id]");

  const navLinks =
    document.querySelectorAll(".navbar nav a");

  const emotionCards =
    document.querySelectorAll(".emotion-card");

  const actionCards =
    document.querySelectorAll(".action-card");

  const timelineCards =
    document.querySelectorAll(".timeline-card");

  const timelineLine =
    document.querySelector(".timeline-line span");

  const magneticElements =
    document.querySelectorAll(".magnetic");


  /* =======================================================
     SETTINGS
  ======================================================= */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  const isTouch =
    window.matchMedia(
      "(hover: none), (pointer: coarse)"
    ).matches;


  /* =======================================================
     PAGE LOAD
  ======================================================= */

  window.addEventListener("load", () => {

    requestAnimationFrame(() => {
      body.classList.add("loaded");
    });

  });


  /* =======================================================
     MOBILE MENU
  ======================================================= */

  if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {

      const isOpen =
        nav.classList.toggle("open");

      menuToggle.classList.toggle(
        "active",
        isOpen
      );

      body.classList.toggle(
        "menu-open",
        isOpen
      );

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

    });


    navLinks.forEach(link => {

      link.addEventListener("click", () => {

        nav.classList.remove("open");
        menuToggle.classList.remove("active");
        body.classList.remove("menu-open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }


  /* =======================================================
     REVEAL ON SCROLL
  ======================================================= */

  if (
    !reducedMotion &&
    "IntersectionObserver" in window
  ) {

    const revealObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "visible"
            );

            revealObserver.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -70px 0px"
        }
      );


    revealElements.forEach(element => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach(element => {
      element.classList.add("visible");
    });

  }


  /* =======================================================
     STAGGER ANIMATIONS
  ======================================================= */

  timelineCards.forEach((card, index) => {

    card.style.transitionDelay =
      `${index * 90}ms`;

  });


  actionCards.forEach((card, index) => {

    card.style.transitionDelay =
      `${index * 100}ms`;

  });


  /* =======================================================
     SCROLL PROGRESS
  ======================================================= */

  let ticking = false;

  function updateScroll() {

    const scrollTop =
      window.scrollY;

    const documentHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const percentage =
      documentHeight > 0
        ? scrollTop / documentHeight
        : 0;

    if (progress) {

      progress.style.width =
        `${percentage * 100}%`;

    }


    /* NAVBAR */

    if (navbar) {

      navbar.classList.toggle(
        "scrolled",
        scrollTop > 40
      );

    }


    /* TIMELINE */

    if (
      timelineLine &&
      pressure
    ) {

      const timeline =
        document.querySelector(
          ".timeline"
        );

      if (timeline) {

        const rect =
          timeline.getBoundingClientRect();

        const timelineHeight =
          timeline.offsetHeight;

        const viewportPoint =
          window.innerHeight * .55;

        const passed =
          viewportPoint - rect.top;

        const timelineProgress =
          Math.max(
            0,
            Math.min(
              1,
              passed / timelineHeight
            )
          );

        timelineLine.style.height =
          `${timelineProgress * 100}%`;

      }

    }


    /* ACTIVE NAV */

    let currentSection = "";

    sections.forEach(section => {

      const rect =
        section.getBoundingClientRect();

      if (
        rect.top <=
        window.innerHeight * .35
      ) {

        currentSection =
          section.id;

      }

    });


    navLinks.forEach(link => {

      const target =
        link.getAttribute("href");

      link.classList.toggle(
        "active",
        target === `#${currentSection}`
      );

    });


    /* HERO PARALLAX */

    if (
      hero &&
      heroContent &&
      !reducedMotion
    ) {

      const heroRect =
        hero.getBoundingClientRect();

      const heroProgress =
        Math.max(
          0,
          Math.min(
            1,
            -heroRect.top /
            hero.offsetHeight
          )
        );

      heroContent.style.setProperty(
        "--hero-scroll",
        heroProgress
      );

      heroContent.style.transform =
        `translate3d(
          0,
          ${heroProgress * -70}px,
          0
        )`;

      heroContent.style.opacity =
        `${1 - heroProgress * .85}`;

    }


    ticking = false;

  }


  window.addEventListener(
    "scroll",
    () => {

      if (!ticking) {

        window.requestAnimationFrame(
          updateScroll
        );

        ticking = true;

      }

    },
    { passive: true }
  );


  /* =======================================================
     SMOOTH NAVIGATION
  ======================================================= */

  navLinks.forEach(link => {

    link.addEventListener("click", event => {

      const selector =
        link.getAttribute("href");

      if (!selector.startsWith("#")) {
        return;
      }

      const target =
        document.querySelector(selector);

      if (!target) {
        return;
      }

      event.preventDefault();

      const offset =
        navbar
          ? navbar.offsetHeight
          : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        offset -
        20;

      window.scrollTo({

        top: targetPosition,

        behavior:
          reducedMotion
            ? "auto"
            : "smooth"

      });

    });

  });


  /* =======================================================
     HERO SCROLL BUTTON
  ======================================================= */

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

          const targetId =
            link.getAttribute("href");

          const target =
            document.querySelector(
              targetId
            );

          if (!target) {
            return;
          }

          if (
            link.closest(".navbar")
          ) {
            return;
          }

          event.preventDefault();

          const offset =
            navbar
              ? navbar.offsetHeight
              : 0;

          const position =
            target.getBoundingClientRect().top +
            window.scrollY -
            offset;

          window.scrollTo({

            top: position,

            behavior:
              reducedMotion
                ? "auto"
                : "smooth"

          });

        }
      );

    });


  /* =======================================================
     EMOTION CARDS
  ======================================================= */

  emotionCards.forEach(card => {

    card.addEventListener("click", () => {

      const wasOpen =
        card.classList.contains("open");


      /* close all */

      emotionCards.forEach(item => {
        item.classList.remove("open");
      });


      /* open selected */

      if (!wasOpen) {

        card.classList.add("open");

      }

    });

  });


  /* =======================================================
     CLOSE EMOTION CARD WITH ESC
  ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") {
        return;
      }

      emotionCards.forEach(card => {
        card.classList.remove("open");
      });

    }
  );


  /* =======================================================
     MOUSE CURSOR GLOW
  ======================================================= */

  if (
    cursorGlow &&
    !isTouch &&
    !reducedMotion
  ) {

    let mouseX = -500;
    let mouseY = -500;

    let currentX = -500;
    let currentY = -500;

    window.addEventListener(
      "pointermove",
      event => {

        mouseX = event.clientX;
        mouseY = event.clientY;

      },
      { passive: true }
    );


    function animateCursor() {

      currentX +=
        (mouseX - currentX) * .12;

      currentY +=
        (mouseY - currentY) * .12;

      cursorGlow.style.setProperty(
        "--cursor-x",
        `${currentX}px`
      );

      cursorGlow.style.setProperty(
        "--cursor-y",
        `${currentY}px`
      );

      requestAnimationFrame(
        animateCursor
      );

    }

    animateCursor();

  }


  /* =======================================================
     HERO MOUSE PARALLAX
  ======================================================= */

  if (
    hero &&
    !isTouch &&
    !reducedMotion
  ) {

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;


    hero.addEventListener(
      "pointermove",
      event => {

        const rect =
          hero.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width -
          .5;

        const y =
          (event.clientY - rect.top) /
          rect.height -
          .5;

        targetX = x * 18;
        targetY = y * 18;

      },
      { passive: true }
    );


    hero.addEventListener(
      "pointerleave",
      () => {

        targetX = 0;
        targetY = 0;

      }
    );


    function animateHero() {

      currentX +=
        (targetX - currentX) * .06;

      currentY +=
        (targetY - currentY) * .06;


      heroGlows.forEach(
        (glow, index) => {

          const factor =
            index === 0
              ? 1
              : -0.6;

          glow.style.transform =
            `translate3d(
              ${currentX * factor}px,
              ${currentY * factor}px,
              0
            )`;

        }
      );


      requestAnimationFrame(
        animateHero
      );

    }

    animateHero();

  }


  /* =======================================================
     PRESSURE PARALLAX
  ======================================================= */

  if (
    pressure &&
    pressureGlow &&
    !isTouch &&
    !reducedMotion
  ) {

    pressure.addEventListener(
      "pointermove",
      event => {

        const rect =
          pressure.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width -
          .5;

        const y =
          (event.clientY - rect.top) /
          rect.height -
          .5;

        pressureGlow.style.transform =
          `translate(
            ${x * 35}px,
            ${y * 35}px
          )`;

      },
      { passive: true }
    );


    pressure.addEventListener(
      "pointerleave",
      () => {

        pressureGlow.style.transform =
          "translate(0, 0)";

      }
    );

  }


  /* =======================================================
     ACTION CARD 3D TILT
  ======================================================= */

  if (
    !isTouch &&
    !reducedMotion
  ) {

    actionCards.forEach(card => {

      card.addEventListener(
        "pointermove",
        event => {

          const rect =
            card.getBoundingClientRect();

          const x =
            event.clientX - rect.left;

          const y =
            event.clientY - rect.top;

          const centerX =
            rect.width / 2;

          const centerY =
            rect.height / 2;

          const rotateX =
            ((y - centerY) /
              centerY) *
            -4;

          const rotateY =
            ((x - centerX) /
              centerX) *
            4;


          card.style.setProperty(
            "--mx",
            `${x}px`
          );

          card.style.setProperty(
            "--my",
            `${y}px`
          );


          card.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-6px)`;

        },
        { passive: true }
      );


      card.addEventListener(
        "pointerleave",
        () => {

          card.style.transform =
            "";

          card.style.setProperty(
            "--mx",
            "50%"
          );

          card.style.setProperty(
            "--my",
            "50%"
          );

        }
      );

    });

  }


  /* =======================================================
     MAGNETIC BUTTONS
  ======================================================= */

  if (
    !isTouch &&
    !reducedMotion
  ) {

    magneticElements.forEach(
      element => {

        element.addEventListener(
          "pointermove",
          event => {

            const rect =
              element.getBoundingClientRect();

            const x =
              event.clientX -
              rect.left -
              rect.width / 2;

            const y =
              event.clientY -
              rect.top -
              rect.height / 2;

            element.style.transform =
              `translate(
                ${x * .18}px,
                ${y * .18}px
              )`;

          },
          { passive: true }
        );


        element.addEventListener(
          "pointerleave",
          () => {

            element.style.transform =
              "";

          }
        );

      }
    );

  }


  /* =======================================================
     TOUCH FEEDBACK
  ======================================================= */

  if (isTouch) {

    const touchTargets =
      document.querySelectorAll(
        ".action-card, .timeline-card, .emotion-card, .now-card"
      );

    touchTargets.forEach(element => {

      element.addEventListener(
        "touchstart",
        () => {

          element.classList.add(
            "touch-active"
          );

        },
        { passive: true }
      );


      element.addEventListener(
        "touchend",
        () => {

          setTimeout(() => {

            element.classList.remove(
              "touch-active"
            );

          }, 180);

        },
        { passive: true }
      );

    });

  }


  /* =======================================================
     KEYBOARD ACCESSIBILITY
  ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        nav &&
        menuToggle
      ) {

        nav.classList.remove("open");
        menuToggle.classList.remove("active");
        body.classList.remove("menu-open");

      }

    }
  );


  /* =======================================================
     PREVENT IMAGE DRAG
  ======================================================= */

  document
    .querySelectorAll("img")
    .forEach(img => {

      img.setAttribute(
        "draggable",
        "false"
      );

    });


  /* =======================================================
     INITIAL UPDATE
  ======================================================= */

  updateScroll();

})();