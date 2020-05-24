'use strict'
const MINE = '💣';
const FLAG = '🚩';
const NORMAL = "😃";
const HURT = "🤯";
const DEAD = "😵";
const WIN = "🤩";
const MINE_BLOWN = "💥";
const LIFE = "💛";
const HINT = "💡";

var gBoard;
var gNextId = 1;
var gTimerInterval;

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    livesLeft: 1,
    safeClicksAvailable: 3,
    hintsAvailable: 3,
    hintModeOn: false
};

function init() {
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard);
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = gGame.secsPassed;
    var elRestart = document.querySelector('.restart');
    elRestart.innerText = `${NORMAL}`;
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
    return board;
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

function renderBoard(board) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = ' ';
            var className = 'cell';
            var idName = 'cell' + i + '-' + j;
            strHTML += '<td onclick="cellClicked(this)" oncontextmenu="cellMarked(this); return false" class="' + className + '" id="' + idName + '"> ' + cell + ' </td>';
        };
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
    var elLives = document.querySelector(".lives");
    elLives.innerText = `${LIFE}`;
    var elHints = document.querySelector(".hints-container")
    elHints.innerText=`${HINT + HINT + HINT}`
}

function renderLevel(rowColLength, mines, lives) {
    clearInterval(gTimerInterval);
    gGame.secsPassed = 0;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.livesLeft = 0;
    gGame.safeClicksAvailable = 3;
    gGame.hintsAvailable = 3;
    var elRestart = document.querySelector('.restart');
    elRestart.innerText = `${NORMAL}`;
    gGame.isOn = false;
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = '0.00';
    gLevel.SIZE = rowColLength;
    gLevel.MINES = mines;
    gGame.livesLeft = lives;
    var elSafe = document.querySelector(".options")
    elSafe.innerText =  `Safe Click\n (${gGame.safeClicksAvailable} Available)`
    var elHint = document.querySelector(".hint")
    elHint.innerText = `Hint\n (${gGame.hintsAvailable} Available)`
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard);
    var elLives = document.querySelector(".lives");
    if (lives === 1) elLives.innerText = `${LIFE}`;
    if (lives === 2) elLives.innerText = `${LIFE + LIFE}`;
    if (lives === 3) elLives.innerText = `${LIFE + LIFE + LIFE}`;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) continue;
            var minesArouned = 0;
            minesArouned = countMinesAround(board, i, j);
            board[i][j].minesAroundCount = minesArouned;
        }
    }
};

function countMinesAround(mat, rowIdx, colIdx) {
    var minesAroundCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var cell = mat[i][j];
            if (cell.isMine === true) minesAroundCount++;
        }
    }
    return minesAroundCount;
};

function cellClicked(elCell) {
    if (gGame.markedCount === 0 && gGame.shownCount === 0 && gGame.isOn === false) {
        startTimer(Date.now());
        gGame.isOn;
    }
    if (gGame.shownCount === 0) {
        for (var i = 0; i < gLevel.MINES; i++) {
            var randomIdxI = getRandomInt(0, gLevel.SIZE - 1);
            var randomIdxJ = getRandomInt(0, gLevel.SIZE - 1);
            for (var k = 0; k < gBoard.length; k++) {
                for (var l = 0; l < gBoard[0].length; l++) {
                    if (elCell.id === 'cell' + randomIdxI + '-' + randomIdxJ) i++
                    else { gBoard[randomIdxI][randomIdxJ].isMine = true; }
                }
            }
        }
        for (var i = 0; i < gLevel.SIZE; i++) {
            for (var j = 0; j < gLevel.SIZE; j++) {
                gBoard[i][j].minesAroundCount = setMinesNegsCount(gBoard)
            };
        }
    }
    if (gGame.isOn === false) return;
    if (gGame.hintModeOn === true) {
        showHint(elCell);
        return
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var curCell = gBoard[i][j];
            if (curCell.isMarked) continue;
            if (curCell.isShown) continue;
            if (elCell.id === 'cell' + i + '-' + j) {
                curCell.isShown = true;
                gGame.shownCount++;
                elCell.classList.add("clicked");
                if (curCell.isMine) {
                    curCell.isShown = true;
                    curCell.isMine = false;
                    gGame.livesLeft--;
                    elCell.innerText = `${MINE_BLOWN}`;
                    var elRestart = document.querySelector('.restart');
                    elRestart.innerText = `${HURT}`;
                    var elLives = document.querySelector(".lives");
                    if (gGame.livesLeft === 0) elLives.innerText = '';
                    if (gGame.livesLeft === 1) elLives.innerText = `${LIFE}`;
                    if (gGame.livesLeft === 2) elLives.innerText = `${LIFE + LIFE}`;

                }
                else if (curCell.minesAroundCount > 0) {
                    elCell.innerText = curCell.minesAroundCount;
                } else {
                    expandShown(gBoard, elCell, i, j);
                }
            }
        }
    }
    checkGameOver();
};

