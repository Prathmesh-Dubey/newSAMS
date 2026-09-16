document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector(".cert-carousel");
  const viewport = document.getElementById("ccViewport");
  const stage = document.getElementById("ccTrack");
  const dotsWrap = document.getElementById("ccDots");
  const prevBtn = document.getElementById("ccPrev");
  const nextBtn = document.getElementById("ccNext");

  if (!section || !viewport || !stage || !prevBtn || !nextBtn) return;

  const cards = Array.from(stage.querySelectorAll(".cc-card"));
  if (!cards.length) return;

  let currentIndex = 0;

  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "cc-dot";
    dot.setAttribute("aria-label", "Go to certification " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  const total = cards.length;
  const mod = (n) => ((n % total) + total) % total;

  function render() {
    const prevIndex = mod(currentIndex - 1);
    const nextIndex = mod(currentIndex + 1);

    cards.forEach((card, i) => {
      card.classList.remove("is-active", "is-prev", "is-next");
      if (i === currentIndex) {
        card.classList.add("is-active");
      } else if (i === prevIndex && total > 1) {
        card.classList.add("is-prev");
      } else if (i === nextIndex && total > 1) {
        card.classList.add("is-next");
      }
    });

    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === currentIndex));
  }

  function goTo(index) {
    currentIndex = mod(index);
    render();
  }

  prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

  // Clicking a faded side card also advances to it.
  stage.addEventListener("click", (e) => {
    const card = e.target.closest(".cc-card");
    if (!card) return;
    const index = cards.indexOf(card);
    if (index === mod(currentIndex - 1)) goTo(currentIndex - 1);
    if (index === mod(currentIndex + 1)) goTo(currentIndex + 1);
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
      goTo(currentIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(currentIndex - 1);
    }
  });

  // Swipe / drag support (touch and mouse).
  let dragStartX = 0;
  let dragging = false;

  viewport.addEventListener("pointerdown", (e) => {
    dragging = true;
    dragStartX = e.clientX;
  });

  viewport.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;
    const delta = e.clientX - dragStartX;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) {
      goTo(currentIndex + 1);
    } else {
      goTo(currentIndex - 1);
    }
  });

  viewport.addEventListener("pointerleave", () => {
    dragging = false;
  });

  render();
});
