// Create JS representation from the DOM
// Getting references to HTML elements used in the game
const startText = document.getElementById('startText'); // Start game text element
const paddle1 = document.getElementById('paddle1'); // Player 1's paddle
const paddle2 = document.getElementById('paddle2'); // Player 2's paddle
const ball = document.getElementById('ball'); // The ball element
const player1ScoreElement = document.getElementById('player1Score'); // Player 1's score display
const player2ScoreElement = document.getElementById('player2Score'); // Player 2's score display
const lossSound = document.getElementById('lossSound'); // Sound when a player loses a point
const wallSound = document.getElementById('wallSound'); // Sound when the ball hits a wall
const paddleSound = document.getElementById('paddleSound'); // Sound when the ball hits a paddle

// Game Variables
// Variables to control the state of the game
let gameRunning = false; // Boolean to check if the game is active
let keysPressed = {}; // Object to keep track of pressed keys
let paddle1Speed = 0; // Speed of paddle 1
let paddle1Y = 150; // Vertical position of paddle 1
let paddle2Speed = 0; // Speed of paddle 2
let paddle2Y = 150; // Vertical position of paddle 2
let ballX = 290; // Horizontal position of the ball
let ballSpeedX = 2; // Horizontal speed of the ball
let ballY = 190; // Vertical position of the ball
let ballSpeedY = 2; // Vertical speed of the ball
let player2Score = 0; // Player 2's score
let player1Score = 0; // Player 1's score

// Game Constants
// Constants to control the gameplay behavior
const paddleAcceleration = 1; // Acceleration rate of paddles
const maxPaddleSpeed = 5; // Maximum speed of paddles
const paddleDeceleration = 1; // Deceleration rate of paddles
const gameHeight = 400; // Height of the game area
const gameWidth = 600; // Width of the game area

// Adding event listeners for keyboard events
document.addEventListener('keydown', startGame); // Start the game on any key press
document.addEventListener('keydown', handleKeyDown); // Handle key down events
document.addEventListener('keyup', handleKeyUp); // Handle key up events

// Start game
function startGame() {
  gameRunning = true; // Set the game status to running
  startText.style.display = 'none'; // Hide the start text
  document.removeEventListener('keydown', startGame); // Remove the event listener to prevent restarting
  gameLoop(); // Start the game loop
}

// Main game loop
function gameLoop() {
  if (gameRunning) { // Check if the game is running
    updatePaddle1(); // Update paddle 1's position
    updatePaddle2(); // Update paddle 2's position
    moveBall(); // Move the ball
    setTimeout(gameLoop, 8); // Loop the game every 8 milliseconds
  }
}

// Key down event handler
function handleKeyDown(e) {
  keysPressed[e.key] = true; // Mark the key as pressed
}

// Key up event handler
function handleKeyUp(e) {
  keysPressed[e.key] = false; // Mark the key as not pressed
}

// Update paddle 1's position based on key presses
function updatePaddle1() {
  if (keysPressed['w']) { // If 'w' key is pressed
    paddle1Speed = Math.max(paddle1Speed - paddleAcceleration, -maxPaddleSpeed); // Accelerate up
  } else if (keysPressed['s']) { // If 's' key is pressed
    paddle1Speed = Math.min(paddle1Speed + paddleAcceleration, maxPaddleSpeed); // Accelerate down
  } else { // No key pressed for paddle 1
    if (paddle1Speed > 0) {
      paddle1Speed = Math.max(paddle1Speed - paddleDeceleration, 0); // Decelerate
    } else if (paddle1Speed < 0) {
      paddle1Speed = Math.min(paddle1Speed + paddleDeceleration, 0); // Decelerate
    }
  }

  paddle1Y += paddle1Speed; // Update the vertical position of paddle 1

  // Ensure paddle 1 stays within game boundaries
  if (paddle1Y < 0) {
    paddle1Y = 0;
  }
  if (paddle1Y > gameHeight - paddle1.clientHeight) {
    paddle1Y = gameHeight - paddle1.clientHeight;
  }
  paddle1.style.top = paddle1Y + 'px'; // Update the paddle position on screen
}

