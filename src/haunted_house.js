import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
import { Sky } from "three/addons/objects/Sky.js";

// @Note: 1 Unit  =  1 meter
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

// Floor
const floorAlphaTexture = textureLoader.load(
  "/static/textures/floor/alpha.jpg"
);

const floorColorTexture = textureLoader.load(
  "/static/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg"
);
const floorARMTexture = textureLoader.load(
  "/static/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg"
);
const floorNormalTexture = textureLoader.load(
  "/static/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg"
);
const floorDisplacementTexture = textureLoader.load(
  "/static/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg"
);

// configure repeat property
floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);
// Not the expected result and you might notice weird lines on the side of the floor. This is due to the texture not repeating itself. What you see are the last pixels being stretched to the end.
// To fix that, we need to inform Three.js that those textures need to be repeated by setting the wrapS and wrapT to THREE.RepeatWrapping:
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// The next issue is that the color looks oddly gray. This is because of the color space.
// Color textures (not data textures like the normal map, AO map, roughness map, etc.) are being encoded in sRGB to optimise how the color is stored according to how color is perceived by human eyes.
// The coast_sand_rocks_02_diff_1k.jpg has been encoded properly using the sRGB color space and we need to inform Three.js of this by setting the colorSpace of the texture to THREE.SRGBColorSpace:
floorColorTexture.colorSpace = THREE.SRGBColorSpace;

// Wall
const wallColorTexture = textureLoader.load(
  "/static/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg"
);
const wallARMTexture = textureLoader.load(
  "/static/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg"
);
const wallNormalTexture = textureLoader.load(
  "/static/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg"
);

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

// Roof
const roofColorTexture = textureLoader.load(
  "/static/textures/roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg"
);
const roofARMTexture = textureLoader.load(
  "/static/textures/roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg"
);
const roofNormalTexture = textureLoader.load(
  "/static/textures/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg"
);

roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

// Bush
const bushColorTexture = textureLoader.load(
  "/static/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg"
);
const bushARMTexture = textureLoader.load(
  "/static/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg"
);
const bushNormalTexture = textureLoader.load(
  "/static/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg"
);

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

bushColorTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;

// Grave
const graveColorTexture = textureLoader.load(
  "/static/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg"
);
const graveARMTexture = textureLoader.load(
  "/static/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg"
);
const graveNormalTexture = textureLoader.load(
  "/static/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg"
);

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

// Door
const doorColorTexture = textureLoader.load("/static/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/static/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/static/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load(
  "/static/textures/door/height.jpg"
);
const doorNormalTexture = textureLoader.load(
  "/static/textures/door/normal.jpg"
);
const doorMetalnessTexture = textureLoader.load(
  "/static/textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "/static/textures/door/roughness.jpg"
);

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
/**
 * House
 */

// Starts

// In Three.js, we load textures to enhance the realism and detail of 3D models. For the floor in your scene, you're using multiple types of textures to create a realistic and dynamic surface. Here's why each texture is loaded and applied:

// -> Color Texture (map):
// This is the base texture that defines the surface's colors. In this case, it's the image of sand and rocks. It's essentially the "skin" of the material.

// -> Alpha Texture (alphaMap):
// This texture defines transparency for specific areas of the material. It's typically a black-and-white image where black represents fully transparent areas and white represents opaque areas. Using this, you can create effects like holes or fading edges on the surface.

// -> Ambient Occlusion Texture (aoMap):
// This texture simulates shadows in the crevices or areas where light would naturally be occluded. It adds depth and realism by darkening areas that are less exposed to light.

// -> Roughness Texture (roughnessMap):
// This determines how rough or smooth the surface appears. Darker areas on the texture make the material shinier (smooth), while lighter areas make it rougher.

// -> Metalness Texture (metalnessMap):
// This texture defines which parts of the surface should behave like metal. Typically, a surface like sand and rocks would have low or no metalness, but this can add subtle effects.

