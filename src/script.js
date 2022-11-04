import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { gsap } from "gsap";
import { TimelineMax } from "gsap/gsap-core";
import { Timeline } from "gsap/gsap-core";

const viewAngle = 0.8;
const cameraLookAt = 0;

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const player = new THREE.BoxGeometry(1, 1, 1);
const platform = new THREE.BoxGeometry(1.2, 0.2, 1.2);

// Materials

const material_player = new THREE.MeshBasicMaterial();
material_player.color = new THREE.Color(0x00ff00);

const material_platform = new THREE.MeshBasicMaterial();
material_platform.color = new THREE.Color(0xffffff);

// Mesh
const mesh_player = new THREE.Mesh(player, material_player);
scene.add(mesh_player);
mesh_player.rotateY(viewAngle);

var platformPositionOffset = 0;
for (let i = 0; i < 4; i++) {
  const mesh_platform = new THREE.Mesh(platform, material_platform);
  scene.add(mesh_platform);
  mesh_platform.position.x = platformPositionOffset;
  mesh_platform.position.z = -platformPositionOffset;
  mesh_platform.rotateY(viewAngle);
  mesh_platform.position.y = -0.5;

  platformPositionOffset += 1.2;
}

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 3;
camera.position.z = 3;
camera.lookAt(0, 0, 0);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

var newX = 0;
var newZ = 0;
var playerAnimation = gsap.to(mesh_player.position, {
  duration: 1,
  x: newX,
  z: newZ,
});

const clock = new THREE.Clock();

// Key Listeners
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  if (!playerAnimation.isActive) {
    var keyCode = event.which;
    if (keyCode == 87) {
      // w
      console.log("up");
    } else if (keyCode == 83) {
      // s
      console.log("down");
    } else if (keyCode == 65) {
      // a
      console.log("left");
    } else if (keyCode == 68) {
      // d
      console.log("right");
    } else if (keyCode == 32) {
      // space
      console.log("space");
      var getMeshPos = new THREE.Vector3();
      getMeshPos.getPositionFromMatrix(mesh_player.matrixWorld);
      newX = getMeshPos.x;
      newZ = getMeshPos.z;
      playerAnimation;
    } else if (keyCode == 8) {
      // backspace
      console.log("backspace");
    }
  }
}

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // sphere.rotation.y = .5 * elapsedTime

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
