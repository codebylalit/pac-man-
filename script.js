// Game state variables
let gameRunning = false;
let score = 0;
let lives = 3;
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

// Leaderboard data
let leaderboard = [
  { name: "Chris", score: 100 },
  { name: "Mark", score: 75 },
  { name: "Tom", score: 50 },
  { name: "John", score: 45 },
  { name: "John2", score: 40 },
  { name: "John3", score: 35 },
];

// Game elements
const main = document.querySelector("main");
const scoreElement = document.querySelector(".score p");
const livesElement = document.querySelector(".lives ul");
const startDiv = document.querySelector(".startDiv");
const startButton = document.querySelector(".start");

//Player = 2, Wall = 1, Enemy = 3, Point = 0, Empty = -1
let maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Player and enemy positions
let playerRow = 1;
let playerCol = 1;
let enemies = [
  { row: 1, col: 8, direction: "left" },
  { row: 6, col: 5, direction: "up" },
  { row: 8, col: 1, direction: "right" },
];

// Initialize game
function initGame() {
  main.innerHTML = "";
  playerRow = 1;
  playerCol = 1;
  score = 0;
  lives = 3;
  gameRunning = true;

  // Reset enemy positions
  enemies = [
    { row: 1, col: 8, direction: "left" },
    { row: 6, col: 5, direction: "up" },
    { row: 8, col: 1, direction: "right" },
  ];

  // Reset maze to original state
  maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  updateScore();
  updateLives();
  renderMaze();
  startDiv.style.display = "none";
}

// Populate the maze in the HTML
function renderMaze() {
  main.innerHTML = "";

  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      let block = document.createElement("div");
      block.classList.add("block");
      block.dataset.row = row;
      block.dataset.col = col;

      switch (maze[row][col]) {
        case 1:
          block.classList.add("wall");
          break;
        case 2:
          block.id = "player";
          let mouth = document.createElement("div");
          mouth.classList.add("mouth");
          block.appendChild(mouth);
          break;
        case 3:
          block.classList.add("enemy");
          break;
        case 0:
          block.classList.add("point");
          block.style.height = "1vh";
          block.style.width = "1vh";
          break;
        case -1:
          // Empty space (eaten dot) - no special styling
          break;
        default:
          // Fallback for any other values
          break;
      }

      main.appendChild(block);
    }
  }
}

// Update score display
function updateScore() {
  scoreElement.textContent = score;
}

// Update lives display
function updateLives() {
  const lifeElements = livesElement.querySelectorAll("li");
  lifeElements.forEach((life, index) => {
    if (index < lives) {
      life.style.display = "block";
    } else {
      life.style.display = "none";
    }
  });
}

