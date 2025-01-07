import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { AxesHelper } from "three";

// @Note: Three.js already supports 3D text geometries with the TextGeometry class.
// The problem is that you must specify a font, and this font must be in a particular json format called typeface.
// There are many ways of getting fonts in that format. First,
// you can convert your font with converters like this one: https://gero3.github.io/facetype.js/.

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Center the text
// There are several ways to center the text.
// One way of doing it is by using bounding.
// The bounding is the information associated with the geometry that tells what space is taken by that geometry.
// It can be a box or a sphere.

// axes helper
const axesHelper = new AxesHelper();
scene.add(axesHelper);
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/static/textures/matcaps/8.png");
// Textures used as map and matcap are supposed to be encoded in sRGB and we need to inform Three.js of this by setting their colorSpace to THREE.SRGBColorSpace:
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load("/static/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Hello Three.js", {
    font,
    size: 0.5,
    depth: 0.2, // replaced `height`
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeometry.computeBoundingBox();
  // moving the text
  // move until console.log(textGeometry.boundingBox) has same values on `min` & `max` objects holding attributes `x,y,z`
  // The text should be centered but if you want to be very precise, you should also subtract the bevelSize which is 0.02
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5, // Subtract bevel size
  //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5, // Subtract bevel size
  //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5 // Subtract bevel thickness
  // );
  // simpler way
  textGeometry.center();
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  // optimization log -> console.time('donuts') - console.timeEnd('donuts')
  console.time('donuts');
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  for (let i = 0; i < 100; i++) {
    // const donutMaterial = new THREE.MeshMatcapMaterial({
    //   matcap: matcapTexture,
    // });
    const donut = new THREE.Mesh(donutGeometry, material);

    // Let's add some randomness for their position
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    // Add randomness to the rotation. No need to rotate all 3 axes, and because the donut is symmetric, half of a revolution is enough:
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    // Finally, we can add randomness to the scale. Be careful, though; we need to use the same value for all 3 axes (x, y, z)
    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }
  console.timeEnd('donuts');
});

/**
 * Object
 */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);

// scene.add(cube);

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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
