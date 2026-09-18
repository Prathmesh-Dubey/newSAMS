document.addEventListener("DOMContentLoaded", function () {

  /* ---------------------------------------------------------------- */
  /* Navbar: scroll shrink + mobile toggle                              */
  /* ---------------------------------------------------------------- */
  (function nav() {
    const nav = document.getElementById("s2Nav");
    const toggle = document.getElementById("s2NavToggle");
    const mobile = document.getElementById("s2NavMobile");
    if (!nav) return;

    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && mobile) {
      toggle.addEventListener("click", () => {
        const open = mobile.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      mobile.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => {
          mobile.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        })
      );
    }
  })();

  /* ---------------------------------------------------------------- */
  /* Back to top                                                        */
  /* ---------------------------------------------------------------- */
  (function backToTop() {
    const btn = document.getElementById("s2Top");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      () => btn.classList.toggle("is-visible", window.scrollY > 700),
      { passive: true }
    );
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  })();

  /* ---------------------------------------------------------------- */
  /* Scroll reveal                                                      */
  /* ---------------------------------------------------------------- */
  (function reveal() {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    els.forEach((el) => io.observe(el));
  })();

  /* ---------------------------------------------------------------- */
  /* Animated counters                                                  */
  /* ---------------------------------------------------------------- */
  (function counters() {
    const els = Array.from(document.querySelectorAll("[data-count-to]"));
    if (!els.length) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const run = (el) => {
      const target = Number(el.dataset.countTo);
      const suffix = el.dataset.suffix || "";
      if (prefersReducedMotion || !Number.isFinite(target)) {
        el.textContent = target + suffix;
        return;
      }
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    els.forEach((el) => io.observe(el));
  })();

  /* ---------------------------------------------------------------- */
  /* Certification carousel                                             */
  /* ---------------------------------------------------------------- */
  (function ccCarousel() {
    const track = document.getElementById("ccTrack2");
    const dotsWrap = document.getElementById("ccDots2");
    const prevBtn = document.getElementById("ccPrev2");
    const nextBtn = document.getElementById("ccNext2");
    if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

    const cards = Array.from(track.querySelectorAll(".s2-cc__card"));
    const total = cards.length;
    let current = 0;

    cards.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to certification " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function markActive(i) {
      dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));
    }

    function goTo(i) {
      current = (i + total) % total;
      cards[current].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      markActive(current);
    }

    prevBtn.addEventListener("click", () => goTo(current - 1));
    nextBtn.addEventListener("click", () => goTo(current + 1));

    let settleTimer = null;
    track.addEventListener(
      "scroll",
      () => {
        if (settleTimer) clearTimeout(settleTimer);
        settleTimer = setTimeout(() => {
          let closest = 0;
          let closestDist = Infinity;
          cards.forEach((card, i) => {
            const dist = Math.abs(card.offsetLeft - track.scrollLeft);
            if (dist < closestDist) {
              closestDist = dist;
              closest = i;
            }
          });
          current = closest;
          markActive(current);
        }, 120);
      },
      { passive: true }
    );

    markActive(0);
  })();

  /* ---------------------------------------------------------------- */
  /* Technical Overview: interactive category system                   */
  /* ---------------------------------------------------------------- */
  (function techOverview() {
    const tabsWrap = document.getElementById("tovTabs2");
    const body = document.getElementById("tovBody2");
    const model = document.getElementById("tovModel2");
    const badgeEl = document.getElementById("tovBadge2");
    const section = document.getElementById("device");
    if (!tabsWrap || !body || !model || !badgeEl || !section) return;

    const ORBITS = {
      front: "0deg 75deg 105%",
      back: "180deg 75deg 105%",
      top: "0deg 12deg 105%",
      bottom: "0deg 168deg 105%",
      left: "-90deg 75deg 105%",
      right: "90deg 75deg 105%",
    };

    const SPECS = [
      { eyebrow: "Design", title: "Rugged Engineering", desc: "Built for demanding industrial environments with reinforced construction and protected controls.", image: "front",
        details: [{ label: "Material", value: "Industrial-grade housing" }, { label: "Controls", value: "Sealed, glove-operable" }] },
      { eyebrow: "Display", title: "Industrial Visibility", desc: "Large readable display engineered for field operation and professional workflows.", image: "front",
        details: [{ label: "Visibility", value: "Sunlight-readable panel" }, { label: "Input", value: "Glove and wet-touch capable" }] },
      { eyebrow: "Performance", title: "Qualcomm Snapdragon", desc: "8-core Snapdragon platform designed for enterprise applications, communication and field workflows.", image: "right",
        details: [{ label: "Processor", value: "8-core Qualcomm Snapdragon" }, { label: "OS", value: "Android 16, Enterprise-managed" }] },
      { eyebrow: "Camera", title: "50 MP Inspection Camera", desc: "High-resolution rear camera with phase-detect autofocus and LED flash for industrial inspection.", image: "back",
        details: [{ label: "Rear camera", value: "50 MP" }, { label: "Focus", value: "Phase-detect AF + LED flash" }], badge: "50 MP" },
      { eyebrow: "Battery", title: "4,000 mAh", desc: "Full-shift battery capacity with intrinsically safe charging circuitry and low-temperature operation.", image: "bottom",
        details: [{ label: "Capacity", value: "4,000 mAh" }, { label: "Charging", value: "Intrinsically safe circuitry" }], badge: "4,000 mAh" },
      { eyebrow: "Connectivity", title: "Connected In The Field", desc: "4G LTE, dual-band Wi-Fi and Bluetooth for PTT, telemetry and asset tagging via NFC.", image: "top",
        details: [{ label: "Network", value: "4G LTE" }, { label: "Wireless", value: "Wi-Fi · Bluetooth · NFC" }] },
      { eyebrow: "Navigation", title: "Multi-Constellation GNSS", desc: "Four-constellation positioning for lone-worker safety and geofenced zone alerts.", image: "left",
        details: [{ label: "GNSS", value: "GPS · GLONASS" }, { label: "Use", value: "Lone-worker safety, geofencing" }] },
      { eyebrow: "Protection", title: "IP68", desc: "Fully dust-tight and protected against continuous immersion.", image: "front",
        details: [{ label: "Ingress", value: "IP68 rated" }, { label: "Sealing", value: "Ports, keys and speaker" }], badge: "IP68" },
    ];

    let resumeTimer = null;
    function goToAngle(angle) {
      const orbit = ORBITS[angle];
      if (!orbit) return;
      model.removeAttribute("auto-rotate");
      model.cameraOrbit = orbit;
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => model.setAttribute("auto-rotate", ""), 3200);
    }

    SPECS.forEach((spec, i) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "s2-tov__tab" + (i === 0 ? " is-active" : "");
      tab.textContent = spec.eyebrow;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(i === 0));
      tab.addEventListener("click", () => show(i));
      tabsWrap.appendChild(tab);
    });
    const tabs = Array.from(tabsWrap.children);

    function show(index) {
      const spec = SPECS[index];
      tabs.forEach((t, i) => {
        t.classList.toggle("is-active", i === index);
        t.setAttribute("aria-selected", String(i === index));
      });
      goToAngle(spec.image);

      if (spec.badge) {
        badgeEl.textContent = spec.badge;
        badgeEl.classList.add("is-visible");
      } else {
        badgeEl.classList.remove("is-visible");
      }

      const details = spec.details
        .map(
          (d) =>
            '<div class="s2-tov__detail"><span>' + d.label + "</span><span>" + d.value + "</span></div>"
        )
        .join("");

      body.innerHTML =
        '<div class="s2-tov__slide">' +
        '<span class="s2-tov__num">' + String(index + 1).padStart(2, "0") + " / " + String(SPECS.length).padStart(2, "0") + "</span>" +
        "<h3>" + spec.title + "</h3>" +
        "<p>" + spec.desc + "</p>" +
        '<div class="s2-tov__details">' + details + "</div>" +
        "</div>";
    }

    show(0);

    let inView = false;
    new IntersectionObserver((entries) => entries.forEach((e) => (inView = e.isIntersecting)), { threshold: 0.3 }).observe(section);
    let current = 0;
    tabs.forEach((t, i) =>
      t.addEventListener("click", () => {
        current = i;
      })
    );
    window.addEventListener("keydown", (e) => {
      if (!inView) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        current = (current + 1) % SPECS.length;
        show(current);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        current = (current - 1 + SPECS.length) % SPECS.length;
        show(current);
      }
    });
  })();

  /* ---------------------------------------------------------------- */
  /* Risk zones                                                         */
  /* ---------------------------------------------------------------- */
  (function riskZones() {
    const tabs = Array.from(document.querySelectorAll(".s2-rz__tab"));
    const badge = document.getElementById("rzBadge2");
    const desc = document.getElementById("rzDesc2");
    const example = document.getElementById("rzExample2");
    const art = document.getElementById("rzArt2");
    if (!tabs.length || !badge || !desc || !example) return;

    const DATA = [
      { badge: "Gas Atmosphere", desc: "Explosive gas atmospheres likely in normal operation.", example: "Areas near tanks, pumps and gas processing equipment.", tint: "gas" },
      { badge: "Dust Atmosphere", desc: "Combustible dust clouds likely in normal operation.", example: "Milling, processing and bulk handling areas.", tint: "dust" },
      { badge: "Certification Code", desc: "Intrinsically safe · highest gas group · T4 temperature class.", example: "Limits circuit energy so no spark can ignite hydrogen or acetylene.", tint: "code" },
    ];

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const i = Number(tab.dataset.rz);
        tabs.forEach((t) => {
          t.classList.toggle("is-active", t === tab);
          t.setAttribute("aria-selected", String(t === tab));
        });
        badge.textContent = DATA[i].badge;
        example.innerHTML = "<strong>Example:</strong> " + DATA[i].example;
        desc.style.opacity = 0;
        setTimeout(() => {
          desc.textContent = DATA[i].desc;
          desc.style.opacity = 1;
        }, 150);
        if (art) art.style.transform = "rotate(" + i * 8 + "deg)";
      });
    });
    desc.style.transition = "opacity .3s ease";
  })();

  /* ---------------------------------------------------------------- */
  /* Reach: region tabs                                                 */
  /* ---------------------------------------------------------------- */
  (function reach() {
    const regionButtons = Array.from(document.querySelectorAll(".s2-region"));
    const panels = Array.from(document.querySelectorAll("[data-region-panel]"));
    if (!regionButtons.length) return;

    regionButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.region;
        regionButtons.forEach((b) => {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-selected", String(b === btn));
        });
        panels.forEach((p) => (p.hidden = p.dataset.regionPanel !== target));
      });
    });
  })();

  /* ---------------------------------------------------------------- */
  /* Distributor form                                                   */
  /* ---------------------------------------------------------------- */
  (function distributorForm() {
    const form = document.getElementById("s2DistForm");
    const note = document.getElementById("s2DistNote");
    if (!form || !note) return;

    const fields = Array.from(form.querySelectorAll(".s2-field")).filter((f) => f.querySelector("[required]"));

    function validateField(field) {
      const input = field.querySelector("input, select, textarea");
      const valid = input.checkValidity();
      field.classList.toggle("is-invalid", !valid);
      field.classList.toggle("is-valid", valid);
      return valid;
    }

    fields.forEach((field) => {
      const input = field.querySelector("input, select, textarea");
      input.addEventListener("blur", () => validateField(field));
      input.addEventListener("input", () => {
        if (field.classList.contains("is-invalid")) validateField(field);
      });
      if (input.tagName === "SELECT") {
        input.addEventListener("change", () => field.classList.add("has-value"));
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const allValid = fields.map(validateField).every(Boolean);

      if (!allValid) {
        note.textContent = "Please complete the highlighted fields before submitting.";
        note.classList.remove("is-success");
        note.classList.add("is-error");
        return;
      }

      const btn = form.querySelector(".s2-btn");
      btn.classList.add("is-loading");
      note.textContent = "";
      note.classList.remove("is-error");

      setTimeout(() => {
        btn.classList.remove("is-loading");
        note.textContent = "Thanks — your enquiry has been noted. Our team will be in touch shortly.";
        note.classList.add("is-success");
        form.reset();
        fields.forEach((f) => f.classList.remove("is-valid", "is-invalid", "has-value"));
      }, 700);
    });
  })();

});
