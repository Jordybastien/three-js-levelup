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
 * Lights
 */
// ### AmbientLight
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// ### PointLight
// const pointLight = new THREE.PointLight(0xffffff, 50);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

// ### DirectionalLight
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
directionalLight.castShadow = true;
// @Note: we need to specify a size. By default, the shadow map size is only 512x512 for performance reasons.
// We can improve it but keep in mind that you need a power of 2 value for the mipmapping
// The bigger the size, the more performance gets demanding
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
// directionalLight.shadow.camera.near = 1
// directionalLight.shadow.camera.far = 6
// scene.add(directionalLight);

// #### Near and far
// Three.js is using cameras to do the shadow maps renders.
// Those cameras have the same properties as the cameras we already used.
// This means that we must define a near and a far.
// It won't really improve the shadow's quality,
// but it might fix bugs where you can't see the shadow or where the shadow appears suddenly cropped.
// it's like setting limits
// The smaller the values, the more precise the shadow will be. But if it's too small, the shadows will just be cropped.
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
// directionalLightCameraHelper.visible = false
// scene.add(directionalLightCameraHelper);

// #### Amplitude
// Because we are using a DirectionalLight, Three.js is using an OrthographicCamera.
// we can control how far on each side the camera can see with the top, right, bottom, and left properties.
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;

// ### Blur
directionalLight.shadow.radius = 10;

// #### Shadow map algorithm
// Different types of algorithms can be applied to shadow maps:

// THREE.BasicShadowMap: Very performant but lousy quality
// THREE.PCFShadowMap: Less performant but smoother edges
// THREE.PCFSoftShadowMap: Less performant but even softer edges
// THREE.VSMShadowMap: Less performant, more constraints, can have unexpected results

// @Note: To change it update `renderer.shadowMap.type`, default is `PCFShadowMap`
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

// ### SpotLight
const spotLight = new THREE.SpotLight(0xffffff, 2.4, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
spotLight.position.set(0, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// scene.add(spotLightCameraHelper);

// ### PointLight
const pointLight = new THREE.PointLight(0xffffff, 2.7);
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0);
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
scene.add(pointLight);

// ### Baking shadows
// Three.js shadows can be very useful if the scene is simple, but it might otherwise become messy.

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCameraHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/static/textures/bakedShadow.jpg");
// Textures used as map and matcap are supposed to be encoded in sRGB and
// we need to inform Three.js of this by setting their colorSpace to THREE.SRGBColorSpace
bakedShadow.colorSpace = THREE.SRGBColorSpace;
// then use MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial({ map: bakedShadow });

// ### Baking shadows alternative
// A less realistic but more dynamic solution would be to use a more simple shadow under the sphere and slightly above the plane.
const simpleShadow = textureLoader.load("/static/textures/simpleShadow.jpg");
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  })
);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
// material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
// sphere.position.x = -1.5;
sphere.position.y = 1;
sphere.castShadow = true; // Cast shadow

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;
plane.receiveShadow = true; // Receive shadow

// scene.add(sphere, cube, torus, plane);
// scene.add(sphere, plane);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;
scene.add(sphere, sphereShadow, plane);

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
// ### Shadows
// We won't detail how shadows are working internally, but we will try to understand the basics.

// When you do one render, Three.js will first do a render for each light supposed to cast shadows.
// Those renders will simulate what the light sees as if it was a camera.
// During these lights renders, MeshDepthMaterial replaces all meshes materials.

// The results are stored as textures and named shadow maps.

// You won't see those shadow maps directly, but they are used on every material supposed to receive shadows and projected on the geometry.

// @Note: Only the following types of lights support shadows: 1. PointLight, 2. DirectionalLight 3. SpotLight
// can be disabled when using Baked shadows
renderer.shadowMap.enabled = false; // activate shadow

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  //   sphere.rotation.y = 0.1 * elapsedTime;
  //   cube.rotation.y = 0.1 * elapsedTime;
  //   torus.rotation.y = 0.1 * elapsedTime;

  //   sphere.rotation.x = 0.15 * elapsedTime;
  //   cube.rotation.x = 0.15 * elapsedTime;
  //   torus.rotation.x = 0.15 * elapsedTime;
  // Update the sphere
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  // Update the shadow
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
