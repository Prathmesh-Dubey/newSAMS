document.addEventListener("DOMContentLoaded", function () {
  const section = document.getElementById("device");
  const carousel = document.getElementById("tovCarousel");
  const track = document.getElementById("tovTrack");
  const dotsWrap = document.getElementById("tovDots");
  const prevBtn = document.getElementById("tovPrev");
  const nextBtn = document.getElementById("tovNext");
  const phoneStage = document.getElementById("tovPhoneStage");

  if (!section || !carousel || !track || !dotsWrap || !prevBtn || !nextBtn || !phoneStage) return;

  const SPECS = [
    {
      eyebrow: "Design",
      title: "Rugged Engineering",
      desc: "Built for demanding industrial environments with reinforced construction and protected controls.",
      view: "front",
      details: [
        { label: "Material", value: "Industrial-grade housing" },
        { label: "Controls", value: "Sealed, glove-operable" },
      ],
    },
    {
      eyebrow: "Display",
      title: "Industrial Visibility",
      desc: "Large readable display engineered for field operation and professional workflows.",
      view: "front",
      details: [
        { label: "Visibility", value: "Sunlight-readable panel" },
        { label: "Input", value: "Glove and wet-touch capable" },
      ],
    },
    {
      eyebrow: "Performance",
      title: "Qualcomm Snapdragon",
      desc: "8-core Snapdragon platform designed for enterprise applications, communication and field workflows.",
      view: "right",
      details: [
        { label: "Processor", value: "8-core Qualcomm Snapdragon" },
        { label: "OS", value: "Android 16, Enterprise-managed" },
      ],
    },
    {
      eyebrow: "Camera",
      title: "50 MP Inspection Camera",
      desc: "High-resolution rear camera with phase-detect autofocus and LED flash for industrial inspection.",
      view: "back",
      details: [
        { label: "Rear camera", value: "50 MP" },
        { label: "Focus", value: "Phase-detect AF + LED flash" },
      ],
      badge: "50 MP",
    },
    {
      eyebrow: "Battery",
      title: "4,000 mAh",
      desc: "Full-shift battery capacity with intrinsically safe charging circuitry and low-temperature operation.",
      view: "bottom",
      details: [
        { label: "Capacity", value: "4,000 mAh" },
        { label: "Charging", value: "Intrinsically safe circuitry" },
      ],
      badge: "4,000 mAh",
    },
    {
      eyebrow: "Connectivity",
      title: "Connected In The Field",
      desc: "4G LTE, dual-band Wi-Fi and Bluetooth for PTT, telemetry and asset tagging via NFC.",
      view: "top",
      details: [
        { label: "Network", value: "4G LTE" },
        { label: "Wireless", value: "Wi-Fi · Bluetooth · NFC" },
      ],
    },
    {
      eyebrow: "Navigation",
      title: "Multi-Constellation GNSS",
      desc: "Four-constellation positioning for lone-worker safety and geofenced zone alerts.",
      view: "left",
      details: [
        { label: "GNSS", value: "GPS · GLONASS" },
        { label: "Use", value: "Lone-worker safety, geofencing" },
      ],
    },
    {
      eyebrow: "Protection",
      title: "IP68",
      desc: "Fully dust-tight and protected against continuous immersion.",
      view: "front",
      details: [
        { label: "Ingress", value: "IP68 rated" },
        { label: "Sealing", value: "Ports, keys and speaker" },
      ],
      badge: "IP68",
    },
  ];

  const pad2 = (n) => String(n).padStart(2, "0");

  const badgeEl = document.createElement("span");
  badgeEl.className = "tov-slide-badge";
  phoneStage.parentElement.appendChild(badgeEl);

  SPECS.forEach((spec, i) => {
    const slide = document.createElement("article");
    slide.className = "tov-slide";
    slide.dataset.index = String(i);

    const details = spec.details
      .map(
        (d) =>
          '<div class="tov-detail"><span class="tov-detail-label">' +
          d.label +
          '</span><span class="tov-detail-value">' +
          d.value +
          "</span></div>"
      )
      .join("");

    slide.innerHTML =
      '<span class="tov-slide-num">' +
      pad2(i + 1) +
      " / " +
      pad2(SPECS.length) +
      '</span><span class="tov-slide-eyebrow">' +
      spec.eyebrow +
      '</span><h3 class="tov-slide-title">' +
      spec.title +
      '</h3><p class="tov-slide-desc">' +
      spec.desc +
      '</p><div class="tov-slide-divider"></div><div class="tov-slide-details">' +
      details +
      "</div>";

    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "tov-dot";
    dot.setAttribute("aria-label", "Go to " + spec.eyebrow);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const slides = Array.from(track.querySelectorAll(".tov-slide"));
  const dots = Array.from(dotsWrap.querySelectorAll(".tov-dot"));
  const total = slides.length;
  const mod = (n) => ((n % total) + total) % total;

  let currentIndex = 0;

  function markActive(index) {
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    if (window.tovModel) window.tovModel.setView(SPECS[index].view);
    if (SPECS[index].badge) {
      badgeEl.textContent = SPECS[index].badge;
      badgeEl.classList.add("is-visible");
    } else {
      badgeEl.classList.remove("is-visible");
    }
  }

  function goTo(index) {
    currentIndex = mod(index);
    track.scrollTo({
      left: slides[currentIndex].offsetLeft - track.offsetLeft,
      behavior: "smooth",
    });
    markActive(currentIndex);
  }

  prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

  let scrollTimer = null;
  track.addEventListener("scroll", () => {
    if (scrollTimer) window.cancelAnimationFrame(scrollTimer);
    scrollTimer = window.requestAnimationFrame(() => {
      let closest = 0;
      let closestDist = Infinity;
      slides.forEach((s, i) => {
        const dist = Math.abs(s.offsetLeft - track.offsetLeft - track.scrollLeft);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      if (closest !== currentIndex) {
        currentIndex = closest;
        markActive(currentIndex);
      }
    });
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

  // Mouse drag-to-swipe support (touch swipe already works natively via scroll-snap).
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartScroll = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
    track.style.scrollBehavior = "auto";
  });

  track.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    track.scrollLeft = dragStartScroll - (e.clientX - dragStartX);
  });

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    track.style.scrollBehavior = "smooth";
    goTo(currentIndex);
  }

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointerleave", endDrag);
  track.addEventListener("pointercancel", endDrag);

  window.addEventListener("resize", () => goTo(currentIndex));

  markActive(0);

  // tovModel.js loads as a module and may finish setting up after this
  // script runs, so re-apply the active spec's view once it's ready.
  window.addEventListener("tov:model-ready", () => {
    if (window.tovModel) window.tovModel.setView(SPECS[currentIndex].view);
  });
});
