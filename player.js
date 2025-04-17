// player.js
import * as THREE from './three.js';
import { scene } from './setupScene.js';

const loader = new THREE.TextureLoader();
const player = new THREE.Object3D();

let spriteMesh;
loader.load('player.png', (texture) => {
  const material = new THREE.MeshStandardMaterial({ map: texture, transparent: true });
  const geometry = new THREE.PlaneGeometry(2, 2);
  spriteMesh = new THREE.Mesh(geometry, material);
  spriteMesh.rotation.x = -Math.PI / 2;
  player.add(spriteMesh);
});

// Handle sprite swap on click
let angryTimeout;
const angryTexture = loader.load('angry.png');
document.addEventListener('click', () => {
  if (spriteMesh) {
    const originalTexture = spriteMesh.material.map;
    spriteMesh.material.map = angryTexture;
    clearTimeout(angryTimeout);
    angryTimeout = setTimeout(() => {
      spriteMesh.material.map = originalTexture;
    }, 150);
  }
});

player.position.y = 0.5;

const playerLight = new THREE.PointLight(0xffffaa , 5, 0, 1);
playerLight.position.set(0, 2, 0);
player.add(playerLight);

scene.add(player);

const keysPressed = {};
document.addEventListener('keydown', (e) => (keysPressed[e.key.toLowerCase()] = true));
document.addEventListener('keyup', (e) => (keysPressed[e.key.toLowerCase()] = false));

function updatePlayerMovement() {
  const speed = 0.1;
  if (keysPressed['w']) player.position.z -= speed;
  if (keysPressed['s']) player.position.z += speed;
  if (keysPressed['a']) player.position.x -= speed;
  if (keysPressed['d']) player.position.x += speed;
}

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
document.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

import { camera } from './setupScene.js';

function updatePlayerRotation(ground) {

raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(ground);
  if (intersects.length > 0) {
    const point = intersects[0].point;
    const dx = point.x - player.position.x;
    const dz = point.z - player.position.z;
    const angle = Math.atan2(dx, dz);
    player.rotation.y = angle;
  }
}

let killCount = 0;
const counter = document.getElementById('kill-counter');
if (counter) counter.textContent = `Kills: 0`;
function incrementKillCount() {
  killCount++;
  console.log(`Kills: ${killCount}`);
  const counter = document.getElementById('kill-counter');
  if (counter) counter.textContent = `Kills: ${killCount}`;
}

function resetKillCount() {
  killCount = 0;
  console.log('Kills reset to 0');
  const counter = document.getElementById('kill-counter');
  if (counter) counter.textContent = `Kills: 0`;
}

export { player, updatePlayerMovement, updatePlayerRotation, incrementKillCount, resetKillCount };
