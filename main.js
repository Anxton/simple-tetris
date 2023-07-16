const timerSpan = document.getElementById("timer")
const startButton = document.getElementById("startButton")
const squares = document.querySelectorAll("#matrix square")
const matrixEl = document.getElementById("matrix")

let startDate = Date.now()
let playing = false

function makePiece(pieceName='t') {
    const pieceObject = new Object()
    pieceObject.piece = pieceName.toLowerCase() // piece.piece = 'l'
    pieceObject.orientation = 'north' // piece.orientation = 'north'
    switch (pieceName.toLowerCase()) {
        case 't':
            pieceObject.blocks = [
                [5, 0],
                [4, 1],
                [5, 1],
                [6, 1]
            ]
            break
        case 'i':
            pieceObject.blocks = [
                [3, 0],
                [4, 0],
                [5, 0],
                [6, 0],
            ]
            break
        case 'o':
            pieceObject.blocks = [
                [4,0],
                [4,1],
                [5,0],
                [5,1],
            ]
            break
        case 'l':
            pieceObject.blocks = [
                [5,0],
                [3,1],
                [4,1],
                [5,1],
            ]
            break
        case 's':
            pieceObject.blocks = [
                [5,0],
                [4,0],
                [3,1],
                [4,1],
            ]
            break
        case 'j':
            pieceObject.blocks = [
                [3,0],
                [3,1],
                [4,1],
                [5,1],
            ]
            break
        case 'z':
            pieceObject.blocks = [
                [3,0],
                [4,0],
                [4,1],
                [5,1],
            ]
            break
        default:
            throw new Error('Unknown piece: ' + pieceObject)
    }

    return pieceObject
}

let activePiece = makePiece("t")

let ticks

const matrix = [
    // sideways and flipped so it's matrix[x][y] (matrix[0],[19] on bottom)
    // should it rather be matrix[line][col] like in maths ? (matrix[19][0] would be on bottom)
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'o', 'o'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'o', 'o'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'z', 'z'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'z', 'z', 'i'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'l', 'l', 's', 'i'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'l', 's', 's', 'i'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'l', 's', '', 'i'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'j'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'j', 'j', 'j'],
]

function blockAt(x, y) {
    if (x < 0 || x > 9) throw new Error('x out of bounds: ' + x)
    if (y < 0 || y > 19) throw new Error('y out of bounds: ' + y)
    return matrix[x][y]
}

function squareAt(x, y) {
    if (x < 0 || x > 9) throw new Error('x out of bounds: ' + x)
    if (y < 0 || y > 19) throw new Error('y out of bounds: ' + y)
    return squares[x + y*10]
}

// function render() {
//     renderMatrix()
//     renderTimer()
// }

function renderMatrix() {
    // render board
    renderBoard()
    // render activePiece
    renderActivePiece()
}
function renderBoard() {
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[0].length; y++) {
            squareAt(x, y).className = matrix[x][y]
        }
    }
}
function renderActivePiece() {
    activePiece.blocks.forEach((arr) => {
        squareAt(arr[0], arr[1]).className = activePiece.piece
    })
}

function renderTimer() {
    timerSpan.textContent = playing
        ? toTimerString(Date.now() - startDate)
        : "00:00.00"
}
function toTimerString(ms) {
    let s = ms / 1000
    sString = (s % 60 < 10)
        ? '0' + (s % 60).toFixed(3)
        : (s % 60).toFixed(3)

    m = Math.trunc(s / 60)
    mString = (m < 10)
        ? '0' + m
        : m
    return `${mString}:${sString}`
}


function down() {
    if (!isMovable(activePiece, 'down')) {
        return
    }
    activePiece.blocks.forEach((block) => {
        block[1]++ // y goes down for each block of the piece
    })
}
/**
 * 
 * @param piece
 * @param {string} direction
 * @returns {boolean}
*/
function isMovable(piece, direction) {
    function isOutOfBounds(block) {
        if (block[0] < 0 || block[0] > 9 || block[1] < 0 || block[1] > 19)
            return true
        else
            return false
    }
    switch (direction) {
        case 'down':
            for (const block of piece.blocks) {
                if (isOutOfBounds([block[0], block[1]+1]) || blockAt(block[0], block[1]+1)) {
                    return false
                }
            }
            break

        case 'left':
            for (const block of piece.blocks) {
                if (isOutOfBounds([block[0]-1, block[1]] || blockAt(block[0]-1, block[1]))) {
                    return false
                }
            }
            break

        case 'right':
            for (const block of piece.blocks) {
                block[0] += 1
                if (isOutOfBounds([block[0]+1, block[1]] || blockAt(block[0]+1, block[1]))) {
                    return false
                }
            }
            break

        default:
            break
    }
    return true
}

function debug() {
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[0].length; y++) {
            squareAt(x, y).textContent = `${x}, ${y}`
            squareAt(x, y).style['font-size'] = '0.6rem'
        }
    }
}

// debug()



function settings() { }

function start() {
    ticks = 0
    playing = !playing
    startButton.textContent = playing ? "Stop" : "New game"
    startDate = Date.now()
}


function tick() {
    if (!playing) {
        return
    }
    if (ticks % 60 === 0) {
        down()
        renderMatrix()
    }
    ticks++
    renderTimer()
}

setInterval(tick, 16.67)

matrixEl.addEventListener('keydown', (ev) => {
    if (ev.code == 'ArrowLeft')
        left()
    if (ev.code == 'ArrowRight')
        right()
    if (ev.code == 'ArrowDown')
        console.log("alalo");
        // down()
})