document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector(".cert-carousel");
  const viewport = document.getElementById("ccViewport");
  const stage = document.getElementById("ccTrack");
  const dotsWrap = document.getElementById("ccDots");
  const prevBtn = document.getElementById("ccPrev");
  const nextBtn = document.getElementById("ccNext");

  if (!section || !viewport || !stage || !prevBtn || !nextBtn) return;

  const realCards = Array.from(stage.querySelectorAll(".cc-card"));
  const total = realCards.length;
  if (!total) return;

  // Clone the last card before the first, and the first card after the
  // last, so a swipe/scroll past either edge finds a real-looking
  // neighbour instead of empty space — then we invisibly snap back to
  // the real card underneath once it settles. This is what makes the
  // loop feel infinite instead of bouncing back and forth.
  realCards.forEach((card, i) => (card.dataset.real = String(i)));

  const leadClone = realCards[total - 1].cloneNode(true);
  const tailClone = realCards[0].cloneNode(true);
  leadClone.setAttribute("aria-hidden", "true");
  tailClone.setAttribute("aria-hidden", "true");
  leadClone.dataset.real = String(total - 1);
  tailClone.dataset.real = "0";
  stage.insertBefore(leadClone, realCards[0]);
  stage.appendChild(tailClone);

  const slides = Array.from(stage.children);
  const toDomPos = (realIndex) => realIndex + 1;

  realCards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "cc-dot";
    dot.setAttribute("aria-label", "Go to certification " + (i + 1));
    dot.addEventListener("click", () => stepTo(toDomPos(i)));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  let currentIndex = 0;
  let suppressScrollSync = false;

  function markActive(realIndex) {
    slides.forEach((slide) => {
      slide.classList.toggle("is-active", Number(slide.dataset.real) === realIndex);
    });
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === realIndex));
  }

  // The scrollLeft that puts this slide's true center on the viewport's
  // true center — not just its left edge flush with the viewport's left
  // edge, which is a different (and, for every slide but the first,
  // wrong) position, and fights with the browser's own
  // scroll-snap-align: center once it re-snaps.
  function centerTarget(domPos) {
    const slide = slides[domPos];
    return slide.offsetLeft - stage.offsetLeft + slide.offsetWidth / 2 - stage.clientWidth / 2;
  }

  function jumpInstant(domPos) {
    stage.style.scrollBehavior = "auto";
    stage.scrollLeft = centerTarget(domPos);
    stage.style.scrollBehavior = "";
  }

  function stepTo(domPos) {
    stage.scrollTo({ left: centerTarget(domPos), behavior: "smooth" });
  }

  function handleNext() {
    stepTo(currentIndex === total - 1 ? slides.length - 1 : toDomPos(currentIndex + 1));
  }

  function handlePrev() {
    stepTo(currentIndex === 0 ? 0 : toDomPos(currentIndex - 1));
  }

  prevBtn.addEventListener("click", handlePrev);
  nextBtn.addEventListener("click", handleNext);

  // Clicking a faded card also jumps to it (including the two clones).
  stage.addEventListener("click", (e) => {
    const slide = e.target.closest(".cc-card");
    if (!slide) return;
    const domPos = slides.indexOf(slide);
    if (domPos === -1 || domPos === toDomPos(currentIndex)) return;
    stepTo(domPos);
  });

  function findClosestDomPos() {
    let closest = 0;
    let closestDist = Infinity;
    slides.forEach((slide, i) => {
      const dist = Math.abs(centerTarget(i) - stage.scrollLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    return closest;
  }

  function domPosToReal(domPos) {
    if (domPos === 0) return total - 1;
    if (domPos === slides.length - 1) return 0;
    return domPos - 1;
  }

  // Two things happen on scroll, at different cadences:
  // 1) Live, every frame — whichever card is currently closest to center
  //    gets marked active right away, so only one card is ever opaque at
  //    a time during a drag. Waiting until the scroll fully stops to
  //    decide this caused both cards to sit at the same faded opacity
  //    mid-swipe, and their overlapping text visibly double-exposed.
  // 2) Once settled (debounced) — if we landed on one of the two clones,
  //    snap instantly to the real card underneath (identical in
  //    appearance, so the correction is invisible).
  let liveFrame = null;
  let settleTimer = null;
  stage.addEventListener("scroll", () => {
    if (suppressScrollSync) return;

    if (liveFrame) cancelAnimationFrame(liveFrame);
    liveFrame = requestAnimationFrame(() => {
      const realIdx = domPosToReal(findClosestDomPos());
      if (realIdx !== currentIndex) {
        currentIndex = realIdx;
        markActive(currentIndex);
      }
    });

    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      const domPos = findClosestDomPos();
      if (domPos === 0) {
        suppressScrollSync = true;
        currentIndex = total - 1;
        jumpInstant(total);
        markActive(currentIndex);
        suppressScrollSync = false;
      } else if (domPos === slides.length - 1) {
        suppressScrollSync = true;
        currentIndex = 0;
        jumpInstant(1);
        markActive(currentIndex);
        suppressScrollSync = false;
      }
    }, 120);
  });

  // Keyboard arrow-key navigation while the carousel is in view.
  let inView = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        inView = entry.isIntersecting;
      });
    },
    { threshold: 0.35 }
  );
  observer.observe(section);

  window.addEventListener("keydown", (e) => {
    if (!inView) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    }
  });

  window.addEventListener("resize", () => jumpInstant(toDomPos(currentIndex)));

  jumpInstant(toDomPos(0));
  markActive(0);
});
