document.addEventListener("DOMContentLoaded", function () {
  const section = document.getElementById("reach");
  if (!section) return;

  const regionButtons = Array.from(section.querySelectorAll(".region"));
  const panels = Array.from(section.querySelectorAll("[data-region-panel]"));

  regionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.region;

      regionButtons.forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
      panels.forEach((p) => {
        p.hidden = p.dataset.regionPanel !== target;
      });
    });
  });

  const revealEls = Array.from(section.querySelectorAll("[data-reveal]"));
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
});
