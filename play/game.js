var game = document.getElementById("game");
var gameStateDisplay = document.getElementById("game-state-display");

const NUM_columnS = 3;
const NUM_ROWS = 3;
const NUM_CELLS = NUM_columnS + NUM_ROWS;

const column_CLASS_LIST = ['left', 'middle', 'right'];
const ROW_CLASS_LIST = ['top', 'center', 'bottom'];

const WIN_COMBINATIONS = [
    0b111000000,
    0b000111000,
    0b000000111,
    0b100100100,
    0b010010010,
    0b001001001,
    0b100010001,
    0b001010100
];

const BOT_MOVE_PRIORITY = [
    4,
    0,
    2,
    6,
    8,
    1,
    3,
    5,
    7
];

class TicTacToe {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.cells = [];
        this.bot;

        // create board
        this.board = document.createElement('div');
        this.board.classList.add('board');
        this.gameOver = false;
        this.playerTurn = 1;

        for(let row = 0; row < NUM_ROWS; row++) {
            let rowClass = ROW_CLASS_LIST[row];
            
            for(let column = 0; column < NUM_columnS; column++) {
                let columnClass = column_CLASS_LIST[column];

                let nextCell = document.createElement('div');
                nextCell.setAttribute('class', `cell ${rowClass} ${columnClass}`);
                nextCell.setAttribute('data-row', row);
                nextCell.setAttribute('data-column', column);
                let cellIndex = this.cells.length;
            
                nextCell.addEventListener('click', () => {
                    this.cellClick(cellIndex);
                });

                this.board.appendChild(nextCell);

                this.cells[this.cells.length] = nextCell;
            }
            
            this.board.appendChild(document.createElement('br'));
        }

        this.parentElement.appendChild(this.board);
    }// constructor(parentElement)

    getCurrentPlayerDocClass() {
        if(this.playerTurn == 1) {
            return 'marked-x';
        }
        else if(this.playerTurn == 2) {
            return 'marked-o';
        }
        
        return '';
    }

    getBinary(playerDocClass) {
        var positions = 0;
        for(let cellIndex in this.cells) {
            if(this.cells[cellIndex].classList.contains(playerDocClass)) {
                positions += Math.pow(2, cellIndex);
            }
        }
        return positions;
    }

    static checkBinaryWin(binary) {
        for(let win of WIN_COMBINATIONS) {
            if((binary & win) == win) {
                return true;
            }
        }

        return false;
    }

    checkWin(playerDocClass) {
        return TicTacToe.checkBinaryWin(this.getBinary(playerDocClass));
    }

    cellIsOpen(id) {
        if(!(this.cells[id].classList.contains('marked-x') || this.cells[id].classList.contains('marked-o'))) {
            return true;
        }
        return false;
    }

    checkOpenCells() {
        for(let cellIndex in this.cells) {
            if(this.cellIsOpen(cellIndex)) {
                return true;
            }
        }

        return false;
    }

    endGame() {
        this.gameOver = true;
        this.playerTurn = 0;
        this.parentElement.firstElementChild.classList.add('game-over');
    }

    checkGameOver() {
        if(this.checkWin('marked-x')) {
            this.parentElement.classList.add('marked-x');
            this.endGame();
        }
        else if(this.checkWin('marked-o')) {
            this.parentElement.classList.add('marked-o');
            this.endGame();
        }
        else if(!this.checkOpenCells()) {
            this.parentElement.classList.add('tie');
            this.endGame();
        }
    }

    nextTurn() {
        this.checkGameOver();

        if(this.playerTurn == 1) {
            this.playerTurn = 2;
        }
        else if(this.playerTurn == 2){
            this.playerTurn = 1;
        }
        else {
            this.playerTurn = 0;
            return;
        }
        
        if(this.bot && this.bot.player && this.bot.player == this.playerTurn) {
            this.cellClick(this.bot.getBestMove());
        }
    }

    cellClick(cellIndex) {
        if(this.playerTurn == 0) {
            return;
        }
        if(cellIndex < 0) {
            return;
        }

        if(this.cells[cellIndex].classList.contains('marked-x') || this.cells[cellIndex].classList.contains('marked-o')) {
            return;
        }

        if(this.playerTurn == 1) {
            this.cells[cellIndex].classList.add('marked-x');
            //console.log('Player 1 moved to ' + cellIndex);
        }
        else if(this.playerTurn == 2){
            this.cells[cellIndex].classList.add('marked-o');
            //console.log('Player 2 moved to ' + cellIndex);
        }

        this.nextTurn();
    }// cellClick(game, x, y)

    reset() {
        this.parentElement.classList.remove('marked-x');
        this.parentElement.classList.remove('marked-o');
        this.parentElement.classList.remove('tie');

        this.bot = undefined;
        this.gameOver = false;
        this.playerTurn = 1;

        this.parentElement.firstElementChild.classList.remove('game-over');

        for(let cell of this.cells) {
            cell.classList.remove('marked-x');
            cell.classList.remove('marked-o');
        }
    }

}// class TicTacToe

