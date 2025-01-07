import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import GUI from 'lil-gui';

/**
 * Debug
 */
const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  color: '#ff0000',
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// The first parameter is the object and the second parameter is the property of that object you want to tweak.
// gui.add(mesh.position, 'y')
// 1. RANGE
//  min - max - step
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');

// tweak for non - properties
const myObject = {
  myVariable: 1337,
};
gui.add(myObject, 'myVariable');

// 2. Checkbox
gui.add(mesh, 'visible');
gui.add(material, 'wireframe');

// 3. Colors
gui.addColor(material, 'color');
// @Note: Three.js applies some color management in order to optimise the rendering. As a result, the color value that is being displayed in the tweak isn’t the same value as the one being used internally.
// .onChange((value) =>
//     {
//         console.log(material.color)
//         console.log(value)

//         So, this is the color value you can safely use in your code
//         console.log(value.getHexString())
//     })

// Another way to deal with non-modified color, create a debug object
// const debugObject = {}
// debugObject.color = '#3a6ea6'

// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
// const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: false })
// gui
//     .addColor(debugObject, 'color')
//     .onChange(() =>
//     {
//         material.color.set(debugObject.color)
//     })

// 4. Function / Button

const debugObject = {};

// adding a function
debugObject.spin = () => {
  gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
};

gui.add(debugObject, 'spin');

// 5. Tweaking the geometry
debugObject.subdivision = 2;
gui
  .add(debugObject, 'subdivision')
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    // The old geometries are still sitting somewhere in the GPU memory which can create a memory leak.
    // use `dispose` to cleanup
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    );
  });

// 6. Folders
// const cubeTweaks = gui.addFolder('Awesome cube')
// cubeTweaks.add()
// cubeTweaks.close() closed by default

// 7. GUI setup
// const gui = new GUI({
//     title: "Si sawa c"
//     width: 300
//     closeFolders: true closed by default
// })

// hiding it `gui.hide()`
// toggling it
// window.addEventListener('keydown', (event) =>
//     {
//         if(event.key == 'h')
//             gui.show(gui._hidden)
//     })

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
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
