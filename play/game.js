var game = document.getElementById("game");
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
        this.cells = [[]];

        // create board
        this.board = document.createElement('div');
        this.board.classList.add('board');
        this.gameOver = false;
        this.playerTurn = 1;

        for(let row = 0; row < NUM_ROWS; row++) {
            let rowClass = ROW_CLASS_LIST[row];
            this.cells[row] = [];
            
            for(let column = 0; column < NUM_columnS; column++) {
                let columnClass = column_CLASS_LIST[column];

                let nextCell = document.createElement('div');
                nextCell.setAttribute('class', `cell ${rowClass} ${columnClass}`);
                nextCell.setAttribute('data-row', row);
                nextCell.setAttribute('data-column', column);
            
                nextCell.addEventListener('click', () => {
                    this.cellClick(column, row);
                });

                this.board.appendChild(nextCell);

                this.cells[row][column] = nextCell;
            }
            
            this.board.appendChild(document.createElement('br'));
        }

        this.parentElement.appendChild(this.board);
    }// constructor(parentElement)

    checkWin(playerDocClass) { //https://stackoverflow.com/questions/1056316/algorithm-for-determining-tic-tac-toe-game-over#:~:text=To%20check%20whether%20a%20player,if%20the%20two%20are%20equal.&text=eg.&text=Note%3A%20X%20%26%20W%20%3D%20W,is%20in%20a%20win%20state.
        var positions = 0;
        var index = 0;

        for(let row = 0; row < this.cells.length; row++) {
            for(let column = 0; column < this.cells[row].length; column++) {
                if(this.cells[row][column].classList.contains(playerDocClass)) {
                    positions += Math.pow(2, index);
                }
                index++;
            }
        }

        for(let win in WIN_COMBINATIONS) {
            if(positions & win == win) {
                return true;
            }
        }

        return false;
    }

    checkGameOver() {

    }

    cellClick(x, y) {
        if(this.cells[y][x].classList.contains('marked-x') || this.cells[y][x].classList.contains('marked-o')) {
            return;
        }

        if(this.playerTurn == 1) {
            this.cells[y][x].classList.add('marked-x');
            this.playerTurn = 2;
        }
        else if(this.playerTurn == 2){
            this.cells[y][x].classList.add('marked-o');
            this.playerTurn = 1;
        }
        

    }// cellClick(game, x, y)

}// class TicTacToe

var gameBoard = new TicTacToe(game);