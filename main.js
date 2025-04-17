import { scene, camera, renderer, ground } from './setupScene.js';
import { player, updatePlayerMovement, updatePlayerRotation } from './player.js';
import { initControls } from './controls.js';
import { bullets, updateBullets, setupShooting } from './bullets.js';
import { enemies, updateEnemies, startSpawningEnemies } from './enemies.js';

// DOM
initControls();
setupShooting(scene, player, ground);
startSpawningEnemies(scene, player);

// Render Loop
function animate() {
  requestAnimationFrame(animate);
  updatePlayerMovement();
  updatePlayerRotation(ground);
  updateBullets(scene, enemies);
  updateEnemies(player);
  renderer.render(scene, camera);
}
animate();

// Debug access
window.scene = scene;
window.camera = camera;
window.player = player;

// Resize Handling
window.addEventListener('resize', () => {
  camera.left = window.innerWidth / -100;
  camera.right = window.innerWidth / 100;
  camera.top = window.innerHeight / 100;
  camera.bottom = window.innerHeight / -100;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
