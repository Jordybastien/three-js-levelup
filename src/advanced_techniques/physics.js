import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import CANNON from "cannon";

// @Note: Physics is on the CPU
// @Note: Render is on the GPU

// Performance
// ### 1. Broadphase

// When testing the collisions between objects, a naive approach is testing every Body against every other Body. While this is easy to do, it's costly in terms of performance.

// That is where broadphase comes up. The broadphase is doing a rough sorting of the Bodies before testing them. Imagine having two piles of boxes far from each other. Why would you test the boxes from one pile against the boxes in the other pile? They are too far to be colliding.

// There are 3 broadphase algorithms available in Cannon.js:

// NaiveBroadphase: Tests every Bodies against every other Bodies
// GridBroadphase: Quadrilles the world and only tests Bodies against other Bodies in the same grid box or the neighbors' grid boxes.
// SAPBroadphase (Sweep and prune broadphase): Tests Bodies on arbitrary axes during multiples steps.
// The default broadphase is NaiveBroadphase, and I recommend you to switch to SAPBroadphase. Using this broadphase can eventually generate bugs where a collision doesn't occur, but it's rare, and it involves doing things like moving Bodies very fast.

// To switch to SAPBroadphase, simply instantiate it in the world.broadphase property and also use this same world as parameter:
// world.broadphase = new CANNON.SAPBroadphase(world)

// ### 2. Sleep
// Even if we use an improved broadphase algorithm, all the Body are tested, even those not moving anymore. We can use a feature called sleep.

// When the Body speed gets incredibly slow (at a point where you can't see it moving), the Body can fall asleep and won't be tested unless a sufficient force is applied to it by code or if another Body hits it.

// To activate this feature, simply set the allowSleep property to true on the World:
// world.allowSleep = true
// Workers
// Running the physics simulation takes time. The component of your computer doing the work is the CPU. When you run Three.js, Cannon.js, your code logic, etc. everything is done by the same thread in your CPU. That thread can quickly overload if there is too much to do (like too many objects in the physics simulation), resulting in a frame rate drop.

// The right solution is to use workers. Workers let you put a part of your code in a different thread to spread the load. You can then send and receive data from that code. It can result in a considerable performance improvement.

// The problem is that the code has to be distinctly separated. You can find a good and simple example here(https://schteppe.github.io/cannon.js/examples/worker.html) in the page source code.

/**
 * Debug
 */
const gui = new GUI();
const debugObject = {};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Physics
 */
// world
const world = new CANNON.World();
// performance enhancing statements
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
// We used - 9.82 as the value because it's the gravity constant on earth,
// but you can use any other value if you want things to fall slower or if your scene happens on Mars.
world.gravity.set(0, -9.82, 0);

// Material
const defaultMaterial = new CANNON.Material("default");
// contact material
// the combination of the two Materials and contains properties for when objects collide
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1, // how much does it rub?
    restitution: 0.7, // how much does it bounce?
  }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// sphere
// const sphereShape = new CANNON.Sphere(0.5); // Radius 0.5
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape,
//   //   material: defaultMaterial,
// });

// // ### Apply forces
// // There are many ways to apply forces to a Body:

// // applyForce to apply a force to the Body from a specified point in space (not necessarily on the Body's surface) like the wind that pushes everything a little all the time, a small but sudden push on a domino or a greater sudden force to make an angry bird jump toward the enemy castle.
// // applyImpulse is like applyForce but instead of adding to the force that will result in velocity changes, it applies directly to the velocity.
// // applyLocalForce is the same as applyForce but the coordinates are local to the Body (meaning that 0, 0, 0 would be the center of the Body).
// // applyLocalImpulse is the same as applyImpulse but the coordinates are local to the Body.

// // Because using "force" methods will result in velocity changes, let's not use "impulse" methods
// sphereBody.applyLocalForce(
//   new CANNON.Vec3(150, 0, 0),
//   new CANNON.Vec3(0, 0, 0)
// );

// world.addBody(sphereBody);
// Physics - Floor
const floorShape = new CANNON.Plane();
// setting mass to `0` tells cannon.js that this object is static
const floorBody = new CANNON.Body({
  mass: 0,
  shape: floorShape,
  //   material: defaultMaterial,
});
// You should see the sphere jumping in a direction (probably toward the camera).
// Not the intended result. The reason is that our plane is facing the camera by default.
// We need to rotate it just like we rotated the floor in Three.js.
// Rotation with Cannon.js is a little harder than with Three.js because you have to use Quaternion.
// There are multiple ways of rotating the Body, but it has to be with its quaternion property.
// We are going to use the setFromAxisAngle(...).
// @Note: Rotation Math.PI
// Quarter rotation: Math.PI * 0.5
// Full rotation: Math.PI * 2
// Half rotation: Math.PI
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32), // Radius 0.5
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5,
//   })
// );
// sphere.castShadow = true;
// sphere.position.y = 0.5;
// scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Sounds
 */
const hitSound = new Audio("/static/sounds/hit.mp3");

const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();

  if (impactStrength > 1.5) {
    hitSound.volume = Math.random();
    hitSound.currentTime = 0;
    hitSound.play();
  }
};

/**
 * Utils
 */
const objectsToUpdate = [];

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

const createSphere = (radius, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js body
  const shape = new CANNON.Sphere(radius);

  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defaultMaterial,
  });
  body.position.copy(position);
  body.addEventListener("collide", playHitSound);
  world.addBody(body);

  // Save in objects to update
  objectsToUpdate.push({
    mesh,
    body,
  });
};

createSphere(0.5, { x: 0, y: 3, z: 0 });

debugObject.createSphere = () => {
  createSphere(0.5, { x: 0, y: 3, z: 0 });
};

gui.add(debugObject, "createSphere");

// Create box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});
const createBox = (width, height, depth, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js body
  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );

  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defaultMaterial,
  });
  body.position.copy(position);
  world.addBody(body);

  // Save in objects
  objectsToUpdate.push({ mesh, body });
};

createBox(1, 1, 1, { x: 0, y: 3, z: 0 });

debugObject.createBox = () => {
  createBox(Math.random(), Math.random(), Math.random(), {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
gui.add(debugObject, "createBox");

debugObject.reset = () => {
  for (const object of objectsToUpdate) {
    // Remove body
    object.body.removeEventListener("collide", playHitSound);
    world.removeBody(object.body);

    // Remove mesh
    scene.remove(object.mesh);
  }

  objectsToUpdate.splice(0, objectsToUpdate.length);
};

gui.add(debugObject, "reset");
/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics world
  // Now let's use the applyForce(...) to apply some wind. Because the wind is permanent,
  // we should apply this force to each frame before updating the World.
  // To correctly apply this force, the point should be the sphereBody.position:
  //   sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position); // sphereBody.position is a Vec3
  // @Params 1. time step: 1/60fps
  // we want our experience to run at 60fps, we are going to use 1 / 60.
  // Don't worry, the experience will work at the same speed on devices with higher and lower frame rates.
  // @Params 2. deltaTime: We need to calculate how much time has passed since the last frame
  // @Params 3. number of iterations
  // https://gafferongames.com/post/fix_your_timestep/
  world.step(1 / 60, deltaTime, 3);
  // updating our Three.js sphere by using the sphereBody coordinates
  //   sphere.position.copy(sphereBody.position);
  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    // ensure object rotates on falling `quaternion` is then used
    object.mesh.quaternion.copy(object.body.quaternion);
  }
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
