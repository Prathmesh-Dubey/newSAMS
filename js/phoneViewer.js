import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const MODEL_URL = "3Dmodel/sams-rugged-phone.glb";

let cachedGltf = null;
let pendingGltf = null;

function loadModel() {
  if (cachedGltf) return Promise.resolve(cachedGltf);
  if (!pendingGltf) {
    pendingGltf = new Promise((resolve, reject) => {
      new GLTFLoader().load(
        MODEL_URL,
        (gltf) => {
          cachedGltf = gltf;
          resolve(gltf);
        },
        undefined,
        reject
      );
    });
  }
  return pendingGltf;
}

/**
 * Builds a self-contained three.js viewer (scene, lights, studio
 * environment, model) inside `container`. Both the inline technical-overview
 * viewer and the fullscreen 360 modal share this so the lighting/shine setup
 * stays identical between them.
 */
export function createPhoneViewer(container, { controlsOptions = {} } = {}) {
  const canvas = document.createElement("canvas");
  canvas.className = "phone-viewer-canvas";
  container.appendChild(canvas);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    32,
    container.clientWidth / Math.max(container.clientHeight, 1),
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
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  // A soft studio environment gives glass/metal surfaces real reflections
  // (the "shine") instead of the flat look plain directional lights produce.
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x8ec9ff, 1.6);
  rimLight.position.set(-4, 2, -3);
  scene.add(rimLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
  fillLight.position.set(0, -3, 2.5);
  scene.add(fillLight);

  const rig = new THREE.Group();
  scene.add(rig);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.65;
  Object.assign(controls, controlsOptions);

  let frameDistance = 6.5;

  function frameModel(object) {
    const box = new THREE.Box3().setFromObject(object);
    const center = new THREE.Vector3();
    box.getCenter(center);
    object.position.sub(center);

    // Frame the model's bounding sphere fully in view, with margin. Using
    // the sphere (not the axis-aligned box) keeps the whole model inside
    // the frustum at every rotation angle, not just the initial one.
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const margin = 1.25;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const distanceForHeight = sphere.radius / Math.sin(vFov / 2);
    const distanceForWidth = sphere.radius / Math.sin(hFov / 2);
    frameDistance = Math.max(distanceForHeight, distanceForWidth) * margin;

    camera.position.set(0, 0, frameDistance);
    camera.near = frameDistance / 100;
    camera.far = frameDistance * 100;
    camera.updateProjectionMatrix();

    if (controls.minDistance !== undefined) controls.minDistance = frameDistance * 0.5;
    if (controls.maxDistance !== undefined) controls.maxDistance = frameDistance * 2;

    controls.update();
  }

  const ready = loadModel().then((gltf) => {
    const phone = gltf.scene.clone(true);

    phone.traverse((node) => {
      if (!node.isMesh || !node.material) return;
      const boostShine = (mat) => {
        if ("envMapIntensity" in mat) mat.envMapIntensity = 1.35;
        if ("metalness" in mat) mat.metalness = Math.max(mat.metalness, 0.35);
        if ("roughness" in mat) mat.roughness = Math.min(mat.roughness, 0.45);
      };
      if (Array.isArray(node.material)) node.material.forEach(boostShine);
      else boostShine(node.material);
    });

    rig.add(phone);
    frameModel(phone);
    return phone;
  });

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener("resize", resize);

  let animHandle = null;
  let onTick = null;

  function animate() {
    animHandle = requestAnimationFrame(animate);
    controls.update();
    if (onTick) onTick();
    renderer.render(scene, camera);
  }
  animate();

  function dispose() {
    if (animHandle) cancelAnimationFrame(animHandle);
    window.removeEventListener("resize", resize);
    controls.dispose();
    renderer.dispose();
    canvas.remove();
  }

  return { scene, camera, renderer, rig, controls, ready, resize, dispose, setTick: (fn) => (onTick = fn) };
}
