import * as THREE from "three";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800, height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);


// // OrthographicCamera
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)

camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

/**
 * Animate
 */
// let time = Date.now();

// const tick = () => {
//   // handle time
//   const currentTime = Date.now();
//   const deltaTime = currentTime - time;
//   console.log(deltaTime);
//   time = currentTime;

//   console.log('tick');
//   // Update objects
//   // ensuring the cube rotates at the same speed regardless of PC capability FPS frames per second
//   mesh.rotation.y += 0.001 * deltaTime;
//   //   mesh.rotation.y += 0.01;
//   //   mesh.rotation.x -= 0.01;

//   renderer.render(scene, camera);

//   window.requestAnimationFrame(tick);
// };

// tick();

// Create a clock instance to keep track of time
// using a clock to animate and ensuring rotations are run on the same time regardless of PC FPS
const clock = new THREE.Clock();

const tick = () => {
  // Get the total elapsed time since the clock started
  // Used for time-based animations or updates
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // one revolution per second  mesh.rotation.y = elapsedTime * Math.PI * 2;
  //   mesh.rotation.y = elapsedTime;

  //   mesh.position.y = Math.sin(elapsedTime);
  //   mesh.position.x = Math.cos(elapsedTime);

  // camera
  camera.position.y = Math.sin(elapsedTime);
  camera.position.x = Math.cos(elapsedTime);
  camera.lookAt(mesh.position);

  // Render the current state of the scene from the camera's perspective
  renderer.render(scene, camera);

  // Schedule the tick function to run again on the next animation frame
  // Ensures smooth animations synced with the browser's refresh rate
  window.requestAnimationFrame(tick);
};

tick();

/********************************* GSAP ***********************************/

// gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });

// const tick = () => {
//   // Render
//   renderer.render(scene, camera);

//   // Call tick again on the next frame
//   window.requestAnimationFrame(tick);
// };

// tick();
