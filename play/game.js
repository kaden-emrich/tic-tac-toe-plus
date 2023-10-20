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

class TicTacToe {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.cells = [];

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
        }
    }

    cellClick(cellIndex) {
        if(this.playerTurn == 0) {
            return;
        }

        if(this.cells[cellIndex].classList.contains('marked-x') || this.cells[cellIndex].classList.contains('marked-o')) {
            return;
        }

        if(this.playerTurn == 1) {
            this.cells[cellIndex].classList.add('marked-x');
        }
        else if(this.playerTurn == 2){
            this.cells[cellIndex].classList.add('marked-o');
        }

        this.nextTurn();
    }// cellClick(game, x, y)

}// class TicTacToe

class TicTacBot {
    constructor(game) {
        this.game = game;
    }// constructor(parentElement)

    checkWinMoves(playerDocClass) {
        for(let cellIndex in this.game.cells) {
            if(this.game.cellIsOpen(cellIndex)) {
                let cellBinary = this.game.getBinary(playerDocClass) + Math.pow(2, cellIndex);
                if(TicTacToe.checkBinaryWin(cellBinary)) {
                    return parseInt(cellIndex);
                }
            }
        }
        return -1;
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
        if(this.checkWinMoves(botTurn)) {

        }

        // check for blocks
        if(this.checkWinMoves(otherTurn)) {
            return this.checkWinMoves(otherTurn);
        }

        // 
        

        
    }
    
}// class TicTacBot

var gameBoard = new TicTacToe(game);
var gameBot = new TicTacBot(gameBoard);