import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";

// @Note: 1 Unit  =  1 meter
/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * House
 */
// Temporary sphere
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(1, 32, 32),
//   new THREE.MeshStandardMaterial({ roughness: 0.7 })
// );
// scene.add(sphere);

// Starts

// 1. Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial() // realistic
);

floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);
gui.add(floor.rotation, "x").min(-3).max(3).step(0.01);

// 2. House container
const house = new THREE.Group();
scene.add(house);

// 3.Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial()
);
// The walls are halfway buried in the floor because the origin of the geometry is at its center.
// In Three.js, the default origin (reference point) of a mesh's geometry is at its center.
// For the walls: new THREE.BoxGeometry(4, 2.5, 4);
// The height of the box is 2.5.
// Since the origin is at the center, half of the box (2.5 / 2 = 1.25) extends below the origin,
// and the other half extends above the origin. So we're adding this half to the y position to move it up
walls.position.y += 1.25;
house.add(walls);

// 4.Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial()
);
roof.position.y = 2.5 + 0.75; // walls height + half of roof height due to it also being positioned at it's center
// The axis is y (the vertical axis) and the amount is Math.PI * 0.25 which is 1/8 of a circle:
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// 5. Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 2.2),
  new THREE.MeshStandardMaterial()
);
door.position.y = 1;
door.position.z = 2; // this will create a glitch `z-fighting` due to it being positioned at the exact position as one of the walls
//That glitch is called “z-fighting”. It’s when two faces are mathematically in the exact same spot and the GPU doesn’t know which one is in front of the other.
// The easiest solution for this problem is to slightly move the objects away:
door.position.z = 2 + 0.01;
house.add(door);

// 6.Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial();

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// 7. Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial();

for (let i = 0; i < 30; i++) {
  // these graves are set within the house, centered on the same position
  //   This is where trigonometry comes in handy.

  // First, we are going to define a random angle between 0 and a full circle.

  // When using trigonometry, we need to use radians where Math.PI is equal to approximately 3.1415 which is half a circle. Since we want a full circle, we need to multiply Math.PI by 2.

  // Let’s create an angle variable containing Math.random() multiplied by Math.PI and then multiplied by 2:
  // Mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  // coordinates
  // angle
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4; // radius outside the house remember 4 * 4
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  grave.position.x = x;
  grave.position.z = z;
  grave.position.y += Math.random() * 0.4; // 0.4 being half it's height

  // rotation Between 0 & 1 => 0 <-> 1 now * 0.5 means -0.5 <-> 0.5
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  // Add to the graves group
  graves.add(grave);
}

// Ends

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#ffffff", 1.5);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
