import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { gsap } from "gsap";
import { Vector3 } from "three";

// Variables
const gap = 1.5;
var positions = [
  new Vector3(0, 0, 0),
  new Vector3(gap, 0, -gap),
  new Vector3(gap * 2, 0, -gap * 2),
  new Vector3(gap * 3, 0, -gap * 3),
];
const viewAngle = 0.8;
var currentPosition = 0;
var isOnSpecialPlatform = false;

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

const material_special_platform = new THREE.MeshBasicMaterial();
material_special_platform.color = new THREE.Color(0xffbb00);
material_special_platform.opacity = 0.0;

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

const special_platforms = [1, 3];
var special_platform_meshes = [];
var section_materials = [];
var section_meshes = [];
for (let i = 0; i < special_platforms.length; i++) {
  const material_section = new THREE.MeshBasicMaterial();
  material_section.color = new THREE.Color(0xff0000);
  material_section.opacity = 0.0;
  section_materials.push(material_section);

  const mesh_section = new THREE.Mesh(section1, material_section);
  mesh_section.position.x =
    platform_meshes[special_platforms[i]].position.x - 3;
  mesh_section.position.y = platform_meshes[special_platforms[i]].position.y;
  mesh_section.position.z =
    platform_meshes[special_platforms[i]].position.z - 3;
  mesh_section.rotateY(viewAngle);
  scene.add(mesh_section);
  section_meshes.push(mesh_section);

  const mesh_special_platform = new THREE.Mesh(
    platform,
    material_special_platform
  );
  mesh_special_platform.position.x =
    platform_meshes[special_platforms[i]].position.x - gap;
  mesh_special_platform.position.y =
    platform_meshes[special_platforms[i]].position.y;
  mesh_special_platform.position.z =
    platform_meshes[special_platforms[i]].position.z - gap;
  mesh_special_platform.rotateY(viewAngle);
  scene.add(mesh_special_platform);
  special_platform_meshes.push(mesh_special_platform);
}

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
for (let i = 0; i < special_platform_meshes.length; i++) {
  gsap.to(special_platform_meshes[i].position, {
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
gsap.to(material_special_platform, {
  duration: 2,
  ease: "power2",
  opacity: 1.0,
});

// Key Listeners
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  var keyCode = event.which;
  if (keyCode == 13) {
    // enter
    if (
      platform_meshes[special_platforms[0]].position.x == mesh_player.position.x
    ) {
      playerSpecialHop();
    } else if (
      platform_meshes[special_platforms[1]].position.x == mesh_player.position.x
    ) {
      playerSpecialHop();
    }
  }
  if (keyCode == 32) {
    // space
    if (currentPosition < positions.length - 1) {
      currentPosition += 1;
      playerHop();
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
      playerHop();
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
      isOnSpecialPlatform = false;
    }
  }

  // Show Titles if player is on certain platforms
  for (let i = 0; i < special_platforms.length; i++) {
    if (currentPosition == special_platforms[i]) {
      gsap.to(section_meshes[i].position, {
        duration: 1,
        ease: "power2",
        y: 1,
      });
      gsap.to(section_materials[i], {
        duration: 1,
        ease: "power2",
        opacity: 1.0,
      });
    }
  }
}

function playerHop() {
  gsap.to(mesh_player.position, {
    duration: 1,
    y: 0.5,
    ease: "power2",
  });
  gsap.to(mesh_player.position, {
    duration: 0.5,
    y: 0,
    ease: "power2",
    delay: 0.5,
  });
}

function playerSpecialHop() {
  if (!isOnSpecialPlatform) {
    gsap.to(mesh_player.position, {
      duration: 1.5,
      x: "-=1.5",
      y: 0.8,
      z: "-= 1.5",
      ease: "power2",
    });
    gsap.to(mesh_player.position, {
      duration: 0.5,
      y: 0,
      ease: "power2",
      delay: 1,
    });
    isOnSpecialPlatform = true;
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
