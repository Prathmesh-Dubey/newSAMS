document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector(".roadmap");
  const grid = document.getElementById("roadmapGrid");

  if (!section || !grid) return;

  const MILESTONES = [
    {
      when: "Now",
      title: "Distributor onboarding",
      desc: "Territory agreements and pre-launch pricing for authorised partners.",
    },
    {
      when: "Q3 2026",
      title: "Certification documentation",
      desc: "IECEx, ATEX and NEC 500 certificates and co-branded datasheets released to partners.",
    },
    {
      when: "Q4 2026",
      title: "Smart Ex-04 launch",
      desc: "General availability across 30+ target countries. Full technical specifications published.",
    },
    {
      when: "2027",
      title: "Regional certifications",
      desc: "INMETRO, PESO, EAC Ex, CSA, NEPSI, ANZEx, KOSHA and TIIS roll-out.",
    },
  ];

  MILESTONES.forEach((m, i) => {
    const el = document.createElement("div");
    el.className = "roadmap-item";
    el.style.transitionDelay = 0.25 + i * 0.1 + "s";
    el.innerHTML =
      '<span class="roadmap-when">' +
      m.when.toUpperCase() +
      '</span><h3 class="roadmap-item-title">' +
      m.title +
      '</h3><p class="roadmap-item-desc">' +
      m.desc +
      "</p>";
    grid.appendChild(el);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
          revealObserver.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );
  revealObserver.observe(section);
});
