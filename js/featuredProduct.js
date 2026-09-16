document.addEventListener("DOMContentLoaded", function () {
  const section = document.getElementById("featured-product");
  const cardsWrap = document.getElementById("fpCards");
  const certsWrap = document.getElementById("fpCerts");
  const calloutsWrap = document.getElementById("fpCallouts");

  if (!section || !cardsWrap || !certsWrap || !calloutsWrap) return;

  const ICONS = {
    android:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9.5v6a1 1 0 0 0 1 1h1v2.5a1.3 1.3 0 0 0 2.6 0V16.5h2.8v2.5a1.3 1.3 0 0 0 2.6 0V16.5h1a1 1 0 0 0 1-1v-6H6z" fill="currentColor"/><path d="M6 8.5h12a6 6 0 0 0-3.2-4.6l.9-1.6a.4.4 0 1 0-.7-.4l-.9 1.6a6.6 6.6 0 0 0-4.2 0l-.9-1.6a.4.4 0 1 0-.7.4l.9 1.6A6 6 0 0 0 6 8.5Z" fill="currentColor"/><circle cx="9.3" cy="6.3" r=".6" fill="#fff"/><circle cx="14.7" cy="6.3" r=".6" fill="#fff"/><rect x="3" y="9.5" width="1.6" height="5.5" rx=".8" fill="currentColor"/><rect x="19.4" y="9.5" width="1.6" height="5.5" rx=".8" fill="currentColor"/></svg>',
    signal:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="14" width="3" height="6" rx="1" fill="currentColor"/><rect x="9" y="10" width="3" height="10" rx="1" fill="currentColor"/><rect x="15" y="6" width="3" height="14" rx="1" fill="currentColor"/><rect x="21" y="2" width="0" height="0"/></svg>',
    battery:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="7" width="16" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/><rect x="20" y="10" width="2" height="4" rx="1" fill="currentColor"/><rect x="5" y="9.5" width="9" height="5" rx="1" fill="currentColor"/></svg>',
    water:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3s6 6.6 6 11a6 6 0 1 1-12 0c0-4.4 6-11 6-11Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  };

  const CARDS = [
    { icon: "android", value: "Android 16", label: "Certified" },
    { icon: "signal", value: "4G LTE", label: "Connectivity" },
    { icon: "battery", value: "4,000 mAh", label: "Battery", active: true },
    { icon: "water", value: "IP68", label: "Water Resistant" },
  ];

  const CERTS = ["ATEX Certified", "IECEx Certified", "NEC 500", "IMEI / TAC Certified"];

  const CALLOUTS = [
    { label: "Built for", value: "Extreme Environments", side: "right", top: "18%" },
    { label: "Intrinsically", value: "Safe Design", side: "left", top: "48%" },
    { label: "IP68", value: "Protection", side: "right", top: "76%" },
  ];

  CARDS.forEach((card, i) => {
    const el = document.createElement("div");
    el.className = "fp-card" + (card.active ? " fp-card-active" : "");
    el.style.transitionDelay = 0.35 + 0.08 * i + "s";
    el.innerHTML =
      '<span class="fp-card-icon">' +
      ICONS[card.icon] +
      '</span><span class="fp-card-value">' +
      card.value +
      '</span><span class="fp-card-label">' +
      card.label +
      "</span>";
    cardsWrap.appendChild(el);
  });

  CERTS.forEach((label, i) => {
    const el = document.createElement("span");
    el.className = "fp-cert";
    el.style.transitionDelay = 0.65 + 0.06 * i + "s";
    el.textContent = label;
    certsWrap.appendChild(el);
  });

  CALLOUTS.forEach((co, i) => {
    const el = document.createElement("div");
    el.className = "fp-callout fp-callout-" + co.side;
    el.style.top = co.top;
    el.style.transitionDelay = 0.5 + i * 0.15 + "s";
    el.innerHTML =
      '<span class="fp-callout-line"></span><span class="fp-callout-dot"></span><span class="fp-callout-text">' +
      co.label +
      "<br>" +
      co.value +
      "</span>";
    calloutsWrap.appendChild(el);
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
    { threshold: 0.25 }
  );
  revealObserver.observe(section);
});
