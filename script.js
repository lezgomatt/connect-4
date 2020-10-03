var
    numRows = 6,
    numColumns = 7,
    winCondition = 4;

var board = document.getElementById('board');

var grid = [];
var elems = [];

var done = false;
var turn = 'pink';

for (var i = 0; i < numRows; i++) {
    grid.push([]);
    elems.push([]);
    for (var j = 0; j < numColumns; j++) {
        grid[i].push('gray');
        var e = document.createElement('div');
        e.classList.add('row' + (i + 1), 'col' + (j + 1), 'tiny', (i === 0) ? turn : 'gray', 'circle');
        elems[i].push(e);
    }
}

for (let c = 0; c < numColumns; c++) {
    let col = document.createElement('div');
    col.classList.add('col');
    board.appendChild(col);
    col.addEventListener('click', () => clicked(c));

    for (let r = numRows - 1; r >= 0; r--) {
        col.appendChild(elems[r][c]);
    }
}

function nextTurn() {
    turn = (turn === 'cyan') ? 'pink' : 'cyan';
}

function clicked(col) {
    if (done || grid[numRows - 1][col] != 'gray') {
        return;
    }

    let row = 0;
    while (grid[row][col] !== 'gray') {
        row++;
    }

    put(row, col);
    checkWin(row, col);

    if (done) {
        board.classList.add('done');
        var theTiny = document.getElementsByClassName('tiny ' + turn);
        [].slice.call(theTiny).forEach(function (e) { e.classList.remove(turn); e.classList.add('gray'); });
    } else {
        var oldTurn = turn;
        nextTurn();
        var theTiny = document.getElementsByClassName('tiny ' + oldTurn);
        [].slice.call(theTiny).forEach(function (e) { e.classList.remove(oldTurn); e.classList.add(turn); });
        if (row + 1 != numRows) {
            elems[row + 1][col].classList.remove('gray');
            elems[row + 1][col].classList.add(turn);
        }
    }
}

function checkWin(row, col) {
    var start, end;


    for (start = col; start >= 0 && grid[row][start] == turn; start--);
    start++;
    for (end = col; end < numColumns && grid[row][end] == turn; end++);
    end--;

    if (end - start + 1 >= winCondition) {
        done = true;
        for (var i = start; i <= end; i++) {
            elems[row][i].classList.add('win');
        }
    }


    for (start = row; start >= 0 && grid[start][col] == turn; start--);
    start++;
    for (end = row; end < numRows && grid[end][col] == turn; end++);
    end--;

    if (end - start + 1 >= winCondition) {
        done = true;
        for (var i = start; i <= end; i++) {
            elems[i][col].classList.add('win');
        }
    }


    for (start = 0; Math.min(row + start, col + start) >= 0 && grid[row + start][col + start] == turn; start--);
    start++;
    for (end = 0; Math.max(row + end, col + end) < Math.min(numRows, numColumns) && grid[row + end][col + end] == turn; end++);
    end--;

    if (end - start + 1 >= winCondition) {
        done = true;
        for (var i = start; i <= end; i++) {
            elems[row + i][col + i].classList.add('win');
        }
    }

    for (start = 0; (row + start) >= 0 && (col - start) < numColumns && grid[row + start][col - start] == turn; start--);
    start++;
    for (end = 0; (col - end) >= 0 && (row + end) < numRows && grid[row + end][col - end] == turn; end++);
    end--;

    if (end - start + 1 >= winCondition) {
        done = true;
        for (var i = start; i <= end; i++) {
            elems[row + i][col - i].classList.add('win');
        }
    }
}

function put(row, col) {
    grid[row][col] = turn;
    elems[row][col].classList.remove('tiny');
}
