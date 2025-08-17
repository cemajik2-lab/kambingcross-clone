const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player
const player = { x: 180, y: 460, w: 40, h: 40, color: "brown" };

// Cars
const cars = [];
function spawnCar() {
  const y = Math.random() * 400;
  cars.push({ x: -60, y: y, w: 60, h: 30, speed: 2 + Math.random() * 3 });
}
setInterval(spawnCar, 1500);

// Keys
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

let score = 0;
let gameOver = false;

function update() {
  if (gameOver) return;

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
    player.y = 460; // reset position lepas sampai atas
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
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Cars
  ctx.fillStyle = "red";
  for (let car of cars) {
    ctx.fillRect(car.x, car.y, car.w, car.h);
  }

  // Score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);

  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", 90, 250);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
