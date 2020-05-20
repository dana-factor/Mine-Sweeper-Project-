'use strict'
const MINE = '💣';

var gBoard;
var gNextId = 1;

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

function init() {
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard);
    console.log(gBoard);
    console.table(gBoard);
}

function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = creatCell();
            board[i][j] = cell;
        }
    }
    board[2][2].isMine = true;
    board[0][3].isMine = true;
    gBoard = board;

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            gBoard[i][j].minesAroundCount = setMinesNegsCount(gBoard)
        };
    }
    return gBoard;
}

function creatCell() {
    var cell = {
        id: gNextId++,
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}

function renderBoard(mat) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = ' ';
            var className = 'cell';
            var idName = 'cell' + i + '-' + j;
            strHTML += '<td onclick="cellClicked(this)" class="' + className + '" id="' + idName + '"> ' + cell + ' </td>';
        };
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;

    // renderCell(2, 2, MINE);
    // renderCell(0, 3, MINE);
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) continue;
            var minesArouned = 0;
            minesArouned = countMinesAround(board, i, j);
            board[i][j].minesAroundCount = minesArouned;
        }
    } return minesArouned;
}

function countMinesAround(mat, rowIdx, colIdx) {
    var minesAroundCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var cell = mat[i][j];
            if (cell.isMine === true) minesAroundCount++
        }
    }
    return minesAroundCount;
}

function cellClicked(elCell) {
    console.log(elCell.id);
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var curCell = gBoard[i][j];
            if (elCell.id === 'cell' + i + '-' + j) {
                if (curCell.isMine) elCell.innerText = `${MINE}`;
                else {
                    elCell.innerText = curCell.minesAroundCount
                };
                curCell.isShown = true;
                console.log(gBoard);
            }
        }
    }
}

