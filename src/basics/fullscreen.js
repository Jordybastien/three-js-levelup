import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// cursor
const cursor = {
  x: 0,
  y: 0,
};

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera aspect property
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);

  // handling pixel ratio, worst case huge displayRatio, maximum being 2
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // renderer.setPixelRatio(window.devicePixelRatio);
});

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

// entering fullscreen on mouse double click
window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// Safari support
// window.addEventListener('dblclick', () => {
//   const fullscreenElement =
//     document.fullscreenElement || document.webkitFullscreenElement;

//   if (!fullscreenElement) {
//     if (canvas.requestFullscreen) {
//       canvas.requestFullscreen();
//     } else if (canvas.webkitRequestFullscreen) {
//       canvas.webkitRequestFullscreen();
//     }
//   } else {
//     if (document.exitFullscreen) {
//       document.exitFullscreen();
//     } else if (document.webkitExitFullscreen) {
//       document.webkitExitFullscreen();
//     }
//   }
// });

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  1000
);

camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //   camera.position.x = cursor.x * 3;
  //   camera.position.y = cursor.y * 3;

  //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
  //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
  //   camera.position.y = cursor.y * 3
  //   camera.lookAt(mesh.position);
  // deviceorientationcontrols deprecated

  // update controls

  controls.update();
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
