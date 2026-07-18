(function () {
  "use strict";

  var nav = document.getElementById("siteNav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  var themeToggle = document.getElementById("themeToggle");
  var themeIcon = document.getElementById("themeIcon");
  var yearEl = document.getElementById("year");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var savedTheme = localStorage.getItem("brchecho-theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (themeIcon) {
      themeIcon.className = "bi bi-sun";
    }
  }

  var navFramePending = false;

  function updateNavScroll() {
    if (!nav) return;
    if (window.scrollY > 12) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }

  updateNavScroll();
  window.addEventListener("scroll", function () {
    if (navFramePending) return;
    navFramePending = true;
    window.requestAnimationFrame(function () {
      updateNavScroll();
      navFramePending = false;
    });
  }, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var isDark = document.body.classList.toggle("dark-mode");
      localStorage.setItem("brchecho-theme", isDark ? "dark" : "light");
      if (themeIcon) {
        themeIcon.className = isDark ? "bi bi-sun" : "bi bi-moon-stars";
      }
    });
  }

  // Reveal immediately on entry; timers and stagger can block smooth scrolling.
  var reveals = document.querySelectorAll(".reveal");

  if (reduceMotion) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px 80px 0px" }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // Experience jump links — soft active highlight
  var expSteps = document.querySelectorAll(".exp-step");
  var expJumpLinks = document.querySelectorAll(".exp-jump a");

  if (expSteps.length && expJumpLinks.length && "IntersectionObserver" in window) {
    var activeId = null;

    function setActiveJump(id) {
      if (!id || activeId === id) return;
      activeId = id;
      expJumpLinks.forEach(function (link) {
        var match = link.getAttribute("href") === "#" + id;
        link.classList.toggle("is-active", match);
      });
    }

    var stepObserver = new IntersectionObserver(
      function (entries) {
        var visible = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return b.intersectionRatio - a.intersectionRatio;
          });

        if (visible.length && visible[0].target.id) {
          setActiveJump(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75] }
    );

    expSteps.forEach(function (step) {
      if (step.id) stepObserver.observe(step);
    });

    if (expSteps[0] && expSteps[0].id) {
      setActiveJump(expSteps[0].id);
    }
  }
})();
