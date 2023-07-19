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

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

initializeGame();
aiTurn();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `You are X`;
    running = true;
}

function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if (options[cellIndex] !== "" || !running) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
    aiTurn();
}

function aiTurn() {
    const level = checkLevel();
    if (level == "easy") {
        if (currentPlayer === "O") {
            let random = Math.floor(Math.random() * 9);
            while (options[random] !== "" && running) {
                random = Math.floor(Math.random() * 9);
            }
            updateCell(cells[random], random);
            checkWinner();
        }
    } else if (level === "medium") {
        if (currentPlayer === "O") {
            const winningMove = getWinningMove("O");
            const blockingMove = getWinningMove("X");

            if (winningMove !== -1 && running) {
                updateCell(cells[winningMove], winningMove);
                checkWinner();
            } else if (blockingMove !== -1 && running) {
                updateCell(cells[blockingMove], blockingMove);
                checkWinner();
            } else {
                let availableMoves = getAvailableMoves();
                let randomMove = getRandomMove(availableMoves);

                if (randomMove !== -1 && running) {
                    updateCell(cells[randomMove], randomMove);
                    checkWinner();
                }
            }
        }
    } else if (level === "hard") {
        if (currentPlayer === "O") {
            let bestScore = -Infinity;
            let bestMove;

            for (let i = 0; i < options.length; i++) {
                if (options[i] === "") {
                    options[i] = currentPlayer;
                    const score = minimax(options, 0, false);
                    options[i] = ""; // Undo the move

                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }

            if (bestMove !== undefined && running) {
                updateCell(cells[bestMove], bestMove);
                checkWinner();
            }
        }
    }
}

function getWinningMove(player) {
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const [cellA, cellB, cellC] = condition.map(index => options[index]);

        if (cellA === player && cellB === player && cellC === "") {
            return condition[2];
        } else if (cellA === player && cellB === "" && cellC === player) {
            return condition[1];
        } else if (cellA === "" && cellB === player && cellC === player) {
            return condition[0];
        }
    }

    return -1;
}

function getAvailableMoves() {
    const availableMoves = [];

    for (let i = 0; i < options.length; i++) {
        if (options[i] === "") {
            availableMoves.push(i);
        }
    }

    return availableMoves;
}

function getRandomMove(moves) {
    if (moves.length === 0) {
        return -1;
    }

    const randomIndex = Math.floor(Math.random() * moves.length);
    return moves[randomIndex];
}

function minimax(board, depth, isMaximizingPlayer) {
    let result = checkResult();

    if (result !== null) {
        return result;
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                const score = minimax(board, depth + 1, false);
                board[i] = ""; // Undo the move
                bestScore = Math.max(score, bestScore);
            }
        }

        return bestScore;
    } else {
        let bestScore = Infinity;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = ""; // Undo the move
                bestScore = Math.min(score, bestScore);
            }
        }

        return bestScore;
    }
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer() {
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
}

function checkResult() {
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const [cellA, cellB, cellC] = condition.map(index => options[index]);

        if (cellA === "" || cellB === "" || cellC === "") {
            continue;
        }

        if (cellA === cellB && cellB === cellC) {
            if (cellA === "X") {
                return -1; // X wins
            } else {
                return 1; // O wins
            }
        }
    }

    if (!options.includes("")) {
        return 0; // Draw
    }

    return null; // Game still in progress
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i]; // [0, 1, 2] -> [3, 4, 5] -> [6, 7, 8]....
        const [cellA, cellB, cellC] = condition.map(index => options[index]);


        if (cellA == "" || cellB == "" || cellC == "") {
            continue;
        }

        if (cellA == cellB && cellB == cellC) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
    } else if (!options.includes("")) {
        statusText.textContent = `Draw!`;
        running = false;
    } else {
        changePlayer();
    }
}

function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `You are X`;
    cells.forEach(cell => cell.textContent = "");
    aiTurn();
    running = true;
}

function checkLevel() {
    const value = document.getElementsByName("level");
    const selectValue = Array.from(value).find(radio => radio.checked);
    return selectValue.value;
}