let secretWord = "";
let attempts = 0;
let gameOver = false;

let board = document.getElementById("board");
let form = document.getElementById("guess-form");
let input = document.getElementById("guess-input");
let button = document.getElementById("submit-button");
let message = document.getElementById("message");

function selectRandomWord() {
  let randomNumber = Math.floor(Math.random() * words.length);
  return words[randomNumber];
}

function startGame() {
  secretWord = selectRandomWord();
  attempts = 0;
  gameOver = false;

  board.innerHTML = "";
  message.textContent = "";
  input.value = "";
  input.disabled = false;
  button.disabled = false;

  for (let i = 0; i < 30; i++) {
    let cell = document.createElement("div");
    cell.className = "cell";
    board.appendChild(cell);
  }
}

function checkGuess(guess) {
  let result = ["absent", "absent", "absent", "absent", "absent"];
  let used = [false, false, false, false, false];

  for (let i = 0; i < 5; i++) {
    if (guess[i] === secretWord[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] !== "correct") {
      for (let j = 0; j < 5; j++) {
        if (guess[i] === secretWord[j] && used[j] === false) {
          result[i] = "present";
          used[j] = true;
          break;
        }
      }
    }
  }

  return result;
}

function displayGuess(guess, result) {
  for (let i = 0; i < 5; i++) {
    let position = attempts * 5 + i;
    let cell = board.children[position];

    cell.textContent = guess[i];
    cell.className = "cell " + result[i];
  }
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  if (gameOver === true) {
    return;
  }

  let guess = input.value.toUpperCase().trim();

  if (guess.length !== 5) {
    message.textContent = "Please enter a five-letter word.";
    return;
  }

  for (let i = 0; i < 5; i++) {
    if (guess[i] < "A" || guess[i] > "Z") {
      message.textContent = "Please enter letters only.";
      return;
    }
  }

  let result = checkGuess(guess);
  displayGuess(guess, result);

  attempts++;

  if (guess === secretWord) {
    message.textContent = "Congratulations! You guessed the word!";
    gameOver = true;
  } else if (attempts === 6) {
    message.textContent = 'Game over, the word was "' + secretWord + '"';
    gameOver = true;
  } else {
    message.textContent = "Attempts remaining: " + (6 - attempts);
  }

  if (gameOver === true) {
    input.disabled = true;
    button.disabled = true;
  }

  input.value = "";
});

startGame();
