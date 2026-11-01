(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    var film = document.querySelector(".signal-video");
    if (film) {
      film.removeAttribute("autoplay");
      film.pause();
    }
  }

  try {
    root.classList.add("js");

    /* Stagger the parts of a section, not the whole block. */
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    items.forEach(function (el) {
      var siblings = Array.prototype.slice.call(
        el.parentElement ? el.parentElement.querySelectorAll("[data-reveal]") : [el]
      );
      var index = siblings.indexOf(el);
      if (index > 0) {
        el.style.transitionDelay = Math.min(index, 4) * 70 + "ms";
      }
    });

    if (!("IntersectionObserver" in window) || reduce) {
      items.forEach(function (el) {
        el.classList.add("is-in");
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      items.forEach(function (el) {
        observer.observe(el);
      });
    }

    /* The projects index drives the square stage. */
    var stageImages = Array.prototype.slice.call(document.querySelectorAll("[data-stage]"));
    var projectLinks = Array.prototype.slice.call(document.querySelectorAll("[data-project]"));

    function activateProject(index) {
      stageImages.forEach(function (img) {
        img.classList.toggle("is-active", img.getAttribute("data-stage") === String(index));
      });
      projectLinks.forEach(function (link) {
        link.classList.toggle("is-current", link.getAttribute("data-project") === String(index));
      });
    }

    projectLinks.forEach(function (link) {
      var index = link.getAttribute("data-project");
      link.addEventListener("mouseenter", function () {
        activateProject(index);
      });
      link.addEventListener("focus", function () {
        activateProject(index);
      });
    });

    /* A quiet navigation bar once the first screen is behind. */
    var head = document.querySelector(".site-head");
    if (head) {
      var onScroll = function () {
        head.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    /* If anything above failed before the observer ran, show the content. */
    window.setTimeout(function () {
      if (!document.querySelector("[data-reveal].is-in")) {
        root.classList.remove("js");
      }
    }, 2600);
  } catch (error) {
    root.classList.remove("js");
  }
})();
