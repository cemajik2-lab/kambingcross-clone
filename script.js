const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const gameWrapper = document.getElementById("gameWrapper");
const scoreText = document.getElementById("scoreText");
const overlay = document.getElementById("overlay");
const overlayMsg = document.getElementById("overlayMsg");
const retryBtn = document.getElementById("retryBtn");
const startBtn = document.getElementById("startBtn");

let player, cars, keys, score, carInterval;
let gameRunning = false;

// load kambing sprite (kau boleh replace dengan file kambing.png sendiri)
const goatImg = new Image();
goatImg.src = "https://i.ibb.co/pPg9v9r/goat.png"; // contoh sprite free

function initGame() {
  player = { x: 180, y: 460, w: 40, h: 40 };
  cars = [];
  keys = {};
  score = 0;
  gameRunning = true;

  overlay.classList.add("hidden");
  scoreText.textContent = "Score: " + score;

  if (carInterval) clearInterval(carInterval);
  carInterval = setInterval(spawnCar, 1200);
}

function spawnCar() {
  if (!gameRunning) return;
  const y = Math.random() * 400;
  const colors = ["#ff00cc", "#00ffff", "#ffcc00", "#00ff00"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  cars.push({ x: -60, y: y, w: 60, h: 30, speed: 2 + Math.random() * 3, color });
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
    if (score >= 5) {
      endGame("🎉 YEAY! Kau Menang! 🎉");
    }
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

  // Jalan neon
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#0ff";
  ctx.lineWidth = 2;
  for (let i = 50; i < canvas.height; i += 80) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  if (!gameRunning) return;

  // Player (kambing sprite)
  ctx.drawImage(goatImg, player.x, player.y, player.w, player.h);

  // Cars
  for (let car of cars) {
    ctx.fillStyle = car.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = car.color;
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

retryBtn.addEventListener("click", () => {
  initGame();
});

startBtn.addEventListener("click", () => {
  menu.classList.add("hidden");
  gameWrapper.classList.remove("hidden");
  initGame();
});

// run loop
loop();
