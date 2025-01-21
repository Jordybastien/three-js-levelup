import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/static/textures/particles/2.png");

/**
 * Particles
 */
// Geometry
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);

// // Material
// const particlesMaterial = new THREE.PointsMaterial({
//   size: 0.02,
//   sizeAttenuation: true,
// });

// // Points
// const particles = new THREE.Points(particlesGeometry, particlesMaterial);
// scene.add(particles);

// ### Custom geometry

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
});
const particlesGeometry = new THREE.BufferGeometry();
const count = 200;
// const count = 20000;

const positions = new Float32Array(count * 3); // Multiply by 3 because each position is composed of 3 values (x, y, z)
const colors = new Float32Array(count * 3);

particlesMaterial.size = 0.1;
// particlesMaterial.color = new THREE.Color("#ff88cc");
// using a texture
// particlesMaterial.map = particleTexture;
// If you look closely, you'll see that the front particles are hiding the back particles.
// We need to activate transparency with transparent and use the texture on the alphaMap property instead of the map
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
// Now that's better, but we can still randomly see some edges of the particles.
// That is because the particles are drawn in the same order as they are created, and WebGL doesn't really know which one is in front of the other.
// There are multiple ways of fixing this.

// 1. alphaTest 2. depthTest 3. depthWrite

// ### Using alphaTest
// The alphaTest is a value between 0 and 1 that enables
// the WebGL to know when not to render the pixel according to that pixel's transparency.
// By default, the value is 0 meaning that the pixel will be rendered anyway.
// If we use a small value such as 0.001, the pixel won't be rendered if the alpha is 0
// particlesMaterial.alphaTest = 0.001;

// ### Using depthTest
// When drawing, the WebGL tests if what's being drawn is closer than what's already drawn.
// That is called depth testing and can be deactivated
// particlesMaterial.depthTest = false;

// While this solution seems to completely fix our problem,
// deactivating the depth testing might create bugs if you have other objects in your scene or particles with different colors.
// The particles might be drawn as if they were above the rest of the scene.

// ### Using depthWrite
// As we said, the WebGL is testing if what's being drawn is closer than what's already drawn.
// The depth of what's being drawn is stored in what we call a depth buffer.
// Instead of not testing if the particle is closer than what's in this depth buffer,
// we can tell the WebGL not to write particles in that depth buffer
// particlesMaterial.depthWrite = false;

// ### Blending
// Currently, the WebGL draws the pixels one on top of the other.
// By changing the blending property, we can tell the WebGL not only to draw the pixel,
// but also to add the color of that pixel to the color of the pixel already drawn.
// That will have a saturation effect that can look amazing.
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending;

for (
  let i = 0;
  i < count * 3;
  i++ // Multiply by 3 for same reason
) {
  positions[i] = (Math.random() - 0.5) * 10; // Math.random() - 0.5 to have a random value between -0.5 and +0.5
  colors[i] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
); // Create the Three.js BufferAttribute and specify that each information is composed of 3 values
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// To activate those vertex colors, simply change the vertexColors property to true
particlesMaterial.vertexColors = true;

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

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
camera.position.z = 3;
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
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update particles
  for (let i = 0; i < count; i++) {
    const i3 = i * 3; // selecting vertice of x,y.z -> 0, 3, 6, 9 ...
    // this way in a three dimension array we're always selecing x

    const yProperty = i3 + 1; 
    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[yProperty] = Math.sin(
      elapsedTime + x
    );
  }

  // If we have 20000 particles, we are going through each one, calculating a new position, 
  // and updating the whole attribute on each frame. 
  // That can work with a small number of particles, but we want millions of particles.
  // This is expensive on the performance, not a great solution
  // A better approach is creating our own material with our own shaders.

  particlesGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
