import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// @Notes:
// Materials are used to put a color on each visible pixel of the geometries.

// The algorithms that decide on the color of each pixel are written in programs called shaders.
// Writing shaders is one of the most challenging parts of WebGL and Three.js,
// Three.js has many built-in materials with pre-made shaders.

// A mesh is a 3D object that combines geometry (the shape of the object) and material (the appearance of the object).
// It is one of the most fundamental building blocks for creating objects in a 3D scene

// Key Components of a Mesh:
//     Geometry:
//
//         Defines the shape or structure of the object.
//     Examples include BoxGeometry (a cube), SphereGeometry (a sphere), PlaneGeometry (a flat plane), or custom geometries.
//     It contains the vertices and faces that make up the object.
//     Material:
//
// Defines how the surface of the object looks.
//     Examples include MeshBasicMaterial (a simple material without lighting), MeshStandardMaterial (supports realistic lighting and PBR), or MeshLambertMaterial (supports lighting but is less computationally expensive than MeshStandardMaterial).


/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Textures

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/static/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/static/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load("/static/textures/door/ambientOcclusion.jpg");
const doorHeightTexture = textureLoader.load("/static/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/static/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/static/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/static/textures/door/roughness.jpg");
// textures used as map and matcap are supposed to be encoded in sRGB and we need to inform Three.js of this by setting their colorSpace to THREE.SRGBColorSpace
const matcapTexture = textureLoader.load("/static/textures/matcaps/1.png");
const gradientTexture = textureLoader.load("/static/textures/gradients/3.jpg");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

// statements starts here
// ### 1. MeshBasicMaterial
// The map property will apply a texture on the surface of the geometry:
// const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });
// The color property will apply a uniform color on the surface of the geometry. When you are changing the color property directly, you must instantiate a Color class. You can use many different formats.
// material.color = new THREE.Color('#ff0000')

// The wireframe property will show the triangles that compose your geometry with a thin line of 1px regardless of the distance of the camera
// lines mostly for debugging
// material.wireframe = true;
// side
// The side property lets you decide which side of the faces is visible. By default, the front side is visible
// material.side = THREE.DoubleSide


// ### 2. MeshNormalMaterial
// The MeshNormalMaterial displays a nice purple, blueish color that looks like the normal texture we saw in the Textures lessons. That is no coincidence because both are related to what we call “normals”.
// const material = new THREE.MeshNormalMaterial()

// You can use Normals for many things like calculating how to illuminate the face or how the environment should reflect or refract on the geometries' surface.
// When using the MeshNormalMaterial, the color will just display the normal orientation relative to the camera. If you rotate around the sphere, you'll see that the color is always the same, regardless of which part of the sphere you're looking at.
// While you can use some of the properties we discovered with the MeshBasicMaterial like wireframe, transparent, opacity, and side, there is also a new property that you can use, which is called flatShading:
// flatShading will flatten the faces, meaning that the normals won't be interpolated between the vertices.


// ### 3. MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture
// MeshMatcapMaterial is a fantastic material because of how great it can look while remaining very performant.
// For it to work, the MeshMatcapMaterial needs a reference texture that looks like a sphere.
// The material will then pick colors from the texture according to the normal orientation relative to the camera.
// No light in the screen, this will use the asset lighting(color)
// https://github.com/nidorx/matcaps
// https://www.kchapelier.com/matcap-studio/


// ### 4. MeshDepthMaterial
// The MeshDepthMaterial will simply color the geometry in white if it's close to the camera's near value and in black if it's close to the far value of the camera:
// It’s actually a little more complex than that and this material is actually used to save the depth in a texture, which can be used for later complex computations like handling shadows.


// ### 5. MeshLambertMaterial
// The MeshLambertMaterial is the first material in the list that requires lights to be seen.
// The MeshLambertMaterial is the most performant material that uses lights.
// Unfortunately, the parameters aren't convenient, and you can see strange patterns in the geometry if you look closely at rounded geometries like the sphere.
// Adding a few lights

// AMBIENT LIGHT
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)

// POINT LIGHT
// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

// ### 6. MeshPhongMaterial
// The MeshPhongMaterial is very similar to the MeshLambertMaterial, but the strange patterns are less visible, and you can also see the light reflection on the surface of the geometry:
// const material = new THREE.MeshPhongMaterial()

// You can control the light reflection with the shininess property.
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)


