// enemies.js
import * as THREE from './three.js';
import { resetKillCount } from './player.js';

const enemies = [];
const loader = new THREE.TextureLoader();

function spawnEnemy(scene, player) {
  const textures = ['enemy1.png', 'enemy2.png', 'enemy3.png'];
  const selected = textures[Math.floor(Math.random() * textures.length)];
  const enemy = new THREE.Object3D();

  loader.load(selected, (texture) => {
    const material = new THREE.MeshStandardMaterial({ map: texture, transparent: true });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    plane.rotation.x = -Math.PI / 2;
    enemy.add(plane);
  });

  enemy.position.y = 0.5;
  const angle = Math.random() * Math.PI * 2;
  const radius = 20;
  enemy.position.x = Math.cos(angle) * radius;
  enemy.position.z = Math.sin(angle) * radius;
  scene.add(enemy);
  enemies.push(enemy);
}

function updateEnemies(player) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    const direction = new THREE.Vector3().subVectors(player.position, enemy.position).normalize();
    enemy.position.addScaledVector(direction, 0.03);

    // Check collision with player
    const distance = enemy.position.distanceTo(player.position);
    if (distance < 1.0) {
      // Explosion effect
      const explosion = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 6, 6),
        new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffaa00 })
      );
      explosion.position.copy(enemy.position);
      explosion.position.y = 0.5;
      player.parent.add(explosion);
      setTimeout(() => player.parent.remove(explosion), 200);

      // Reset kill counter
      const counter = document.getElementById('kill-counter');
      resetKillCount();

      // Relocate player
      const angle = Math.random() * Math.PI * 2;
      const radius = 10;
      player.position.x = Math.cos(angle) * radius;
      player.position.z = Math.sin(angle) * radius;

      // Remove enemy
      player.parent.remove(enemy);
      enemies.splice(i, 1);
    }
  }
}

function startSpawningEnemies(scene, player) {
  setInterval(() => spawnEnemy(scene, player), 2000);
}

export { enemies, updateEnemies, startSpawningEnemies };
