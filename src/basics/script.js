import * as THREE from 'three';

// // Scene
// const scene = new THREE.Scene();

// // object - geometry
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);

// // Positioning
// mesh.position.x = 0.7;
// // mesh.position.y = - 0.6
// // mesh.position.z = 1
// // or
// // mesh.position.set(0.7, - 0.6, 1)

// // scale
// mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;
// // or mesh.scale.set

// // rotation, axis order is important
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;

// // adding mesh to the scene
// scene.add(mesh);

// console.log(mesh.position.length());

// // Sizes
// const sizes = {
//   width: 800,
//   height: 600,
// };

// // Camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// // configurations done before render
// camera.position.z = 3;
// camera.position.x = 1;
// camera.position.y = 1;
// scene.add(camera);


// // lookAt
// // camera.lookAt(new THREE.Vector3(0, - 1, 0))
// camera.lookAt(mesh.position)

// console.log(mesh.position.distanceTo(camera.position));
// // console.log(mesh.position.normalize())

// /**
//  * Axes Helper
//  */
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

// // Canvas
// const canvas = document.querySelector('canvas.webgl');

// // Renderer
// const renderer = new THREE.WebGLRenderer({
//   canvas,
// });

// renderer.setSize(sizes.width, sizes.height);

// // render function
// renderer.render(scene, camera);


/*********************************GROUP***********************************/

/**
 * Objects
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Axes Helper
 */
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

const group = new THREE.Group()
group.scale.y = 2
group.rotation.y = 0.2
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube1.position.x = - 1.5
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube2.position.x = 0
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube3.position.x = 1.5
group.add(cube3)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
// camera.lookAt(new THREE.Vector3(0, - 1, 0))
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)