// ### 7. MeshToonMaterial
// The MeshToonMaterial is similar to the MeshLambertMaterial in terms of properties but with a cartoonish style:
// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture
// By default, you only get a two-part coloration (one for the shadow and one for the light).
// To add more steps to the coloration, you can use the gradientTexture we loaded at the start of the lesson
// on the gradientMap property:


// Generate big pixels on an asset/material
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter

// ### 8. MeshStandardMaterial
// Like the MeshLambertMaterial and the MeshPhongMaterial,
// it supports lights but with a more realistic algorithm and better parameters like roughness and metalness.
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0.45
// material.roughness = 0.65


// const material = new THREE.MeshStandardMaterial();
// material.metalness = 1
// material.roughness = 1
// material.map = doorColorTexture;
// The aoMap property (literally "ambient occlusion map") will add shadows where the texture is dark.
// Then, add the aoMap using the doorAmbientOcclusionTexture texture and control the intensity using the aoMapIntensity property:
// material.aoMap = doorAmbientOcclusionTexture;

// The displacementMap property will move the vertices to create true relief:
// material.displacementMap = doorHeightTexture

// material.displacementScale = 0.1

// Instead of specifying uniform metalness and roughness for the whole geometry, we can use metalnessMap and roughnessMap:
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture

// The normalMap will fake the normal orientation and add details to the surface regardless of the subdivision:
// material.normalMap = doorNormalTexture

// ### 9. MeshPhysicalMaterial
//  ⚠️ MeshPhysicalMaterial is the worst material in terms of performance.
//  Don’t expect a good frame rate on every device, if you apply this material to many objects covering most of the screen.
const material = new THREE.MeshPhysicalMaterial()
material.metalness = 1
material.roughness = 1
material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1
material.displacementMap = doorHeightTexture
material.displacementScale = 0.1
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.normalMap = doorNormalTexture
material.normalScale.set(0.5, 0.5)

// clearcoat
// The clearcoat will simulate a thin layer of varnish on top of the actual material.
// This layer has its own reflective properties while we can still see the default material behind it.
material.clearcoat = 1
material.clearcoatRoughness = 0

// sheen
// The sheen will highlight the material when seen from a narrow angle. We can usually see this effect on fluffy material like fabric.
material.sheen = 1
material.sheenRoughness = 0.25
material.sheenColor.set(1, 1, 1)

// iridescence
// The iridescence is an effect where we can see color artifacts like
// a fuel puddle, soap bubbles, or even LaserDiscs for those who are old enough to remember them.
material.iridescence = 1
material.iridescenceIOR = 1
material.iridescenceThicknessRange = [ 100, 800 ]

// transmission
// The transmission will enable light to go through the material.
// It’s more than just transparency with opacity because the image behind the object gets deformed.
material.transmission = 1
material.ior = 1.5
material.thickness = 0.5

// The objects feel translucent.
//   ior stands for Index Of Refraction and depends on the type of material you want to simulate.
//   A diamond has an ior of 2.417, water has an ior of 1.333 and air has an ior of 1.000293.
//   You can find the whole list on Wikipedia https://en.wikipedia.org/wiki/List_of_refractive_indices
//   The thickness is a fixed value and the actual thickness of the object isn’t taken into account.
//   Currently, we have a lot of maps messing up our material, but the transmission looks really good with a pure material too.

// ### ADDING AN ENVIRONMENT MAP
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/static/textures/environmentMap/2k.hdr", (environmentMap) => {
  // To apply it to our scene, we need to change its mapping property to THREE.EquirectangularReflectionMapping and then assign it to the background and environment properties of the scene:
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});


// geometry created directly inside a Mesh
// sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
sphere.position.x = -1.5;

// plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);


// torus
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 16, 32), material);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);
// statements ends here

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth, height: window.innerHeight,
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
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
// Create a clock instance to keep track of time
const clock = new THREE.Clock();

const tick = () => {
  // Get the total elapsed time since the clock started
  // Used for time-based animations or updates
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls (e.g., OrbitControls) to reflect user interactions
  // Some controls, like OrbitControls, require this to update camera movement
  controls.update();

  // Render the current state of the scene from the camera's perspective
  renderer.render(scene, camera);

  // Schedule the tick function to run again on the next animation frame
  // Ensures smooth animations synced with the browser's refresh rate
  window.requestAnimationFrame(tick);
};

tick();