// Update paddle 2's position based on key presses
function updatePaddle2() {
  if (keysPressed['ArrowUp']) { // If 'ArrowUp' key is pressed
    paddle2Speed = Math.max(paddle2Speed - paddleAcceleration, -maxPaddleSpeed); // Accelerate up
  } else if (keysPressed['ArrowDown']) { // If 'ArrowDown' key is pressed
    paddle2Speed = Math.min(paddle2Speed + paddleAcceleration, maxPaddleSpeed); // Accelerate down
  } else { // No key pressed for paddle 2
    if (paddle2Speed > 0) {
      paddle2Speed = Math.max(paddle2Speed - paddleDeceleration, 0); // Decelerate
    } else if (paddle2Speed < 0) {
      paddle2Speed = Math.min(paddle2Speed + paddleDeceleration, 0); // Decelerate
    }
  }

  paddle2Y += paddle2Speed; // Update the vertical position of paddle 2

  // Ensure paddle 2 stays within game boundaries
  if (paddle2Y < 0) {
    paddle2Y = 0;
  }
  if (paddle2Y > gameHeight - paddle2.clientHeight) {
    paddle2Y = gameHeight - paddle2.clientHeight;
  }
  paddle2.style.top = paddle2Y + 'px'; // Update the paddle position on screen
}

// Move the ball and handle collisions
function moveBall() {
  ballX += ballSpeedX; // Update the horizontal position of the ball
  ballY += ballSpeedY; // Update the vertical position of the ball

  // Wall collision detection
  if (ballY >= gameHeight - ball.clientHeight || ballY <= 0) {
    ballSpeedY = -ballSpeedY; // Reverse vertical direction
    playSound(wallSound); // Play wall hit sound
  }

  // Paddle 1 collision detection
  if (
    ballX <= paddle1.clientWidth && // Check if ball is at paddle 1
    ballY >= paddle1Y && // Check if ball is within paddle 1's vertical range
    ballY <= paddle1Y + paddle1.clientHeight
  ) {
    ballSpeedX = -ballSpeedX; // Reverse horizontal direction
    playSound(paddleSound); // Play paddle hit sound
  }

  // Paddle 2 collision detection
  if (
    ballX >= gameWidth - paddle2.clientWidth - ball.clientWidth && // Check if ball is at paddle 2
    ballY >= paddle2Y && // Check if ball is within paddle 2's vertical range
    ballY <= paddle2Y + paddle2.clientHeight
  ) {
    ballSpeedX = -ballSpeedX; // Reverse horizontal direction
    playSound(paddleSound); // Play paddle hit sound
  }

  // Out of game area collision detection
  if (ballX <= 0) { // If ball goes past the left boundary
    player2Score++; // Increment player 2's score
    playSound(lossSound); // Play loss sound
    updateScoreboard(); // Update the scoreboard
    resetBall(); // Reset the ball position
    pauseGame(); // Pause the game
  } else if (ballX >= gameWidth - ball.clientWidth) { // If ball goes past the right boundary
    player1Score++; // Increment player 1's score
    playSound(lossSound); // Play loss sound
    updateScoreboard(); // Update the scoreboard
    resetBall(); // Reset the ball position
    pauseGame(); // Pause the game
  }

  // Update the ball's position on the screen
  ball.style.left = ballX + 'px';
  ball.style.top = ballY + 'px';
}

// Update the scoreboard display
function updateScoreboard() {
  player1ScoreElement.textContent = player1Score; // Update player 1's score
  player2ScoreElement.textContent = player2Score; // Update player 2's score
}

// Reset the ball to the center and set a new random direction
function resetBall() {
  ballX = gameWidth / 2 - ball.clientWidth / 2; // Center the ball horizontally
  ballY = gameHeight / 2 - ball.clientHeight / 2; // Center the ball vertically
  ballSpeedX = Math.random() > 0.5 ? 2 : -2; // Randomize horizontal direction
  ballSpeedY = Math.random() > 0.5 ? 2 : -2; // Randomize vertical direction
}

// Pause the game and wait for a new start event
function pauseGame() {
  gameRunning = false; // Set gameRunning to false to pause the game
  document.addEventListener('keydown', startGame); // Re-enable the start game listener
}

// Play the specified sound effect
function playSound(sound) {
  sound.currentTime = 0; // Reset sound to the beginning
  sound.play(); // Play the sound
}
