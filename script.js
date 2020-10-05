"use strict";

const ColorPink = "pink";
const ColorCyan = "cyan";

function flipColor(color) {
    return color === ColorPink ? ColorCyan : ColorPink;
}

class Game {
    constructor(gameElem, numRows, numCols, numToWin, firstColor) {
        this.numRows = numRows;
        this.numCols = numCols;
        this.numToWin = numToWin;

        // row direction: bottom to top
        // column direction: left to right
        this.grid = new Array(numRows * numCols).fill(null);

        this.gameOver = false;
        this.turn = firstColor;

        this.gridElem = gameElem.querySelector(".grid");
        this.messagesElem = gameElem.querySelector(".messages");
        this.initDom();

        this.messagesElem.querySelector(".play-again")
            .addEventListener("click", () => this.playAgain());
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

            this.messagesElem.classList.add(`winner-${this.turn}`);

            return;
        }

        if (this.inBounds(row + 1, col)) {
            this.getCircle(row + 1, col).classList.add("candidate");
        }

        if (this.gridElem.querySelector(".candidate") == null) {
            this.gameOver = true;

            this.gridElem.classList.remove(`turn-${this.turn}`);
            this.messagesElem.classList.add("winner-draw");

            return;
        }

        this.gridElem.classList.remove(`turn-${this.turn}`);
        this.turn = flipColor(this.turn);
        this.gridElem.classList.add(`turn-${this.turn}`);
    }

    checkWin(row, col) {
        const steps = {
            horizontal: { row: 0, col: 1 },
            vertical: { row: 1, col: 0 },
            risingDiagonal: { row: 1, col: 1 },
            fallingDiagonal: { row: 1, col: -1 },
        };

        for (let dir in steps) {
            let step = steps[dir];

            let countFw = this.count(row, col, step, this.turn);
            let countBw = this.count(row, col, { row: -step.row, col: -step.col }, this.turn);
            let countTotal = countFw + countBw - 1;

            if (countTotal >= this.numToWin) {
                this.gameOver = true;

                let r = row + countBw * -step.row;
                let c = col + countBw * -step.col;

                for (let i = 0; i < countTotal; i++) {
                    r += step.row;
                    c += step.col;
                    this.getCircle(r, c).classList.add("win");
                }
            }
        }
    }

    count(startRow, startCol, step, color) {
        let count = 0;

        let r = startRow;
        let c = startCol;

        while (this.inBounds(r, c) && this.getColor(r, c) === color) {
            count++;
            r += step.row;
            c += step.col;
        }

        return count;
    }

    playAgain() {
        this.grid = new Array(this.numRows * this.numCols).fill(null);
        this.gameOver = false;
        this.turn = flipColor(this.turn);

        this.gridElem.classList.remove("turn-pink", "turn-cyan", "game-over");
        this.messagesElem.classList.remove("winner-pink", "winner-cyan", "winner-draw");

        while (this.gridElem.firstChild != null) {
            this.gridElem.removeChild(this.gridElem.firstChild);
        }

        this.initDom();
    }
}

let gameElem = document.querySelector(".game");
new Game(gameElem, 6, 7, 4, Math.random() < 0.5 ? ColorPink : ColorCyan);
