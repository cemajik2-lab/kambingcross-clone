const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const gameWrapper = document.getElementById("gameWrapper");
const scoreText = document.getElementById("scoreText");
const overlay = document.getElementById("overlay");
const overlayMsg = document.getElementById("overlayMsg");
const retryBtn = document.getElementById("retryBtn");
const startBtn = document.getElementById("startBtn");
const controls = document.getElementById("controls");

let player, cars, keys, score, carInterval;
let gameRunning = false;

function initGame() {
  player = { x: 180, y: 460, w: 40, h: 40, color: "#0ff" };
  cars = [];
  keys = {};
  score = 0;
  gameRunning = true;

  overlay.classList.add("hidden");
  scoreText.textContent = "Score: " + score;

  if (carInterval) clearInterval(carInterval);
  carInterval = setInterval(spawnCar, 1500);
}

function spawnCar() {
  if (!gameRunning) return;
  const y = Math.random() * 400;
  cars.push({ x: -60, y: y, w: 60, h: 30, speed: 2 + Math.random() * 3 });
}

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update() {
  if (!gameRunning) return;

  if (keys["ArrowUp"]) player.y -= 3;
  if (keys["ArrowDown"]) player.y += 3;
  if (keys["ArrowLeft"]) player.x -= 3;
  if (keys["ArrowRight"]) player.x += 3;

  if (player.x < 0) player.x = 0;
  if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;
  if (player.y < 0) {
    score++;
    player.y = 460;
    scoreText.textContent = "Score: " + score;
    if (score >= 5) endGame("🎉 YEAY! Kau Menang! 🎉");
  }
  if (player.y + player.h > canvas.height) player.y = canvas.height - player.h;

  for (let i = cars.length - 1; i >= 0; i--) {
    let car = cars[i];
    car.x += car.speed;
    if (car.x > canvas.width + 60) {
      cars.splice(i, 1);
      continue;
    }

    if (
      player.x < car.x + car.w &&
      player.x + player.w > car.x &&
      player.y < car.y + car.h &&
      player.y + player.h > car.y
    ) {
      endGame("💀 GAME OVER 💀");
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!gameRunning) return;

  // Player (kambing neon)
  ctx.fillStyle = player.color;
  ctx.shadowColor = "#0ff";
  ctx.shadowBlur = 20;
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.shadowBlur = 0;

  // Cars (neon merah jahat)
  for (let car of cars) {
    ctx.fillStyle = "#f0f";
    ctx.shadowColor = "#f0f";
    ctx.shadowBlur = 15;
    ctx.fillRect(car.x, car.y, car.w, car.h);
    ctx.shadowBlur = 0;
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function endGame(msg) {
  clearInterval(carInterval);
  gameRunning = false;
  overlayMsg.textContent = msg;
  overlay.classList.remove("hidden");
}

retryBtn.addEventListener("click", () => initGame());
startBtn.addEventListener("click", () => {
  menu.classList.add("hidden");
  gameWrapper.classList.remove("hidden");
  initGame();
});

// 🎮 Mobile Controls
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  controls.classList.remove("hidden");
  document.querySelectorAll("#controls button").forEach(btn => {
    btn.addEventListener("touchstart", () => keys[btn.dataset.key] = true);
    btn.addEventListener("touchend", () => keys[btn.dataset.key] = false);
  });
}

// Loop jalan sepanjang hidup
loop();
