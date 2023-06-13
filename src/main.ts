import * as THREE from 'three';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create objects
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(geometry, material);
scene.add(sun);

const earthOrbit = new THREE.Object3D();
scene.add(earthOrbit);

const earth = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
earth.position.set(3, 0, 0);
earthOrbit.add(earth);

// Create a space shuttle geometry
const shuttleGeometry = new THREE.BoxGeometry(0.5, 0.5 , 1);
const shuttleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const shuttle = new THREE.Mesh(shuttleGeometry, shuttleMaterial);
shuttle.position.set(5, 0, 0);
scene.add(shuttle);

// Create a starfield
const starCount = 300;
const starfield = new THREE.Group();
scene.add(starfield);

for (let i = 0; i < starCount; i++) {
  const star = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );

  // Generate random positions for stars within a cube
  star.position.x = (Math.random() - 0.5) * 200;
  star.position.y = (Math.random() - 0.5) * 200;
  star.position.z = (Math.random() - 0.5) * 200;

  starfield.add(star);
}

// Create a keyboard state object to track key states
interface KeyboardState {
  [key: string]: boolean;
}

const keyboardState: KeyboardState = {};

// Add event listeners for keydown, keyup, and keypress events
window.addEventListener('keydown', (event) => {
  keyboardState[event.key] = true;
});

window.addEventListener('keyup', (event) => {
  keyboardState[event.key] = false;
});

window.addEventListener('keypress', (event) => {
  keyboardState[event.key] = true;
});

// Set initial camera position and lookAt target
const cameraOffset = new THREE.Vector3(0, 3, -5);
camera.position.copy(shuttle.position).add(cameraOffset);
camera.lookAt(shuttle.position);

// Create an animation loop
// Create an animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the sun
  sun.rotation.y += 0.01;

  // Rotate the earth around the sun
  earthOrbit.rotation.y += 0.02;

  // Move the shuttle based on keyboard input
  const angle = shuttle.rotation.y;
  const speed = 0.05;

  if (keyboardState['ArrowUp']) {
    shuttle.position.x += Math.sin(angle) * speed;
    shuttle.position.z += Math.cos(angle) * speed;
  }

  if (keyboardState['ArrowDown']) {
    shuttle.position.x -= Math.sin(angle) * speed;
    shuttle.position.z -= Math.cos(angle) * speed;
  }

  if (keyboardState['ArrowRight']) {
    shuttle.rotation.y -= speed;
  }

  if (keyboardState['ArrowLeft']) {
    shuttle.rotation.y += speed;
  }

  if (keyboardState[' ']) {
    shuttle.position.y += speed;
  }

  if (keyboardState['Shift']) {
    shuttle.position.y -= speed;
  }

  // Update the camera position to follow the shuttle
  const cameraOffset = new THREE.Vector3(0, 3, -5);
  const cameraPosition = shuttle.position.clone().add(cameraOffset);
  camera.position.copy(cameraPosition);

  // Render the scene
  renderer.render(scene, camera);
}

animate();
