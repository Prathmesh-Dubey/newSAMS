document.addEventListener("DOMContentLoaded", function () {
  const section = document.getElementById("applications");
  const list = document.getElementById("appsList");

  if (!section || !list) return;

  const INDUSTRIES = [
    { num: "01", title: "Oil & Gas", desc: "Upstream, midstream, downstream operations" },
    { num: "02", title: "Petrochemical", desc: "Refineries and chemical processing plants" },
    { num: "03", title: "Mining", desc: "Underground and surface mining operations" },
    { num: "04", title: "Power Generation", desc: "Conventional and renewable energy facilities" },
    { num: "05", title: "Pharmaceutical", desc: "Solvent handling and cleanroom environments" },
    { num: "06", title: "Marine & Offshore", desc: "Offshore platforms and marine vessels" },
  ];

  INDUSTRIES.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "apps-row";
    row.style.transitionDelay = 0.3 + i * 0.07 + "s";
    row.innerHTML =
      '<span class="apps-row-num">' +
      item.num +
      '</span><div class="apps-row-body"><h3 class="apps-row-title">' +
      item.title +
      '</h3><p class="apps-row-desc">' +
      item.desc +
      '</p></div><svg class="apps-row-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    list.appendChild(row);
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
