const board = document.getElementById("board");
const reset = document.getElementById("reset");

let clicks = 0;
let shipsFound = 0;
let gameOver = false;//took this from AI because in mine after 8 clicks it was still allowing to click on the cells and revealing the ships. So I added this variable to stop the game after 8 clicks or after finding all 5 ships.


const cells = ["ship", "water", "water", "ship",
    "water", "ship", "water", "water",
    "water", "water", "ship", "water",
    "ship", "water", "water", "water"];

function createBoard() {
    board.innerHTML = "";

    for (let i = 0; i < 16; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        const img = document.createElement("img");

        if (cells[i] === "ship") {
            img.src = "ship.jpg";
        } else {
            img.src = "water.jpg";
        }

        cell.appendChild(img);

        cell.addEventListener("click", function () {
            if (gameOver || cell.classList.contains("revealed")) {
                return;
            }

            cell.classList.add("revealed");
            img.style.display = "block";

            clicks++;

            if (cells[i] === "ship") {
                shipsFound++;
            }

            if (shipsFound === 5) {
                gameOver = true;
                alert("You Won!");
            } else if (clicks === 8) {
                gameOver = true;
                alert("You Lost!");
            }
        });

        board.appendChild(cell);
    }
}

reset.addEventListener("click", function () {
    clicks = 0;
    shipsFound = 0;
    gameOver = false;

    createBoard();
});

createBoard();//use this to load the board when the page is loaded. Otherwise, the board will be empty until the user clicks the reset button.
