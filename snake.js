var activeRegion = new ZingTouch.Region(document.body);
var canvas = document.getElementById("game");
var divHighScore = document.getElementById("HighScore");
var divScore = document.getElementById("Score");
var HighScore = getHighScore();
var gameOver = false;
var gameStart = false;
var gamePause = false;
var context = canvas.getContext("2d");
var grid = 16;
var direction = "right";
var prevDirection = "right";
var score = 0;
var speed = 200;
var increment = 4;

divHighScore.innerHTML = "HIGH SCORE : " + HighScore;
divScore.innerHTML = "YOUR SCORE: " + score;
context.fillStyle = "#23ebc3";
context.textAlign = "center";
context.font = "30px Trebuchet MS";
context.fillText(
  "Press Enter OR Tap to start",
  canvas.width / 2,
  canvas.height / 2
);

var snake = getSnakeObj();

var food = getfood();
if (food.x == -5 && food.x == -5) updatefoodPosition();

function getSnakeObj() {
  if (!sessionStorage.snakeObj) {
    return {
      x: 160,
      y: 160,
      cells: [{ x: 160, y: 160 }, { x: 160 - grid, y: 160 }]
    };
  }
  return JSON.parse(sessionStorage.snakeObj);
}

function getfood() {
  4;
  if (!sessionStorage.food) {
    return {
      x: -5,
      y: -5
    };
  }
  return JSON.parse(sessionStorage.food);
}

function pauseGame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "red";
  context.textAlign = "center";
  context.font = "25px Trebuchet MS";
  context.fillText(
    "Game Paused! Hit 'P' to resume",
    canvas.width / 2,
    canvas.height / 2
  );
  sessionStorage.snakeObj = JSON.stringify(snake);
  sessionStorage.food = JSON.stringify(food);
}

function resumeGame() {
  snake = getSnakeObj();
  food = getfood();
  context.clearRect(0, 0, canvas.width, canvas.height);
  autoMove();
}

function getHighScore() {
  if (!localStorage.HighScore) {
    localStorage.setItem("HighScore", 0);
    return 0;
  }
  return localStorage.getItem("HighScore");
}

function setHighScore(score) {
  localStorage.setItem("HighScore", score);
}

function drawfood() {
  context.fillStyle = "red";
  context.fillRect(food.x, food.y, grid - 1, grid - 1);
}

function drawSnake() {
  context.fillStyle = "#eeff00";
  for (let i = 0; i < snake.cells.length; i++) {
    if (i > 0) context.fillStyle = "green";
    if (
      i > 0 &&
      snake.cells[i].x == snake.cells[0].x &&
      snake.cells[i].y == snake.cells[0].y
    ) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      gameOver = true;
      sessionStorage.removeItem("snakeObj");
      sessionStorage.removeItem("food");
      gameStart = false;
      context.fillStyle = "#23ebc3";
      context.textAlign = "center";
      context.font = "155% Trebuchet MS";
      if (HighScore <= score) {
        setHighScore(score);
        context.font = "30px Trebuchet MS";
        context.fillText(
          "Congratulations!",
          canvas.width / 2,
          canvas.height / 2 - grid
        );
        context.font = "20px Trebuchet MS";
        context.fillText(
          "You've set High Score : " + score,
          canvas.width / 2,
          canvas.height / 2 + grid
        );
      } else
        context.fillText(
          "Game Over! Your Score : " + score,
          canvas.width / 2,
          canvas.height / 2
        );
      context.fillText(
        "Hit ENTER or TAP to exit",
        canvas.width / 2,
        canvas.height / 2 + 3 * grid
      );
      document.addEventListener("keydown", function(e) {
        if (e.keyCode == 13) window.location.href = "snake.html";
      });
      activeRegion.bind(canvas, "tap", function(e) {
        if (e) window.location.href = "snake.html";
      });
      return;
    }
    if (snake.cells[i].x < 0) snake.cells[i].x = canvas.width - grid;
    if (snake.cells[i].x > canvas.width - grid) snake.cells[i].x = 0;
    if (snake.cells[i].y < 0) snake.cells[i].y = canvas.height - grid;
    if (snake.cells[i].y > canvas.height - grid) snake.cells[i].y = 0;

    if (i == 0) {
      snake.x = snake.cells[0].x;
      snake.y = snake.cells[0].y;
    }

    context.fillRect(snake.cells[i].x, snake.cells[i].y, grid - 1, grid - 1);
  }
  if (snake.x == food.x && snake.y == food.y) {
    updatefoodPosition();
    drawfood();
    score++;
    divScore.innerHTML = "YOUR SCORE: " + score;
    speed -= increment;
  }
  if (HighScore < score) divHighScore.innerHTML = "HIGH SCORE: " + score;
}

