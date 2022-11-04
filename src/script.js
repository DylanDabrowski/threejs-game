import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { gsap } from "gsap";
import { TimelineMax } from "gsap/gsap-core";
import { Timeline } from "gsap/gsap-core";
import { Vector3 } from "three";

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
var positions = [
  new Vector3(0, 0, 0),
  new Vector3(1.2, 0, -1.2),
  new Vector3(2.4, 0, -2.4),
  new Vector3(3.6, 0, -3.6),
];
var currentPosition = 0;

// Materials
const material_player = new THREE.MeshBasicMaterial();
material_player.color = new THREE.Color(0x00ff00);

const material_platform = new THREE.MeshBasicMaterial();
material_platform.color = new THREE.Color(0xffffff);

// Mesh
const mesh_player = new THREE.Mesh(player, material_player);
scene.add(mesh_player);
mesh_player.rotateY(viewAngle);

for (let i = 0; i < positions.length; i++) {
  const mesh_platform = new THREE.Mesh(platform, material_platform);
  scene.add(mesh_platform);
  mesh_platform.position.x = positions[i].x;
  mesh_platform.position.z = positions[i].z;
  mesh_platform.rotateY(viewAngle);
  mesh_platform.position.y = -0.5;
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

// Key Listeners
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
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
    if (currentPosition < positions.length) {
      currentPosition += 1;
      gsap.to(mesh_player.position, {
        duration: 1,
        x: positions[currentPosition].x,
        z: positions[currentPosition].z,
      });
      gsap.to(camera.position, {
        duration: 1,
        x: positions[currentPosition].x,
        z: positions[currentPosition].z + 2,
      });
    }
  } else if (keyCode == 8) {
    // backspace
    console.log("backspace");
    if (currentPosition >= 0) {
      currentPosition -= 1;
      gsap.to(mesh_player.position, {
        duration: 1,
        x: positions[currentPosition].x,
        z: positions[currentPosition].z,
      });
      gsap.to(camera.position, {
        duration: 1,
        x: positions[currentPosition].x,
        z: positions[currentPosition].z + 2,
      });
    }
  }
}

const tick = () => {
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