// Update leaderboard display
function updateLeaderboard() {
  const leaderboardElement = document.querySelector(".leaderboard ol");
  leaderboardElement.innerHTML = "";

  leaderboard.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}........${entry.score}`;
    leaderboardElement.appendChild(li);
  });
}

// Check if score qualifies for leaderboard
function checkLeaderboard() {
  const minScore = leaderboard[leaderboard.length - 1].score;
  if (score > minScore) {
    const playerName = prompt(
      `Congratulations! You scored ${score} points and made it to the leaderboard! Enter your name:`
    );
    if (playerName && playerName.trim()) {
      // Add new score
      leaderboard.push({ name: playerName.trim(), score: score });

      // Sort by score (highest first)
      leaderboard.sort((a, b) => b.score - a.score);

      // Keep only top 6 scores
      leaderboard = leaderboard.slice(0, 6);

      // Update display
      updateLeaderboard();

      // Save to localStorage
      localStorage.setItem("pacman-leaderboard", JSON.stringify(leaderboard));
    }
  }
}

// Load leaderboard from localStorage
function loadLeaderboard() {
  const saved = localStorage.getItem("pacman-leaderboard");
  if (saved) {
    leaderboard = JSON.parse(saved);
  }
  updateLeaderboard();
}

// Check if position is valid (not a wall)
function isValidPosition(row, col) {
  return (
    row >= 0 &&
    row < maze.length &&
    col >= 0 &&
    col < maze[row].length &&
    maze[row][col] !== 1
  );
}

// Move player
function movePlayer(direction) {
  if (!gameRunning) return;

  let newRow = playerRow;
  let newCol = playerCol;

  switch (direction) {
    case "up":
      newRow--;
      break;
    case "down":
      newRow++;
      break;
    case "left":
      newCol--;
      break;
    case "right":
      newCol++;
      break;
  }

  if (isValidPosition(newRow, newCol)) {
    // Check if there's a point to collect BEFORE moving
    if (maze[newRow][newCol] === 0) {
      score += 10;
      updateScore();
    }

    // Clear old player position - set to empty space (-1) if it was a point
    if (maze[playerRow][playerCol] === 2) {
      maze[playerRow][playerCol] = -1; // Empty space where player was
    }

    // Move player
    playerRow = newRow;
    playerCol = newCol;
    maze[playerRow][playerCol] = 2;

    // Update player mouth direction
    const player = document.querySelector("#player");
    if (player) {
      const mouth = player.querySelector(".mouth");
      if (mouth) {
        mouth.className = "mouth " + direction;
      }
    }

    renderMaze();
    checkCollisions();
  }
}

// Move enemies
function moveEnemies() {
  if (!gameRunning) return;

  enemies.forEach((enemy, index) => {
    let newRow = enemy.row;
    let newCol = enemy.col;

    // Simple AI: try to move in current direction, if blocked, change direction
    switch (enemy.direction) {
      case "up":
        newRow--;
        break;
      case "down":
        newRow++;
        break;
      case "left":
        newCol--;
        break;
      case "right":
        newCol++;
        break;
    }

    // If new position is invalid, change direction
    if (!isValidPosition(newRow, newCol) || maze[newRow][newCol] === 2) {
      const directions = ["up", "down", "left", "right"];
      enemy.direction =
        directions[Math.floor(Math.random() * directions.length)];
      return; // Skip this move
    }

    // Move enemy - set old position to empty space
    maze[enemy.row][enemy.col] = -1;
    enemy.row = newRow;
    enemy.col = newCol;
    maze[enemy.row][enemy.col] = 3;
  });

  renderMaze();
  checkCollisions();
}

// Check for collisions
function checkCollisions() {
  enemies.forEach((enemy) => {
    if (enemy.row === playerRow && enemy.col === playerCol) {
      loseLife();
    }
  });

  // Check if all points are collected
  let pointsLeft = false;
  for (let row of maze) {
    for (let cell of row) {
      if (cell === 0) {
        pointsLeft = true;
        break;
      }
    }
    if (pointsLeft) break;
  }

  if (!pointsLeft) {
    gameWin();
  }
}

// Lose a life
function loseLife() {
  lives--;
  updateLives();

  if (lives <= 0) {
    gameOver();
  } else {
    // Reset player position
    maze[playerRow][playerCol] = -1; // Set to empty space
    playerRow = 1;
    playerCol = 1;
    maze[playerRow][playerCol] = 2;
    renderMaze();

    // Add hit animation
    const player = document.querySelector("#player");
    if (player) {
      player.classList.add("hit");
      setTimeout(() => {
        player.classList.remove("hit");
      }, 1500);
    }
  }
}

// Game over
function gameOver() {
  gameRunning = false;
  checkLeaderboard();
  alert("Game Over! Final Score: " + score);
  startDiv.style.display = "flex";
}

// Game win
function gameWin() {
  gameRunning = false;
  checkLeaderboard();
  alert("Congratulations! You won! Final Score: " + score);
  startDiv.style.display = "flex";
}

// Keyboard event handlers
function keyUp(event) {
  if (event.key === "ArrowUp") {
    upPressed = false;
  } else if (event.key === "ArrowDown") {
    downPressed = false;
  } else if (event.key === "ArrowLeft") {
    leftPressed = false;
  } else if (event.key === "ArrowRight") {
    rightPressed = false;
  }
}

function keyDown(event) {
  if (event.key === "ArrowUp") {
    upPressed = true;
    movePlayer("up");
  } else if (event.key === "ArrowDown") {
    downPressed = true;
    movePlayer("down");
  } else if (event.key === "ArrowLeft") {
    leftPressed = true;
    movePlayer("left");
  } else if (event.key === "ArrowRight") {
    rightPressed = true;
    movePlayer("right");
  }
}

// Button event handlers
function setupButtonControls() {
  const leftBtn = document.getElementById("lbttn");
  const upBtn = document.getElementById("ubttn");
  const rightBtn = document.getElementById("rbttn");
  const downBtn = document.getElementById("dbttn");

  leftBtn.addEventListener("click", () => movePlayer("left"));
  upBtn.addEventListener("click", () => movePlayer("up"));
  rightBtn.addEventListener("click", () => movePlayer("right"));
  downBtn.addEventListener("click", () => movePlayer("down"));
}

// Game loop
function gameLoop() {
  if (gameRunning) {
    moveEnemies();
  }
}

// Initialize everything
function init() {
  loadLeaderboard();
  renderMaze();
  updateScore();
  updateLives();
  setupButtonControls();

  // Start button
  startButton.addEventListener("click", initGame);

  // Keyboard events
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  // Game loop
  setInterval(gameLoop, 500); // Move enemies every 500ms
}

// Start the game
init();