class TicTacBot {
    constructor(game, player) {
        this.game = game;
        this.player = player;

        if(this.player == this.game.playerTurn) {
            this.game.cellClick(this.getBestMove());
        }
    }// constructor(parentElement)

    getPossibleMoves(playerDocClass) {
        var possibleMoves = [];
        for(let move of BOT_MOVE_PRIORITY) {
            if(this.game.cellIsOpen(move)) {
                possibleMoves[possibleMoves.length] = move;
            }
        }

        return possibleMoves;
    }

    getNumPossibleWin(playerDocClass) {
        var numWins = 0;
        for(let cellIndex in this.game.cells) {
            if(this.game.cellIsOpen(cellIndex)) {
                let cellBinary = this.game.getBinary(playerDocClass) + Math.pow(2, cellIndex);
                if(TicTacToe.checkBinaryWin(cellBinary)) {
                    numWins++;
                }
            }
        }
        return numWins;
    }

    checkWinMoves(playerDocClass) {
        for(let cellIndex of this.getPossibleMoves(playerDocClass)) {
            if(this.game.cellIsOpen(cellIndex)) {
                let cellBinary = this.game.getBinary(playerDocClass) + Math.pow(2, cellIndex);
                if(TicTacToe.checkBinaryWin(cellBinary)) {
                    return parseInt(cellIndex);
                }
            }
        }
        return -1;
    }

    getAdjustedBotPriority(playerDocClass, otherDocClass) {
        let bestMove = this.getPossibleMoves(playerDocClass)[0];
        let bestMoveValue = 0;

        for(let firstMove of this.getPossibleMoves(playerDocClass)) {
            let moveValue = 0;
            for(let nextMove of this.getPossibleMoves(playerDocClass)) {
                if(nextMove != firstMove) {
                    let cellBinary = this.game.getBinary(playerDocClass) + Math.pow(2, firstMove) + Math.pow(2, nextMove);
                    let overlapBinary = cellBinary & this.game.getBinary(otherDocClass);
                    if(overlapBinary == 0 && TicTacToe.checkBinaryWin(cellBinary)) {
                        moveValue++;
                    }
                }
            }

            if(moveValue > bestMoveValue) {
                bestMove = firstMove;
                bestMoveValue = moveValue;
            }
        }

        if(bestMoveValue > 1) {
            return bestMove;
        }
        else {
            return -1;
        }
    }

    getBestMove() {
        let botTurn = 'marked-o';
        let otherTurn = 'marked-x';

        // is game active
        if(this.game.playerTurn == 1) {
            botTurn = 'marked-x';
            otherTurn = 'marked-o';
        }
        else if(this.game.playerTurn == 2) {
            botTurn = 'marked-o';
            otherTurn = 'marked-x';
        }

        // check for wins
        if(this.checkWinMoves(botTurn) >= 0) {
            return this.checkWinMoves(botTurn);
        }

        // check for blocks
        if(this.checkWinMoves(otherTurn) >= 0) {
            return this.checkWinMoves(otherTurn);
        }

        // check if there is a play that the opponent can make that will guarantee they win
        if(this.getAdjustedBotPriority(otherTurn) >= 0) {
            return this.getAdjustedBotPriority(otherTurn);
        }

        // check if there is a play that will guarantee a win next turn
        if(this.getAdjustedBotPriority(botTurn) >= 0) {
            return this.getAdjustedBotPriority(botTurn);
        }

        // check for backup move
        if(this.getPossibleMoves(botTurn).length > 0) {
            return this.getPossibleMoves(botTurn)[0];
        }

        return -1;
    }
}// class TicTacBot

var gameBoard = new TicTacToe(game);

function newGame(botPlayer) {
    console.log('new game');
    gameBoard.reset();
    if(botPlayer == 1) {
        gameBoard.bot = new TicTacBot(gameBoard, 1);
    }
    else if(botPlayer == 2) {
        gameBoard.bot = new TicTacBot(gameBoard, 2);
    }
}