import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

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
 * Lights
 */

// ### 1. AmbientLight
// @Note: If all you have is an AmbientLight, you'll have the same effect as for a MeshBasicMaterial because all faces of the geometries will be lit equally.
// Ambient Light applies light in every direction ending up having same light on an object from every direction
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
// scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);

// ### 2. DirectionalLight
// @Note: The DirectionalLight will have a sun-like effect as if the sun rays were traveling in parallel.
// By default, the light will seem to come from above.
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(1, 0.25, 0);
// scene.add(directionalLight);

// ### 3. HemisphereLight
// The HemisphereLight is similar to the AmbientLight but with a different color from the sky than the color coming from the ground.
// Faces facing the sky will be lit by one color while another color will lit faces facing the ground.
// @Note: First value color will be applied at the top
// @Note: Second value color will be applied at the bottom
// can be used in let's say a terrain with grass having green color from the bottom and the sky blue
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9);
// scene.add(hemisphereLight)

// ### 4. PointLight
// The PointLight is almost like a lighter. The light source is infinitely small, and the light spreads uniformly in every direction.
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.x = 1;
pointLight.position.y = 0.5;
pointLight.position.z = 1;
// scene.add(pointLight);

// ### 5. RectAreaLight
// The RectAreaLight works like the big rectangle lights you can see on the photoshoot set.
// It's a mix between a directional light and a diffuse light.
// works like a photoshoot plane
// The RectAreaLight only works with MeshStandardMaterial and MeshPhysicalMaterial.
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);
// scene.add(rectAreaLight);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
// @Note: A Vector3 without any parameter will have its x, y, and z to 0 (the center of the scene).

// ### 6. SpotLight
// The SpotLight works like a flashlight. It's a cone of light starting at a point and oriented in a direction.
const spotLight = new THREE.SpotLight(
  0x78ff00,
  4.5,
  10,
  Math.PI * 0.1, // half a circle angle
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

// @Note: Adding spotlight target
// The position, along the rotation and scale, are compiled into what we call a transform matrix.
// This transform matrix is what really matters at the end.
spotLight.target.position.x = -0.75;
// scene.add(spotLight.target);

// #### Performance
// Lights are great and can be realistic if well used. The problem is that lights can cost a lot when it comes to performance.
// The GPU will have to do many calculations like the distance from the face to the light, how much that face is facing the light, if the face is in the spot light cone, etc.

// 1. Minimal cost:
// AmbientLight
// HemisphereLight

// 2. Moderate cost:
// DirectionalLight
// PointLight

// 3. High cost:
// SpotLight
// RectAreaLight

// #### Baking
// A good technique for lighting is called baking.
// The idea is that you bake the light into the texture.
// This can be done in a 3D software.
// The downside is that, once the lighting is baked,
// we can't move the lights, because there are none and you'll probably need a lot of textures.

// https://threejs-journey.xyz/
// https://threejs-journey.com/assets/lessons/14/018.png

// #### Helpers
// Positioning and orienting the lights is hard. To assist us, we can use helpers.
// Only the following helpers are supported:

// HemisphereLightHelper
// DirectionalLightHelper
// PointLightHelper
// RectAreaLightHelper
// SpotLightHelper
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);
/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
