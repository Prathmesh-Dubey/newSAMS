import { createPhoneViewer } from "./phoneViewer.js";

// Target rig orientation (radians) that brings each named face toward the
// camera, assuming the exported model's local +Z is the front, +X is right
// and +Y is up.
const VIEW_ROTATIONS = {
  front: { x: 0, y: 0 },
  back: { x: 0, y: Math.PI },
  right: { x: 0, y: -Math.PI / 2 },
  left: { x: 0, y: Math.PI / 2 },
  top: { x: Math.PI / 2, y: 0 },
  bottom: { x: -Math.PI / 2, y: 0 },
};

function shortestDelta(from, to) {
  let diff = (to - from) % (Math.PI * 2);
  if (diff > Math.PI) diff -= Math.PI * 2;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return diff;
}

function initTovModel() {
  const container = document.getElementById("tovPhoneStage");
  if (!container) return;

  // The rig's rotation is driven by the selected spec (see setView), not by
  // an idle auto-spin. OrbitControls only lets the visitor tilt/orbit the
  // camera manually to inspect the current pose from another angle.
  const viewer = createPhoneViewer(container, {
    controlsOptions: {
      enableZoom: false,
      enablePan: false,
      minPolarAngle: Math.PI / 2 - 0.85,
      maxPolarAngle: Math.PI / 2 + 0.85,
    },
  });

  let targetRotation = { ...VIEW_ROTATIONS.front };

  function setView(name) {
    targetRotation = VIEW_ROTATIONS[name] || VIEW_ROTATIONS.front;
  }

  viewer.ready.then(() => {
    window.dispatchEvent(new CustomEvent("tov:model-ready"));
  });

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  viewer.setTick(() => {
    // Ease the rig toward the spec's target pose along the shortest path.
    const ease = prefersReducedMotion ? 1 : 0.07;
    viewer.rig.rotation.x += shortestDelta(viewer.rig.rotation.x, targetRotation.x) * ease;
    viewer.rig.rotation.y += shortestDelta(viewer.rig.rotation.y, targetRotation.y) * ease;
  });

  window.tovModel = { setView };
}

document.addEventListener("DOMContentLoaded", initTovModel);