// -> Normal Texture (normalMap):
// The normal map simulates small bumps and grooves by altering how light interacts with the surface. It doesn't physically move vertices but tricks the lighting system into thinking the surface is bumpy.

// -> Displacement Texture (displacementMap):
// This moves the actual vertices of the geometry based on the texture, creating real physical bumps and dips on the surface. It's often used in combination with the normal map to create both large and fine details.

// -> Displacement Settings (displacementScale and displacementBias):
// These parameters control the strength and offset of the displacement effect to ensure it fits the desired visual and physical look without exaggeration.

// Why All These Textures?
// Each texture adds a specific aspect of realism:
// The color texture defines the look of the surface.
// The alpha map provides selective transparency for effects like blending into the environment.
// The ambient occlusion map adds depth through subtle shadowing.
// The roughness, metalness, and normal maps enhance how the material interacts with light, making it look realistic under different lighting conditions.
// The displacement map physically alters the surface for large-scale realism.
// By combining these, the material achieves a highly realistic and dynamic appearance, which would be difficult to achieve with a simple color and flat surface.

// 1. Floor
const floor = new THREE.Mesh(
  //   new THREE.PlaneGeometry(20, 20),
  new THREE.PlaneGeometry(20, 20, 100, 100), // added segments because of `displacementMap`, much vertices is bad for performance
  new THREE.MeshStandardMaterial({
    // The material samples the alphaMap texture and uses its values to determine the visibility of each part of the mesh.
    // To use alphaMap, the material must have transparent: true, otherwise, Three.js won't render transparency.
    // A plane with an alphaMap of a circular gradient can create the effect of a smooth fade from opaque in the center to fully transparent at the edges.
    alphaMap: floorAlphaTexture, // Controls transparency for specific areas.
    transparent: true, // When playing with the alpha, we need to inform Three.js that this material now supports transparency by setting the transparent property to true
    map: floorColorTexture, // Applies the color texture to the material.
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    // the displacement map will move the actual vertices. It won’t fake it like the normal map does.
    // We usually use the displacement map to create the rough shape and the normal map to create more granular details.
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3, // reduced vertices bump, lower the effect using `displacementScale`
    displacementBias: -0.2, // All vertices might go up a little, to fix it use `displacementBias`
  }) // realistic
);

// GUI
gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("floorDisplacementScale");
gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("floorDisplacementBias");
// @Note: Textures https://threejs-journey.com/lessons/haunted-house#choosing-and-downloading-textures
// Here, you can choose exactly what to export. Those names should remind you of what we’ve seen in previous lessons:
// AO (ambient occlusion): Prevents the ambient light being applied to crevices
// Diffuse: The actual color
// Displacement: Will move the vertices up and down to create elevations
// Normal: Will fake the orientation to create details. DX and GL are different ways of orienting the normals and we need to go for GL.
// Rough: How smooth or rough the material is

// Although it’s not the case for Coast Sand Rock 02, you might see more options such as:
// Bump: Like the normal map, but it’s a grayscale value (we don’t need it)
// Metal: Defines the metallic parts (we need this one if available)

// Normally, we would use JPG for most textures and PNG for the Normal because
// we avoid lossy compression on normal maps to prevent visual artefacts.
// But since we are going to use grungy textures, those artefacts won’t be visible,
// which is why we are going to choose JPG for all of them.

floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);
gui.add(floor.rotation, "x").min(-3).max(3).step(0.01);

// 2. House container
const house = new THREE.Group();
scene.add(house);

// 3.Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
);
// The walls are halfway buried in the floor because the origin of the geometry is at its center.
// In Three.js, the default origin (reference point) of a mesh's geometry is at its center.
// For the walls: new THREE.BoxGeometry(4, 2.5, 4);
// The height of the box is 2.5.
// Since the origin is at the center, half of the box (2.5 / 2 = 1.25) extends below the origin,
// and the other half extends above the origin. So we're adding this half to the y position to move it up
walls.position.y += 1.25;
house.add(walls);

