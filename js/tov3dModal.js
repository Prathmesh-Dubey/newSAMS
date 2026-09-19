import { createPhoneViewer } from "./phoneViewer.js";

function initTov3dModal() {
  const openBtn = document.getElementById("tov360Btn");
  const modal = document.getElementById("tov3dModal");
  const backdrop = document.getElementById("tov3dModalBackdrop");
  const closeBtn = document.getElementById("tov3dModalClose");
  const stage = document.getElementById("tov3dModalStage");

  if (!openBtn || !modal || !backdrop || !closeBtn || !stage) return;

  let viewer = null;

  function ensureViewer() {
    if (viewer) return;
    // Free-look viewer: unlike the inline spec view, the visitor can orbit
    // and zoom without any restriction to inspect the whole device.
    viewer = createPhoneViewer(stage, {
      controlsOptions: {
        enableZoom: true,
        enablePan: false,
        autoRotate: true,
        autoRotateSpeed: 1.6,
      },
    });

    let resumeTimer = null;
    viewer.controls.addEventListener("start", () => {
      viewer.controls.autoRotate = false;
      if (resumeTimer) clearTimeout(resumeTimer);
    });
    viewer.controls.addEventListener("end", () => {
      resumeTimer = setTimeout(() => {
        if (viewer) viewer.controls.autoRotate = true;
      }, 2500);
    });
  }

  function open() {
    ensureViewer();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("tov-modal-locked");
    requestAnimationFrame(() => viewer.resize());
  }

  function close() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("tov-modal-locked");
  }

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });
}

document.addEventListener("DOMContentLoaded", initTov3dModal);
