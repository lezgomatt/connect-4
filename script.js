"use strict";

const ColorPink = "pink";
const ColorCyan = "cyan";

class Game {
    constructor(gridElem, numRows, numCols, numToWin, firstColor) {
        this.numRows = numRows;
        this.numCols = numCols;
        this.numToWin = numToWin;

        // row direction: bottom to top
        // column direction: left to right
        this.grid = new Array(numRows * numCols).fill(null);

        this.gameOver = false;
        this.turn = firstColor;

        this.gridElem = gridElem;
        this.initDom();
    }

    initDom() {
        this.gridElem.classList.add(`turn-${this.turn}`);

        for (let c = 0; c < this.numCols; c++) {
            let col = document.createElement("div");
            col.classList.add("col");
            col.addEventListener("click", () => this.drop(c));
            this.gridElem.appendChild(col);

            for (let r = this.numRows - 1; r >= 0; r--) {
                let circle = document.createElement("div");
                circle.classList.add("circle", `r${r}c${c}`);
                col.appendChild(circle);
            }

            this.getCircle(0, c).classList.add("candidate");
        }
    }

    inBounds(row, col) {
        return (0 <= row && row < this.numRows) && (0 <= col && col < this.numCols);
    }

    checkBounds(row, col) {
        if (!this.inBounds(row, col)) {
            throw new Error(`Out of bounds: (${row}, ${col})`);
        }
    }

    getCircle(row, col) {
        this.checkBounds(row, col);

        return this.gridElem.querySelector(`.r${row}c${col}`);
    }

    getColor(row, col) {
        this.checkBounds(row, col);

        return this.grid[row * this.numCols + col];
    }

    setColor(row, col, color) {
        this.checkBounds(row, col);

        this.grid[row * this.numCols + col] = color;
    }

    drop(col) {
        if (this.gameOver || this.getColor(this.numRows - 1, col) != null) {
            return;
        }
    
        let row = 0;
        while (this.getColor(row, col) != null) {
            row++;
        }

        this.setColor(row, col, this.turn);
        let circle = this.getCircle(row, col);
        circle.classList.add(this.turn);
        circle.classList.remove("candidate");

        this.checkWin(row, col);
        if (this.gameOver) {
            this.gridElem.classList.add("game-over");
            this.gridElem.classList.remove(`turn-${this.turn}`);

            for (let candidate of this.gridElem.querySelectorAll(".candidate")) {
                candidate.classList.remove("candidate");
            }

            return;
        }

        if (this.inBounds(row + 1, col)) {
            this.getCircle(row + 1, col).classList.add("candidate");
        }

        this.gridElem.classList.remove(`turn-${this.turn}`);
        this.turn = this.turn === ColorPink ? ColorCyan : ColorPink;
        this.gridElem.classList.add(`turn-${this.turn}`);
    }

    checkWin(row, col) {
        let start, end;
    
        // horizontal
        for (start = col; start >= 0 && this.getColor(row, start) === this.turn; start--);
        start++;
        for (end = col; end < this.numCols && this.getColor(row, end) === this.turn; end++);
        end--;
    
        if (end - start + 1 >= this.numToWin) {
            this.gameOver = true;

            for (let i = start; i <= end; i++) {
                this.getCircle(row, i).classList.add("win");
            }
        }
    
        // vertical
        for (start = row; start >= 0 && this.getColor(start, col) === this.turn; start--);
        start++;
        for (end = row; end < this.numRows && this.getColor(end, col) === this.turn; end++);
        end--;
    
        if (end - start + 1 >= this.numToWin) {
            this.gameOver = true;

            for (let i = start; i <= end; i++) {
                this.getCircle(i, col).classList.add("win");
            }
        }
    
        // rising diagonal
        for (start = 0; Math.min(row + start, col + start) >= 0 && this.getColor(row + start, col + start) === this.turn; start--);
        start++;
        for (end = 0; Math.max(row + end, col + end) < Math.min(this.numRows, this.numCols) && this.getColor(row + end, col + end) === this.turn; end++);
        end--;
    
        if (end - start + 1 >= this.numToWin) {
            this.gameOver = true;

            for (let i = start; i <= end; i++) {
                this.getCircle(row + i, col + i).classList.add("win");
            }
        }
    
        // falling diagonal
        for (start = 0; (row + start) >= 0 && (col - start) < this.numCols && this.getColor(row + start, col - start) === this.turn; start--);
        start++;
        for (end = 0; (col - end) >= 0 && (row + end) < this.numRows && this.getColor(row + end, col - end) === this.turn; end++);
        end--;
    
        if (end - start + 1 >= this.numToWin) {
            this.gameOver = true;

            for (let i = start; i <= end; i++) {
                this.getCircle(row + i, col - i).classList.add("win");
            }
        }
    }    
}

let grid = document.querySelector(".grid");
new Game(grid, 6, 7, 4, ColorPink);
