import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { gsap } from "gsap";
import { Vector3 } from "three";

// Platform Positions
const gap = 1.5;
var positions = [
  new Vector3(0, 0, 0),
  new Vector3(gap, 0, -gap),
  new Vector3(gap * 2, 0, -gap * 2),
  new Vector3(gap * 3, 0, -gap * 3),
];
const viewAngle = 0.8;
var currentPosition = 0;

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Camera
const camera = new THREE.PerspectiveCamera(
  100,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 3;
camera.position.z = 3;
camera.lookAt(0, 0, 0);
scene.add(camera);

// Lights
const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
scene.add(hemiLight);

// Materials
const material_player = new THREE.MeshBasicMaterial();
material_player.color = new THREE.Color(0x00ff00);

const material_platform = new THREE.MeshBasicMaterial();
material_platform.color = new THREE.Color(0xd4ffdc);
material_platform.opacity = 0.0;

const material_section = new THREE.MeshBasicMaterial();
material_section.color = new THREE.Color(0xff0000);
material_section.opacity = 0.0;

// Objects
const player = new THREE.BoxGeometry(1, 1, 1);
const platform = new THREE.BoxGeometry(1.5, 0.2, 1.5);
const section1 = new THREE.BoxGeometry(2, 1, 1);

// Mesh
const mesh_player = new THREE.Mesh(player, material_player);
mesh_player.rotateY(viewAngle);
mesh_player.position.y = 20;
scene.add(mesh_player);

var platform_meshes = [];
for (let i = 0; i < positions.length; i++) {
  const mesh_platform = new THREE.Mesh(platform, material_platform);
  mesh_platform.position.x = positions[i].x;
  mesh_platform.position.z = positions[i].z;
  mesh_platform.rotateY(viewAngle);
  mesh_platform.position.y = -10;
  scene.add(mesh_platform);
  platform_meshes.push(mesh_platform);
}

const mesh_section1 = new THREE.Mesh(section1, material_section);
mesh_section1.position.x = platform_meshes[1].position.x - 3;
mesh_section1.position.y = platform_meshes[1].position.y;
mesh_section1.position.z = platform_meshes[1].position.z - 3;
mesh_section1.rotateY(viewAngle);
scene.add(mesh_section1);

// Beginning Animation
// player
gsap.to(mesh_player.position, {
  duration: 2,
  ease: "power2",
  y: 0,
});
gsap.to(mesh_player.rotation, {
  duration: 2,
  ease: "power2",
  y: 14.95,
});
// platforms
for (let i = 0; i < platform_meshes.length; i++) {
  gsap.to(platform_meshes[i].position, {
    duration: 1 + i * 0.5,
    ease: "power2",
    y: -0.6,
  });
}
gsap.to(material_platform, {
  duration: 2,
  ease: "power2",
  opacity: 1.0,
});

// Key Listeners
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  var keyCode = event.which;
  if (keyCode == 32) {
    // space
    if (currentPosition < positions.length - 1) {
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
    if (currentPosition > 0) {
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

  // Show Titles if player is on certain platforms
  if (currentPosition == 1) {
    gsap.to(mesh_section1.position, {
      duration: 1,
      ease: "power2",
      y: 1,
    });
    gsap.to(material_section, {
      duration: 1,
      ease: "power2",
      opacity: 1.0,
    });
  }
}

// Update When Window Resizes
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

const tick = () => {
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
