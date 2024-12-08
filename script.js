const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const resetButton = document.querySelector('.reset');
const backToMenuButton = document.querySelector('.back-to-menu');
const twoPlayerButton = document.querySelector('.two-player');
const playerVsAiButton = document.querySelector('.player-vs-ai');
const gameContainer = document.querySelector('.game-container');
const gameModeContainer = document.querySelector('.game-mode');
const winSound = new Audio('ganhou.mp3');
const drawSound = new Audio('perdeu.mp3');


let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let isTwoPlayerGame = false;
let isAiTurn = false;  

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function checkWinner() {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            statusText.textContent = `Jogador ${currentPlayer} venceu!`;
            isGameActive = false;
            winSound.play();
            return;
        }
    }

    if (!gameState.includes('')) {
        statusText.textContent = 'Empate!';
        isGameActive = false;
        drawSound.play(); 
    }
}

function handleCellClick(event) {
   
    if (!isGameActive || gameState[event.target.getAttribute('data-index')] !== '' || (isAiTurn && !isTwoPlayerGame)) {
        return;
    }

    const cell = event.target;
    const index = cell.getAttribute('data-index');
    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');
    checkWinner();

    if (isGameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Vez do jogador ${currentPlayer}`;

   
        if (isTwoPlayerGame) {
            return;
        }

       
        if (currentPlayer === 'O') {
            isAiTurn = true;
            setTimeout(aiMove, 500); 
        }
    }
}

function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    statusText.textContent = `Vez do jogador ${currentPlayer}`;
    isAiTurn = false;  
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
}

function selectGameMode(mode) {
    isTwoPlayerGame = mode === 'twoPlayer';
    gameModeContainer.style.display = 'none';  
    gameContainer.style.display = 'block';  
    statusText.textContent = `Vez do jogador ${currentPlayer}`;
    gameState = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    isAiTurn = false;  
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
}

function backToMenu() {
    gameModeContainer.style.display = 'block';  
    gameContainer.style.display = 'none';  
}

function aiMove() {
    const bestMove = minimax(gameState, 0, true);
    const bestMoveIndex = bestMove.index;

    gameState[bestMoveIndex] = 'O';
    cells[bestMoveIndex].textContent = 'O';
    cells[bestMoveIndex].classList.add('taken');
    
    checkWinner();

    if (isGameActive) {
        currentPlayer = 'X';
        statusText.textContent = `Vez do jogador ${currentPlayer}`;
    }

    isAiTurn = false;  
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        'X': -10,  
        'O': 10,  
        'tie': 0   
    };

    const winner = checkGameState(board);
    if (winner !== null) {
        return { score: scores[winner] };
    }

    const availableMoves = getAvailableMoves(board);
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        let bestMove = null;
        
        for (let i = 0; i < availableMoves.length; i++) {
            const move = availableMoves[i];
            board[move] = 'O';  
            const result = minimax(board, depth + 1, false);
            board[move] = '';  
            if (result.score > bestScore) {
                bestScore = result.score;
                bestMove = { index: move, score: bestScore };
            }
        }
        return bestMove;
    } else {
        let bestScore = Infinity;
        let bestMove = null;
        
        for (let i = 0; i < availableMoves.length; i++) {
            const move = availableMoves[i];
            board[move] = 'X';  
            const result = minimax(board, depth + 1, true);
            board[move] = '';   
            if (result.score < bestScore) {
                bestScore = result.score;
                bestMove = { index: move, score: bestScore };
            }
        }
        return bestMove;
    }
}

function checkGameState(board) {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];  
        }
    }

    if (board.includes('')) {
        return null;  
    }

    return 'tie';  
}

function getAvailableMoves(board) {
    return board.map((value, index) => value === '' ? index : null).filter(val => val !== null);
}

// Eventos
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
backToMenuButton.addEventListener('click', backToMenu);
twoPlayerButton.addEventListener('click', () => selectGameMode('twoPlayer'));
playerVsAiButton.addEventListener('click', () => selectGameMode('ai'));
