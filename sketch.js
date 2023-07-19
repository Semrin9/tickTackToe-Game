const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let options = ["X", "", "", "", "", "", "", "", ""];
let currentPlayer = "O";
let running = false;

initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");

    if(options[cellIndex] != "" || !running) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();

    if (currentPlayer == "X") {
        let random = Math.floor(Math.random() * 9);
        if(options[random] == "" && running) {
            updateCell(cells[random], random);
            checkWinner();
        }
        else {
            while(options[random] != "" && running) {
                let random  = Math.floor(Math.random() * 9);
                if(options[random] == "") {
                    updateCell(cells[random], random);
                    checkWinner();
                    break;
                }
            }
        }
    }
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer() {
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];     // [0, 1, 2] -> [3, 4, 5] -> [6, 7, 8]....
        const cellA = options[condition[0]];    // options[0] -> options[3] -> options[6]....
        const cellB = options[condition[1]];    // options[1] -> options[4] -> options[7]....
        const cellC = options[condition[2]];    // options[2] -> options[5] -> options[8]....

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }

        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }

    if(roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
    }

    else if(!options.includes("")) {
        statusText.textContent = `Draw!`;
        running = false;
    }

    else {
        changePlayer();
    }
}

function restartGame() {
    currentPlayer = "O";
    options = ["X", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    for (let i = 1; i < cells.length; i++) {
        cells[i].textContent = ""
    }
    // cells.forEach(cell => cell.textContent = "");
    running = true;
}