function updatefoodPosition() {
  food.x = grid * Math.floor(Math.random() * (canvas.width / grid - 1));
  food.y = grid * Math.floor(Math.random() * (canvas.height / grid - 1));
  for (let i = 0; i < snake.cells.length; i++) {
    if (snake.cells[i].x == food.x && snake.cells[i].y == food.y) {
      i = 0;
      food.x = grid * Math.floor(Math.random() * (canvas.width / grid - 1));
      food.y = grid * Math.floor(Math.random() * (canvas.height / grid - 1));
    }
  }
}

function moveSnake() {
  let dx = 0,
    dy = 0;

  switch (direction) {
    case "left":
      dx = -grid;
      break;
    case "up":
      dy = -grid;
      break;
    case "right":
      dx = grid;
      break;
    case "down":
      dy = grid;
      break;
  }

  snake.x += dx;
  snake.y += dy;

  snake.cells.unshift({ x: snake.x, y: snake.y }); // Insert at 0th position
  if (snake.x == food.x && snake.y == food.y) {
    updatefoodPosition();
    score++;
    divScore.innerHTML = "YOUR SCORE: " + score;
    speed -= increment;
  } else snake.cells.pop(); // remove the last element
}

function autoMove() {
  if (gameOver || gamePause) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
  moveSnake();
  drawSnake();
  prevDirection = direction;
  if (!gameOver && !gamePause) drawfood();
  setTimeout(autoMove, speed);
}

document.addEventListener("keydown", function(e) {
  switch (e.keyCode) {
    case 13:
      if (!gameStart) autoMove();
      gameStart = true;
      break;
    case 100:
      if (prevDirection != "right" && prevDirection != "left")
        direction = "left";
      break;
    case 104:
      if (prevDirection != "down" && prevDirection != "up") direction = "up";
      break;
    case 102:
      if (prevDirection != "left" && prevDirection != "right")
        direction = "right";
      break;
    case 101:
      if (prevDirection != "up" && prevDirection != "down") direction = "down";
      break;
    case 80:
      if (gamePause == false && gameStart) {
        gamePause = true;
        pauseGame();
        break;
      }
      if (gamePause == true && gameStart) {
        gamePause = false;
        resumeGame();
      }
      break;
  }
});

activeRegion.bind(canvas, "tap", function(e) {
  if (e && !gameStart) {
    autoMove();
    gameStart = true;
  }
});

activeRegion.bind(canvas, "swipe", function(e) {
  if (
    e.detail.data[0].currentDirection > 135 &&
    e.detail.data[0].currentDirection < 225
  )
    if (prevDirection != "right" && prevDirection != "left") direction = "left";
  if (
    e.detail.data[0].currentDirection > 45 &&
    e.detail.data[0].currentDirection < 135
  )
    if (prevDirection != "down" && prevDirection != "up") direction = "up";
  if (
    (e.detail.data[0].currentDirection > 315 &&
      e.detail.data[0].currentDirection <= 360) ||
    (e.detail.data[0].currentDirection > 45 &&
      e.detail.data[0].currentDirection <= 0)
  )
    if (prevDirection != "left" && prevDirection != "right")
      direction = "right";
  if (
    e.detail.data[0].currentDirection > 225 &&
    e.detail.data[0].currentDirection < 315
  )
    if (prevDirection != "up" && prevDirection != "down") direction = "down";
});
