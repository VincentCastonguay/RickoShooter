// setupScene.js
import * as THREE from './three.js';

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 10, 60);
scene.background = new THREE.Color(0x000000);

const camera = new THREE.OrthographicCamera(
  window.innerWidth / -100,
  window.innerWidth / 100,
  window.innerHeight / 100,
  window.innerHeight / -100,
  0.1,
  1000
);
camera.position.set(0, 10, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
document.body.appendChild(renderer.domElement);

const combatSong = new Audio('CombatSong.mp3');
combatSong.loop = true;
combatSong.volume = 0.1;
window.addEventListener('click', () => {
  combatSong.play();
}, { once: true });

const loader = new THREE.TextureLoader();
const backgroundTexture = loader.load('background.png');
backgroundTexture.wrapS = THREE.RepeatWrapping;
backgroundTexture.wrapT = THREE.RepeatWrapping;
backgroundTexture.repeat.set(10, 10);
const bgGeometry = new THREE.PlaneGeometry(100, 100);
const bgMaterial = new THREE.MeshStandardMaterial({ map: backgroundTexture });
const ground = new THREE.Mesh(bgGeometry, bgMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const ambientLight = new THREE.AmbientLight(0xff00ff, 0.2);
scene.add(ambientLight);

export { scene, camera, renderer, ground };
