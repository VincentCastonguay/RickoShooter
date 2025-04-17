// Basic Three.js Top-Down Shooter Template (CDN version, no modules)

// Scene Setup
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 10, 60);
scene.background = new THREE.Color(0x000000); // Black background

const camera = new THREE.OrthographicCamera(
  window.innerWidth / -100,
  window.innerWidth / 100,
  window.innerHeight / 100,
  window.innerHeight / -100,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Audio Setup
// Use cloned audio elements to allow overlapping playback
const gunshotBase = new Audio('gunshot.wav');
const explosionBase = new Audio('explosion.wav');

// Player using plane with texture (reacts to light)
const loader = new THREE.TextureLoader();
const player = new THREE.Object3D();
loader.load('player.png', (texture) => {
  const material = new THREE.MeshStandardMaterial({ map: texture, transparent: true });
  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2; // Face up
  player.add(mesh);
});
scene.add(player);


player.position.y = 0.5; // Raise player above ground

// Lighting Setup
const ambientLight = new THREE.AmbientLight(0x222222); // Low ambient light
scene.add(ambientLight);

const playerLight = new THREE.PointLight(0xffffaa , 5, 0, 1);
playerLight.position.set( 0, 2, 0);
player.add(playerLight);

// Glowing sci-fi grid background
const gridShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    varying vec2 vUv;
    void main() {
      float grid = abs(sin(vUv.x * 50.0 + time * 2.0)) + abs(sin(vUv.y * 50.0 + time * 2.0));
      float intensity = smoothstep(1.8, 2.0, grid);
      vec3 glowColor = mix(vec3(0.0), vec3(0.0, 0.8, 1.0), intensity);
      gl_FragColor = vec4(glowColor, 1.0);
    }
  `,
  transparent: false
});

const groundGeometry = new THREE.PlaneGeometry(100, 100);
const ground = new THREE.Mesh(groundGeometry, gridShaderMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Camera Position
camera.position.set(0, 10, 0);
camera.lookAt(0, 0, 0);

// Controls
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

// Mouse Aiming Setup
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
document.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function updatePlayerRotation() {
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

// Bullet Shooting
const bullets = [];
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

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.mesh.position.addScaledVector(bullet.direction, 0.5);

    // Check collision with enemies
    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      const distance = bullet.mesh.position.distanceTo(enemy.position);
      if (distance < 0.7) {
        // Remove enemy and bullet
        scene.remove(enemy);
        scene.remove(bullet.mesh);
        enemies.splice(j, 1);
        bullets.splice(i, 1);

        // Explosion effect
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
        break;
      }
    }

    if (i < bullets.length && bullet.mesh.position.length() > 100) {
      scene.remove(bullet.mesh);
      bullets.splice(i, 1);
    }
  }
}

// Enemy Setup
const enemies = [];
function spawnEnemy() {
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
  console.log('Spawned enemy at', enemy.position.x.toFixed(2), enemy.position.z.toFixed(2));
  enemies.push(enemy);
}

function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    const direction = new THREE.Vector3().subVectors(player.position, enemy.position).normalize();
    enemy.position.addScaledVector(direction, 0.03);
  }
}

setInterval(spawnEnemy, 2000);

// Render Loop
function animate() {
  // Animate grid background
  if (ground.material.uniforms?.time) {
    ground.material.uniforms.time.value += 0.01;
  }
  requestAnimationFrame(animate);
  updatePlayerMovement();
  updatePlayerRotation();
  updateBullets();
  updateEnemies();
  renderer.render(scene, camera);
}
animate();

// Resize Handling
window.addEventListener('resize', () => {
  camera.left = window.innerWidth / -100;
  camera.right = window.innerWidth / 100;
  camera.top = window.innerHeight / 100;
  camera.bottom = window.innerHeight / -100;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
