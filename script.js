const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const modeBtn = document.getElementById('mode'); // NEW: Toggle mode button

let aiMode = false; // false = Multiplayer, true = AI Mode
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = true;

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// Handle cell click
function cellClicked() {
  const cellIndex = this.dataset.index;
  if (board[cellIndex] !== "" || !running) return;

  board[cellIndex] = currentPlayer;
  this.textContent = currentPlayer;
  checkWinner();

  // If AI mode and it's AI's turn
  if (aiMode && running && currentPlayer === "O") {
    setTimeout(aiMove, 300); // small delay for realism
  }
}

// AI Move using Minimax
function aiMove() {
  let bestScore = -Infinity;
  let move;
  
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O"; // AI is O
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  board[move] = "O";
  cells[move].textContent = "O";
  checkWinner();
}

// Minimax algorithm
function minimax(newBoard, depth, isMaximizing) {
  let result = checkWinnerAI(newBoard);
  if (result !== null) {
    const scores = { X: -1, O: 1, draw: 0 };
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Check winner for AI evaluation
function checkWinnerAI(b) {
  for (let condition of winConditions) {
    const [a, b1, c] = condition;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return b[a];
    }
  }
  if (!b.includes("")) return "draw";
  return null;
}

// Check winner for the actual game
function checkWinner() {
  let roundWon = false;
  for (let condition of winConditions) {
    const [a, b1, c] = condition;
    if (board[a] && board[a] === board[b1] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `${currentPlayer} wins!`;
    running = false;
  } else if (!board.includes("")) {
    statusText.textContent = "Draw!";
    running = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
  }
}

// Restart game
function restartGame() {
  currentPlayer = "X";
  board = ["", "", "", "", "", "", "", "", ""];
  running = true;
  statusText.textContent = `${currentPlayer}'s turn`;
  cells.forEach(cell => cell.textContent = "");
}

// Toggle between Multiplayer and AI mode
function toggleMode() {
  aiMode = !aiMode;
  restartGame();
  modeBtn.textContent = aiMode ? "Mode: AI" : "Mode: Multiplayer";
}

cells.forEach(cell => cell.addEventListener('click', cellClicked));
restartBtn.addEventListener('click', restartGame);
modeBtn.addEventListener('click', toggleMode);

statusText.textContent = `${currentPlayer}'s turn`;
modeBtn.textContent = "Mode: Multiplayer";
