var game = document.getElementById("game");
const NUM_COLLUMS = 3;
const NUM_ROWS = 3;
const NUM_CELLS = NUM_COLLUMS + NUM_ROWS;

const COLLUM_CLASS_LIST = ['left', 'middle', 'right'];
const ROW_CLASS_LIST = ['top', 'center', 'bottom'];

class TicTacToe {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.cells = [[]];

        // create board
        this.board = document.createElement('div');
        this.board.classList.add('board');

        for(let row = 0; row < NUM_ROWS; row++) {
            let rowClass = ROW_CLASS_LIST[row];
            this.cells[row] = [];
            
            for(let collum = 0; collum < NUM_COLLUMS; collum++) {
                let collumClass = COLLUM_CLASS_LIST[collum];

                let nextCell = document.createElement('div');
                nextCell.setAttribute('class', `cell ${rowClass} ${collumClass}`);
                nextCell.setAttribute('data-row', row);
                nextCell.setAttribute('data-collum', collum);
            
                nextCell.addEventListener('click', () => {
                    this.cells;
                });

                this.board.appendChild(nextCell);

                this.cells[row][collum] = nextCell;
            }
            
            this.board.appendChild(document.createElement('br'));
        }

        this.parentElement.appendChild(this.board);
    }// constructor(parentElement)

    static cellClick(game, x, y) {



    }// cellClick(game, x, y)
}// class TicTacToe

var gameBoard = new TicTacToe(game);