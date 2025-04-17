// setupScene.js
import * as THREE from './three.js';

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 10, 60);
scene.background = new THREE.Color(0x0000ff);

const camera = new THREE.OrthographicCamera(
  window.innerWidth / -100,
  window.innerWidth / 100,
  window.innerHeight / 100,
  window.innerHeight / -100,
  0.1,
  1000
);

// Camera Position
camera.position.set(0, 10, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);

export { scene, camera, renderer, ground };