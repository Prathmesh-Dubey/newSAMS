import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function initHero3D() {
  const container = document.getElementById("hero3d");
  const canvas = document.getElementById("phone-canvas");
  if (!container || !canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    32,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 6.5);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x8ec9ff, 1.1);
  rimLight.position.set(-4, 2, -3);
  scene.add(rimLight);

  const rig = new THREE.Group();
  scene.add(rig);

  let phone = null;

  new GLTFLoader().load(
    "3Dmodel/sams-rugged-phone.glb",
    (gltf) => {
      phone = gltf.scene;

      const box = new THREE.Box3().setFromObject(phone);
      const center = new THREE.Vector3();
      box.getCenter(center);
      phone.position.sub(center);

      rig.add(phone);

      // Frame the model's bounding sphere fully in view, with margin.
      // Using the sphere (not the axis-aligned box) keeps the whole model
      // inside the frustum at every rotation angle, not just the initial one.
      const sphere = box.getBoundingSphere(new THREE.Sphere());
      const margin = 1.08;
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
      const distanceForHeight = sphere.radius / Math.sin(vFov / 2);
      const distanceForWidth = sphere.radius / Math.sin(hFov / 2);
      const distance = Math.max(distanceForHeight, distanceForWidth) * margin;

      camera.position.set(0, 0, distance);
      camera.near = distance / 100;
      camera.far = distance * 100;
      camera.updateProjectionMatrix();
    },
    undefined,
    (error) => {
      console.error("SAM'S 3D viewer: failed to load model", error);
    }
  );

  function handleResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener("resize", handleResize);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function animate() {
    requestAnimationFrame(animate);
    if (!prefersReducedMotion) {
      rig.rotation.y += 0.006;
    }
    renderer.render(scene, camera);
  }
  animate();
}

if (window.matchMedia("(min-width: 1101px)").matches) {
  initHero3D();
}
