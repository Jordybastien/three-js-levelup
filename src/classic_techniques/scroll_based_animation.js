import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("/static/textures/gradients/3.jpg");
// Not the toon effect we were expecting.
// The reason is that the texture is a very small image composed of 3 pixels going from dark to bright.
// By default, instead of picking the nearest pixel on the texture, WebGL will try to interpolate the pixels.
// That's usually a good idea for the look of our experiences, but in this case,
// it creates a gradient instead of a toon effect.
// To fix that, we need to set the magFilter of the texture to THREE.NearestFilter
// so that the closest pixel is used without interpolating it with neighbor pixels:
gradientTexture.magFilter = THREE.NearestFilter;

// Material
const material = new THREE.MeshToonMaterial({
  // MeshToonMaterial is one of the Three.js materials that appears only when there is light
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

// Meshes
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

const objectsDistance = 4;

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

/**
 * Particles
 */
// Geometry
const particlesCount = 2000;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  // For the y (vertical) it's a bit more tricky.
  // We need to make the particles start high enough and then spread far enough below
  // so that we reach the end with the scroll.
  // To do that, we can use the objectsDistance variable and
  // multiply by the number of objects which is the length of the sectionMeshes array:
  positions[i * 3 + 1] =
    objectsDistance * 0.5 -
    Math.random() * objectsDistance * sectionMeshes.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.03,
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// AxesHelper to the scene
const axesHelper = new THREE.AxesHelper(10); // The argument specifies the length of the axes
scene.add(axesHelper);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
});

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
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, // This makes the canvas transparent.
});
// Fix the elastic scroll https://threejs-journey.com/lessons/scroll-based-animation#fix-the-elastic-scroll

// renderer.setClearAlpha(1);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */
let scrollY = window.scrollY;
// triggered rotations
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  // This works because each section is exactly one height of the viewport.
  // To get the exact section instead of that float value, we can use Math.round():
  const newSection = Math.round(scrollY / sizes.height);

  if (newSection != currentSection) {
    currentSection = newSection;

    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    });
  }
});

/**
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  //   cursor.x = event.clientX;
  //   cursor.y = event.clientY;
  // We should get the pixel positions of the cursor in the console.
  // While we could use those values directly, it's always better to adapt them to the context.
  // First, the amplitude depends on the size of the viewport and users
  // with different screen resolutions will have different results.
  // We can normalize the value (from 0 to 1) by dividing them by the size of the viewport:
  //   cursor.x = event.clientX / sizes.width;
  //   cursor.y = event.clientY / sizes.height;

  // While this is better already, we can do even more.
  // We know that the camera will be able to go as much on the left as on the right.
  // This is why, instead of a value going from 0 to 1 it's better to have a value going from -0.5 to 0.5.
  // To do that, subtract 0.5:
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
// If you test the experience on a high frequency screen,
// the tick function will be called more often and the camera will move faster toward the target.
// While this is not a big issue,
// it's not accurate and it's preferable to have the same result across devices as much as possible.
// To fix that, we need to use the time spent between each frame.
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Animate meshes
  for (const mesh of sectionMeshes) {
    // mesh.rotation.x = elapsedTime * 0.1;
    // mesh.rotation.y = elapsedTime * 0.12;
    // to apply gsap rotation
    // previous statements prevented gsap rotation
    // The reason is that, on each frame, we are already updating the rotation.x and rotation.y of each mesh with the elapsedTime.
    //To fix that, in the tick function, instead of setting a very specific rotation based on the elapsedTime, we are going to add the deltaTime to the current rotation:
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  // Animate camera
  // scrollY contains the amount of pixels that have been scrolled.
  // If we scroll 1000 pixels (which is not that much),
  // the camera will go down of 1000 units in the scene (which is a lot).

  // Each section has exactly the same size as the viewport.
  // This means that when we scroll the distance of one viewport height, the camera should reach the next object.

  // To do that, we need to divide scrollY by the height of the viewport which is sizes.height:

  // The camera is now going down of 1 unit for each section scrolled.
  // But the objects are currently separated by 4 units which is the objectsDistance variable:

  // We need to multiply the value by objectsDistance:
  //   camera.position.y = (-scrollY / sizes.height) * objectsDistance;
  // ### Parallax
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  // bug with the two camera position changing, we end up using a group instead `cameraGroup`
  //   const parallaxX = cursor.x;
  //   const parallaxY = -cursor.y; // using `minus` for the right direction
  //   cameraGroup.position.x = parallaxX;
  //   cameraGroup.position.y = parallaxY;

  // ### Step 1 - parallax: change the = to += because we are adding to the actual position
  //   cameraGroup.position.x += parallaxX;
  //   cameraGroup.position.y += parallaxY;
  // ### Step 2 - parallax: calculate the distance from the actual position to the destination:
  //   cameraGroup.position.x += parallaxX - cameraGroup.position.x;
  //   cameraGroup.position.y += parallaxY - cameraGroup.position.y;
  // ### Step 3 - parallax: we only want a 10th of that distance

  //   You now have the time spent between the current frame and the previous frame in seconds. For high frequency screens, the value will be smaller because less time was needed.
  // We can now use that deltaTime on the parallax, but, because the deltaTime is in seconds, the value will be very small (around 0.016 for most common screens running at 60fps). Consequently, the effect will be very slow.
  // To fix that, we can change 0.1 to something like 5:
  // same speed frequency on different screens with different frame rate

  // lowering the amplitude for parallax
  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;

  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  // parallax easing

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
