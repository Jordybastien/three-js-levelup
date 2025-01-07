import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 3D textures https://3dtextures.me/

// Textures
// const image = new Image();
// image.onload = () => {
//   console.log('--->image loaded');
// };
// image.src = '/static/textures/door/color.jpg';

// using the image
// const image = new Image();
// const texture = new THREE.Texture(image);
// // the texture looks oddly greyish
// // It’s because the image has been encoded using the sRGB color space but Three.js isn’t aware of this.
// // To fix that, you need to set their colorSpace to THREE.sRGBColorSpace:
// texture.colorSpace = THREE.SRGBColorSpace;
// image.addEventListener('load', () => {
//   texture.needsUpdate = true;
// });
// image.src = '/static/textures/door/color.jpg';

// ### Using TextureLoader
// The native JavaScript technique is not that complicated, but there is an even more straightforward way with TextureLoader.
// const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load('/static/textures/door/color.jpg')
// texture.colorSpace = THREE.SRGBColorSpace

// The weight
// Don't forget that the users going to your website will have to download those textures. You can use most of the types of images we use on the web like .jpg (lossy compression but usually lighter) or .png (lossless compression but usually heavier).

// ### Using the loading Manager
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log('loading started');
};
loadingManager.onLoad = () => {
  console.log('loading finished');
};
loadingManager.onProgress = () => {
  console.log('loading progressing');
};
loadingManager.onError = () => {
  console.log('loading error');
};

// textures used as map and matcap are supposed to be encoded in sRGB and we need to inform Three.js of this by setting their colorSpace to THREE.SRGBColorSpace
const textureLoader = new THREE.TextureLoader(loadingManager);

const colorTexture = textureLoader.load('/static/textures/door/color.jpg');
colorTexture.colorSpace = THREE.SRGBColorSpace;
const alphaTexture = textureLoader.load('/static/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/static/textures/door/height.jpg');
const normalTexture = textureLoader.load('/static/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load(
  '/static/textures/door/ambientOcclusion.jpg'
);
const metalnessTexture = textureLoader.load(
  '/static/textures/door/metalness.jpg'
);
const roughnessTexture = textureLoader.load(
  '/static/textures/door/roughness.jpg'
);

const geometry = new THREE.BoxGeometry(1, 1, 1);
// ### UV unwrapping
colorTexture.repeat.x = 2;
colorTexture.repeat.y = 3;
colorTexture.wrapS = THREE.RepeatWrapping;
colorTexture.wrapT = THREE.RepeatWrapping;

// Minification filter
// The minification filter happens when the pixels of texture are smaller than the pixels of the render. In other words, the texture is too big for the surface, it covers.

// You can change the minification filter of the texture using the minFilter property.

// There are 6 possible values:

// THREE.NearestFilter
// THREE.LinearFilter
// THREE.NearestMipmapNearestFilter
// THREE.NearestMipmapLinearFilter
// THREE.LinearMipmapNearestFilter
// THREE.LinearMipmapLinearFilter

// One final word about all those filters is that THREE.NearestFilter is cheaper than the other ones, and you should get better performances when using it.

// Only use the mipmaps for the minFilter property. If you are using the THREE.NearestFilter, you don't need the mipmaps, and you can deactivate them with colorTexture.generateMipmaps = false:

// colorTexture.generateMipmaps = false
// colorTexture.minFilter = THREE.NearestFilter

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
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// To see the texture on the cube, replace the color property by map and use the texture as value:
// const material = new THREE.MeshBasicMaterial({ map: texture });
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;
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
