const squaresElem = Array.from(document.querySelectorAll(".square"));
const turnTextElem = document.getElementById("player-turn");
const resultTextElem = document.querySelector(".result-text");
const resetBtnElem = document.getElementById("reset-button");
const playAiBtnElem = document.getElementById("play-ai");

IN_PROG = "IN_PROG";
TIE = 'TIE';

xSuperiorScores = {
    'X': 1,
    'O': -1,
    'TIE': 0
};

oSuperiorScores = {
    'X': -1,
    'O': 1,
    'TIE': 0
};

let gameEnd = false;
let emptySquares = 9;
let gameBoard = [
    ' ', ' ', ' ',
    ' ', ' ', ' ',
    ' ', ' ', ' '
];

const winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

let currentTurn = 'X';
let nextTurn = 'O';
squaresElem.forEach((square, index) => {
    square.addEventListener("click", function() {
        addMark(square, index);
    })
});

resetBtnElem.addEventListener("click", function() {
    location.reload();
});

playAiBtnElem.addEventListener("click", function() {
    let scores = currentTurn === 'X' ? xSuperiorScores : oSuperiorScores;
    playBestMove(gameBoard, currentTurn, nextTurn, scores);
    squaresElem.forEach((square, index) => {
        square.addEventListener("click", function() {
            addMark(square, index);
            playBestMove(gameBoard, currentTurn, nextTurn, scores);
        })
    });
})

function playBestMove(board, aiTurn, humanTurn, scores) {
    let maxScore = -Infinity;
    let bestMove;
    for (let i=0;i<board.length;i++) {
        if (board[i] === ' ') {
            board[i] = aiTurn;
            let score = miniMax(board, humanTurn, false, scores);
            board[i] = ' ';
            if (score > maxScore) {
                maxScore = score;
                bestMove = i;
            }
        }
    }
    addMark(squaresElem[bestMove], bestMove);
}

function evaluateBoard(board) {
    for (let i=0;i<winPatterns.length;i++) {
        if (board[winPatterns[i][0]] === ' ' || board[winPatterns[i][1]] === ' ' || board[winPatterns[i][2]] === ' ') {
            continue;
        }
        if (board[winPatterns[i][0]] === board[winPatterns[i][1]] && board[winPatterns[i][1]] === board[winPatterns[i][2]]) {
            return board[winPatterns[i][0]];
        }
    }
    if (board.includes(' ')) {
        return IN_PROG;
    }
    return 'TIE';
}

function miniMax(board, currTurn, isMaximizing, scores) {
    let result = evaluateBoard(board);
    if (result !== IN_PROG) {
        return scores[result];
    }

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i=0;i<board.length;i++) {
            if (board[i] === ' '){
                board[i] = currTurn;
                let next = currTurn === 'O' ? 'X' : 'O';
                let eval = miniMax(board, next, false, scores);
                board[i] = ' ';
                maxEval = Math.max(eval, maxEval);
            }
        }
        return maxEval;
    }

    else {
        let minEval = Infinity;
        for (let i=0;i<board.length;i++) {
            if (board[i] === ' '){
                board[i] = currTurn;
                let next = currTurn === 'O' ? 'X' : 'O';
                let eval = miniMax(board, next, true, scores);
                board[i] = ' ';
                minEval = Math.min(eval, minEval);
            }
        }
        return minEval;
    }
}



function addMark(square, index) {
    if (gameEnd || !square.classList.contains("empty")) {
        return;
    }
    square.classList.remove("empty");
    emptySquares--;
    square.innerHTML = currentTurn;
    gameBoard[index] = currentTurn;
    let currGameResult = checkWinCondition();
    if (gameEnd) {
        announceResult(currGameResult);
        return;
    }
    changeTurn();
}

function changeTurn() {
    let temp = currentTurn;
    currentTurn = nextTurn;
    nextTurn = temp;
    turnTextElem.textContent = currentTurn;
}

function checkWinCondition() {
    for (let i=0;i<winPatterns.length;i++) {
        if (gameBoard[winPatterns[i][0]] === ' ' || gameBoard[winPatterns[i][1]] === ' ' || gameBoard[winPatterns[i][2]] === ' ' ) {
            continue;
        }
        if (gameBoard[winPatterns[i][0]] === gameBoard[winPatterns[i][1]] && gameBoard[winPatterns[i][1]] === gameBoard[winPatterns[i][2]]) {
            gameEnd = true;
            return gameBoard[winPatterns[i][0]];
        }
        if (emptySquares === 0) {
            gameEnd = true;
            return TIE;
        }
    }
    return null;
}


function announceResult(gameResult) {
    if (gameResult === TIE) {
        resultTextElem.innerHTML = `It's a Tie!`
    }
    else {
        resultTextElem.innerHTML = `Player ${gameResult} Won!`;
    }
    resultTextElem.classList.remove("hidden");
}