function cellMarked(elCell) {
    if (gGame.markedCount === 0 && gGame.shownCount === 0 && gGame.isOn === false) {
        startTimer(Date.now())
        gGame.isOn;
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var curCell = gBoard[i][j];
            if (elCell.id === 'cell' + i + '-' + j) {
                if (elCell.classList.contains("clicked")) break;
                if (curCell.isMarked) {
                    curCell.isMarked = false;
                    elCell.innerText = " ";
                    gGame.markedCount--;
                } else if (gGame.markedCount === gLevel.MINES) {
                    elCell.classList.add("impossible")
                    setTimeout(function () { elCell.classList.remove("impossible") }, 500)
                } else {
                    curCell.isMarked = true;
                    gGame.markedCount++
                    elCell.innerText = FLAG;
                }
            }
        }
    } checkGameOver();
};

function startTimer(startTime) {
    clearInterval(gTimerInterval);
    gTimerInterval = setInterval(function () {
        gGame.secsPassed = Date.now() - startTime;
        var elTimer = document.querySelector('.timer');
        elTimer.innerText = (gGame.secsPassed / 100).toFixed(2);
    }, 100);
    gGame.isOn = true;
};

function checkGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var curCell = gBoard[i][j];
            var elRestart = document.querySelector('.restart');
            if (gGame.livesLeft === 0) {
                elRestart.innerText = `${DEAD}`;
                gGame.isOn = false;
                clearInterval(gTimerInterval);
                if (curCell.isMine) renderCell(i, j, `${MINE}`);
            }
            if (gGame.shownCount + gGame.markedCount === Math.pow(gLevel.SIZE, 2)) {
                elRestart.innerText = `${WIN}`;
                gGame.isOn = false;
                clearInterval(gTimerInterval);
            }
        }
    }
};

function expandShown(board, elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var curCell = gBoard[i][j];
            var elCell = document.querySelector(`#cell${i}-${j}`);
            if (curCell.isMine === false) {
                cellClicked(elCell);
            }
        }
    }
};

function restart() {
    if (gLevel.SIZE === 4) renderLevel(4, 2);
    if (gLevel.SIZE === 8) renderLevel(8, 12);
    if (gLevel.SIZE === 12) renderLevel(12, 30);
};

function showSafeClicks() {
    var randomIdxI = getRandomInt(0, gLevel.SIZE - 1);
    var randomIdxJ = getRandomInt(0, gLevel.SIZE - 1);

    if (gBoard[randomIdxI][randomIdxJ].isMine === false &&
        gBoard[randomIdxI][randomIdxJ].isShown === false &&
        gGame.safeClicksAvailable > 0) {
        var elCell = document.querySelector(`#cell${randomIdxI}-${randomIdxJ}`);
        elCell.classList.add("clear");
        setTimeout(function () { elCell.classList.remove("clear") }, 1000);
        gGame.safeClicksAvailable--;
        var elSafe = document.querySelector(".options, safe");
        elSafe.innerText = `Safe Click\n (${gGame.safeClicksAvailable} Available)`;
    } else if (gGame.safeClicksAvailable === 0) {
        var elSafe = document.querySelector(".options, safe");
        elSafe.classList.add("impossible");
        setTimeout(function () { elSafe.classList.remove("impossible") }, 1000);
    } else {
        showSafeClicks();
    };
};

function showHint(elCell) {
    var elHint = document.querySelector(".hint");
    if (gGame.hintsAvailable > 0) {
        if (!elCell) {
            gGame.hintModeOn = true;
            return;
        }
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (elCell.id === 'cell' + i + '-' + j) {
                    for (var k = i - 1; k <= i + 1; k++) {
                        if (k < 0 || k > gBoard.length - 1) continue;
                        for (var l = j - 1; l <= j + 1; l++) {
                            if (l < 0 || l > gBoard[0].length - 1) continue;
                            var curCell = gBoard[k][l];
                            var elNegCell = document.querySelector(`#cell${k}-${l}`);
                            if (curCell.isMine === true && curCell.isShown === false && curCell.isMarked === false) {
                                elNegCell.innerText = `${MINE}`;
                                // setTimeout(function () { elNegCell.innerText = " " }, 1000)
                            };
                            if (curCell.isMine === false && curCell.isShown === false && curCell.isMarked === false) {
                                elNegCell.innerText = `${curCell.minesAroundCount}`;
                                // setTimeout(function () { elNegCell.innerText = " " }, 1000)
                            };
                        } setTimeout(function () {
                            for (var i = 0; i < gBoard.length; i++) {
                                for (var j = 0; j < gBoard[0].length; j++) {
                                    var curCell = gBoard[i][j];
                                    var elCell = document.querySelector(`#cell${i}-${j}`);
                                    if (curCell.isShown === false && curCell.isMarked === false) elCell.innerText = " "
                                };
                            };
                        }, 1000);
                    };
                };
            };
        };
        gGame.hintsAvailable--;
        elHint.innerText = `Hint\n (${gGame.hintsAvailable} Available)`;
        var elHints = document.querySelector(".hints-container");
        if(gGame.hintsAvailable === 0) elHints.innerText=" ";
        if(gGame.hintsAvailable === 1) elHints.innerText=`${HINT}`;
        if(gGame.hintsAvailable === 2) elHints.innerText=`${HINT + HINT}`;
        gGame.hintModeOn = false;
    } else {
        elHint.classList.add("impossible");
        setTimeout(function () { elHint.classList.remove("impossible") }, 1000);
    };
};