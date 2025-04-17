// bullets.js
import * as THREE from './three.js';
import { camera } from './setupScene.js';

const bullets = [];
const gunshotBase = new Audio('gunshot.wav');

function setupShooting(scene, player, ground) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  document.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(ground);
    if (intersects.length > 0) {
      const point = intersects[0].point;
      const bulletGeometry = new THREE.SphereGeometry(0.2, 8, 8);
      const bulletMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
      const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
      bullet.position.copy(player.position);
      bullet.position.y = 0.5;
      const direction = new THREE.Vector3().subVectors(point, player.position).normalize();
      bullets.push({ mesh: bullet, direction });
      scene.add(bullet);
      const gunshotSound = gunshotBase.cloneNode();
      gunshotSound.play();
    }
  });
}

import { incrementKillCount } from './player.js';

function updateBullets(scene, enemies) {
  const explosionBase = new Audio('explosion.wav');

  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.mesh.position.addScaledVector(bullet.direction, 0.5);

    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      const distance = bullet.mesh.position.distanceTo(enemy.position);
      if (distance < 0.7) {
        scene.remove(enemy);
        scene.remove(bullet.mesh);
        enemies.splice(j, 1);
        bullets.splice(i, 1);

        const explosion = new THREE.Mesh(
          new THREE.SphereGeometry(0.5, 6, 6),
          new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffaa00 })
        );
        explosion.position.copy(enemy.position);
        explosion.position.y = 0.5;
        scene.add(explosion);
        setTimeout(() => scene.remove(explosion), 200);

        const explosionSound = explosionBase.cloneNode();
        explosionSound.play();
incrementKillCount();
        break;
      }
    }

    if (i < bullets.length && bullet.mesh.position.length() > 100) {
      scene.remove(bullet.mesh);
      bullets.splice(i, 1);
    }
  }
}

export { bullets, updateBullets, setupShooting };
