const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const gameWrapper = document.getElementById("gameWrapper");
const scoreText = document.getElementById("scoreText");
const overlay = document.getElementById("overlay");
const overlayMsg = document.getElementById("overlayMsg");
const retryBtn = document.getElementById("retryBtn");
const startBtn = document.getElementById("startBtn");

let player, cars, keys, score, gameOver, gameWin, carInterval;

function initGame() {
  player = { x: 180, y: 460, w: 40, h: 40, color: "#795548" };
  cars = [];
  keys = {};
  score = 0;
  gameOver = false;
  gameWin = false;

  overlay.classList.add("hidden");
  scoreText.textContent = "Score: " + score;

  // clear interval kalau ada leftover
  if (carInterval) clearInterval(carInterval);
  carInterval = setInterval(spawnCar, 1500);
}

function spawnCar() {
  const y = Math.random() * 400;
  cars.push({ x: -60, y: y, w: 60, h: 30, speed: 2 + Math.random() * 3 });
}

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update() {
  if (gameOver || gameWin) return;

  // Movement
  if (keys["ArrowUp"]) player.y -= 3;
  if (keys["ArrowDown"]) player.y += 3;
  if (keys["ArrowLeft"]) player.x -= 3;
  if (keys["ArrowRight"]) player.x += 3;

  // Boundaries
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;
  if (player.y < 0) {
    score++;
    player.y = 460;
    scoreText.textContent = "Score: " + score;

    if (score >= 5) {
      gameWin = true;
      endGame("🎉 YEAY! Kau Menang! 🎉");
    }
  }
  if (player.y + player.h > canvas.height) player.y = canvas.height - player.h;

  // Move cars
  for (let car of cars) {
    car.x += car.speed;
    if (car.x > canvas.width + 60) {
      cars.splice(cars.indexOf(car), 1);
    }

    // Collision detection
    if (
      player.x < car.x + car.w &&
      player.x + player.w > car.x &&
      player.y < car.y + car.h &&
      player.y + player.h > car.y
    ) {
      gameOver = true;
      endGame("💀 GAME OVER 💀");
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Jalan
  ctx.fillStyle = "#b0bec5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Cars
  ctx.fillStyle = "red";
  for (let car of cars) {
    ctx.fillRect(car.x, car.y, car.w, car.h);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function endGame(msg) {
  clearInterval(carInterval);
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

// Start game loop sekali je
loop();