// 4.Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);
roof.position.y = 2.5 + 0.75; // walls height + half of roof height due to it also being positioned at it's center
// The axis is y (the vertical axis) and the amount is Math.PI * 0.25 which is 1/8 of a circle:
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// 5. Door
const door = new THREE.Mesh(
  //   new THREE.PlaneGeometry(2.2, 2.2),
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100), // adding more vertices for the door not to be all flat use `displacementMap`
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
  })
);
door.position.y = 1;
door.position.z = 2; // this will create a glitch `z-fighting` due to it being positioned at the exact position as one of the walls
//That glitch is called “z-fighting”. It’s when two faces are mathematically in the exact same spot and the GPU doesn’t know which one is in front of the other.
// The easiest solution for this problem is to slightly move the objects away:
door.position.z = 2 + 0.01;
house.add(door);

// 6.Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#ccffcc", // green-ish
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
});

// on adding the bush we might notice at the top of the bushes a weird stretch of the texture that looks like a hole.
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

// 7. Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});

for (let i = 0; i < 30; i++) {
  // these graves are set within the house, centered on the same position
  //   This is where trigonometry comes in handy.

  // First, we are going to define a random angle between 0 and a full circle.

  // When using trigonometry, we need to use radians where Math.PI is equal to approximately 3.1415 which is half a circle. Since we want a full circle, we need to multiply Math.PI by 2.

  // Let’s create an angle variable containing Math.random() multiplied by Math.PI and then multiplied by 2:
  // Mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  // coordinates
  // angle
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4; // radius outside the house remember 4 * 4
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  grave.position.x = x;
  grave.position.z = z;
  grave.position.y += Math.random() * 0.4; // 0.4 being half it's height

  // rotation Between 0 & 1 => 0 <-> 1 now * 0.5 means -0.5 <-> 0.5
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  // Add to the graves group
  graves.add(grave);
}

// Ends

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

/**
 * Ghosts - lights
 */
const ghost1 = new THREE.PointLight("#8800ff", 6);
const ghost2 = new THREE.PointLight("#ff0088", 6);
const ghost3 = new THREE.PointLight("#ff0000", 6);
scene.add(ghost1, ghost2, ghost3);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// Cast and receive
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;

for (const grave of graves.children) {
  grave.castShadow = true;
  grave.receiveShadow = true;
}

// Mapping
// optimize and make sure the shadow maps fit the scene nicely
// DirectionalLIght
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

/**
 * Sky
 */
const sky = new Sky();
sky.scale.set(100, 100, 100); // looking like a small cube until we
scene.add(sky);
sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

/**
 * Fog
 */
scene.fog = new THREE.FogExp2("#04343f", 0.1);

// AxesHelper to the scene
const axesHelper = new THREE.AxesHelper(10); // The argument specifies the length of the axes
scene.add(axesHelper);

// The textures are too big and too heavy, which is not just an issue for the loading. 
// It’s also an issue for the GPU. The bigger the textures, the more memory they’ll occupy. 
// It’s bad for performance, but it also generates a small freeze when the textures are being uploaded to the GPU.

// #### Texture Optimisation
// In use https://cloudconvert.com/jpg-to-webp
// Click on the wrench icon, set the Width and Height to 256, and the Quality to 80:
// From 13MB to 1.6MB
// The current version is not optimized
// https://threejs-journey.com/lessons/haunted-house#textures-optimisation
/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  // https://www.desmos.com/calculator
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle * 3.45);

  const ghost2Angle = -elapsedTime * 0.38;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 2.34) *
    Math.sin(ghost2Angle * 3.45);

  const ghost3Angle = elapsedTime * 0.23;
  ghost3.position.x = Math.cos(ghost3Angle) * 6;
  ghost3.position.z = Math.sin(ghost3Angle) * 6;
  ghost3.position.y =
    Math.sin(ghost3Angle) *
    Math.sin(ghost3Angle * 2.34) *
    Math.sin(ghost3Angle * 3.45);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
